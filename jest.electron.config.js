const base = require('./jest.main.config');

module.exports = {
  ...base,
  testMatch: [
    '<rootDir>/main/service/impl/__tests__/CalendarMeetingDbService.test.ts',
    '<rootDir>/main/service/impl/__tests__/*.electron.test.ts',
  ],
  testPathIgnorePatterns: [],
};
