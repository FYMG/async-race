import { default as ICarModel } from '../../models/ICarModel';
import { FunctionComponent } from '../baseComponent';

declare const carImageComponent: FunctionComponent<HTMLElement, {
    carObj: ICarModel;
}>;
export default carImageComponent;
