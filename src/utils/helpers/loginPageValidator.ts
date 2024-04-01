const regExp = /^[A-z-]*$/;
export default function loginPageValidator(str: string, strMinLength: number) {
    const error: string[] = [];
    if (!str) {
        error.push('Поле не может быть пустым');
    } else {
        if (str.length < strMinLength) {
            error.push(`мнимальная длина = ${strMinLength}`);
        }
        if (str[0]!.toUpperCase() !== str[0]) {
            error.push('первая буква должна быть заглавной');
        }
        if (!regExp.test(str)) {
            error.push('только латиница и "-"');
        }
    }
    return error.join(', ');
}
