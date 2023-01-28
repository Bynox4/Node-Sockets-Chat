

class Message{
    constructor( uid, name, message ) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}


class ChatMessage {

    constructor() {
        this.messages = [];
        this.users = {};
    }

    get last10() {
        this.messages = this.messages.splice(0,10);
        return this.messages
    }

    get userArr() {
        return Object.values( this.users ); // [{},{},{}]
    }

    sentMessage( uid, name, message ) {
        this.messages.unshift(
            new Message(uid, name, message)
        );
    }

    connectUser( user ){
        this.users[user.id] = user;
    }

    disconnectUser( id ){
        delete this.users[id];
    }
}

export default ChatMessage;