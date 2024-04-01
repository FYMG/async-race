export interface IWord {
    audioExample: string;
    textExample: string;
    textExampleTranslate: string;
    id: number;
    word: string;
    wordTranslate: string;
}

export interface IRound {
    levelData: {
        id: string;
        name: string;
        imageSrc: string;
        cutSrc: string;
        author: string;
        year: string;
    };
    words: IWord[];
}
interface ILevelModel {
    rounds: IRound[];
    roundsCount: number;
}

export default ILevelModel;
