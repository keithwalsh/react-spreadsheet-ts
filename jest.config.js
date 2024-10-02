module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src", "<rootDir>/test"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.json",
            },
        ],
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
        "^@components/(.*)$": "<rootDir>/src/components/$1", // Map @components/* to src/components/*
        "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
        "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock static assets
    },
    transformIgnorePatterns: ["/node_modules/", "^.+\\.js$"],
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
            babelConfig: true,
        },
    },
    collectCoverage: true,
    coverageDirectory: "coverage",
    coverageReporters: ["lcov", "text-summary"],
    collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts", "!src/index.tsx", "!**/node_modules/**"],
};
