import type { Config } from '../config.js';
/**
 * Lists all available subtitles for a video.
 *
 * @param url - The URL of the video
 * @returns Promise resolving to a string containing the list of available subtitles
 * @throws {Error} When URL is invalid or subtitle listing fails
 *
 * @example
 * ```typescript
 * try {
 *   const subtitles = await listSubtitles('https://youtube.com/watch?v=...');
 *   console.log('Available subtitles:', subtitles);
 * } catch (error) {
 *   console.error('Failed to list subtitles:', error);
 * }
 * ```
 */
export declare function listSubtitles(url: string): Promise<string>;
/**
 * Downloads subtitles for a video in the specified language.
 *
 * @param url - The URL of the video
 * @param language - Language code (e.g., 'en', 'zh-Hant', 'ja')
 * @param config - Configuration object
 * @returns Promise resolving to the subtitle content
 * @throws {Error} When URL is invalid, language is not available, or download fails
 *
 * @example
 * ```typescript
 * try {
 *   // Download English subtitles
 *   const enSubs = await downloadSubtitles('https://youtube.com/watch?v=...', 'en', config);
 *   console.log('English subtitles:', enSubs);
 *
 *   // Download Traditional Chinese subtitles
 *   const zhSubs = await downloadSubtitles('https://youtube.com/watch?v=...', 'zh-Hant', config);
 *   console.log('Chinese subtitles:', zhSubs);
 * } catch (error) {
 *   if (error.message.includes('No subtitle files found')) {
 *     console.warn('No subtitles available in the requested language');
 *   } else {
 *     console.error('Failed to download subtitles:', error);
 *   }
 * }
 * ```
 */
export declare function downloadSubtitles(url: string, language: string, config: Config): Promise<string>;
/**
 * Downloads and cleans subtitles to produce a plain text transcript.
 *
 * @param url - The URL of the video
 * @param language - Language code (e.g., 'en', 'zh-Hant', 'ja')
 * @param config - Configuration object
 * @returns Promise resolving to the cleaned transcript text
 * @throws {Error} When URL is invalid, language is not available, or download fails
 *
 * @example
 * ```typescript
 * try {
 *   const transcript = await downloadTranscript('https://youtube.com/watch?v=...', 'en', config);
 *   console.log('Transcript:', transcript);
 * } catch (error) {
 *   console.error('Failed to download transcript:', error);
 * }
 * ```
 */
export declare function downloadTranscript(url: string, language: string, config: Config): Promise<string>;
