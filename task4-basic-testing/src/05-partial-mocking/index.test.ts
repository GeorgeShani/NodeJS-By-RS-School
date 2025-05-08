import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule =
    jest.requireActual<typeof import('./index')>('./index');

  // Return an object with mocked functions and original unmockedFunction
  return {
    ...originalModule,
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    // Call all mocked functions
    mockOne();
    mockTwo();
    mockThree();

    // Verify the mocked functions don't call console.log
    expect(consoleSpy).not.toHaveBeenCalledWith('foo');
    expect(consoleSpy).not.toHaveBeenCalledWith('bar');
    expect(consoleSpy).not.toHaveBeenCalledWith('baz');

    // Verify the mocked functions were called
    expect(mockOne).toHaveBeenCalled();
    expect(mockTwo).toHaveBeenCalled();
    expect(mockThree).toHaveBeenCalled();

    // Clean up the spy
    consoleSpy.mockRestore();
  });

  test('unmockedFunction should log into console', () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, 'log');

    // Call the unmocked function
    unmockedFunction();

    // Verify it logs the original message
    expect(consoleSpy).toHaveBeenCalledWith('I am not mocked');

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});
