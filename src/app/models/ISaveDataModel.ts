export default interface ISaveDataModel {
    level?: number;
    difficulty?: number;
    seed?: number;
    translateTextOn?: boolean;
    audioOn?: boolean;
    showPuzzle?: boolean;
    levels?: Record<number, Record<number, ISavedLevel>>;
}

export interface ISavedLevel {
    completed: boolean;
    words: ISavedLevelWord[];
}

export interface ISavedLevelWord {
    hint: boolean;
}
