const fs = require('fs')

let lang = 'latin'

const dictionary = fs.readFileSync(`./dictionary/${lang}.txt`).toString().toLowerCase()

let cleanDictionary = []
let wordCount = 0

dictionary.split('\n').forEach(word => {
    if(/^[a-zA-Z]+$/m.test(word)) {
        cleanDictionary.push(word)
        wordCount += 1
    }
})

cleanDictionary = cleanDictionary.join('\n')

fs.writeFileSync(`./cleanDictionary/${lang}.txt`, cleanDictionary)
console.log(`Done! Counted ${wordCount}`)