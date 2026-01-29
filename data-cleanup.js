// Data Cleanup Module
// Scans for irrelevant data and provides archive or erase functionality

const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

class DataCleanup {
    constructor() {
        this.videoDirectory = process.env.VIDEO_DIRECTORY || './videos';
        this.processedDirectory = process.env.PROCESSED_VIDEO_DIRECTORY || './videos/processed';
        this.archiveDirectory = process.env.ARCHIVE_DIRECTORY || './archive';
        this.videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
        this.configExtensions = ['.json'];
        // Files/patterns to always keep (not marked as irrelevant)
        this.protectedFiles = ['README.md', '.gitkeep', 'example-'];
    }

    /**
     * Initialize data cleanup module
     */
    async initialize() {
        try {
            // Create archive directory if it doesn't exist
            await fs.mkdir(this.archiveDirectory, { recursive: true });
            logger.info('Data cleanup module initialized', {
                videoDirectory: this.videoDirectory,
                processedDirectory: this.processedDirectory,
                archiveDirectory: this.archiveDirectory,
            });
        } catch (error) {
            logger.error('Failed to initialize data cleanup module', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Check if a file is protected and should not be marked as irrelevant
     * @param {string} filename - Filename to check
     * @returns {boolean} True if file is protected
     */
    isProtectedFile(filename) {
        return this.protectedFiles.some(
            (pattern) => filename === pattern || filename.startsWith(pattern)
        );
    }

    /**
     * Scan for irrelevant data in the repository
     * @param {Object} options - Scan options
     * @param {number} options.daysOld - Consider files older than this many days as stale (default: 30)
     * @param {boolean} options.includeOrphans - Include orphaned config files (default: true)
     * @param {boolean} options.includeStale - Include stale processed metadata (default: true)
     * @param {boolean} options.includeTempFiles - Include temporary files (default: true)
     * @returns {Promise<Object>} Scan results with categorized irrelevant data
     */
    async scanForIrrelevantData(options = {}) {
        const {
            daysOld = 30,
            includeOrphans = true,
            includeStale = true,
            includeTempFiles = true,
        } = options;

        const results = {
            orphanedConfigs: [],
            staleProcessedFiles: [],
            tempFiles: [],
            totalSize: 0,
            scannedAt: new Date().toISOString(),
        };

        try {
            // Scan for orphaned config files (JSON files without corresponding video)
            if (includeOrphans) {
                const orphans = await this.findOrphanedConfigs();
                results.orphanedConfigs = orphans;
            }

            // Scan for stale processed metadata files
            if (includeStale) {
                const staleFiles = await this.findStaleProcessedFiles(daysOld);
                results.staleProcessedFiles = staleFiles;
            }

            // Scan for temporary files
            if (includeTempFiles) {
                const tempFiles = await this.findTempFiles();
                results.tempFiles = tempFiles;
            }

            // Calculate total size
            const allFiles = [
                ...results.orphanedConfigs,
                ...results.staleProcessedFiles,
                ...results.tempFiles,
            ];

            for (const file of allFiles) {
                results.totalSize += file.size || 0;
            }

            logger.info('Scan for irrelevant data completed', {
                orphanedConfigs: results.orphanedConfigs.length,
                staleProcessedFiles: results.staleProcessedFiles.length,
                tempFiles: results.tempFiles.length,
                totalSize: this.formatBytes(results.totalSize),
            });

            return results;
        } catch (error) {
            logger.error('Failed to scan for irrelevant data', {
                error: error.message,
            });
            throw error;
        }
    }

    /**
     * Find orphaned config files (JSON files without corresponding video)
     * @returns {Promise<Array>} Array of orphaned config file info
     */
    async findOrphanedConfigs() {
        const orphans = [];

        try {
            const files = await fs.readdir(this.videoDirectory);

            // Get all video files (without extension)
            const videoBaseNames = files
                .filter((file) => {
                    const ext = path.extname(file).toLowerCase();
                    return this.videoExtensions.includes(ext);
                })
                .map((file) => path.basename(file, path.extname(file)));

            // Find JSON files without corresponding video
            for (const file of files) {
                const ext = path.extname(file).toLowerCase();
                if (ext === '.json' && !this.isProtectedFile(file)) {
                    const baseName = path.basename(file, ext);
                    if (!videoBaseNames.includes(baseName)) {
                        const filePath = path.join(this.videoDirectory, file);
                        const stats = await fs.stat(filePath);
                        // Only include actual files, not directories
                        if (stats.isFile()) {
                            orphans.push({
                                path: filePath,
                                filename: file,
                                size: stats.size,
                                modified: stats.mtime,
                                type: 'orphaned_config',
                            });
                        }
                    }
                }
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.info('Video directory does not exist, skipping orphan scan', {
                    directory: this.videoDirectory,
                });
            } else {
                logger.error('Error finding orphaned configs', { error: error.message });
            }
        }

        return orphans;
    }

    /**
     * Find stale processed metadata files
     * @param {number} daysOld - Files older than this many days
     * @returns {Promise<Array>} Array of stale file info
     */
    async findStaleProcessedFiles(daysOld) {
        const staleFiles = [];
        const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

        try {
            const files = await fs.readdir(this.processedDirectory);

            for (const file of files) {
                if (this.isProtectedFile(file)) {
                    continue;
                }

                const filePath = path.join(this.processedDirectory, file);
                const stats = await fs.stat(filePath);

                // Only include actual files, not directories
                if (stats.isFile() && stats.mtime.getTime() < cutoffTime) {
                    staleFiles.push({
                        path: filePath,
                        filename: file,
                        size: stats.size,
                        modified: stats.mtime,
                        age: Math.floor(
                            (Date.now() - stats.mtime.getTime()) / (24 * 60 * 60 * 1000)
                        ),
                        type: 'stale_metadata',
                    });
                }
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                logger.info('Processed directory does not exist, skipping stale file scan', {
                    directory: this.processedDirectory,
                });
            } else {
                logger.error('Error finding stale processed files', { error: error.message });
            }
        }

        return staleFiles;
    }

    /**
     * Find temporary files in application-specific directories
     * Only searches video-related directories to avoid system or dependency files
     * @returns {Promise<Array>} Array of temp file info
     */
    async findTempFiles() {
        const tempFiles = [];
        const tempPatterns = ['.tmp', '.temp', '.bak', '.swp', '.swo'];
        // Only search application-specific directories, not root or system directories
        const searchDirs = [this.videoDirectory, this.processedDirectory];

        for (const dir of searchDirs) {
            try {
                const files = await fs.readdir(dir);

                for (const file of files) {
                    const ext = path.extname(file).toLowerCase();
                    const isTemp = tempPatterns.some(
                        (pattern) => ext === pattern || file.endsWith(pattern)
                    );

                    if (isTemp && !this.isProtectedFile(file)) {
                        const filePath = path.join(dir, file);
                        try {
                            const stats = await fs.stat(filePath);
                            if (stats.isFile()) {
                                tempFiles.push({
                                    path: filePath,
                                    filename: file,
                                    size: stats.size,
                                    modified: stats.mtime,
                                    type: 'temp_file',
                                });
                            }
                        } catch {
                            // Skip if can't stat file
                        }
                    }
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    logger.info('Directory does not exist, skipping temp file scan', { dir });
                } else {
                    logger.error('Error finding temp files in directory', {
                        dir,
                        error: error.message,
                    });
                }
            }
        }

        return tempFiles;
    }

    /**
     * Archive irrelevant data files
     * @param {Array} files - Array of file objects to archive
     * @returns {Promise<Object>} Archive results with archived count, failed count, and file details
     */
    async archiveData(files) {
        const results = {
            archived: 0,
            failed: 0,
            errors: [],
            archivedFiles: [],
        };

        try {
            await this.initialize();

            // Create timestamped archive subdirectory
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const archiveSubDir = path.join(this.archiveDirectory, `archive-${timestamp}`);
            await fs.mkdir(archiveSubDir, { recursive: true });

            for (const file of files) {
                try {
                    const destPath = path.join(archiveSubDir, file.filename);

                    // Copy file to archive
                    await fs.copyFile(file.path, destPath);

                    // Verify copy succeeded before deleting original
                    try {
                        await fs.access(destPath);
                        // Remove original only after verifying copy
                        await fs.unlink(file.path);

                        results.archived++;
                        results.archivedFiles.push({
                            original: file.path,
                            archived: destPath,
                        });

                        logger.info('File archived', {
                            original: file.path,
                            archived: destPath,
                        });
                    } catch (verifyError) {
                        // Copy verification failed, don't delete original
                        results.failed++;
                        results.errors.push({
                            file: file.path,
                            error: 'Copy verification failed: ' + verifyError.message,
                        });
                        logger.error('Archive copy verification failed', {
                            file: file.path,
                            error: verifyError.message,
                        });
                    }
                } catch (error) {
                    results.failed++;
                    results.errors.push({
                        file: file.path,
                        error: error.message,
                    });
                    logger.error('Failed to archive file', {
                        file: file.path,
                        error: error.message,
                    });
                }
            }

            // Create manifest file (only if we archived at least one file)
            if (results.archived > 0) {
                try {
                    const manifest = {
                        archivedAt: new Date().toISOString(),
                        files: results.archivedFiles,
                        totalFiles: results.archived,
                    };
                    await fs.writeFile(
                        path.join(archiveSubDir, 'manifest.json'),
                        JSON.stringify(manifest, null, 2)
                    );
                } catch (manifestError) {
                    logger.error('Failed to create manifest file', {
                        error: manifestError.message,
                    });
                    // Don't throw - files are already archived, manifest is supplementary
                }
            }

            logger.info('Archive operation completed', {
                archived: results.archived,
                failed: results.failed,
                archiveDir: archiveSubDir,
            });

            return results;
        } catch (error) {
            logger.error('Archive operation failed', { error: error.message });
            throw error;
        }
    }

    /**
     * Erase (permanently delete) irrelevant data files
     * @param {Array} files - Array of file objects to delete
     * @returns {Promise<Object>} Erase results
     */
    async eraseData(files) {
        const results = {
            deleted: 0,
            failed: 0,
            errors: [],
            deletedFiles: [],
            totalSizeFreed: 0,
        };

        for (const file of files) {
            try {
                await fs.unlink(file.path);
                results.deleted++;
                results.totalSizeFreed += file.size || 0;
                results.deletedFiles.push(file.path);

                logger.info('File deleted', {
                    path: file.path,
                    size: this.formatBytes(file.size || 0),
                });
            } catch (error) {
                results.failed++;
                results.errors.push({
                    file: file.path,
                    error: error.message,
                });
                logger.error('Failed to delete file', {
                    file: file.path,
                    error: error.message,
                });
            }
        }

        logger.info('Erase operation completed', {
            deleted: results.deleted,
            failed: results.failed,
            sizeFreed: this.formatBytes(results.totalSizeFreed),
        });

        return results;
    }

    /**
     * Perform cleanup with specified action
     * @param {string} action - 'archive' or 'erase'
     * @param {Object} scanOptions - Options for scanning
     * @returns {Promise<Object>} Cleanup results
     */
    async cleanup(action, scanOptions = {}) {
        if (action !== 'archive' && action !== 'erase') {
            throw new Error('Invalid action. Use "archive" or "erase"');
        }

        // First scan for irrelevant data
        const scanResults = await this.scanForIrrelevantData(scanOptions);

        // Combine all files
        const allFiles = [
            ...scanResults.orphanedConfigs,
            ...scanResults.staleProcessedFiles,
            ...scanResults.tempFiles,
        ];

        if (allFiles.length === 0) {
            logger.info('No irrelevant data found');
            return {
                action,
                scanResults,
                actionResults: { message: 'No irrelevant data found' },
            };
        }

        // Perform action
        let actionResults;
        if (action === 'archive') {
            actionResults = await this.archiveData(allFiles);
        } else {
            actionResults = await this.eraseData(allFiles);
        }

        return {
            action,
            scanResults,
            actionResults,
        };
    }

    /**
     * Format bytes to human readable string
     * @param {number} bytes - Number of bytes (must be a non-negative number)
     * @returns {string} Formatted string
     */
    formatBytes(bytes) {
        // Handle invalid inputs
        if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) {
            return '0 Bytes';
        }
        if (bytes === 0) {
            return '0 Bytes';
        }
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * Get cleanup status/summary
     * @returns {Promise<Object>} Status information
     */
    async getStatus() {
        const scanResults = await this.scanForIrrelevantData();

        return {
            irrelevantDataFound:
                scanResults.orphanedConfigs.length +
                    scanResults.staleProcessedFiles.length +
                    scanResults.tempFiles.length >
                0,
            summary: {
                orphanedConfigs: scanResults.orphanedConfigs.length,
                staleProcessedFiles: scanResults.staleProcessedFiles.length,
                tempFiles: scanResults.tempFiles.length,
                totalSize: this.formatBytes(scanResults.totalSize),
            },
            details: scanResults,
        };
    }
}

// Export singleton instance
module.exports = new DataCleanup();
