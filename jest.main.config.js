/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/main/**/__tests__/**/*.(test|spec).(ts|tsx|js)'],
  testPathIgnorePatterns: ['CalendarMeetingDbService.test.ts', '\\.electron\\.test\\.ts$'],
  modulePathIgnorePatterns: ['<rootDir>/app/', '<rootDir>/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  }
};
