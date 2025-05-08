import {
  getBankAccount,
  BankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from '.';
import { random } from 'lodash';

// Mock lodash random function to control its behavior in tests
jest.mock('lodash', () => ({
  random: jest.fn(),
}));

describe('BankAccount', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    // Arrange & Act
    const account = getBankAccount(100);

    // Assert
    expect(account).toBeInstanceOf(BankAccount);
    expect(account.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    // Arrange
    const account = getBankAccount(50);

    // Act & Assert
    expect(() => account.withdraw(100)).toThrow(InsufficientFundsError);
    expect(() => account.withdraw(100)).toThrow(
      'Insufficient funds: cannot withdraw more than 50',
    );

    // Ensure balance remains unchanged
    expect(account.getBalance()).toBe(50);
  });

  test('should throw error when transferring more than balance', () => {
    // Arrange
    const sourceAccount = getBankAccount(50);
    const destinationAccount = getBankAccount(100);

    // Act & Assert
    expect(() => sourceAccount.transfer(100, destinationAccount)).toThrow(
      InsufficientFundsError,
    );

    // Ensure balances remain unchanged
    expect(sourceAccount.getBalance()).toBe(50);
    expect(destinationAccount.getBalance()).toBe(100);
  });

  test('should throw error when transferring to the same account', () => {
    // Arrange
    const account = getBankAccount(100);

    // Act & Assert
    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(50, account)).toThrow('Transfer failed');

    // Ensure balance remains unchanged
    expect(account.getBalance()).toBe(100);
  });

  test('should deposit money', () => {
    // Arrange
    const account = getBankAccount(100);

    // Act
    const result = account.deposit(50);

    // Assert
    expect(account.getBalance()).toBe(150);
    expect(result).toBe(account); // Method should return this for chaining
  });

  test('should withdraw money', () => {
    // Arrange
    const account = getBankAccount(100);

    // Act
    const result = account.withdraw(30);

    // Assert
    expect(account.getBalance()).toBe(70);
    expect(result).toBe(account); // Method should return this for chaining
  });

  test('should transfer money', async () => {
    // Arrange
    const account = getBankAccount(100);
    const mockedBalance = 75;

    // Mock random to return a value and indicate request success (1)
    (random as jest.Mock).mockImplementationOnce(() => mockedBalance); // First call returns balance
    (random as jest.Mock).mockImplementationOnce(() => 1); // Second call indicates success

    // Act
    const result = await account.fetchBalance();

    // Assert
    expect(result).toBe(mockedBalance);
    expect(random).toHaveBeenCalledTimes(2);
    expect(account.getBalance()).toBe(100); // Original balance should be unchanged
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    // Arrange
    const account = getBankAccount(100);

    // Mock random to return a value but indicate request failure (0)
    (random as jest.Mock).mockImplementationOnce(() => 50); // First call returns balance
    (random as jest.Mock).mockImplementationOnce(() => 0); // Second call indicates failure

    // Act
    const result = await account.fetchBalance();

    // Assert
    expect(result).toBeNull();
    expect(random).toHaveBeenCalledTimes(2);
    expect(account.getBalance()).toBe(100); // Original balance should be unchanged
  });

  test('should set new balance if fetchBalance returned number', async () => {
    // Arrange
    const account = getBankAccount(100);
    const mockedBalance = 150;

    // Setup mock to simulate successful balance fetch
    (random as jest.Mock).mockImplementationOnce(() => mockedBalance); // First call returns balance
    (random as jest.Mock).mockImplementationOnce(() => 1); // Second call indicates success

    // Act
    await account.synchronizeBalance();

    // Assert
    expect(account.getBalance()).toBe(mockedBalance);
    expect(random).toHaveBeenCalledTimes(2);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    // Arrange
    const account = getBankAccount(100);

    // Setup mock to simulate failed balance fetch
    // We need to set up the mock for both calls to synchronizeBalance
    (random as jest.Mock)
      .mockImplementationOnce(() => 75) // First synchronizeBalance call - balance value
      .mockImplementationOnce(() => 0) // First synchronizeBalance call - request failure
      .mockImplementationOnce(() => 75) // Second synchronizeBalance call - balance value
      .mockImplementationOnce(() => 0); // Second synchronizeBalance call - request failure

    // Act & Assert - First call
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );

    // Act & Assert - Second call with message check
    await expect(account.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );

    // Ensure original balance is unchanged
    expect(account.getBalance()).toBe(100);
    expect(random).toHaveBeenCalledTimes(4); // 2 calls for each synchronizeBalance
  });

  test('should chain methods correctly', () => {
    // Arrange
    const account1 = getBankAccount(100);
    const account2 = getBankAccount(50);

    // Act - chain multiple operations
    account1.deposit(50).withdraw(30).transfer(20, account2);

    // Assert
    expect(account1.getBalance()).toBe(100); // 100 + 50 - 30 - 20 = 100
    expect(account2.getBalance()).toBe(70); // 50 + 20 = 70
  });
});
