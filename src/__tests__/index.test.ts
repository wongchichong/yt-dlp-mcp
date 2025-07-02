// @ts-nocheck
// @jest-environment node
import { describe, test, expect } from '@jest/globals';
import * as os from 'os';
import * as path from 'path';
import { downloadVideo } from '../modules/video.js';
import { CONFIG } from '../config.js';
import * as fs from 'fs';

// 設置 Python 環境
process.env.PYTHONPATH = '';
process.env.PYTHONHOME = '';

describe('downloadVideo', () => {
  const testUrl = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'; // A short video for general tests
  const chapterTestUrl = 'https://www.youtube.com/watch?v=pvkTC2xIbeY'; // A video with chapters for chapter tests
  const testConfig = {
    ...CONFIG,
    file: {
      ...CONFIG.file,
      downloadsDir: path.join(os.tmpdir(), 'yt-dlp-test-downloads'),
      tempDirPrefix: 'yt-dlp-test-'
    }
  };

  beforeEach(async () => {
    await fs.promises.mkdir(testConfig.file.downloadsDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.promises.rm(testConfig.file.downloadsDir, { recursive: true, force: true });
  });

  test('downloads video successfully with correct format', async () => {
    const result = await downloadVideo(testUrl, testConfig);
    expect(result).toContain('Video download process initiated');
    
    const files = await fs.promises.readdir(testConfig.file.downloadsDir);
    expect(files.length).toBeGreaterThan(0);
  }, 30000);

  test('uses correct resolution format', async () => {
    const result = await downloadVideo(testUrl, testConfig, '1080p');
    expect(result).toContain('Video download process initiated');
    
    const files = await fs.promises.readdir(testConfig.file.downloadsDir);
    expect(files.length).toBeGreaterThan(0);
  }, 30000);

  test('handles invalid URL', async () => {
    await expect(downloadVideo('invalid-url', testConfig))
      .rejects
      .toThrow();
  });

  test('downloads video with start and end time', async () => {
    const result = await downloadVideo(testUrl, testConfig, undefined, '00:00:05', '00:00:10');
    expect(result).toContain('Video download process initiated');
    const files = await fs.promises.readdir(testConfig.file.downloadsDir);
    expect(files.length).toBeGreaterThan(0);
  }, 30000);

  test('downloads video with specific chapter', async () => {
    const result = await downloadVideo(chapterTestUrl, testConfig, undefined, undefined, undefined, 'Chapter 1');
    expect(result).toContain('Video download process initiated');
    const files = await fs.promises.readdir(testConfig.file.downloadsDir);
    expect(files.length).toBeGreaterThan(0);
  }, 30000);

  test('splits video by all chapters', async () => {
    const result = await downloadVideo(chapterTestUrl, testConfig, undefined, undefined, undefined, 'all');
    expect(result).toContain('Video download process initiated');
    const files = await fs.promises.readdir(testConfig.file.downloadsDir);
    expect(files.length).toBeGreaterThan(1);
  }, 60000);
});