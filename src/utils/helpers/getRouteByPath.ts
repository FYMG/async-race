import Routes, { IRoute } from '@utils/consts/routes';

export default function getRouteByPath(path: string) {
    return Object.keys(Routes).reduce(
        (acc: IRoute | undefined, routeName): IRoute | undefined => {
            if (Routes[routeName]?.path === path) {
                return Routes[routeName];
            }
            return acc;
        },
        undefined,
    );
}
