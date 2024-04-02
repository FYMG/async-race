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
import { IPatchEngineResponse } from '@models/raceApi/patch/IPatchEngine';
import ICarModel from '@models/ICarModel.ts';
import style from './car.module.scss';

export class CarComponent extends BaseComponent<HTMLDivElement> {
    private readonly id: number;

    private editComponent: CarSettingComponent;

    private trackCar: BaseComponent | null = null;

    private engineStats: IPatchEngineResponse | null = null;

    private engineStarted = false;

    private animationInterval: ReturnType<typeof setInterval> | null = null;

    private raceCounter = 0;

    public carObj: ICarModel;

    private readonly startButton: BaseComponent<HTMLButtonElement>;

    private readonly driveButton: BaseComponent<HTMLButtonElement>;

    private lastRaceTime: number;

    constructor(carObj: ICarModel, editComponent: CarSettingComponent, props: IProps) {
        super(props);

        this.id = carObj.id;

        this.editComponent = editComponent;
        this.carObj = carObj;

        this.lastRaceTime = 0;

        this.startButton = createComponent({
            tag: 'button',
            classList: style['car__control-button'],
            textContent: 'start',
        });

        this.driveButton = createComponent<HTMLButtonElement>({
            tag: 'button',
            classList: style['car__control-button'],
            textContent: 'drive',
            disabled: true,
        });
    }

    public engineIsStarted() {
        return this.engineStarted;
    }

    render() {
        this.children.forEach((child) => child.destroy());

        this.driveButton.addEventListener('click', () => {
            this.drive();
        });

        this.startButton.addEventListener('click', () => {
            if (!this.engineStarted) {
                this.start();
            } else {
                this.stop();
            }
        });
        const carControlBlock = createComponent({
            tag: 'div',
            classList: style['car__control'],
            children: [
                createComponent({
                    tag: 'span',
                    textContent: this.carObj.name,
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
                    this.editComponent.selectCar(this.carObj, this);
                }),
                this.startButton,
                this.driveButton,
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

        carBody?.style.setProperty('fill', this.carObj.color);

        this.trackCar = trackCar;

        const track = createComponent({
            tag: 'div',
            classList: style['car__track'],
            children: [trackControlBlock, trackEnd, trackCar],
        });

        this.append(track);

        return this;
    }

    public win() {
        console.log('Im a chapion', this.lastRaceTime);
    }

    stop(callback?: () => void) {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
        }
        useRaceApi().engineStop(this.id, (data) => {
            this.startButton.getNode().textContent = 'start';
            this.driveButton.getNode().disabled = true;
            this.raceCounter += 1;
            this.engineStats = data;
            this.engineStarted = false;
            this.trackCar?.getNode().style.setProperty('left', '0');
        });
        callback?.();
    }

    start(callback?: () => void) {
        useRaceApi().engineStart(this.id, (data) => {
            this.startButton.getNode().textContent = 'stop';
            this.driveButton.getNode().disabled = false;
            this.engineStats = data;
            this.engineStarted = true;
            this.trackCar?.getNode().style.setProperty('left', '0');
            callback?.();
        });
    }

    drive(callback?: (success: boolean) => void) {
        this.driveButton.getNode().disabled = true;
        const currRace = this.raceCounter;
        const drivePerPeriod = this.engineStats!.velocity * 100;
        let letToGo = this.engineStats!.distance;
        const totalDistance = this.engineStats!.distance;
        const timeStartTime = Date.now();
        this.animationInterval = setInterval(() => {
            letToGo -= drivePerPeriod;
            if (drivePerPeriod > letToGo) {
                if (this.animationInterval) {
                    clearInterval(this.animationInterval);
                }

                letToGo = 0;
            }
            const node = this.trackCar!.getNode();
            const totalWidth = this.getNode().clientWidth;
            node.style.setProperty(
                'left',
                `${(totalWidth - 40) * ((totalDistance - letToGo) / totalDistance)}px`,
            );
        }, 100);
        useRaceApi().engineDrive(this.id, (data) => {
            const time = Date.now() - timeStartTime;
            if (!this.engineStarted && currRace !== this.raceCounter) {
                return;
            }
            if (data.success === false) {
                if (this.animationInterval) {
                    clearInterval(this.animationInterval);
                }
            } else {
                this.lastRaceTime = time;
            }
            callback?.(data.success);
        });
    }
}

const carComponent: FunctionComponent<
    HTMLDivElement,
    { carObj: ICarModel; editComponent: CarSettingComponent },
    CarComponent
> = ({ classList, carObj, editComponent, ...props }) => {
    return new CarComponent(carObj, editComponent, {
        classList: mergeClassLists(style['car'], classList),
        ...props,
    }).render();
};

export default carComponent;
