const Firestore = require('@google-cloud/firestore')
const uuid = require('uuid/v4')
const moment = require('moment')
const url = require('url');

// Firestore API
const firestore = new Firestore({timestampsInSnapshots: true});

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
                response.status(200).json({dbResponse: ref, game: fullGameData})
            })
        }
        else {
            response.status(200).send()
        }
    } else {
        response.status(403).send()
    }
}

function createGame(query) {
    const gameId = query.gameId
    const playerId = query.playerId
    const name = query.name
    const created = moment().valueOf()
    const deckId = '1'
    const game = {
        name: name,
        id: gameId,
        created: created,
        players: [playerId],
        active: false,
        deck: deckId,
        hands: {}                
    }
    game.hands[playerId] = {0 : 'S13'}

    const docPath = `games/${gameId}`
    console.log('Docpath = ', docPath)
    try {
        console.log('Creating game', gameId)
        return firestore.doc(docPath).set(game)
    } catch (err) {
        console.log('Error: ',err)
        response.status(500).json(err)
    }    
}

function getGame(query) {
    const gameId = query.gameId
    const docPath = `games/${gameId}`
    console.log('Docpath = ', docPath)
    try {
        console.log('Getting game', gameId)
        return firestore.doc(docPath).get()
    } catch (err) {
        console.log('Error: ',err)
        response.status(500).json(err)
    }    
}