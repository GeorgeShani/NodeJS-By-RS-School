import axios from 'axios';
import { throttledGetDataFromApi, THROTTLE_TIME } from './index';
import { throttle } from 'lodash';

// Mock both libraries
jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => fn), // Just pass through the function
}));

describe('throttledGetDataFromApi', () => {
  // Explicitly type the mock function
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a simple mock structure
    mockGet = jest.fn();
    (axios.create as jest.Mock).mockReturnValue({
      get: mockGet,
    });

    // Default response
    mockGet.mockResolvedValue({ data: { test: 'data' } });
  });

  test('should create instance with provided base url', async () => {
    // Execute
    await throttledGetDataFromApi('/test');

    // Verify axios.create was called with correct base URL
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    // Execute
    const relativePath = '/todos/1';
    await throttledGetDataFromApi(relativePath);

    // Verify get was called with the correct path
    expect(mockGet).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    // Prepare
    const mockResponseData = { id: 1, title: 'test todo' };
    mockGet.mockResolvedValue({ data: mockResponseData });

    // Execute
    const result = await throttledGetDataFromApi('/todos/1');

    // Verify response data is returned
    expect(result).toEqual(mockResponseData);
  });

  test('should throttle the API calls using lodash throttle', () => {
    // Verify throttle was called with correct parameters
    expect(throttle).toHaveBeenCalledWith(expect.any(Function), THROTTLE_TIME);
  });
});
