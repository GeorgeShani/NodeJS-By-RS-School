import { simpleCalculator, Action } from './index';

describe('simpleCalculator', () => {
  // Test cases for valid inputs and operations
  describe('valid operations', () => {
    const testCases = [
      // Addition cases
      {
        a: 1,
        b: 2,
        action: Action.Add,
        expected: 3,
        description: 'should add 1 + 2 = 3',
      },
      {
        a: 2,
        b: 2,
        action: Action.Add,
        expected: 4,
        description: 'should add 2 + 2 = 4',
      },
      {
        a: 3,
        b: 2,
        action: Action.Add,
        expected: 5,
        description: 'should add 3 + 2 = 5',
      },
      {
        a: -5,
        b: 10,
        action: Action.Add,
        expected: 5,
        description: 'should add -5 + 10 = 5',
      },
      {
        a: 3.5,
        b: 1.5,
        action: Action.Add,
        expected: 5,
        description: 'should add 3.5 + 1.5 = 5',
      },

      // Subtraction cases
      {
        a: 5,
        b: 2,
        action: Action.Subtract,
        expected: 3,
        description: 'should subtract 5 - 2 = 3',
      },
      {
        a: 10,
        b: 7,
        action: Action.Subtract,
        expected: 3,
        description: 'should subtract 10 - 7 = 3',
      },
      {
        a: 0,
        b: 5,
        action: Action.Subtract,
        expected: -5,
        description: 'should subtract 0 - 5 = -5',
      },
      {
        a: -3,
        b: -8,
        action: Action.Subtract,
        expected: 5,
        description: 'should subtract -3 - (-8) = 5',
      },

      // Multiplication cases
      {
        a: 3,
        b: 4,
        action: Action.Multiply,
        expected: 12,
        description: 'should multiply 3 * 4 = 12',
      },
      {
        a: 5,
        b: 5,
        action: Action.Multiply,
        expected: 25,
        description: 'should multiply 5 * 5 = 25',
      },
      {
        a: 0,
        b: 10,
        action: Action.Multiply,
        expected: 0,
        description: 'should multiply 0 * 10 = 0',
      },
      {
        a: -4,
        b: 3,
        action: Action.Multiply,
        expected: -12,
        description: 'should multiply -4 * 3 = -12',
      },

      // Division cases
      {
        a: 10,
        b: 2,
        action: Action.Divide,
        expected: 5,
        description: 'should divide 10 / 2 = 5',
      },
      {
        a: 7,
        b: 2,
        action: Action.Divide,
        expected: 3.5,
        description: 'should divide 7 / 2 = 3.5',
      },
      {
        a: 0,
        b: 5,
        action: Action.Divide,
        expected: 0,
        description: 'should divide 0 / 5 = 0',
      },
      {
        a: 5,
        b: 0,
        action: Action.Divide,
        expected: Infinity,
        description: 'should divide 5 / 0 = Infinity',
      },

      // Exponentiation cases
      {
        a: 2,
        b: 3,
        action: Action.Exponentiate,
        expected: 8,
        description: 'should exponentiate 2 ^ 3 = 8',
      },
      {
        a: 5,
        b: 2,
        action: Action.Exponentiate,
        expected: 25,
        description: 'should exponentiate 5 ^ 2 = 25',
      },
      {
        a: 3,
        b: 0,
        action: Action.Exponentiate,
        expected: 1,
        description: 'should exponentiate 3 ^ 0 = 1',
      },
      {
        a: 0,
        b: 5,
        action: Action.Exponentiate,
        expected: 0,
        description: 'should exponentiate 0 ^ 5 = 0',
      },
    ];

    test.each(testCases)('$description', ({ a, b, action, expected }) => {
      const result = simpleCalculator({ a, b, action });
      expect(result).toBe(expected);
    });
  });

  // Test cases for invalid inputs
  describe('invalid inputs', () => {
    const invalidTestCases = [
      {
        a: '5',
        b: 3,
        action: Action.Add,
        expected: null,
        description: 'should return null when first argument is not a number',
      },
      {
        a: 5,
        b: '3',
        action: Action.Add,
        expected: null,
        description: 'should return null when second argument is not a number',
      },
      {
        a: 5,
        b: 3,
        action: 'invalid',
        expected: null,
        description: 'should return null when action is not valid',
      },
      {
        a: null,
        b: 3,
        action: Action.Add,
        expected: null,
        description: 'should return null when first argument is null',
      },
      {
        a: 5,
        b: undefined,
        action: Action.Add,
        expected: null,
        description: 'should return null when second argument is undefined',
      },
      {
        a: 5,
        b: 3,
        action: null,
        expected: null,
        description: 'should return null when action is null',
      },
    ];

    test.each(invalidTestCases)(
      '$description',
      ({ a, b, action, expected }) => {
        const result = simpleCalculator({
          a: a as unknown as number,
          b: b as unknown as number,
          action: action as unknown as Action,
        });
        expect(result).toBe(expected);
      },
    );
  });

  // Edge cases test
  describe('edge cases', () => {
    test('should return null for non-enum action values', () => {
      // Test that invalid actions return null as expected
      const result = simpleCalculator({
        a: 5,
        b: 3,
        action: 'customAction' as unknown as Action,
      });

      expect(result).toBeNull();
    });

    // Additional edge cases
    test('should handle very large numbers', () => {
      const result = simpleCalculator({
        a: Number.MAX_SAFE_INTEGER,
        b: 1,
        action: Action.Add,
      });

      expect(result).toBe(Number.MAX_SAFE_INTEGER + 1);
    });

    test('should handle very small numbers', () => {
      const result = simpleCalculator({
        a: Number.MIN_VALUE,
        b: Number.MIN_VALUE,
        action: Action.Add,
      });

      expect(result).toBe(Number.MIN_VALUE + Number.MIN_VALUE);
    });

    test('should handle negative exponents', () => {
      const result = simpleCalculator({
        a: 2,
        b: -2,
        action: Action.Exponentiate,
      });

      expect(result).toBe(0.25); // 2^(-2) = 1/4 = 0.25
    });
  });
});
