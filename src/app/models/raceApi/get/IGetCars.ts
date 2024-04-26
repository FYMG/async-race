import ICarModel from '@models/ICarModel.ts';

export type IGetCarsResponse = ICarModel[];

export interface IGetCarsQueryParams {
    [key: string]: unknown;
    _page: number;
    _limit: number;
}
