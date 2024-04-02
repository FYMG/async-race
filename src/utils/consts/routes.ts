import startPageView from '@views/startPage';
import { FunctionComponent } from '@components/baseComponent';
import gamePage from '@views/gamePage.ts';

export interface IRouteParams {
    [key: string]: string | boolean | number | undefined | null;
    difficulty?: number;
    level?: number;
    reg?: boolean;
    page?: number;
}

export interface IRoute {
    name: string;
    path: string;
    view: FunctionComponent<HTMLTemplateElement>;
    needAuth: boolean;
    params: IRouteParams;
}

export interface IRoutes {
    [key: string]: IRoute;
    startPage: IRoute;
    winners: IRoute;
}

const Routes: IRoutes = {
    startPage: {
        name: 'startPage',
        path: '/fymg-JSFE2023Q4/',
        view: startPageView,
        needAuth: false,
        params: { page: undefined },
    },
    winners: {
        name: 'winners',
        path: '/fymg-JSFE2023Q4/winners',
        view: gamePage,
        needAuth: false,
        params: {
            difficulty: undefined,
            level: undefined,
        },
    },
};

export default Routes;
