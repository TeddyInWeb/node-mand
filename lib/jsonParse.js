/**
 *  json响应处理
 */

const document = require('../config/document.js')

const getResultJsonStr = (code = -1, data = '') => {      
    return {
        code: code, 
        msg: document.list[code] || document.list[-1],
        data: data,
    }
}

const sendJson = (response, json, contentType = 'application/json') => {
    response.writeHead(200, {
        'Content-Type': contentType,
        'charset': 'utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
    })
    response.end(JSON.stringify(json))
}

const sendResult = (response, code = -1, data = '', contentType) => {
    sendJson(response, getResultJsonStr(code, data), contentType)
}

module.exports = {
    getResultJsonStr : getResultJsonStr,
    sendJson : sendJson,
    sendResult : sendResult
}