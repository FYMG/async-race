import createComponent, { BaseComponent } from '@components/baseComponent.ts';
import routes, { IRoute, IRouteParams } from '@utils/consts/routes';
import throwError from '@utils/helpers/throwError';
import getRouteByPath from '@utils/helpers/getRouteByPath';
import { useAuthProvider } from '@services/auth.ts';

class Router {
    private root: BaseComponent;

    private readonly defaultRoute: IRoute | undefined;

    private states: Record<string, BaseComponent<HTMLTemplateElement>> = {};

    private prevRoute = '';

    private static instance: Router;

    static create(rootComponent?: BaseComponent, defaultRoute?: IRoute): Router {
        if (Router.instance) {
            throwError('Router already created');
        }
        if (!useAuthProvider().isInitialized) {
            throwError('For a Router work, initiate authProvider first');
        }
        Router.instance = new Router(rootComponent, defaultRoute);
        return Router.instance;
    }

    static getIsInitialized() {
        return !!Router.instance;
    }

    private constructor(rootComponent?: BaseComponent, defaultRoute?: IRoute) {
        this.root = this.createOrGetRoot(rootComponent);
        this.defaultRoute = defaultRoute;
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

            if (route.needAuth && !useAuthProvider().isAuth) {
                console.log('not auth redirect to login page ');
                this.route(routes.startPage);
                return;
            }

            url.pathname = route.path;
            if (pushState) {
                window.history.pushState({}, '', url);
            }

            let routeViewComponent = route.view({});
            this.states[this.prevRoute]?.appendChildren(this.root.getChildren());
            if (this.states[route.path]) {
                routeViewComponent = this.states[route.path]!;
            } else {
                this.states[route.path] = routeViewComponent;
            }

            this.root.getChildren().forEach((child) => child.remove());
            this.root.appendChildren(routeViewComponent.getChildren());
            this.prevRoute = route.path;
            console.log(this.prevRoute, this.states);
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
                    routeCopy.params[param] = JSON.parse(urlParams.get(param)!) as
                        | string
                        | boolean
                        | number;
                } else {
                    routeCopy.params[param] = urlParams.get(param);
                }
            }
        });
        return routeCopy;
    }

    static getInstance() {
        return Router.instance;
    }
}

export const useRouter = () => {
    if (!Router.getInstance()) {
        throwError('Router not created');
    }
    const router = Router.getInstance();
    const routeInfo = router.getRouteInfo();
    return {
        root: router.getRoot(),
        route: router.route.bind(router),
        args: routeInfo.params,
        isInitialized: Router.getIsInitialized(),
    };
};

export const createRouter = (root?: BaseComponent, defaultRoute?: IRoute) => {
    Router.create(root, defaultRoute);
    Router.initialLoad();
    return useRouter();
};
