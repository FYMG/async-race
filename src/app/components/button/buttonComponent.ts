import createComponent, { FunctionComponent } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import style from './button.module.scss';

const buttonComponent: FunctionComponent<HTMLButtonElement> = ({
    classList,
    children,
    ...props
}) =>
    createComponent({
        tag: 'button',
        classList: mergeClassLists(style['button'], classList),
        children,
        ...props,
    });
export default buttonComponent;
