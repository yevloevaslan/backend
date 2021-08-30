/*
before all in source file change:
    var allData =
to
    exports.allData =
*/
const sourceFile = require('./data');
const fetch = require('node-fetch');

const clearTagsRegEx = /<\/?[^>]+(>|$)/g;
const clearLineBreaksRegEx = /\r?\n|\r/g;
const clearNumberListRegEx = /\d+\)/; // 1) 2)

const addToDb = {};
let count = 0;

function clearTags(word) {
    word = word.replace(clearTagsRegEx, '');
    return word;
}
function separateWord(word) {
    word = word.replace(clearLineBreaksRegEx, ' ||| ');
    return word;
}

for (const word of sourceFile.allData) {

    const ing = separateWord(clearTags(word.bbb));
    const rus = separateWord(clearTags(word.ddd));

    let rusLong = rus.split(' ||| ');
    let ingLong = ing.split(' ||| ');

    const rusVariants = parseDescription(rusLong, 'rus');
    const ingVariants = parseDescription(ingLong, 'ing');


    for (let ingWord of ingVariants) {
        for (let rusWord of rusVariants) {
            // console.log('rusWord', rusWord);
            const addObject = {};
            if (ingWord.ing) addObject.ing = ingWord.ing;
            if (ingWord.ingDescription) addObject.ingDescription = ingWord.ingDescription;
            if (rusWord.rus) addObject.rus = rusWord.rus;
            if (rusWord.rusDescription) addObject.rusDescription = rusWord.rusDescription;
            addToDb[count] = addObject;
            count ++;
        }
    }
}

function parseDescription(wordsArray, language) {
    let semicolonSeparatedWordsArray = [];
    for (let word of wordsArray) {
        word = word.split(';');
        // word = word.replace(rrr, '');
        semicolonSeparatedWordsArray.push(word);
    }
    semicolonSeparatedWordsArray = semicolonSeparatedWordsArray.flat(Infinity);
    semicolonSeparatedWordsArray = semicolonSeparatedWordsArray.map(word=> {
        word = word.replace(clearNumberListRegEx, '');
        word = word.trim();
        return word;
    });

    const words = [];
    for (let wordFull of semicolonSeparatedWordsArray) {

        const roundBracketOpen = wordFull.indexOf('(');
        const roundBracketClose = wordFull.lastIndexOf(')');
    
        let description = wordFull.slice(roundBracketOpen, roundBracketClose+1);

        const wordWithoutRoundBracket = wordFull.slice(0, roundBracketOpen !== -1 ? roundBracketOpen: wordFull.length);
            
            
        const squareBracketOpen = wordFull.indexOf('[');
        const squareBracketClose = wordFull.lastIndexOf(']');
            
        let word = wordWithoutRoundBracket;
        if (squareBracketOpen !== -1) {
            const newDesrtiption = wordFull.slice(squareBracketOpen, squareBracketClose !== -1 ? squareBracketClose+1 : wordWithoutRoundBracket.length);
            description += newDesrtiption;
            word = wordWithoutRoundBracket.slice(0, squareBracketOpen);
        }

        const wordsCommaSeparated = word.split(',');

        for (let oneWord of wordsCommaSeparated) {
            oneWord = oneWord.trim(); 
            if (language === 'rus') {
                words.push({
                    rus: oneWord,
                    rusDescription: description,
                });
            }
            if (language === 'ing') {
                words.push({
                    ing: oneWord,
                    ingDescription: description,
                });
            }
            // }
        }
    }
    // console.log(words);
    return words;
}

// console.log(addToDb);
(async ()=>{
    for (const word in addToDb) {
        const query = `
    mutation{
        createWord(wordData: {
          ing: "${addToDb[word].ing}",
          rus: "${addToDb[word].rus}"${addToDb[word].ingDescription || addToDb[word].rusDescription ? ',' : ''}
          ${addToDb[word].ingDescription ? `ingDescription: "${addToDb[word].ingDescription}"` : ''}${addToDb[word].rusDescription ? ',' : ''}
          ${addToDb[word].rusDescription ? `rusDescription: "${addToDb[word].rusDescription}"` : ''}
        })
      }
      `; 
        console.log(addToDb[word]);
        // console.log(query);
        console.log('word ', word, 'of', count);
        await fetch('http://localhost:8887/api/admin', {
            method: 'POST',
            body: JSON.stringify({query}),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.text())
            .then(body => console.log(body)) 
            .catch(error => console.error(error));
    }
})();