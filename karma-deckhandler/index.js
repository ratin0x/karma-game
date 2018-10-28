const Firestore = require('@google-cloud/firestore')

// Firestore API
const firestore = new Firestore({timestampsInSnapshots: true});

const suits = ['h', 'd', 's', 'c']
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

exports.karma_deckhandler = function(request, response) {
    if (request.method === "OPTIONS") {
        console.log('origins')
        response.set('Access-Control-Allow-Origin', "*")
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT')
        response.set('Access-Control-Max-Age', "1296000")
        response.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-Width, Origin, Accept, X-Custom-Header')
        response.status(200).send()
    }    
}

function makeCardArray () {
    let cards = []
    for (let suitIndex = 0; suitIndex < suits.length; suitIndex++) {
        for (let rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
            cards.push[`${suits[suitIndex]}${ranks[rankIndex]}`]
        }
    }
    console.log(cards)
    return cards
}