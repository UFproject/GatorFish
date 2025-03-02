// Mock for src/utils/request.js
const requestMock = {
  post: jest.fn().mockResolvedValue({}),
  get: jest.fn().mockResolvedValue({}),
  put: jest.fn().mockResolvedValue({}),
  delete: jest.fn().mockResolvedValue({})
};

export const request = requestMock; 