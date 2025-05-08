import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    // Test with an array of numbers
    const elements = [1, 2, 3];
    const result = generateLinkedList(elements);

    // Expected linked list structure
    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    // Regular comparison tetsing using toStrictEqual
    expect(result).toStrictEqual(expected);

    // Test with empty array
    const emptyResult = generateLinkedList([]);
    expect(emptyResult).toStrictEqual({ value: null, next: null });

    // Test with array containing mixed types
    const mixedElements = ['a', 42, true];
    const mixedResult = generateLinkedList(mixedElements);

    expect(mixedResult).toStrictEqual({
      value: 'a',
      next: {
        value: 42,
        next: {
          value: true,
          next: {
            value: null,
            next: null,
          },
        },
      },
    });
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    // Test with an array of numbers
    const elements = [1, 2, 3];
    const result = generateLinkedList(elements);

    // Snapshot testing
    expect(result).toMatchSnapshot();

    // Test with empty array
    const emptyResult = generateLinkedList([]);
    expect(emptyResult).toMatchSnapshot();

    // Test with array containing mixed types
    const mixedElements = ['a', 42, true];
    const mixedResult = generateLinkedList(mixedElements);
    expect(mixedResult).toMatchSnapshot();

    // Test with array containing null values
    const withNullElements = [null, 'test', null];
    const withNullResult = generateLinkedList(withNullElements);
    expect(withNullResult).toMatchSnapshot();
  });
});
