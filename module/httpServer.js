
/**
 *  服务器模块
 */

const Http = require('http')
const Path = require('path')
const Route = require('./route.js')

const port = 8088;

const httpStart = () => {
    
    // 创建 HTTP 服务
    const server = Http.createServer((request, response) => {
        if(Path.basename(request.url).indexOf('.') >= 0){
            Route.fileServer(request, response) // HTTP访问文件服务
        }else{
            Route.apiServer(request, response) // 普通HTTP服务
        }
    }).listen(port, function(){
        console.log(`server is running on http://localhost:${port}`)
    })

    return server;

}

exports.httpStart = httpStart