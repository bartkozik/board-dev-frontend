import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
            },
          ],
        },
      },
    ],
  },
  moduleNameMapper: {
    '^@/(.*)?react$': '<rootDir>/src/svg.transform.ts',
    '.+\\.svg$': 'jest-svg-transformer',
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
