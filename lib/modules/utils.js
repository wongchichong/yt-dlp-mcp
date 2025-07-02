import * as fs from 'fs';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
/**
 * Validates if a given string is a valid URL.
 *
 * @param url - The URL string to validate
 * @returns True if the URL is valid, false otherwise
 *
 * @example
 * ```typescript
 * if (validateUrl('https://youtube.com/watch?v=...')) {
 *   // URL is valid
 * }
 * ```
 */
export function validateUrl(url) {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Checks if a URL is from YouTube.
 *
 * @param url - The URL to check
 * @returns True if the URL is from YouTube, false otherwise
 *
 * @example
 * ```typescript
 * if (isYouTubeUrl('https://youtube.com/watch?v=...')) {
 *   // URL is from YouTube
 * }
 * ```
 */
export function isYouTubeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be');
    }
    catch {
        return false;
    }
}
/**
 * Safely cleans up a directory and its contents.
 *
 * @param directory - Path to the directory to clean up
 * @returns Promise that resolves when cleanup is complete
 * @throws {Error} When directory cannot be removed
 *
 * @example
 * ```typescript
 * try {
 *   await safeCleanup('/path/to/temp/dir');
 * } catch (error) {
 *   console.error('Cleanup failed:', error);
 * }
 * ```
 */
export async function safeCleanup(directory) {
    try {
        await fs.promises.rm(directory, { recursive: true, force: true });
    }
    catch (error) {
        console.error(`Error cleaning up directory ${directory}:`, error);
    }
}
/**
 * Spawns a child process and returns its output as a promise.
 *
 * @param command - The command to execute
 * @param args - Array of command arguments
 * @returns Promise resolving to the command output
 * @throws {Error} When command execution fails
 *
 * @example
 * ```typescript
 * try {
 *   const output = await _spawnPromise('yt-dlp', ['--version']);
 *   console.log('yt-dlp version:', output);
 * } catch (error) {
 *   console.error('Command failed:', error);
 * }
 * ```
 */
export function _spawnPromise(command, args, cwd) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { cwd });
        let stdout = '';
        let stderr = '';
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        process.on('close', (code) => {
            if (code === 0) {
                resolve({ stdout, stderr });
            }
            else {
                reject(new Error(`Failed with exit code: ${code}\nStdout: ${stdout}\nStderr: ${stderr}`));
            }
        });
    });
}
/**
 * Generates a formatted timestamp string for file naming.
 *
 * @returns Formatted timestamp string in the format 'YYYY-MM-DD_HH-mm-ss'
 *
 * @example
 * ```typescript
 * const timestamp = getFormattedTimestamp();
 * console.log(timestamp); // '2024-03-20_12-30-00'
 * ```
 */
export function getFormattedTimestamp() {
    return new Date().toISOString()
        .replace(/[:.]/g, '-')
        .replace('T', '_')
        .split('.')[0];
}
/**
 * Generates a random filename with timestamp prefix.
 *
 * @param extension - Optional file extension (default: 'mp4')
 * @returns A random filename with timestamp
 *
 * @example
 * ```typescript
 * const filename = generateRandomFilename('mp3');
 * console.log(filename); // '2024-03-20_12-30-00_a1b2c3d4.mp3'
 * ```
 */
export function generateRandomFilename(extension = 'mp4') {
    const timestamp = getFormattedTimestamp();
    const randomId = randomBytes(4).toString('hex');
    return `${timestamp}_${randomId}.${extension}`;
}
/**
 * Cleans SRT subtitle content to produce a plain text transcript.
 * Removes timestamps, sequence numbers, and HTML tags.
 *
 * @param srtContent - Raw SRT subtitle content
 * @returns Cleaned transcript text
 *
 * @example
 * ```typescript
 * const cleanedText = cleanSubtitleToTranscript(srtContent);
 * console.log(cleanedText); // 'Hello world this is a transcript...'
 * ```
 */
export function cleanSubtitleToTranscript(srtContent) {
    return srtContent
        .split('\n')
        .filter(line => {
        const trimmed = line.trim();
        // Remove empty lines
        if (!trimmed)
            return false;
        // Remove sequence numbers (lines that are just digits)
        if (/^\d+$/.test(trimmed))
            return false;
        // Remove timestamp lines
        if (/^\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[.,]\d{3}$/.test(trimmed))
            return false;
        return true;
    })
        .map(line => {
        // Remove HTML tags
        return line.replace(/<[^>]*>/g, '');
    })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Sanitizes a string to be used as a safe filename.
 * Removes characters that are invalid in most file systems and replaces spaces with underscores.
 *
 * @param filename - The original string to sanitize
 * @returns A sanitized string suitable for use as a filename
 *
 * @example
 * ```typescript
 * const safeName = sanitizeFilename('My Video: Chapter 1/Part A');
 * console.log(safeName); // 'My_Video_Chapter_1_Part_A'
 * ```
 */
export function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9-_.]/g, '_');
}
//# sourceMappingURL=utils.js.map