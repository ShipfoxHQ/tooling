import * as extensions from '@testing-library/jest-dom/matchers';
import {cleanup} from '@testing-library/react';
import {afterEach, expect} from 'vitest';

expect.extend(extensions);

afterEach(() => {
  cleanup();
});
