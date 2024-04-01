function removeDuplicates<T>(arr: T[]): T[] {
    return arr.filter((item, index) => arr.lastIndexOf(item) === index);
}

export default removeDuplicates;
