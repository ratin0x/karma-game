const Firestore = require('@google-cloud/firestore')
const uuid = require('uuid/v4')
const moment = require('moment')
const url = require('url');
const Deck = require('card-deck')

// Firestore API
const firestore = new Firestore({timestampsInSnapshots: true});

// Deck suits and ranks
const suits = ['h', 'c', 's', 'd']
const ranks = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']

/**
 * Main function handler that routes the game options
 */
exports.karma_gamehandler = function(request, response) {
    if (request.method === "OPTIONS") {
        console.log('origins')
        response.set('Access-Control-Allow-Origin', "*")
        response.set('Access-Control-Allow-Methods', 'GET, POST, PUT')
        response.set('Access-Control-Max-Age', "1296000")
        response.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-Width, Origin, Accept, X-Custom-Header')
        response.status(200).send()
    }

    if (request.method === "GET") {
        let url_parts = url.parse(request.url, true);
        let query = url_parts.query;
        console.log('Query : ', query)
        if (query.create && query.name && query.playerId) {
            const gameId = uuid()
            query.gameId = gameId
            createGame(query).then( ref => {
                console.log('Created, getting game', gameId)
                getGame({gameId: gameId}).then(game => {
                    const fullGameData = game.data()
                    response.status(200).json({dbResponse: ref, game: fullGameData})
                })
            }, err => {
                console.log('Error: ',err)
                response.status(500).json(err)
            })
        } else if (query.get && query.gameId) {
            getGame(query).then(game => {
                const fullGameData = game.data()
                response.status(200).json({game: fullGameData})
            })
        } else if (query.addPlayer && query.gameId && query.playerId) {
            getGame(query).then(game => {
                const fullGameData = game.data()
                addPlayer(fullGameData, query.playerId).then( () => {
                    response.status(200).json({game: fullGameData})
                }).catch( err => {
                    response.status(403).send()
                })
            })
        }
        else {
            response.status(200).send()
        }
    } else {
        response.status(403).send()
    }
}

/**
 * Create a game and add it to the store
 * @param {*} query 
 */
function createGame(query) {
    const gameId = query.gameId
    const playerId = query.playerId
    const name = query.name
    const created = moment().valueOf()
    const deckId = '1'
    const deck = new Deck(buildStack())
    deck.shuffle()

    const game = {
        name: name,
        id: gameId,
        created: created,
        players: [playerId],
        active: false,
        deck: deck._stack,
        hands: {}                
    }
    game.hands[playerId] = {0 : 'S13'}

    const docPath = `games/${gameId}`
    console.log('Docpath = ', docPath)
    try {
        console.log('Creating game', gameId)
        return firestore.doc(docPath).set(game)
    } catch (err) {
        return Promise.reject(err)
    }    
}

/**
 * Get a game from the store
 * @param {query} query 
 */
function getGame(query) {
    const gameId = query.gameId
    const docPath = `games/${gameId}`
    console.log('Docpath = ', docPath)
    try {
        console.log('Getting game', gameId)
        return firestore.doc(docPath).get()
    } catch (err) {
        console.log('Error: ',err)
        return Promise.reject(err)
    }    
}

/**
 * Add a player to a game
 * @param {game} game 
 * @param {playerId} playerId 
 */
function addPlayer(game, playerId) {
    const gameId = game.id
    const docPath = `games/${gameId}`
    try {
        console.log(`Adding player ${playerId} to game ${gameId}`)
        let players = game.players
        if ( !players.includes(playerId) ) {
            players.push(playerId)
            return firestore.doc(docPath).update({players: players})
        } else {
            console.log("Player already added to game")
            return Promise.reject(err)
        }
    } catch (err) {
        console.log('Error: ',err)
        return Promise.reject(err)
    }
}

/**
 * Build out the deck of 52 playing cards
 */
function buildStack() {
    let stack = []
    for ( let suit in suits) {
        for ( let rank in ranks ) {
            stack.push({ suit: suits[suit], rank: ranks[rank]})
        }
    }
    return stack
}