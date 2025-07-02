/**
 * 配置類型定義
 */
export interface Config {
    file: {
        maxFilenameLength: number;
        downloadsDir: string;
        tempDirPrefix: string;
        sanitize: {
            replaceChar: string;
            truncateSuffix: string;
            illegalChars: RegExp;
            reservedNames: readonly string[];
        };
    };
    tools: {
        required: readonly string[];
    };
    download: {
        defaultResolution: "480p" | "720p" | "1080p" | "best";
        defaultAudioFormat: "m4a" | "mp3";
        defaultSubtitleLanguage: string;
    };
}
/**
 * 加載配置
 */
export declare function loadConfig(): Config;
/**
 * 安全的文件名處理函數
 */
export declare function sanitizeFilename(filename: string, config: Config['file']): string;
export declare const CONFIG: Config;
