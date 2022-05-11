
/**
 *  node服务入口
 */

const HttpServer = require('./module/httpServer.js')
const Ws = require('./module/webSocket.js')

// HTTP模块
const server = HttpServer.httpStart()

// Socket模块 (群聊天室)
Ws.startWebsocket(server, '/chatroom')