import { fetch } from 'cross-fetch';
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

global.fetch = fetch;