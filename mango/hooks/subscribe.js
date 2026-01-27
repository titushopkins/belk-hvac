const subscribe = ({ io, collection, document, request, individual, originalDocument }) => {
    let method = request.method
    if (collection.subscribe && method != 'read' && individual) {

        const subscription = io.of(collection.name);

        // Send to the id and the author id
        let payload = method == 'delete' ? originalDocument : document
        subscription.to(request.member?.id).emit(`${collection.name}:${method}d`, payload);
        subscription.to((document?.id||originalDocument?.id)).emit(`${collection.name}:${method}d`, payload);

        // Send to each custom room
        for (let room of (collection.subscribe?.rooms||[])) {
            let keys = room.split('.')
            let target = document
            for (let key of keys) target = target[key]
            console.log(document, keys)
            let roomId = target
            console.log('attempting to emit to', collection.name, roomId, `${collection.name}:${method}d`)
            subscription.to(roomId).emit(`${collection.name}:${method}d`, payload);
        }
    }
}

export { subscribe }
