import { Socket } from "socket.io";
import { checkJWT } from '../helpers/index.js';
import { ChatMessage } from '../models/index.js';

const chatMessage = new ChatMessage();

export const socketController = async( socket = new Socket(), io ) => {
    const user =  await checkJWT(socket.handshake.headers['x-token']);
    if ( !user ){
        return socket.disconnect();
    }

    // Agregar el usuario conectado
    chatMessage.connectUser( user );
    io.emit('active-users', chatMessage.userArr );
    socket.emit('receive-messages', chatMessage.last10 );

    // conectar a una sala especial
    socket.join( user.id ); //global, socket.id, user.id

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        chatMessage.disconnectUser( user.id );
        io.emit('active-users', chatMessage.userArr );
    })

    socket.on('sent-message', ({ uid, message }) => {

        if( uid ){
            // Mensaje privado
            socket.to( uid ).emit('private-message', { de: user.name, message });
        } else{
            chatMessage.sentMessage( user.id, user.name, message );
            io.emit('receive-messages', chatMessage.last10 );
        }

    })
}