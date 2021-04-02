const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

const generateArrayNumberLatinCode = (num: number): Array<number> => {
    const arrayResult = [];
    let i = 1;

    while (num) {
        if (i === 1) arrayResult.push(getRandomArbitrary(65, 90));
        if (i === -1) arrayResult.push(getRandomArbitrary(97, 122));

        i *= -1;
        num -= 1;
    }

    return arrayResult;
};

const generateWord = (count = 8): string => {
    return arrayNumberToLetter(generateArrayNumberLatinCode(count));
};
const arrayNumberToLetter = (numbers: Array<number>): string => {
    return numbers.map(code => {
        return String.fromCharCode(code);
    }).join('');
};

export {
    generateWord,
};