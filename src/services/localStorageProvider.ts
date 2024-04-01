import ILocalStorageModel from '@models/ILocalStorageModel';
import throwError from '@utils/helpers/throwError';

class LocalStorageProvider {
    private static instance: LocalStorageProvider;

    private prefix = 'asyncRaceGame';

    private version = '1.0.0';

    private state: ILocalStorageModel;

    public stateProxy: ILocalStorageModel;

    static create(): LocalStorageProvider {
        if (LocalStorageProvider.instance) {
            throwError('Local storage provider already created');
        }
        LocalStorageProvider.instance = new LocalStorageProvider();
        return LocalStorageProvider.instance;
    }

    static getIsInitialized() {
        return !!LocalStorageProvider.instance;
    }

    private constructor() {
        this.state = this.createOrGetState();
        this.stateProxy = this.createProxy();
    }

    private createOrGetState() {
        const localStorageState = localStorage.getItem(this.getStorageKey());
        if (!this.state && localStorageState) {
            this.state = JSON.parse(localStorageState) as ILocalStorageModel;
        }

        if (!this.state) {
            this.state = {
                session: {
                    isAuth: false,
                    userId: null,
                },
                users: {},
                saveData: {},
                totalUser: 0,
            };
            localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
        }
        return this.state;
    }

    private getStorageKey() {
        return `${this.prefix}@${this.version}:data`;
    }

    private createProxy(): ILocalStorageModel {
        const proxy = <T extends Record<PropertyKey, unknown>>(obj: T): T =>
            new Proxy(obj, {
                set: (target, prop, value: unknown) => {
                    const tempTarget = target as Record<PropertyKey, unknown>;
                    tempTarget[prop] = value;
                    localStorage.setItem(
                        this.getStorageKey(),
                        JSON.stringify(this.state),
                    );
                    return true;
                },
                get: (target, prop) => {
                    if (typeof target[prop] === 'object') {
                        return proxy(target[prop] as T);
                    }

                    this.createOrGetState();
                    return target[prop];
                },
            });

        return proxy(this.state);
    }

    static getInstance() {
        return LocalStorageProvider.instance;
    }
}

export const useLocalStorageProvider = () => {
    if (!LocalStorageProvider.getIsInitialized()) {
        throwError('Local storage provider not created');
    }
    const provider = LocalStorageProvider.getInstance();
    return {
        state: provider.stateProxy,
        isInitialized: LocalStorageProvider.getIsInitialized(),
    };
};
export const createLocalStorageProvider = () => {
    LocalStorageProvider.create();
    return useLocalStorageProvider();
};
