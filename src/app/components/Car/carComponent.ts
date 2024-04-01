import { BaseComponent, FunctionComponent, IProps } from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import style from '@viewsComponents/startPageContent/startPageContent.module.scss';

class CarComponent extends BaseComponent<HTMLDivElement> {
    constructor(any: string, props: IProps) {
        super(props);
        console.log(any);
    }
}

const carComponent: FunctionComponent<
    HTMLDivElement,
    { edit: boolean },
    CarComponent
> = ({ classList, edit, ...props }) => {
    return new CarComponent('wgagwa', {
        classList: mergeClassLists(style['car'], classList),
        ...props,
    });
};

export default carComponent;
