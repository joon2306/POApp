const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './renderer',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/renderer/$1',
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  testMatch: ['**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: './renderer/tsconfig.json',
      useESM: true,
      jsx: 'react-jsx'
    }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(ts-jest|@jest|jest-runtime|@testing-library)/)'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['']
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx']
};

module.exports = createJestConfig(customJestConfig);