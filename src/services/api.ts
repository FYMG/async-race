import throwError from '@utils/helpers/throwError';
import { ICrateCarRequest, ICrateCarResponse } from '@models/raceApi/post/ICreateCar';
import { IGetCarsQueryParams, IGetCarsResponse } from '@models/raceApi/get/IGetCars';
import { IGetCarResponse } from '@models/raceApi/get/IGetCar';
import ICarModel from '@models/ICarModel';
import carBrands from '@utils/consts/carBrands';
import carModels from '@utils/consts/carModels';
import {
    IPatchEngineResponse,
    IPatchEngineResponseDrive,
} from '@models/raceApi/patch/IPatchEngine';
import { IWinnerModel } from '@models/IWinnerModel.ts';

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

interface IUrlParams {
    [key: string]: unknown;
    readonly sources?: string;
}

interface IHeaders {
    readonly 'X-Total-Count'?: string;
}

interface ILoadProps<
    ResponseType,
    RequestBody = NonNullable<unknown>,
    UrlParams extends IUrlParams = NonNullable<unknown>,
> {
    readonly method: HttpMethod;
    readonly endpoint: string;
    readonly callback?: LoadCallback<ResponseType>;
    readonly errorCallback?: LoadErrorCallback;
    body?: RequestBody | NonNullable<unknown>;
    urlParams?: UrlParams | NonNullable<unknown>;
    readonly headers?: IHeaders;
}

interface IBaseRespProps<
    ResponseBody = NonNullable<unknown>,
    RequestBody = NonNullable<unknown>,
    UrlParams extends IUrlParams = NonNullable<unknown>,
> {
    endpoint: string;
    callback?: LoadCallback<ResponseBody>;
    errorCallback?: LoadErrorCallback;
    headers?: IHeaders;
    body?: RequestBody | NonNullable<unknown>;
    urlParams?: UrlParams | NonNullable<unknown>;
}

type GerRespProps<
    ResponseBody,
    UrlParams extends IUrlParams = NonNullable<unknown>,
> = Omit<IBaseRespProps<ResponseBody, NonNullable<unknown>, UrlParams>, 'body'>;

type LoadCallback<ResponseType> = (data: ResponseType, headers: Headers) => void;
type LoadErrorCallback = (data: Response) => void;

enum Endpoints {
    garage = '/garage',
    engine = '/engine',
    winners = '/winners',
}

enum EngineStatuses {
    started = 'started',
    stopped = 'stopped',
    drive = 'drive',
}

class RaceApi {
    private static instance: RaceApi;

    private static baseUrl = 'http://localhost:3000';

    public static create(baseUrl?: string): RaceApi {
        if (RaceApi.instance) {
            throwError('RaceApi Provider already created');
        }

        if (baseUrl) {
            RaceApi.baseUrl = baseUrl;
        }
        RaceApi.instance = new RaceApi();

        return RaceApi.instance;
    }

    static getIsInitialized() {
        return !!RaceApi.instance;
    }

    static getInstance() {
        return RaceApi.instance;
    }

    private headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    public getResp<ResponseType, UrlParams extends IUrlParams = NonNullable<unknown>>({
        endpoint,
        urlParams = {},
        headers = {},
        callback,
    }: GerRespProps<ResponseType, IUrlParams & UrlParams>) {
        this.load<ResponseType>({
            method: HttpMethod.GET,
            endpoint,
            headers,
            callback,
            urlParams,
        });
    }

    public deleteResp<ResponseType, UrlParams>({
        endpoint,
        urlParams = {},
        headers = {},
        callback = () => {},
    }: IBaseRespProps<ResponseType, IUrlParams & UrlParams>) {
        this.load<ResponseType>({
            method: HttpMethod.DELETE,
            endpoint,
            headers,
            callback,
            urlParams,
        });
    }

    public postResp<
        ResponseType = NonNullable<unknown>,
        RequestType = NonNullable<unknown>,
        UrlParams extends IUrlParams = NonNullable<unknown>,
    >({
        endpoint,
        callback,
        errorCallback = () => {},
        body = {},
        urlParams = {},
    }: IBaseRespProps<ResponseType, RequestType, UrlParams>) {
        this.load<ResponseType, RequestType>({
            method: HttpMethod.POST,
            endpoint,
            callback,
            errorCallback,
            urlParams,
            body,
        });
    }

