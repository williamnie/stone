module.exports = {
  extends: require.resolve('@umijs/max/eslint'),
  "rules": {
    'no-unused-expressions': 0, // 允许使用 a && b()的逻辑
    '@typescript-eslint/no-unused-expressions': 0, // 允许使用 a && b()的逻辑
    'no-use-before-define': ['error', { functions: false, classes: true, variables: false }],
    '@typescript-eslint/no-use-before-define': 0,
  }

};
