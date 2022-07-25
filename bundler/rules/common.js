import {babelLoader} from './useLoaderRuleItems';

export const typescriptRule = {
    test: /\.ts?$/,
    loader: 'swc-loader',
    exclude: /node_modules/,
};

export const javascriptRule = {
    test: /\.(js|jsx)$/,
    use: [babelLoader],
    exclude: /node_modules/,
};

export const htmlRule = {
    test: /\.(html)$/,
    use: {
        loader: 'html-loader',
    },
};

export const imagesRule = {
    test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
    type: 'asset/resource',
};

export const fontsRule = {
    test: /\.(woff(2)?|eot|ttf|otf|)$/,
    type: 'asset/inline',
};

export const rawFileRules = {
    test: /\.(glsl|vs|fs|vert|frag)$/,
    exclude: '/node_modules/',
    use: 'raw-loader',
};
