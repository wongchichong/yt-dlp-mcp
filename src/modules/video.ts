import * as path from "path";
import * as fs from "fs";
import type { Config } from "../config.js";

import { 
  _spawnPromise, 
  validateUrl, 
  isYouTubeUrl
} from "./utils.js";

/**
 * Downloads a video from the specified URL.
 * 
 * @param url - The URL of the video to download
 * @param config - Configuration object for download settings
 * @param resolution - Preferred video resolution ('480p', '720p', '1080p', 'best')
 * @returns Promise resolving to a success message with the downloaded file path
 * @throws {Error} When URL is invalid or download fails
 * 
 * @example
 * ```typescript
 * // Download with default settings
 * const result = await downloadVideo('https://youtube.com/watch?v=...');
 * console.log(result);
 * 
 * // Download with specific resolution
 * const hdResult = await downloadVideo(
 *   'https://youtube.com/watch?v=...',
 *   undefined,
 *   '1080p'
 * );
 * console.log(hdResult);
 * ```
 */
export async function downloadVideo(
  url: string,
  config: Config,
  resolution: "480p" | "720p" | "1080p" | "best" = "720p",
  startTime?: string,
  endTime?: string,
  chapter?: string
): Promise<string> {
  const userDownloadsDir = config.file.downloadsDir;
  const tempDownloadDir = path.join(userDownloadsDir, 'temp_yt_dlp_downloads');

  try {
    validateUrl(url);

    // Ensure the temporary download directory exists
    if (!fs.existsSync(tempDownloadDir)) {
      fs.mkdirSync(tempDownloadDir, { recursive: true });
    }

    let format: string;
    if (isYouTubeUrl(url)) {
      // YouTube-specific format selection
      switch (resolution) {
        case "480p":
          format = "bestvideo[height<=480]+bestaudio/best[height<=480]/best";
          break;
        case "720p":
          format = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
          break;
        case "1080p":
          format = "bestvideo[height<=1080]+bestaudio/best[height<=1080]/best";
          break;
        case "best":
          format = "bestvideo+bestaudio/best";
          break;
        default:
          format = "bestvideo[height<=720]+bestaudio/best[height<=720]/best";
      }
    } else {
      // For other platforms, use quality labels that are more generic
      switch (resolution) {
        case "480p":
          format = "worst[height>=480]/best[height<=480]/worst";
          break;
        case "best":
          format = "bestvideo+bestaudio/best";
          break;
        default: // Including 720p and 1080p cases
          // Prefer HD quality but fallback to best available
          format = "bestvideo[height>=720]+bestaudio/best[height>=720]/best";
      }
    }

    const downloadArgs = [
      "--progress",
      "--newline",
      "--no-mtime",
      url
    ];

    // Only add format if not dealing with sections/chapters, as it might interfere
    if (!(startTime || endTime || chapter)) {
      downloadArgs.splice(4, 0, "-f", format);
    }

    // Add --download-sections if startTime or endTime are provided
    if (startTime || endTime) {
      let sectionArgs = [];
      if (startTime) sectionArgs.push("-ss", startTime);
      if (endTime) sectionArgs.push("-to", endTime);
      downloadArgs.push("--postprocessor-args", `ffmpeg_downloader: ${sectionArgs.join(" ")}`);
    }

    

    try {
      const { stderr } = await _spawnPromise("yt-dlp", downloadArgs, tempDownloadDir);
      if (stderr) {
        console.error("yt-dlp stderr:", stderr);
      }
    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    // If chapter is specified, split the video into chapters
    if (chapter) {
      const infoJson = await _spawnPromise("yt-dlp", ["--print-json", url]);
      const videoInfo = JSON.parse(infoJson.stdout);

      if (videoInfo.chapters && videoInfo.chapters.length > 0) {
        for (const chap of videoInfo.chapters) {
          if (chapter === "all" || chap.title === chapter) {
            const chapterFileName = `${videoInfo.title} - ${chap.title}.mp4`;
            const chapterOutputPath = path.join(tempDownloadDir, chapterFileName);
            const fullVideoPath = path.join(tempDownloadDir, fs.readdirSync(tempDownloadDir).find(f => f.endsWith('.mp4') || f.endsWith('.webm')) || '');

            if (!fullVideoPath) {
              throw new Error("Full video not found in temporary directory for chapter splitting.");
            }

            const ffmpegArgs = [
              "-i", fullVideoPath,
              "-ss", String(chap.start_time),
              "-to", String(chap.end_time),
              "-c", "copy",
              chapterOutputPath
            ];

            try {
              const { stderr: ffmpegStderr } = await _spawnPromise("ffmpeg", ffmpegArgs);
              if (ffmpegStderr) {
                console.error("FFmpeg stderr:", ffmpegStderr);
              }
            } catch (ffmpegError) {
              console.error(`Failed to extract chapter "${chap.title}":`, ffmpegError);
            }
          }
        }
      } else {
        console.warn("No chapters found for video, or chapter metadata is missing.");
      }
    }

    // Move downloaded files from tempDownloadDir to userDownloadsDir
    const downloadedFiles = fs.readdirSync(tempDownloadDir);
    if (downloadedFiles.length === 0) {
      throw new Error("No files were downloaded by yt-dlp.");
    }

    for (const file of downloadedFiles) {
      const sourcePath = path.join(tempDownloadDir, file);
      const destinationPath = path.join(userDownloadsDir, file);
      fs.renameSync(sourcePath, destinationPath);
    }

    return `Video download process initiated to ${userDownloadsDir}. Check the directory for the downloaded file(s).`;
  } catch (error) {
    throw error;
  } finally {
    // Clean up the temporary download directory
    if (fs.existsSync(tempDownloadDir)) {
      fs.rmSync(tempDownloadDir, { recursive: true, force: true });
    }
  }
}