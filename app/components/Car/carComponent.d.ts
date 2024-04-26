import { default as ICarModel } from '../../models/ICarModel.ts';
import { CarSettingComponent } from '../carSetting/carSettingComponent';
import { BaseComponent, FunctionComponent, IProps } from '../baseComponent';

export declare class CarComponent extends BaseComponent<HTMLDivElement> {
    private readonly id;
    private editComponent;
    private trackCar;
    private engineStats;
    private engineStarted;
    private animationInterval;
    private raceCounter;
    carObj: ICarModel;
    private readonly startButton;
    private readonly driveButton;
    private lastRaceTime;
    private readonly winText;
    constructor(carObj: ICarModel, editComponent: CarSettingComponent, props: IProps);
    engineIsStarted(): boolean;
    render(): this;
    win(): void;
    stop(callback?: () => void): void;
    setCar(car: ICarModel): void;
    start(callback?: () => void): void;
    drive(callback?: (success: boolean) => void): void;
}
declare const carComponent: FunctionComponent<HTMLDivElement, {
    carObj: ICarModel;
    editComponent: CarSettingComponent;
}, CarComponent>;
export default carComponent;
