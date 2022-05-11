
/**
 *  路由模块
 */

const url = require('url')
const requestHandler = require('./requestHandler.js')

// api路由映射表
const apiHandlerMap = {
    '/': 'index',
    '/index': 'index',
    '/demo/index': 'demo',
    '/demo/upload': 'upload',
    '/demo/data': 'apiDemo',
    '/demo/excelTojson': 'excelTojson',
    '/demo/jsonToExcel': 'jsonToExcel',
}

const getHandler = (key) => {
    return requestHandler[key]
}

const apiServer = (request, response) => {
    let requestUrl = url.parse(request.url).pathname
    let handler = getHandler(apiHandlerMap[requestUrl])
    typeof handler === 'function' ? handler(request, response) : getHandler('noHandler')(request, response)
}

const fileServer = (request, response) => {
    requestHandler.fileRequestHandler(request, response)
}

exports.apiServer = apiServer
exports.fileServer = fileServer
