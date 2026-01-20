import {afterEach, expect, vi} from '@shipfox/vitest/vi';
import * as extensions from '@testing-library/jest-dom/matchers';
import {cleanup} from '@testing-library/react';

expect.extend(extensions);

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
