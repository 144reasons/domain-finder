const fs = require('fs')
const { performance } = require("perf_hooks");

async function getTLDaw() {
    await fetch('https://data.iana.org/TLD/tlds-alpha-by-domain.txt')
        .then(res => res.text())
        .then(body => {
            fs.writeFileSync('./data/TLDs.txt', body.split('\n').slice(1).join('\n'))
        })
    return
}

async function getWordsaw() {
    await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt')
        .then(res => res.text())
        .then(body => {
            fs.writeFileSync('./data/words.txt', body.split('\n').slice(1).join('\n'))
        })

    return
}

async function downloadAll() {
    getTLDaw()
    getWordsaw()
}

// downloadAll()

const start = performance.now();

const TLDs = fs.readFileSync('./data/TLDs.txt').toString().toLowerCase()
const words = fs.readFileSync('./data/words_alpha.txt').toString().toLowerCase()

let domains = {}

TLDs.split('\n').forEach((tld) => {
    let tldDomains = []

    words.split('\n').forEach((word) => {
        let regex = new RegExp(`${tld}$`, 'm')
        if (word == tld) return
        if (regex.test(word)) tldDomains.push(word.replace(regex, `.${tld}`))
        // else console.log('wtf happened')
    })

    domains[tld] = tldDomains
})

let totalDomains = 0

for (let [tld, fdomains] of Object.entries(domains)) {
    let markdown = `# Autogenrated list of possible domains for ${tld}\n\nNo function implemented to check if any of these work, but you can check manually with https://tld-list.com/\n\n| Domain | Porkbun | NameCheap | Domains App |\n|---|---|---|---|\n`

    let domainCount = 0

    fdomains.forEach(domain => {
        // domain = domain.replace('\n', '')
        domainCount += 1
        totalDomains += 1
        markdown = markdown.concat(`| ${domain} | [Porkbun](https://porkbun.com/checkout/search?prb=e814663da1&tlds=&idnLanguage=&search=search&q=${domain}) | [Namecheap](https://www.namecheap.com/domains/registration/results/?domain=${domain}) | [Dmns](https://dmns.app/domains?q=${domain}) |\n`)
    })

    // console.log(markdown)

    if (domainCount > 1 ) fs.writeFileSync(`./domains/${tld}.md`, markdown)
}

const end = performance.now();

console.log('Done! Total possible domain count: ' + totalDomains)

console.log(`Time taken: ${end - start}ms, aka ${(end - start) / 60000} minutes `);


// https://www.namecheap.com/domains/registration/results/?domain=

// https://porkbun.com/checkout/search?prb=e814663da1&tlds=&idnLanguage=&search=search&q=

// https://domains.google.com/registrar/search?searchTerm=