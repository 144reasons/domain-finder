const fs = require('fs')

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

const TLDs = fs.readFileSync('./data/TLDs.txt').toString()
const words = fs.readFileSync('./data/words.txt').toString()

let domains = {}

TLDs.split('\n').forEach((tld) => {
    let tldDomains = []

    words.split('\n').forEach((word) => {
        let regex = new RegExp(`${tld.toLowerCase()}$`, 'm')
        if (regex.test(word.toLowerCase())) tldDomains.push(word.replace(regex, `.${tld.toLowerCase()}`))
    })

    domains[tld] = tldDomains
})

for (let [tld, fdomains] of Object.entries(domains)) {
    let markdown = `# Possible domains for ${tld}\n\nNo function implemented to check if any of these work, but you can check manually with https://tld-list.com/\n\n| Domain | Porkbun | NameCheap | Google Domains |\n|---|---|---|---|\n`

    let domainCount = 0

    fdomains.forEach(domain => {
        domainCount += 1
        markdown = markdown.concat(`| ${domain} | [Porkbun](https://porkbun.com/checkout/search?prb=e814663da1&tlds=&idnLanguage=&search=search&q=${domain}) | [Namecheap](https://www.namecheap.com/domains/registration/results/?domain=${domain}) | [Google](https://domains.google.com/registrar/search?searchTerm=${domain}) |\n`)
    })

    if (domainCount > 1 ) fs.writeFileSync(`./domains/${tld}.md`, markdown)
}

console.log('Probably done')

// https://www.namecheap.com/domains/registration/results/?domain=

// https://porkbun.com/checkout/search?prb=e814663da1&tlds=&idnLanguage=&search=search&q=

// https://domains.google.com/registrar/search?searchTerm=