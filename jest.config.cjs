module.exports = {
    testEnvironment: "node",
    verbose: true,
    transform: { "^.+\\.js$": "babel-jest" },
    setupFiles: ["dotenv/config"],
    setupFilesAfterEnv: ["<rootDir>/backend/test-utils/setup.js"],
    transformIgnorePatterns: ["/node_modules/"],
    testTimeout: 30000
};
