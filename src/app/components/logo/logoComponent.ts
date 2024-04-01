import createComponent, { FunctionComponent } from '@components/baseComponent';
import logo from '@assets/logo-img.png';
import TextStrings from '@utils/consts/text';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import style from './logo.module.scss';

const logoComponent: FunctionComponent = ({ classList, children, ...props }) => {
    const logoImg = createComponent<HTMLImageElement>({
        tag: 'img',
        classList: style['site-logo__img'],
        src: logo,
        alt: `logo ${TextStrings.siteName}`,
    });
    const logoText = createComponent<HTMLSpanElement>({
        tag: 'span',
        classList: style['site-logo__text'],
        textContent: TextStrings.siteName,
    });
    return createComponent({
        tag: 'a',
        classList: mergeClassLists(style['site-logo'], classList),
        children: mergeChildrenLists(logoImg, logoText, children),
        ...props,
    });
};

export default logoComponent;
