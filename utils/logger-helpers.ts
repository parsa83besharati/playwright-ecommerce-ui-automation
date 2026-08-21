import { TestInfo } from '@playwright/test';
import { logger } from './logger';
import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Create a permanent logs folder
const permanentLogsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(permanentLogsDir)) {
  fs.mkdirSync(permanentLogsDir);
}

export const setupTestLogger = (testInfo: TestInfo) => {
  // Create unique filename with test name + timestamp
  const timestamp = Date.now();
  const safeTestName = testInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const logFilePath = path.join(permanentLogsDir, `${safeTestName}-${timestamp}.log`);

  const fileTransport = new winston.transports.File({ filename: logFilePath });

  logger.add(fileTransport);

  (testInfo as any).__logFilePath = logFilePath;
  (testInfo as any).__fileTransport = fileTransport;

  logger.info(`Test started: ${testInfo.title}`);
};

export const teardownTestLogger = async (testInfo: TestInfo) => {
  if (!testInfo) return;

  logger.info(`Test finished. Status: ${testInfo.status}`);

  const logFilePath = (testInfo as any).__logFilePath;
  const fileTransport = (testInfo as any).__fileTransport;

  if (logFilePath && fileTransport) {
    await testInfo.attach('Test Execution Log', {
      path: logFilePath,
      contentType: 'text/plain',
    });

    logger.remove(fileTransport);

    // FIX: Give Winston time to flush the file buffer
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
};
