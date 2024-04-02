import throwError from '@utils/helpers/throwError';
import { useLocalStorageProvider } from '@services/localStorageProvider';
import { ICrateCarRequest, ICrateCarResponse } from '@models/raceApi/post/ICreateCar';
import { IGetCarsQueryParams, IGetCarsResponse } from '@models/raceApi/get/IGetCars';
import { IGetCarResponse } from '@models/raceApi/get/IGetCar';
import ICarModel from '@models/ICarModel';
import carBrands from '@utils/consts/carBrands';
import carModels from '@utils/consts/carModels';

enum HttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

interface IUrlParams {
    [key: string]: unknown;
    readonly sources?: string;
}

interface IHeaders {
    readonly 'X-Total-Count'?: string;
}

interface ILoadProps<ResponseType, RequestType> {
    readonly method: HttpMethod;
    readonly endpoint: string;
    readonly callback: LoadCallback<ResponseType>;
    readonly errorCallback?: () => void;
    readonly body?: RequestType;
    readonly urlParams?: IUrlParams;
    readonly headers?: IHeaders;
}

interface IGetRespProps<
    ResponseType,
    UrlParams extends IUrlParams = NonNullable<unknown>,
> {
    endpoint: string;
    urlParams?: IUrlParams & UrlParams;
    headers?: IHeaders;
    callback?: LoadCallback<ResponseType>;
}

interface IPostRespProps<ResponseType, RequestType, UrlParams = IUrlParams> {
    endpoint: string;
    callback?: LoadCallback<ResponseType>;
    errorCallback?: () => void;
    body?: RequestType;
    urlParams?: UrlParams & IUrlParams;
}

interface IPutRespProps<ResponseType, RequestType, UrlParams = IUrlParams> {
    endpoint: string;
    callback?: LoadCallback<ResponseType>;
    body?: RequestType;
    urlParams?: UrlParams & IUrlParams;
}

interface IDeleteRespProps<
    ResponseType,
    UrlParams extends IUrlParams = NonNullable<unknown>,
> {
    endpoint: string;
    urlParams?: IUrlParams & UrlParams;
    headers?: IHeaders;
    callback?: LoadCallback<ResponseType>;
}

type LoadCallback<ResponseType> = (data: ResponseType, headers: Headers) => void;

enum Endpoints {
    garage = '/garage',
    engine = '/engine',
    winners = '/winners',
}

class RaceApi {
    private static instance: RaceApi;

    private headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    };

    private static baseUrl = 'http://localhost:3000';

    public static create(baseUrl?: string): RaceApi {
        if (RaceApi.instance) {
            throwError('Auth Provider already created');
        }
        if (!useLocalStorageProvider().isInitialized) {
            throwError('For a AuthProvider work, initiate localStorageProvider first');
        }
        if (baseUrl) {
            RaceApi.baseUrl = baseUrl;
        }
        RaceApi.instance = new RaceApi();
        return RaceApi.instance;
    }

    public getResp<ResponseType, UrlParams = IUrlParams>({
        endpoint,
        urlParams = {} as IUrlParams & UrlParams,
        headers = {},
        callback = throwError('No callback for GET response'),
    }: IGetRespProps<ResponseType, IUrlParams & UrlParams>) {
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
        urlParams = {} as IUrlParams & UrlParams,
        headers = {},
        callback = () => {},
    }: IDeleteRespProps<ResponseType, IUrlParams & UrlParams>) {
        this.load<ResponseType>({
            method: HttpMethod.DELETE,
            endpoint,
            headers,
            callback,
            urlParams,
        });
    }

    public postResp<
        ResponseType = Record<PropertyKey, never>,
        RequestType = Record<PropertyKey, never>,
        UrlParams = IUrlParams,
    >({
        endpoint,
        callback = throwError('No callback for GET response'),
        errorCallback = () => {},
        body = {} as RequestType,
        urlParams = {} as IUrlParams & UrlParams,
    }: IPostRespProps<ResponseType, RequestType, UrlParams>) {
        this.load<ResponseType, RequestType>({
            method: HttpMethod.POST,
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
        UrlParams = IUrlParams,
    >({
        endpoint,
        callback = throwError('No callback for GET response'),
        body = {} as RequestType,
        urlParams = {} as IUrlParams & UrlParams,
    }: IPutRespProps<ResponseType, RequestType, UrlParams>) {
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
        errorCallback = () => {},
    ): Promise<Response> {
        if (!res.ok) {
            console.log('error');
            errorCallback();
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
                    return {
                        data: (await res.json()) as ResponseType,
                        ResponseHeaders: res.headers,
                    };
                },
            )
            .then(({ data, ResponseHeaders }) => callback(data, ResponseHeaders))
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
        Promise.all(cars).then(callback).catch(console.log);
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

    static getIsInitialized() {
        return !!RaceApi.instance;
    }

    static getInstance() {
        return RaceApi.instance;
    }
}

export const useRaceApi = () => {
    if (!RaceApi.getInstance()) {
        throwError('Auth Provider not created');
    }
    const raceApi = RaceApi.getInstance();
    return {
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
