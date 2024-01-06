import { defineConfig } from '@umijs/max';
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

export default defineConfig({
  antd: {},
  model: {},
  initialState: {},
  access: {},
  request: {},
  layout: {
    title: 'Stone',
  },
  analyze: {
    analyzerPort: 8000,
    analyzerHost: '0.0.0.0',
  },
  chainWebpack(memo, { env, webpack }) {
    memo.plugin('monaco-editor-webpack-plugin').use(MonacoWebpackPlugin, [
      {
        languages: ['typescript', 'javascript', 'json'],
      }
    ]);
  },
  // extraBabelIncludes: [
  //   'react-monaco-editor',
  // ],
  // mfsu: false,
  esbuildMinifyIIFE: true,
  // jsMinifier: 'terser',
  // cssMinifier: 'cssnano',
  proxy: {
    '/api': {
      target: 'http://localhost:3000/',
      changeOrigin: true,
    },
  },
  routes: [
    {
      path: '/',
      component: './Index',
      menuRender: false
    },
    {
      path: '/login',
      component: './Login',
      menuRender: false
    },
    {
      name: 'Funtion',
      path: '/home',
      component: './Home',
      icon: 'FunctionOutlined',
      access: 'isUser',
    },
    {
      name: 'KVStore',
      path: '/kv',
      component: './KVStore',
      icon: 'DatabaseOutlined',
      access: 'isUser',
    },
  ],
  npmClient: 'pnpm',
});

