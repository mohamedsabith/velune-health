/** Conventional Commits — https://www.conventionalcommits.org */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'home',
        'menu',
        'story',
        'reservations',
        'ui',
        'three',
        'motion',
        'seo',
        'ai',
        'security',
        'deps',
        'ci',
        'docs',
        'content',
      ],
    ],
    'body-max-line-length': [1, 'always', 120],
  },
};

export default config;
