# yt-dlp-mcp

An MCP server implementation that integrates with yt-dlp, providing video and audio content download capabilities (e.g. YouTube, Facebook, Tiktok, etc.) for LLMs.

## Features

* **Subtitles**: Download subtitles in SRT format for LLMs to read
* **Video Download**: Save videos to your Downloads folder with resolution control
* **Audio Download**: Save audios to your Downloads folder
* **Privacy-Focused**: Direct download without tracking
* **MCP Integration**: Works with Dive and other MCP-compatible LLMs

## Installation

### Prerequisites

Install `yt-dlp` based on your operating system:

```bash
# Windows
winget install yt-dlp

# macOS
brew install yt-dlp

# Linux
pip install yt-dlp
```

### With [Dive Desktop](https://github.com/OpenAgentPlatform/Dive)

1. Click "+ Add MCP Server" in Dive Desktop
2. Copy and paste this configuration:

```json
{
  "mcpServers": {
    "yt-dlp": {
      "command": "npx",
      "args": [
        "-y",
        "@kevinwatt/yt-dlp-mcp"
      ]
    }
  }
}
```
3. Click "Save" to install the MCP server

## Tool Documentation

* **list_subtitle_languages**
  * List all available subtitle languages and their formats for a video (including auto-generated captions)
  * Inputs:
    * `url` (string, required): URL of the video

* **download_video_subtitles**
  * Download video subtitles in any available format. Supports both regular and auto-generated subtitles
  * Inputs:
    * `url` (string, required): URL of the video
    * `language` (string, optional): Language code (e.g., 'en', 'zh-Hant', 'ja'). Defaults to 'en'

* **download_video**
  * Download video to user's Downloads folder
  * Inputs:
    * `url` (string, required): URL of the video
    * `resolution` (string, optional): Video resolution ('480p', '720p', '1080p', 'best'). Defaults to '720p'
    * `startTime` (string, optional): Start time of the video segment to download (e.g., '00:01:30', '1:30', '90').
    * `endTime` (string, optional): End time of the video segment to download (e.g., '00:02:00', '2:00', '120').
    * `chapter` (string, optional): Chapter title or 'all' to split video by all chapters. If a chapter title is provided, only that chapter will be downloaded. If 'all' is provided, the video will be split into multiple files based on chapters.

* **download_audio**
  * Download audio in best available quality (usually m4a/mp3 format) to user's Downloads folder
  * Inputs:
    * `url` (string, required): URL of the video

* **download_transcript**
  * Download and clean video subtitles to produce a plain text transcript without timestamps or formatting
  * Inputs:
    * `url` (string, required): URL of the video
    * `language` (string, optional): Language code (e.g., 'en', 'zh-Hant', 'ja'). Defaults to 'en'

## Usage Examples

Ask your LLM to:
```
"List available subtitles for this video: https://youtube.com/watch?v=..."
"Download a video from facebook: https://facebook.com/..."
"Download Chinese subtitles from this video: https://youtube.com/watch?v=..."
"Download this video in 1080p: https://youtube.com/watch?v=..."
"Download audio from this YouTube video: https://youtube.com/watch?v=..."
"Get a clean transcript of this video: https://youtube.com/watch?v=..."
"Download Spanish transcript from this video: https://youtube.com/watch?v=..."
```

## Manual Start

If needed, start the server manually:
```bash
npx @kevinwatt/yt-dlp-mcp
```

## Requirements

* Node.js 20+
* `yt-dlp` in system PATH
* MCP-compatible LLM service


## Documentation

- [API Reference](./docs/api.md)
- [Configuration](./docs/configuration.md)
- [Error Handling](./docs/error-handling.md)
- [Contributing](./docs/contributing.md)


## License

MIT

## Author

Dewei Yen


