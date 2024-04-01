const config = {
    '**/*.{js, jsx, ts, tsx, cjs, mjs}': (filenames) => `eslint ${filenames.join(' ')} --fix`,
    '**/*.{json, html}': (filenames) => `prettier ${filenames.join(' ')} --write --ignore-path .gitignore`,
    '**/*.{css,scss,sass,less,styl,vue,svelte}': (filenames) => `stylelint ${filenames.join(' ')} --fix`,
};

export default config;
