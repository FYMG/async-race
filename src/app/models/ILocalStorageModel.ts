import ISaveDataModel from '@models/ISaveDataModel';

export interface IUser {
    name: string;
    surname: string;
    saveDataId: PropertyKey;
}

export interface ISession {
    isAuth: boolean;
    userId: PropertyKey | null;
}

export type ISaveData = Record<PropertyKey, ISaveDataModel>;

export default interface ILocalStorageModel {
    [key: PropertyKey]: unknown;
    saveData: ISaveData;
    session: ISession;
    users: Record<PropertyKey, IUser>;
    totalUser: number;
}
