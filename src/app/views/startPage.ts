import header from '@viewsComponents/header/header';
import footer from '@viewsComponents/footer/footer';
import createComponent from '@components/baseComponent';
import startPageContent from '@viewsComponents/startPageContent/startPageContent';

const startPageView = () => {
    return createComponent<HTMLTemplateElement>({
        tag: 'template',
        children: [header({}), startPageContent({}), footer({})],
    });
};

export default startPageView;
