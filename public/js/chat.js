
let user = null;
let socket = null;

// referencias html
const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulMessage = document.querySelector('#ulMessage');
const ulUsers = document.querySelector('#ulUsers');
const btnExit = document.querySelector('#btnExit');


// validar el token del localstorage
const validateJwt = async() => {

    const token = localStorage.getItem('token') || '';

    if( token.length <= 10 ){
        window.location = 'index.html'
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch('http://localhost:8080/api/auth/',{
        headers: { 'x-token': token }
    });

    const { user: userDB, token: tokenDB } = await resp.json();
    localStorage.setItem('token', tokenDB);
    user = userDB;
    document.title = user.name;

    await connectSocket();
}

const connectSocket = async() => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('receive-messages', drawMessages);

    socket.on('active-users', drawUser);


    socket.on('private-message', (payload) => {
        console.log('Privado', payload);
    });
}

const drawUser = ( users = [] ) => {
    let usersHTML = '';
    users.forEach( ({ name, uid }) => {
        usersHTML += `
            <li>
                <p>
                    <h5 class="text-success" > ${ name } </h5>
                    <span class="fs-6 text-muted"> ${ uid } </span>
                </p>
            </li>
        `;
    });

    ulUsers.innerHTML = usersHTML;
}


const drawMessages = ( messages = [] ) => {
    let messagesHTML = '';
    messages.forEach( ({ name, message }) => {
        messagesHTML += `
            <li>
                <p>
                    <span class="text-primary px-0" > ${ name } </span>
                    <span> ${ message } </span>
                </p>
                <hr>
            </li>
        `;
    });

    ulMessage.innerHTML = messagesHTML;
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {

    const message = txtMessage.value.trim();
    const uid = txtUid.value.trim();

    if( keyCode !== 13 ) return;
    if( message.length === 0 ) return;
    if( message.length > 70 ) return;

    socket.emit('sent-message', { message, uid });

    txtMessage.value = '';

})

const main = async() => {

    // validar JWT
    await validateJwt();

}

main();
