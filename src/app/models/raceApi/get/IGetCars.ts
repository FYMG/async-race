import ICarModel from '@models/ICarModel.ts';

export type IGetCarsResponse = ICarModel[];

export interface IGetCarsQueryParams {
    _page: number;
    _limit: number;
}
