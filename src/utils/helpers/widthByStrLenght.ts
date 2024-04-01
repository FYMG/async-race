import throwError from '@utils/helpers/throwError';

export function beforeItemWidth(
    index: number,
    totalWidth: number,
    strList: string[],
): number | never {
    if (strList.length > index) {
        return Math.floor(
            totalWidth -
                (strList.slice(index).join('').length / strList.join('').length) *
                    totalWidth,
        );
    }
    return throwError('Incorrect index');
}

export function itemWidth(
    index: number,
    totalWidth: number,
    strList: string[],
): number | never {
    if (strList.length > index) {
        return Math.floor(
            (strList[index]!.length / strList.join('').length) * totalWidth,
        );
    }
    return throwError('Incorrect index');
}
