const Firestore = require('@google-cloud/firestore')
const uuid = require('uuid/v4')
const moment = require('moment')
const url = require('url');

// Firestore API
const firestore = new Firestore({timestampsInSnapshots: true});

exports.karma_playerhandler = function(request, response) {
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
        // if (query.id) {
        //     const docPath = `players/${query.id}`
        //     console.log('Docpath = ', docPath)
        //     try {
        //         firestore.doc(docPath).get().then( player => {
        //             if (player.exists) {
        //                 response.status(200).json(player.data())
        //             } else {
        //                 response.status(404).json({error: "No such player"})
        //             }
        //         }, err => {
        //             response.status(500).json(err)
        //         })
        //     } catch (err) {
        //         response.status(500).json(err)
        //     }
        // } else if (query.new && query.name) {
        //     const playerId = uuid()
        //     const created = moment().valueOf()
        //     const player = {
        //         id: playerId,
        //         name: query['name'],
        //         created: created
        //     }            
        //     firestore.collection('players').doc(playerId).set(player).then( ref => {
        //         response.status(200).json({dbResponse: ref, player: player})
        //     })
        // }
        response.status(200).send()
    }
}