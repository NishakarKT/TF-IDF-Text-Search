import data from "./data/faqs.json";
import TF_IDF from "./data/TF_IDF.json";
import IDF from "./data/IDF.json";
import keyword_extractor from "keyword-extractor";

const strtipPunctuations = str => str.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g, "");

const getKeywords = str => {
    return keyword_extractor.extract(strtipPunctuations(str), { language: "english", remove_digits: true, return_changed_case: true });
};

// // IDF
// const IDF = {};
// Object.keys(data).forEach(question => {
//     const kWords = getKeywords(question + " " + data[question]);
//     kWords.map(kWord => {
//         let count = 0;
//         Object.keys(data).forEach(q => {
//             const kw = getKeywords(q + " " + data[q]);
//             if (kw.includes(kWord))
//                 count++;
//         });
//         IDF[kWord] = Math.log10(Object.keys(data).length / count);
//     });
// });
// console.log(JSON.stringify(IDF));

// // TF_IDF
// const TF_IDF = {};
// Object.keys(data).forEach(question => {
//     const kWords = getKeywords(question + " " + data[question]);
//     const freq = {};
//     kWords.map(kWord => {
//         if (!freq[kWord])
//             freq[kWord] = 0;
//         freq[kWord]++;
//     });
//     TF_IDF[question] = Object.keys(freq).map(kWord => ({ kWord, tf_idf: (IDF[kWord] || 0) * ((freq[kWord] || 0) / (kWords.length || 1)) }));
// });
// console.log(JSON.stringify(TF_IDF));

const findResults = str => {
    const kWords = getKeywords(str);
    let sq_A = 0;
    const tf_idf = {};
    kWords.forEach(kWord => {
        if (!tf_idf[kWord])
            tf_idf[kWord] = 0;
        tf_idf[kWord] += 1 / kWords.length;
    });

    Object.keys(tf_idf).forEach(kWord => {
        tf_idf[kWord] = (IDF[kWord] || 0) * tf_idf[kWord];
        sq_A += (tf_idf[kWord] * tf_idf[kWord]);
    });

    const similarity = {};
    Object.keys(TF_IDF).forEach(question => {
        let sim = 0, sq_B = 0;
        TF_IDF[question].map(kWord => {
            sim += kWord.tf_idf * (tf_idf[kWord.kWord] || 0);
            sq_B += (kWord.tf_idf * kWord.tf_idf);
        });
        sim = sim / (Math.sqrt(sq_A) * Math.sqrt(sq_B));
        similarity[question] = sim;
    });

    const results = Object.keys(similarity).sort((a, b) => similarity[b] - similarity[a]).map(question => ({ question, answer: data[question] }));

    return results;
};

console.log(findResults("professors"));