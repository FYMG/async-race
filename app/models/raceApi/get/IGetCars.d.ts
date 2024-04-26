import { default as ICarModel } from '../../ICarModel.ts';

export type IGetCarsResponse = ICarModel[];
export interface IGetCarsQueryParams {
    [key: string]: unknown;
    _page: number;
    _limit: number;
}
