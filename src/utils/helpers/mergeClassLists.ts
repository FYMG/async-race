const mergeClassLists = (...classLists: (string | string[] | undefined)[]): string[] => {
    const result: string[] = [];
    classLists.forEach((item) => {
        if (typeof item === 'string') {
            result.push(item);
        }
        if (Array.isArray(item)) {
            result.push(...item);
        }
    });
    return result;
};

export default mergeClassLists;
