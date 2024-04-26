import { IWinnerModel } from '../app/models/IWinnerModel.ts';
import { IPatchEngineResponse, IPatchEngineResponseDrive } from '../app/models/raceApi/patch/IPatchEngine';
import { default as ICarModel } from '../app/models/ICarModel';
import { IGetCarResponse } from '../app/models/raceApi/get/IGetCar';
import { IGetCarsResponse } from '../app/models/raceApi/get/IGetCars';
import { ICrateCarResponse } from '../app/models/raceApi/post/ICreateCar';

type LoadCallback<ResponseType> = (data: ResponseType, headers: Headers) => void;
export declare const useRaceApi: () => {
    updateWinner: (id: number, time: number, wins: number, callback?: (data: IWinnerModel) => void) => void;
    getWinner: (id: number, callback: LoadCallback<IWinnerModel>, errorCallback?: (res: Response) => void) => void;
    createWinner: (id: number, time: number, callback?: (data: IWinnerModel) => void, errorCallback?: (res: Response) => void) => void;
    getWinners: ({ page, limit, sort, order, callback, }: {
        page: number;
        limit: number;
        sort: 'id' | 'wins' | 'time';
        order: 'ASC' | 'DESC';
        callback: (data: IWinnerModel[], headers: Headers) => void;
    }) => void;
    engineStop: (id: number, callback?: (data: IPatchEngineResponse) => void) => void;
    engineStart: (id: number, callback?: (data: IPatchEngineResponse) => void) => void;
    engineDrive: (id: number, callback?: (data: IPatchEngineResponseDrive) => void) => void;
    generateCars: (count: number, callback: (data: ICarModel[]) => void) => void;
    updateCar: (id: number, name: string, color: string, callback: LoadCallback<ICarModel>) => void;
    deleteCar: (id: number, callback?: () => void) => void;
    getCar: (id: number, callback: LoadCallback<IGetCarResponse>) => void;
    createCar: (name: string, color: string, callback?: LoadCallback<ICrateCarResponse>) => Promise<ICrateCarResponse>;
    getCars: (page: number, limit: number, callback: LoadCallback<IGetCarsResponse>) => void;
    isInitialized: boolean;
};
export declare const createRaceApiProvider: () => {
    updateWinner: (id: number, time: number, wins: number, callback?: (data: IWinnerModel) => void) => void;
    getWinner: (id: number, callback: LoadCallback<IWinnerModel>, errorCallback?: (res: Response) => void) => void;
    createWinner: (id: number, time: number, callback?: (data: IWinnerModel) => void, errorCallback?: (res: Response) => void) => void;
    getWinners: ({ page, limit, sort, order, callback, }: {
        page: number;
        limit: number;
        sort: 'id' | 'wins' | 'time';
        order: 'ASC' | 'DESC';
        callback: (data: IWinnerModel[], headers: Headers) => void;
    }) => void;
    engineStop: (id: number, callback?: (data: IPatchEngineResponse) => void) => void;
    engineStart: (id: number, callback?: (data: IPatchEngineResponse) => void) => void;
    engineDrive: (id: number, callback?: (data: IPatchEngineResponseDrive) => void) => void;
    generateCars: (count: number, callback: (data: ICarModel[]) => void) => void;
    updateCar: (id: number, name: string, color: string, callback: LoadCallback<ICarModel>) => void;
    deleteCar: (id: number, callback?: () => void) => void;
    getCar: (id: number, callback: LoadCallback<IGetCarResponse>) => void;
    createCar: (name: string, color: string, callback?: LoadCallback<ICrateCarResponse>) => Promise<ICrateCarResponse>;
    getCars: (page: number, limit: number, callback: LoadCallback<IGetCarsResponse>) => void;
    isInitialized: boolean;
};
export {};
