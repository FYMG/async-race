import createComponent, { BaseComponent } from '@components/baseComponent.ts';
import { IRoute, IRouteParams } from '@utils/consts/routes';
import throwError from '@utils/helpers/throwError';
import getRouteByPath from '@utils/helpers/getRouteByPath';

class Router {
    private static instance: Router;

    static create(rootComponent?: BaseComponent, defaultRoute?: IRoute): Router {
        if (Router.instance) {
            throwError('Router already created');
        }

        Router.instance = new Router(rootComponent, defaultRoute);

        return Router.instance;
    }

    static getIsInitialized() {
        return !!Router.instance;
    }

    public static initialLoad() {
        const load = () => {
            const redirectUrl = window.location.href.split('/?/')[1];

            let url = new URL(window.location.href.toString());

            if (redirectUrl) {
                url = new URL(
                    `${window.location.pathname}${redirectUrl}`,
                    window.location.origin + window.location.pathname,
                );
            }

            const route = url.pathname;

            const paramsObj: Record<string, string> = {};

            new URLSearchParams(url.search).forEach((value, key) => {
                paramsObj[key] = value;
            });
            Router.instance.route(route, paramsObj, false);
        };

        window.addEventListener('popstate', () => {
            load();
        });

        load();
    }

    static getInstance() {
        return Router.instance;
    }

    private root: BaseComponent;

    private readonly defaultRoute: IRoute | undefined;

    private states: Record<string, BaseComponent<HTMLTemplateElement>> = {};

    private prevRoute = '';

    private constructor(rootComponent?: BaseComponent, defaultRoute?: IRoute) {
        this.root = this.createOrGetRoot(rootComponent);
        this.defaultRoute = defaultRoute;
    }

    private createOrGetRoot(rootComponent?: BaseComponent) {
        if (!this.root) {
            if (rootComponent) {
                this.root = rootComponent;
            } else {
                this.root = createComponent({
                    tag: 'div',
                    id: 'root',
                });
                document.body.append(this.root.getNode());
            }
        }

        return this.root;
    }

    getRoot() {
        return this.root;
    }

    public route(
        toRoute: string | IRoute | undefined,
        params?: IRouteParams,
        pushState = true,
    ) {
        let route = typeof toRoute === 'string' ? getRouteByPath(toRoute) : toRoute;

        if (!route && !this.defaultRoute) {
            throwError('Route never exist and default route is not set');
        }

        if (!route && this.defaultRoute) {
            route = this.defaultRoute;
        }

        if (route) {
            const url = new URL(window.location.href);

            url.searchParams.forEach((_, key) => url.searchParams.delete(key));

            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== null) {
                        url.searchParams.set(key, String(value));
                    }
                });
            }

            url.pathname = route.path;

            let routeViewComponent = route.view({});

            this.states[this.prevRoute]?.appendChildren(this.root.getChildren());

            if (this.states[route.path]) {
                routeViewComponent = this.states[route.path]!;
                routeViewComponent.getChildren().forEach((item) => item.onRoute());
            } else {
                this.states[route.path] = routeViewComponent;
            }

            this.root.getChildren().forEach((child) => child.remove());
            this.root.appendChildren(routeViewComponent.getChildren());
            this.prevRoute = route.path;

            if (pushState) {
                window.history.pushState({}, '', url);
            }
        }
    }

    getRouteInfo() {
        const route = getRouteByPath(window.location.pathname)!;

        const routeCopy = JSON.parse(JSON.stringify(route)) as typeof route;

        routeCopy.params = {};

        if (!route) {
            throwError('Route not found');
        }

        const urlParams = new URLSearchParams(window.location.search);

        Object.keys(route.params ?? {}).forEach((param) => {
            if (routeCopy.params) {
                if (typeof urlParams.get(param) === 'string') {
                    routeCopy.params[param] = JSON.parse(String(urlParams.get(param))) as
                        | string
                        | number
                        | boolean
                        | undefined;
                } else {
                    routeCopy.params[param] = urlParams.get(param);
                }
            }
        });

        return routeCopy;
    }
}

export const useRouter = () => {
    if (!Router.getInstance()) {
        throwError('Router not created');
    }

    const router = Router.getInstance();

    return {
        root: router.getRoot(),
        route: router.route.bind(router),
        routeInfo: router.getRouteInfo.bind(router),
        isInitialized: Router.getIsInitialized(),
    };
};

export const createRouter = (root?: BaseComponent, defaultRoute?: IRoute) => {
    Router.create(root, defaultRoute);
    Router.initialLoad();

    return useRouter();
};
