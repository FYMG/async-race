import createComponent from '@components/baseComponent.ts';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import TextStrings from '@utils/consts/text';
import style from './footer.module.scss';

const footer: typeof createComponent<HTMLDivElement> = ({
    classList,
    children,
    ...props
}) => {
    const content = createComponent<HTMLElement>({
        tag: 'div',
        classList: style['footer__content'],
        children: [createComponent({ tag: 'p', textContent: TextStrings.footerText })],
    });

    return createComponent({
        tag: 'footer',
        classList: mergeClassLists(style['footer'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    });
};
export default footer;
