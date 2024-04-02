import createComponent, { FunctionComponent } from '@components/baseComponent';
import carSvg from '@utils/car.svg';
import ICarModel from '@models/ICarModel';
import MergeClassLists from '@utils/helpers/mergeClassLists';
import style from './carImageComponent.module.scss';

const carImageComponent: FunctionComponent<HTMLElement, { carObj: ICarModel }> = ({
    classList,
    carObj,
}) => {
    const car = createComponent<HTMLElement>({
        tag: 'div',
        classList: MergeClassLists(style['car-image'], classList),
        textContent: 'start',
    });

    car.getNode().innerHTML = carSvg;
    car
        .getNode()
        .querySelector('svg')
        ?.classList.add(style['car-image__svg'] ?? 'car-image__svg');
    const carBody: HTMLElement | null = car.getNode().querySelector('.car__body');

    carBody?.style.setProperty('fill', carObj.color);

    return car;
};

export default carImageComponent;
