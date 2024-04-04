import createComponent from '@components/baseComponent';
import logoComponent from '@components/logo/logoComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import { useRouter } from '@services/router';
import Routes from '@utils/consts/routes';
import buttonComponent from '@components/button/buttonComponent';
import style from './header.module.scss';

const header: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const { route, routeInfo } = useRouter();

    const logo = logoComponent({}).addEventListener('click', () =>
        route(Routes.startPage),
    );

    const winners = buttonComponent({
        textContent: 'Winners',
    }).addEventListener('click', () => {
        if (routeInfo().path === Routes.startPage.path) {
            route(Routes.winners);
            winners.getNode().textContent = 'Garage';
        } else {
            winners.getNode().textContent = 'Winners';
            route(Routes.startPage);
        }
    });

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['header__content'],
        children: [logo, winners],
    });

    return createComponent({
        tag: 'header',
        classList: mergeClassLists(style['header'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    });
};
export default header;
