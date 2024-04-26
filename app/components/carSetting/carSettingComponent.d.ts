import { CarComponent } from '../Car/carComponent';
import { default as ICarModel } from '../../models/ICarModel';
import { BaseComponent, FunctionComponent, IProps } from '../baseComponent.ts';

export declare class CarSettingComponent extends BaseComponent<HTMLDivElement> {
    private nameComponent;
    private colorComponent;
    private car?;
    private carComponent;
    constructor(colorComponent: BaseComponent<HTMLInputElement>, nameComponent: BaseComponent<HTMLInputElement>, props: IProps);
    update(callback?: (data: ICarModel) => void): void;
    selectCar(car: ICarModel, carComponent: CarComponent): void;
}
declare const carSettingComponent: FunctionComponent<HTMLDivElement, {
    edit: boolean;
    update?: () => void;
}, CarSettingComponent>;
export default carSettingComponent;
