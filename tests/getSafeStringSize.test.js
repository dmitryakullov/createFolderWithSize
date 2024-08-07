const { getSafeStringSize } = require('../utils');
const { MB_1 } = require('../constants');

const DEFAULT_SAFE_SIZE = 104857600;

describe('getSafeStringSize', () => {
  test('should return default size when safe length < 10', () => {
    const result = getSafeStringSize(9, MB_1);

    expect(result).toBe(DEFAULT_SAFE_SIZE);
  });

  test('should return default size when safe length > 500', () => {
    const result = getSafeStringSize(501, MB_1);

    expect(result).toBe(DEFAULT_SAFE_SIZE);
  });

  test('should return safe size according to the entered data', () => {
    const result1 = getSafeStringSize(10, MB_1);
    expect(result1).toBe(10485760);

    const result2 = getSafeStringSize(500, MB_1);
    expect(result2).toBe(524288000);

    const result3 = getSafeStringSize(58, MB_1);
    expect(result3).toBe(60817408);

    const result4 = getSafeStringSize(169, MB_1);
    expect(result4).toBe(177209344);

    const result5 = getSafeStringSize(451, MB_1);
    expect(result5).toBe(472907776);
  });
});
