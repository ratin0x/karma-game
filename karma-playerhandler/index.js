const Firestore = require('@google-cloud/firestore')
const uuid = require('uuid/v4')
const moment = require('moment')

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
        let url = require('url');
        let url_parts = url.parse(request.url, true);
        let query = url_parts.query;
        console.log('Query : ', query)
        if (query['id']) {
            response.set('Access-Control-Allow-Origin', "*")
            response.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST')
            response.set('Access-Control-Max-Age', "1296000")
            response.set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-Width, Origin, Accept, X-Custom-Header')            
            response.status(200).json({ name: 'Bob', id: '1' })
        } else if (query['new'] && query['name']) {
            const playerId = uuid()
            const created = moment().valueOf()
            const document = firestore.doc(`players/${playerId}`)            
            const player = {
                id: playerId,
                name: query['name'],
                created: created
            }
            document.create(player).then(res => {
                console.log('Created ',res)
                response.status(200).json(player)                
            })
        }
        // response.status(200).send()
    }

    response.status(403).send()
}