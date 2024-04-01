import createComponent, { FunctionComponent } from '@components/baseComponent';
import MergeClassLists from '@utils/helpers/mergeClassLists';
import style from './loader.module.scss';

const loaderComponent: FunctionComponent = ({ classList, ...props }) => {
    return createComponent<HTMLElement>({
        tag: 'div',
        classList: MergeClassLists(style['loader'], classList),
        ...props,
    });
};

export default loaderComponent;
