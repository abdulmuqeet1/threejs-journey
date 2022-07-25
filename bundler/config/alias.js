import {join} from 'path';

import {rootDir} from '../utils/env';

export const aliasItems = {
    '@src': join(rootDir, '/src'),
    '@assets': join(rootDir, '/src/assets'),
    '@styles': join(rootDir, '/src/styles'),
    '@app': join(rootDir, '/src/app'),
    '@libs': join(rootDir, '/src/libs'),
};
