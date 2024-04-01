import { TChildren } from '@components/baseComponent.ts';

const mergeChildrenLists = (...classLists: TChildren[]): TChildren => {
    const result: NonNullable<TChildren> = [];
    classLists.forEach((item) => {
        if (Array.isArray(item)) {
            result.concat(item);
        } else if (item !== undefined) {
            result.push(item);
        }
    });
    return result;
};

export default mergeChildrenLists;
