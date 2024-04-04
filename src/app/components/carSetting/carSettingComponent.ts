import createComponent, {
    BaseComponent,
    FunctionComponent,
    IProps,
} from '@components/baseComponent.ts';
import style from '@viewsComponents/startPageContent/startPageContent.module.scss';
import { useRaceApi } from '@services/api.ts';
import mergeClassLists from '@utils/helpers/mergeClassLists';
import ICarModel from '@models/ICarModel';
import { CarComponent } from '@components/Car/carComponent';

export class CarSettingComponent extends BaseComponent<HTMLDivElement> {
    private nameComponent: BaseComponent<HTMLInputElement>;

    private colorComponent: BaseComponent<HTMLInputElement>;

    private car?: ICarModel;

    private carComponent: CarComponent | null = null;

    constructor(
        colorComponent: BaseComponent<HTMLInputElement>,
        nameComponent: BaseComponent<HTMLInputElement>,
        props: IProps,
    ) {
        super(props);
        this.colorComponent = colorComponent;
        this.nameComponent = nameComponent;
    }

    public update(callback?: (data: ICarModel) => void) {
        if (!this.car) {
            return;
        }
        void useRaceApi().updateCar(
            this.car.id,
            this.nameComponent.getNode().value,
            this.colorComponent.getNode().value,
            (data) => {
                callback?.(data);
                this.carComponent?.setCar(data);
            },
        );
    }

    public selectCar(car: ICarModel, carComponent: CarComponent) {
        this.car = car;
        this.carComponent = carComponent;
        this.nameComponent.getNode().value = car.name;
        this.colorComponent.getNode().value = car.color;
    }
}
const carSettingComponent: FunctionComponent<
    HTMLDivElement,
    { edit: boolean; update?: () => void },
    CarSettingComponent
> = ({ classList, edit, update, ...props }) => {
    const colorComponent = createComponent<HTMLInputElement>({
        tag: 'input',
        classList: style['create-car__color'],
        value: 'red',
        type: 'color',
    });

    const nameComponent = createComponent<HTMLInputElement>({
        tag: 'input',
        classList: style['create-car__name'],
        value: 'Tesla',
        type: 'text',
    });

    const component = new CarSettingComponent(colorComponent, nameComponent, {
        tag: 'div',
        classList: mergeClassLists(style['create-car']),
        children: [
            colorComponent,
            nameComponent,
            createComponent<HTMLButtonElement>({
                tag: 'button',
                classList: style['create-car__button'],
                textContent: edit ? 'Update car' : 'Create car',
            }).addEventListener('click', () => {
                if (edit) {
                    component.update();
                } else {
                    void useRaceApi()
                        .createCar(
                            nameComponent.getNode().value,
                            colorComponent.getNode().value,
                        )
                        .then((data) => {
                            update?.();
                            return data;
                        });
                }
            }),
        ],
        ...props,
    });

    return component;
};

export default carSettingComponent;
