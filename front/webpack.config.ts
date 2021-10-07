import path from 'path';
import webpack from 'webpack';
// import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 바벨이 처리할 확장자 목록
    alias: {
      // tsconfig 설정처럼 ../../ 를 없애기 위한 설정 (typescript, webpack 모두 설정이 필요하다.)
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // main 파일
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // ts파일이나 tsx 파일을 babel-loader가 자바스크립트로 변환한다.
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] }, // 타겟 브라우저 설정
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react', // react code 변환
            '@babel/preset-typescript', // typescript code 변환
          ],
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'], // css 파일을 style-loader, css-loader가 자바스크립트로 변환한다.
      },
    ],
  },
  plugins: [
    // typescript 변환 시 필요
    // new ForkTsCheckerWebpackPlugin({
    //   async: false,
    //   // eslint: {
    //   //   files: "./src/**/*",
    //   // },
    // }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // react에서 NODE_ENV를 사용할 수 있도록 해 줌
  ],
  output: {
    // client.tsx부터 만들어진 모든 파일이 나오는 경로
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  // devServer: {
  //   historyApiFallback: true, // react router
  //   port: 3090,
  //   publicPath: '/dist/',
  //   proxy: {
  //     '/api/': {
  //       target: 'http://localhost:3095',
  //       changeOrigin: true,
  //     },
  //   },
  // },
};

// 개발 환경 플러그인
if (isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.HotModuleReplacementPlugin());
  // config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
// 런타임 환경 플러그인
if (!isDevelopment && config.plugins) {
  // config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
