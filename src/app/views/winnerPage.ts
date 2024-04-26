import createComponent from '@components/baseComponent';
import header from '@viewsComponents/header/header';
import footer from '@viewsComponents/footer/footer';
import winnersPageContent from '@viewsComponents/winnersPageContent/winnersPageContent';

const winnerPage = () => {
    return createComponent<HTMLTemplateElement>({
        tag: 'template',
        children: [header({}), winnersPageContent({}), footer({})],
    });
};

export default winnerPage;
