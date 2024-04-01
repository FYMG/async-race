const arrayShuffle = <T>(array: T[]): T[] => {
    const arrayCopy = array.slice();
    array.forEach((_, i) => {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j]!, arrayCopy[i]!];
    });
    return arrayCopy;
};

export default arrayShuffle;
