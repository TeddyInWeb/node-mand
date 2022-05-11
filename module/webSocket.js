
/**
 *  Websocket 模块
 */

const Socket = require('socket.io')

let users = {}; // 在线用户列表 socketId: {'user': String}

const afterConnection = (ws, socket, user) => {

    // 断开链接
    socket.on('disconnect', () => {
        delete users[socket.id] // 在线列表剔除该用户
        ws.emit('broadcast', { msg: `${user} 离开了聊天室!`})
        console.log(`${user} disconnect`, users)
    })

    socket.on('message', (data) => { // 公开消息
        onMessage(ws, socket, data)
    }) 

    socket.on('private message', (targetUser, data) => { // 私信
        onPrivateMessage(ws, socket, targetUser, data)
    }) 

}

const onMessage = (ws, socket, data) => {
    ws.emit('message', { user: users[socket.id].user, msg: data})
}

const onPrivateMessage = (ws, socket, targetUser, data) => {
    let socketId = isUserExist(targetUser)
    socketId && ws.to(socketId).emit('private message', { from: users[socket.id].user, msg: data})
}

const isUserExist = (user) => {
    let socketId;
    for(let i in users){
        if(users[i].user == user){
            socketId = i
        }
    }
    return socketId
}

const startWebsocket = (server, path = '/chatroom') => {

    const ws = new Socket(server, {
        path: path,
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    })

    ws.on('connection', (socket) => {

        let user = socket.request._query.user,
            usersTag = {
                user: user
            }

        if(user && !isUserExist(user)){
            users[socket.id] = usersTag;
            ws.emit('broadcast', { msg: `新用户 ${user} 加入了聊天室!`})
            afterConnection(ws, socket, user)
        }else{
            ws.to(socket.id).emit('disconnect', { msg: `连接断开: ${user} 已被使用!`})
            socket.disconnect(true)
        }

    })
}

exports.startWebsocket = startWebsocket;

