import {describe, expect, it} from 'vitest';
import {bool, createConfig, num, str} from './index';

describe('config', () => {
  it('should create config with string validation', () => {
    const schema = {
      TEST_STRING: str(),
    };

    // Set test environment variable
    process.env.TEST_STRING = 'test-value';

    const config = createConfig(schema);

    expect(config.TEST_STRING).toBe('test-value');

    // Clean up
    process.env.TEST_STRING = undefined;
  });

  it('should create config with number validation', () => {
    const schema = {
      TEST_NUMBER: num(),
    };

    // Set test environment variable
    process.env.TEST_NUMBER = '42';

    const config = createConfig(schema);

    expect(config.TEST_NUMBER).toBe(42);

    // Clean up
    process.env.TEST_NUMBER = undefined;
  });

  it('should create config with boolean validation', () => {
    const schema = {
      TEST_BOOL: bool(),
    };

    // Set test environment variable
    process.env.TEST_BOOL = 'true';

    const config = createConfig(schema);

    expect(config.TEST_BOOL).toBe(true);

    // Clean up
    process.env.TEST_BOOL = undefined;
  });

  it('should update config', () => {
    const schema = {
      TEST_STRING: str(),
    };

    process.env.TEST_STRING = 'test-value';

    let config = createConfig(schema);

    config = createConfig(schema, {TEST_STRING: 'test-value2'});

    expect(config.TEST_STRING).toBe('test-value2');

    process.env.TEST_STRING = undefined;
  });
});
