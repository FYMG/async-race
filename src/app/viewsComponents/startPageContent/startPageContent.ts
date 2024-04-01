import createComponent from '@components/baseComponent';

import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import carSettingComponent from '@components/carSetting/carSettingComponent';
import style from './startPageContent.module.scss';

const startPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    const controlBlock = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__control'],
        children: [
            carSettingComponent({ edit: false }),
            carSettingComponent({ edit: true }),
        ],
    });

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__content'],
        children: [controlBlock],
    });

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['garage'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    });
};
export default startPageContent;
