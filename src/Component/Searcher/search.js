import data from "../../data/books";


// object to store data id and words
let wordsInData = {};
let termFrequencyById = {};
let numOfDataWithWord = {};
let idfOfWord = {};

function summaryWordCount(id) {
    const summary = data.summaries.find((d) => d.id === id).summary;
    let words = [];

    // retrieve all words in a data, split and store in a variable
    if (summary) {
        words = summary.split(" ");
    }

    // initialise an object to store word and frequency of the word
    let wordCount = {};

    // loop each array of word
    words.forEach((word) => {
        if (wordCount[word] === undefined) {
            numOfDataWithWord[word] = numOfDataWithWord[word]
                ? numOfDataWithWord[word] + 1  // increment the count of each word in the map
                : 1;
        }

        wordCount[word] = wordCount[word] ? wordCount[word] + 1 : 1;
    });

    Object.keys(wordCount).forEach((word) => {
        wordCount[word] /= words.length;
    });

    // add frequency map to doc map
    termFrequencyById[id] = wordCount;

    // add the id of the doc and the list of words in the doc
    wordsInData[id] = Object.keys(wordCount);
}

function termOccurrence(word) {
    const totalDocuments = data.summaries.length;

    Object.keys(numOfDataWithWord).forEach((word) => {
        idfOfWord[word] = numOfDataWithWord[word]
            ? Math.log10(totalDocuments / numOfDataWithWord[word])
            : 0;
    });
}

function relevanceSearch(word, id) {
    return (termFrequencyById[id][word] ? termFrequencyById[id][word] : 0) *
    idfOfWord[word]
        ? idfOfWord[word]
        : 0;
}

data.summaries.forEach(({ id, summary }) => summaryWordCount(id));

termOccurrence();

// match the words from the query user types in with the data
function queryRelevanceSearch(query) {
    const words = query.split(" ");

    let frequency = {};

    words.forEach((word) => {
        frequency[word] = frequency[word] ? frequency[word] + 1 : 1;
    });

    let relevance = {};

    Object.keys(frequency).forEach((word) => {
        frequency[word] /= words.length;

        relevance[word] = idfOfWord[word] ? idfOfWord[word] * frequency[word] : 0;
    });

    return relevance;
}

function querySummaryMatcher(query, doc) {
    const queryRelevance = queryRelevanceSearch(query);

    let numerator = 0;
    let denominatorQuery = 0;
    let denominatorDocument = 0;

    Object.keys(queryRelevance).forEach((word) => {
        numerator += queryRelevance[word] * relevanceSearch(word, doc);

        denominatorQuery += queryRelevance[word] * queryRelevance[word];

        denominatorDocument += relevanceSearch(word, doc) * relevanceSearch(word, doc);
    });

    denominatorQuery = Math.sqrt(denominatorQuery);
    denominatorDocument = Math.sqrt(denominatorDocument);

    if (denominatorDocument === 0) {
        return 0;
    }
    return numerator / (denominatorQuery * denominatorDocument);
}

export default function (query, maxSuggestions) {
    let relevance = [];
    data.summaries.forEach(({ id, summary }) => {
        const similarity = querySummaryMatcher(query, id);

        relevance.push({ id: id, relevance: similarity });
    });

    const suggestions = relevance
        .sort((a, b) => {
            return b.relevance - a.relevance;
        })
        .slice(0, maxSuggestions)
        .map((item) => {
            const title = data.titles[item.id];
            const author = data.authors.find((d) => d.book_id === item.id).author;
            const summary = data.summaries.find((d) => d.id === item.id).summary;

            return {
                title,
                author,
                summary,
            };
        });

    return suggestions;
}