    public patchResp<
        ResponseType = NonNullable<unknown>,
        RequestType = NonNullable<unknown>,
        UrlParams extends IUrlParams = NonNullable<unknown>,
    >({
        endpoint,
        callback,
        errorCallback = () => {},
        body = {},
        urlParams = {},
    }: IBaseRespProps<ResponseType, RequestType, UrlParams>) {
        this.load<ResponseType, RequestType>({
            method: HttpMethod.PATCH,
            endpoint,
            callback,
            errorCallback,
            urlParams,
            body,
        });
    }

    public putResp<
        ResponseType = Record<PropertyKey, never>,
        RequestType = Record<PropertyKey, never>,
        UrlParams extends IUrlParams = IUrlParams,
    >({
        endpoint,
        callback,
        body = {},
        urlParams = {},
    }: IBaseRespProps<ResponseType, RequestType, UrlParams>) {
        this.load<ResponseType, RequestType>({
            method: HttpMethod.PUT,
            endpoint,
            callback,
            urlParams,
            body,
        });
    }

    private async errorHandler(
        res: Response,
        errorCallback: LoadErrorCallback = () => {},
    ): Promise<Response> {
        if (!res.ok) {
            errorCallback(res);
        }

        return res;
    }

    private makeUrl<UrlParams = IUrlParams>(
        options: IUrlParams & UrlParams,
        endpoint: string,
    ) {
        const urlOptions = options;

        let url = `${RaceApi.baseUrl}${endpoint}?`;

        Object.keys(urlOptions).forEach((key) => {
            url += `${key}=${String(urlOptions[key])}&`;
        });

        return url.slice(0, -1);
    }

    private load<ResponseType, RequestType = Record<string, never>>({
        method,
        endpoint,
        callback,
        errorCallback = () => {},
        body,
        urlParams = {},
        headers = {},
    }: ILoadProps<ResponseType, RequestType>) {
        fetch(this.makeUrl(urlParams, endpoint), {
            method,
            headers: { ...this.headers, ...headers },
            body: method !== HttpMethod.GET ? JSON.stringify(body ?? {}) : undefined,
        })
            .then((res: Response) => this.errorHandler(res, errorCallback))
            .then(
                async (
                    res: Response,
                ): Promise<{ data: ResponseType; ResponseHeaders: Headers }> => {
                    let data: ResponseType;

                    try {
                        data = (await res.json()) as ResponseType;
                    } catch (err) {
                        data = {} as ResponseType;
                    }

                    return {
                        data,
                        ResponseHeaders: res.headers,
                    };
                },
            )
            .then(({ data, ResponseHeaders }) => callback?.(data, ResponseHeaders))
            .catch((err: Error) => {
                throw err;
            });
    }

    public createCar(
        name: string,
        color: string,
        callback?: LoadCallback<ICrateCarResponse>,
    ) {
        return new Promise((resolve: (data: ICrateCarResponse) => void, reject) => {
            this.postResp<ICrateCarResponse, ICrateCarRequest>({
                endpoint: Endpoints.garage,
                callback: (data, headers) => {
                    resolve(data);
                    callback?.(data, headers);
                },
                errorCallback: reject,
                body: {
                    name,
                    color,
                },
            });
        });
    }

    public getCars(
        page: number,
        limit: number,
        callback: LoadCallback<IGetCarsResponse>,
    ) {
        this.getResp<IGetCarsResponse, IGetCarsQueryParams>({
            endpoint: Endpoints.garage,
            urlParams: {
                _page: page,
                _limit: limit,
            },
            callback,
        });
    }

    public engineStop(id: number, callback?: (data: IPatchEngineResponse) => void) {
        this.patchResp({
            endpoint: `${Endpoints.engine}`,
            urlParams: {
                id,
                status: EngineStatuses.stopped,
            },
            callback,
        });
    }

    public engineStart(id: number, callback?: (data: IPatchEngineResponse) => void) {
        this.patchResp({
            endpoint: `${Endpoints.engine}`,
            urlParams: {
                id,
                status: EngineStatuses.started,
            },
            callback,
        });
    }

