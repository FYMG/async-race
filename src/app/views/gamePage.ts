import createComponent from '@components/baseComponent';
import header from '@viewsComponents/header/header';
import footer from '@viewsComponents/footer/footer';

const gamePage = () => {
    return createComponent<HTMLTemplateElement>({
        tag: 'template',
        children: [header({}), 'gawgagw', footer({})],
    });
};

export default gamePage;
