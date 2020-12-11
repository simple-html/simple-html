module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom-sixteen',
    maxConcurrency: 1,
    verbose: true,
    moduleDirectories: ['node_modules'],
    moduleNameMapper: {
        'lit-html': '<rootDir>/.cache/lit-html/lit-html.js',
        '@simple-html/core': '<rootDir>/packages/core/src/index.ts'
    },
    globals: {
        'ts-jest': {
            diagnostics: false,
            tsconfig: './tsconfig.json'
        }
    },
    collectCoverageFrom: [
        'packages/core/src/**/*.ts',
        'packages/router/src/**/*.ts',
        'packages/datasource/src/**/*.ts'
        // todo: grid,
        // todo: datepaicker
    ]
};