    public engineDrive(id: number, callback?: (data: IPatchEngineResponseDrive) => void) {
        this.patchResp({
            endpoint: `${Endpoints.engine}`,
            urlParams: {
                id,
                status: EngineStatuses.drive,
            },
            callback,
            errorCallback: (data) => {
                if (data.status === 500) {
                    callback?.({
                        success: false,
                    });
                }
            },
        });
    }

    public getCar(id: number, callback: LoadCallback<IGetCarResponse>) {
        this.getResp<IGetCarResponse>({
            endpoint: `${Endpoints.garage}/${id}`,
            callback,
        });
    }

    public deleteCar(id: number, callback?: () => void) {
        this.deleteResp({
            endpoint: `${Endpoints.garage}/${id}`,
            urlParams: {
                id,
            },
            callback,
        });
        this.deleteWinner(id);
    }

    public getWinner(
        id: number,
        callback: LoadCallback<IWinnerModel>,
        errorCallback?: (res: Response) => void,
    ) {
        this.getResp<IWinnerModel>({
            endpoint: `${Endpoints.winners}/${id}`,
            callback,
            errorCallback,
        });
    }

    public createWinner(
        id: number,
        time: number,
        callback?: (data: IWinnerModel) => void,
        errorCallback?: (res: Response) => void,
    ) {
        this.postResp({
            endpoint: `${Endpoints.winners}`,
            body: {
                id,
                time,
                wins: 1,
            },
            callback,
            errorCallback,
        });
    }

    public getWinners({
        page,
        limit,
        sort,
        order,
        callback,
    }: {
        page: number;
        limit: number;
        sort: 'id' | 'wins' | 'time';
        order: 'ASC' | 'DESC';
        callback: (data: IWinnerModel[], headers: Headers) => void;
    }) {
        this.getResp<IWinnerModel[]>({
            endpoint: Endpoints.winners,
            urlParams: {
                _page: page,
                _limit: limit,
                _sort: sort,
                _order: order,
            },
            callback,
        });
    }

    public deleteWinner(id: number, callback?: () => void) {
        this.deleteResp({
            endpoint: `${Endpoints.winners}/${id}`,
            callback,
        });
    }

    public updateWinner(
        id: number,
        time: number,
        wins: number,
        callback?: (data: IWinnerModel) => void,
    ) {
        this.putResp({
            endpoint: `${Endpoints.winners}/${id}`,
            body: {
                wins,
                time,
            },
            callback,
        });
    }

    public generateCars(count: number, callback: (data: ICarModel[]) => void) {
        const cars: Promise<ICarModel>[] = [];

        for (let i = 0; i < count; i += 1) {
            cars.push(
                this.createCar(
                    `${carBrands[Math.floor(Math.random() * carBrands.length)]} ${carModels[Math.floor(Math.random() * carModels.length)]}` ??
                        'Moscvich ultimate',
                    `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                ),
            );
        }
        void Promise.all(cars).then(callback);
    }

    public updateCar(
        id: number,
        name: string,
        color: string,
        callback: LoadCallback<ICarModel>,
    ) {
        this.putResp<ICarModel, Omit<ICarModel, 'id'>>({
            endpoint: `${Endpoints.garage}/${id}`,
            callback,
            body: {
                name,
                color,
            },
        });
    }
}

export const useRaceApi = () => {
    if (!RaceApi.getInstance()) {
        throwError('RaceApi Provider not created');
    }
    const raceApi = RaceApi.getInstance();

    return {
        updateWinner: raceApi.updateWinner.bind(raceApi),
        getWinner: raceApi.getWinner.bind(raceApi),
        createWinner: raceApi.createWinner.bind(raceApi),
        getWinners: raceApi.getWinners.bind(raceApi),
        engineStop: raceApi.engineStop.bind(raceApi),
        engineStart: raceApi.engineStart.bind(raceApi),
        engineDrive: raceApi.engineDrive.bind(raceApi),
        generateCars: raceApi.generateCars.bind(raceApi),
        updateCar: raceApi.updateCar.bind(raceApi),
        deleteCar: raceApi.deleteCar.bind(raceApi),
        getCar: raceApi.getCar.bind(raceApi),
        createCar: raceApi.createCar.bind(raceApi),
        getCars: raceApi.getCars.bind(raceApi),
        isInitialized: RaceApi.getIsInitialized(),
    };
};

export const createRaceApiProvider = () => {
    RaceApi.create();

    return useRaceApi();
};
