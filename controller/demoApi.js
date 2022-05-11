/**
 *  demo RESTFUL API服务
 *  这里采用的设计方案是: 保持DB连接不关闭, 除非服务进程关闭
 */

const jsonParse = require('../lib/jsonParse.js')
const db = require('../module/db/db.js')
const params = require('../lib/params.js')

const connectOpen = () => {
    isConnected = true
}

const connectClose = () => {
    isConnected = false
}

// 获取集合
const Login = db.getSchema('Login')

// 连接DB
let isConnected = false // 是否打开DB-TCP连接标识
db.connectMongoDb('demo', connectOpen, connectClose)

// 查询
const find = (query) => {
    return new Promise((resolve, reject) => {
        Login.find(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    })
}

// get条件查询
const getData = (request, response) => {
    let param = params.grabGetParams(request)
    let query = param && param.name ? {
        name: param.name
    } : {};

    find(query).then((res) => {
        jsonParse.sendResult(response, 0, res)
    }).catch((err) => {
        jsonParse.sendResult(response, -2003, err)
    });
}

// put添加
const addData = (request, response) => {
    params.grabPostParams(request).then((param) => {
        let json
        if (!param.name || !param.password) {
            jsonParse.sendResult(response, -2002)
        } else {
            // 先查询, 避免重复数据
            let query = param && param.name ? {
                name: param.name
            } : {};

            find(query).then((res) => {
                if (res.length > 0) { // 重复数据
                    jsonParse.sendResult(response, -2004, res)
                } else { // 添加数据入库
                    let newData = new Login({
                        name: param.name,
                        password: param.password
                    })
                    newData.save((err, res) => {
                        if (err) {
                            jsonParse.sendResult(response, -2003, err)
                        } else {
                            jsonParse.sendResult(response, 0, res)
                        }
                    })
                }
            }).catch((err) => {
                jsonParse.sendResult(response, -2003, err)
            });
        }
    });
}

// delete删除
const delData = (request, response) => {
    params.grabPostParams(request).then((param) => {
        if (!param.name) {
            jsonParse.sendResult(response, -2002)
        } else {
            Login.deleteOne({
                name: param.name
            }, (err) => {
                if (err) {
                    jsonParse.sendResult(response, -2003, err)
                } else {
                    jsonParse.sendResult(response, 0)
                }
            })
        }
    });
}

// post修改
const updateDataByName = (request, response) => {
    params.grabPostParams(request).then((param) => {
        if (!param.name || !param.password) {
            jsonParse.sendResult(response, -2002)
        } else {
            Login.where({
                name: param.name
            }).update({
                $set: {
                    password: param.password
                }
            }, (err, res) => {
                console.log(res, err);
                if (err) {
                    jsonParse.sendResult(response, -2003, err)
                } else if (res.n == 0) {
                    jsonParse.sendResult(response, -2005, res)
                } else {
                    jsonParse.sendResult(response, 0)
                }
            })
        }
    });
}

const entry = (request, response) => {
    if (!isConnected || !Login) {
        console.log('DB connect failed');
        jsonParse.sendResult(response, -2001)
    } else {
        let method = request.method.toUpperCase();
        switch (method) {
            case 'GET':
                getData(request, response)
                break;
            case 'PUT':
                addData(request, response)
                break;
            case 'DELETE':
                delData(request, response)
                break;
            case 'POST':
                updateDataByName(request, response)
                break;
            default:
                getData(request, response)
        }
    }
}

module.exports = {
    entry: entry,
}