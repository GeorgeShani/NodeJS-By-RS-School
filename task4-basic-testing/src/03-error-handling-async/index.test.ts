import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    // Test with a string
    await expect(resolveValue('test')).resolves.toBe('test');

    // Test with a number
    await expect(resolveValue(42)).resolves.toBe(42);

    // Test with an onject
    const testObj = { key: 'value' };
    await expect(resolveValue(testObj)).resolves.toBe(testObj);

    // Test with null
    await expect(resolveValue(null)).resolves.toBeNull();

    // Test with undefined
    await expect(resolveValue(undefined)).resolves.toBeUndefined();
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    const errorMessage = 'Custom error message';

    // Act & Asset
    expect(() => throwError(errorMessage)).toThrow(errorMessage);
  });

  test('should throw error with default message if message is not provided', () => {
    // Act & Assert
    expect(() => throwError()).toThrow('Oops!');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    // Act & Assert
    expect(() => throwCustomError()).toThrow(MyAwesomeError);
    expect(() => throwCustomError()).toThrow(
      'This is my awesome custom error!',
    );
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    // Using await/expect syntax
    await expect(rejectCustomError()).rejects.toThrow(MyAwesomeError);
    await expect(rejectCustomError()).rejects.toThrow(
      'This is my awesome custom error!',
    );

    // Alternative approach using try/catch
    try {
      await rejectCustomError();
      // If we get here, the test should fail because no error was thrown
      fail('Expected rejectCustomError to throw an error');
    } catch (error) {
      // First verify it's an Error
      expect(error instanceof Error).toBeTruthy();

      // Then check if it's our specific error type
      if (error instanceof Error) {
        expect(error instanceof MyAwesomeError).toBeTruthy();
        expect(error.message).toBe('This is my awesome custom error!');
      }
    }
  });
});
