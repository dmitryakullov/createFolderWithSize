const { createFolderName } = require('../utils');

describe('createFolderName', () => {
  const SAVE_DATE_NOW = Date.now;

  beforeAll(() => {
    Date.now = jest.fn(() => 1723029693796);
  });

  afterAll(() => {
    Date.now = SAVE_DATE_NOW;
  });

  test('should return "empty" name', () => {
    const result1 = createFolderName(0, 0, 0);
    const result2 = createFolderName();

    expect(result1).toBe('empty_size_1i4m959b4');
    expect(result2).toBe('empty_size_1i4m959b4');
  });

  test('should return name with data', () => {
    const result1 = createFolderName(265, 0, 0);
    expect(result1).toBe('265GB_size_1i4m959b4');

    const result2 = createFolderName(0, 265, 0);
    expect(result2).toBe('265MB_size_1i4m959b4');

    const result3 = createFolderName(0, 0, 265);
    expect(result3).toBe('265KB_size_1i4m959b4');

    const result4 = createFolderName(123, 456, 789);
    expect(result4).toBe('123GB_456MB_789KB_size_1i4m959b4');
  });
});
