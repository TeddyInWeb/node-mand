/**
 *  文件上传服务
 */

const formidable = require('formidable')
const fileStream = require('../lib/fileStream.js')
const jsonParse = require('../lib/jsonParse.js')

const renameing = (file) => {
    let tmpName = file.name.split('.')[0]
    let tmpFix = file.name.split('.')[1]
    let serverPath = `./public/demo/upload/${tmpName}_${new Date().getTime()}.${tmpFix}` // 服务器保存路径
    let clientPath = `./upload/${tmpName}_${new Date().getTime()}.${tmpFix}` // 给前端访问路径

    return new Promise((resolve, reject) => {
        fileStream.renameFile(file.path, serverPath, () => {
            resolve(clientPath) // 更名成功后, 将最新路径返回给上级
        }, (err) => {
            reject(err)
        })
    })
}

const sendResult = (type, response, successList) => {
    let code = type === 'success' ? '0' : '-5002'
    let result = {
        success_list: successList,
    }
    let res = jsonParse.getResultJsonStr(code, result)
    jsonParse.sendJson(response, res)
}

const sendError = (response, code) => {
    let res = jsonParse.getResultJsonStr('-5000')
    jsonParse.sendJson(response, res)
    return
}

module.exports = {
    upload: (request, response) => {
        let form = new formidable.IncomingForm()
        form.uploadDir = 'upload' // 文件保存目录
        form.maxFileSize = 2 * 1024 * 1024 // 上传文件大小限制为最大2M  
        form.keepExtensions = true // 使用文件的原扩展名
        form.multiples = true // 设置为多文件上传

        try {
            form.parse(request, function (err, fields, files) {

                if (err) {
                    return void sendError(response, '-5000') // 上传的包超过大小或未知错误
                }

                if (!files || !files.files) {
                    return void sendError(response, '-5001') // 上传的包为空
                }

                let filesQuene = Array.isArray(files.files) ? files.files : [files.files]

                let promiseList = [] // 异步操作列表, 给后面promise.all使用

                filesQuene.map((file) => {
                    promiseList.push(renameing(file))
                })

                Promise.all(promiseList).then((data) => {
                    sendResult('success', response, data)
                }).catch((data) => {
                    sendResult('error', response, data)
                })

            })
        } catch (err) {
            sendResult('error', response, err)
        }
    }
}