import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

// Mock the modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

jest.mock('path', () => ({
  join: jest.fn(),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    // Spy on setTimeout
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    // Check that setTimeout was called with the correct arguments
    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);

    // Check that callback wasn't called immediately
    expect(callback).not.toHaveBeenCalled();

    // Advance timers by half the timeout
    jest.advanceTimersByTime(timeout / 2);
    expect(callback).not.toHaveBeenCalled();

    // Advance timers to complete the timeout
    jest.advanceTimersByTime(timeout / 2);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    // Spy on setInterval
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    // Check that setInterval was called with the correct arguments
    expect(setIntervalSpy).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);

    // Check that callback wasn't called immediately
    expect(callback).not.toHaveBeenCalled();

    // Advance timers by one interval
    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    // Advance timers by two more intervals
    jest.advanceTimersByTime(interval * 2);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Set __dirname for testing
    Object.defineProperty(global, '__dirname', { value: '/mock/dir' });
  });

  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';

    // Mock existsSync to return false so we don't need to mock readFile
    (existsSync as jest.Mock).mockReturnValue(false);

    await readFileAsynchronously(pathToFile);

    // Check that join was called with the correct path format, but don't test the exact __dirname value
    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'non-existent.txt';
    const mockedPath = '/mock/full/path';

    // Setup mocks
    (join as jest.Mock).mockReturnValue(mockedPath);
    (existsSync as jest.Mock).mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    // Should check if the file exists
    expect(existsSync).toHaveBeenCalledWith(mockedPath);
    // Should return null when file doesn't exist
    expect(result).toBeNull();
    // Should not try to read the file
    expect(readFile).not.toHaveBeenCalled();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const mockedPath = '/mock/full/path';
    const fileContent = Buffer.from('file content');

    // Setup mocks
    (join as jest.Mock).mockReturnValue(mockedPath);
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(fileContent);

    const result = await readFileAsynchronously(pathToFile);

    // Should check if the file exists
    expect(existsSync).toHaveBeenCalledWith(mockedPath);
    // Should read the file
    expect(readFile).toHaveBeenCalledWith(mockedPath);
    // Should return the file content as string
    expect(result).toBe('file content');
  });
});
