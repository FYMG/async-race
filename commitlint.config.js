const config = {
    extends: ['@commitlint/config-conventional'],
    formatter: '@commitlint/format',
    plugins: [
        {
            rules: {
                'have-reference-to-the-feature': ({ subject }) => {
                    const regExp = /((RSS-PZ-|rss-pz-)\d{2,5})/;
                    return [
                        regExp.test(subject),
                        `Your subject should contain reference to the feature regExp pattern:${regExp}`,
                    ];
                },
            },
        },
    ],
    rules: {
        'subject-case': [0, 'never'],
        'have-reference-to-the-feature': [2, 'always'],
    },
};

export default config;
