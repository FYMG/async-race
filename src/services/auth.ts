import { useLocalStorageProvider } from '@services/localStorageProvider.ts';
import { ISession, IUser } from '@models/ILocalStorageModel';
import throwError from '@utils/helpers/throwError';
import ISaveDataModel from '@models/ISaveDataModel.ts';

export enum AuthAction {
    login = 'login',
    logout = 'logout',
    signup = 'signup',
}

export enum AuthMessage {
    userAlreadyExist = 'User already exist',
    incorrectFormat = 'Incorrect format',
    allOk = 'All ok',
    userNotExist = 'User not exist',
}

export interface IAuthResult {
    success: boolean;
    action: AuthAction;
    messages: AuthMessage[];
}
class AuthProvider {
    private static instance: AuthProvider;

    public static create(): AuthProvider {
        if (AuthProvider.instance) {
            throwError('Auth Provider already created');
        }
        if (!useLocalStorageProvider().isInitialized) {
            throwError('For a AuthProvider work, initiate localStorageProvider first');
        }
        AuthProvider.instance = new AuthProvider();
        return AuthProvider.instance;
    }

    static getIsInitialized() {
        return !!AuthProvider.instance;
    }

    getIsAuth() {
        return useLocalStorageProvider().state.session.isAuth;
    }

    public singUp(
        name: string,
        surname: string,
        callback: (reason: IAuthResult) => void,
    ): void {
        const { state } = useLocalStorageProvider();
        const error: IAuthResult = {
            success: false,
            action: AuthAction.signup,
            messages: [],
        };
        Object.keys(state.users).some((key) => {
            const user = state.users[key];
            if (user && user.surname === surname && user.name === name) {
                error.messages.push(AuthMessage.userAlreadyExist);
                return true;
            }

            return false;
        });
        const regExp = /^[A-Z][A-z-]*$/;

        if (
            !regExp.test(name) ||
            !regExp.test(surname) ||
            name.length < 3 ||
            surname.length < 4
        ) {
            error.messages.push(AuthMessage.incorrectFormat);
        }

        if (error.messages.length > 0) {
            callback(error);
            return;
        }
        state.totalUser += 1;
        state.users[state.totalUser] = {
            name,
            surname,
            saveDataId: state.totalUser,
        };
        state.saveData = {};
        state.saveData[state.totalUser] = {
            showPuzzle: true,
            audioOn: true,
            translateTextOn: true,
        };

        state.session.isAuth = true;
        state.session.userId = state.totalUser;
        callback({
            success: true,
            action: AuthAction.signup,
            messages: [AuthMessage.allOk],
        });
    }

    public logout(callback: (reason: IAuthResult) => void) {
        const { session } = useLocalStorageProvider().state;
        session.isAuth = false;
        session.userId = null;
        callback({
            success: true,
            action: AuthAction.logout,
            messages: [AuthMessage.allOk],
        });
    }

    public getUser(): { user: IUser; savedData: ISaveDataModel } | never | void {
        const { state } = useLocalStorageProvider();
        if (this.getIsAuth()) {
            const user = state.users[state.session.userId as number]!;
            const savedData = state.saveData[user.saveDataId as number]!;
            return { user, savedData };
        }
        return undefined;
    }

    public login(name: string, surname: string, callback: (reason: IAuthResult) => void) {
        const { state } = useLocalStorageProvider();
        const userExist = Object.keys(state.users).some((key) => {
            const user = state.users[key];
            if (user && user.surname === surname && user.name === name) {
                state.session.isAuth = true;
                state.session.userId = key;
                return true;
            }

            return false;
        });
        if (userExist) {
            callback({
                success: true,
                action: AuthAction.login,
                messages: [AuthMessage.allOk],
            });
        } else {
            callback({
                success: false,
                action: AuthAction.login,
                messages: [AuthMessage.userNotExist],
            });
        }
    }

    static getInstance() {
        return AuthProvider.instance;
    }

    static getDefaultSessionObject(): ISession {
        return {
            isAuth: false,
            userId: null,
        };
    }
}

export const useAuthProvider = () => {
    if (!AuthProvider.getInstance()) {
        throwError('Auth Provider not created');
    }
    const auth = AuthProvider.getInstance();
    return {
        isAuth: auth.getIsAuth(),
        singUp: auth.singUp.bind(auth),
        logout: auth.logout.bind(auth),
        login: auth.login.bind(auth),
        user: auth.getUser()?.user,
        saveData: auth.getUser()?.savedData,
        isInitialized: AuthProvider.getIsInitialized(),
    };
};

export const createAuthProvider = () => {
    AuthProvider.create();
    return useAuthProvider();
};
