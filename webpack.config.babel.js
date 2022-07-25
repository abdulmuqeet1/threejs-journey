
import merge from 'webpack-merge';

import baseConfig from './bundler/base';
import devConfig from './bundler/dev';
import prodConfig from './bundler/prod';
import {isProd} from './bundler/utils/env';

export default () =>
    isProd ? merge(baseConfig, prodConfig) : merge(baseConfig, devConfig);
