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
export declare function validateUrl(url: string): boolean;
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
export declare function isYouTubeUrl(url: string): boolean;
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
export declare function safeCleanup(directory: string): Promise<void>;
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
export declare function _spawnPromise(command: string, args: string[], cwd?: string): Promise<{
    stdout: string;
    stderr: string;
}>;
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
export declare function getFormattedTimestamp(): string;
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
export declare function generateRandomFilename(extension?: string): string;
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
export declare function cleanSubtitleToTranscript(srtContent: string): string;
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
export declare function sanitizeFilename(filename: string): string;
