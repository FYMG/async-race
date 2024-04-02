import createComponent, {
    BaseComponent,
    FunctionComponent,
    IProps,
} from '@components/baseComponent';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import { useRaceApi } from '@services/api';
import { CarSettingComponent } from '@components/carSetting/carSettingComponent';
import flagImg from '@assets/flag.png';
import carSvg from '@utils/car.svg.ts';
import style from './car.module.scss';

export class CarComponent extends BaseComponent<HTMLDivElement> {
    private readonly id: number;

    private editComponent: CarSettingComponent;

    private trackCar: BaseComponent | null = null;

    // private engineStart = false;

    constructor(id: number, editComponent: CarSettingComponent, props: IProps) {
        super(props);
        this.id = id;
        this.editComponent = editComponent;
    }

    render() {
        const { getCar } = useRaceApi();
        this.children.forEach((child) => child.destroy());

        getCar(this.id, (carObj) => {
            const carControlBlock = createComponent({
                tag: 'div',
                classList: style['car__control'],
                children: [
                    createComponent({
                        tag: 'span',
                        textContent: carObj.name,
                    }),
                    createComponent({
                        tag: 'button',
                        classList: style['car__control-button'],
                        textContent: 'delete',
                    }).addEventListener('click', () => {
                        useRaceApi().deleteCar(this.id, () => {
                            this.destroy();
                        });
                    }),
                    createComponent({
                        tag: 'button',
                        classList: style['car__control-button'],
                        textContent: 'select',
                    }).addEventListener('click', () => {
                        this.editComponent.selectCar(carObj, this);
                    }),
                ],
            });

            this.append(carControlBlock);

            const trackControlBlock = createComponent({
                tag: 'div',
                classList: style['car__track-control'],
            });

            const trackEnd = createComponent({
                tag: 'div',
                classList: style['car__track-end'],
                children: [
                    createComponent<HTMLImageElement>({
                        tag: 'img',
                        classList: style['car__track-end-image'],
                        src: flagImg,
                        alt: 'track end flag',
                    }),
                ],
            });

            const trackCar = createComponent<HTMLElement>({
                tag: 'div',
                classList: style['car__track-car'],
                textContent: 'start',
            });

            trackCar.getNode().innerHTML = carSvg;
            trackCar
                .getNode()
                .querySelector('svg')
                ?.classList.add(style['car__track-car-svg'] ?? 'car__track-car-svg');
            const carBody: HTMLElement | null = trackCar
                .getNode()
                .querySelector('.car__body');

            carBody?.style.setProperty('fill', carObj.color);

            this.trackCar = trackCar;

            const track = createComponent({
                tag: 'div',
                classList: style['car__track'],
                children: [trackControlBlock, trackEnd, trackCar],
            });

            this.append(track);
        });

        return this;
    }

    turn() {
        console.log(1);
    }

    drive() {
        this.trackCar?.getNode().style.setProperty('left', '0px');
        console.log(2);
    }
}

const carComponent: FunctionComponent<
    HTMLDivElement,
    { carId: number; editComponent: CarSettingComponent },
    CarComponent
> = ({ classList, carId, editComponent, ...props }) => {
    return new CarComponent(carId, editComponent, {
        classList: mergeClassLists(style['car'], classList),
        ...props,
    }).render();
};

export default carComponent;
