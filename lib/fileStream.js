/**
 *  文件处理模块
 */

const fs = require('fs')

// 普通文件处理
const accessFile = (response, path) => {
    fs.readFile(path, 'utf-8', function (err, data) {
        if (err) {
            console.log(err)
            response.statusCode = 404
            response.end()
        } else { // 普通文件
            response.statusCode = 200
            response.end(data)
        }
    })
}

// 多媒体文件处理
const accessImage = (response, path) => {
    let responseData = []
    console.log("path", path)
    let stream = fs.createReadStream(path)
    console.log("111")
    if (stream) {
        stream.on('error', function (chunk) {
            response.statusCode = 404
            response.end()
        })
        stream.on('data', function (chunk) {
            responseData.push(chunk)
        })
        stream.on('end', function () {
            let finalData = Buffer.concat(responseData)
            response.statusCode = 200
            response.write(finalData)
            response.end()
        })
    } else {
        response.statusCode = 404
        response.end()
    }
}

module.exports = {
    // 读取文件直接展示到客户端
    FileToClient: (response, path, ContentType = 'text/html') => {
        if (!path || !ContentType) {
            response.statusCode = 404
            response.end()
        }

        response.setHeader('Access-Control-Allow-Origin', '*')
        response.setHeader('Cache-Control', 'max-age=600')
        response.setHeader('Content-Type', ContentType)

        if (ContentType.indexOf('image') >= 0) {
            accessImage(response, path, ContentType)
        } else {
            accessFile(response, path, ContentType)
        }
    },
    // 复制文件到新目录
    moveFileToPath: (tmpPath, path, callback) => {
        if (!tmpPath || !path) {
            console.log('tmpPath or path missing')
            return
        }
        fs.readFile(tmpPath, function (err, data) {
            if (err) {
                console.log(err)
            } else {
                fs.writeFile(path, data, (err) => {
                    if (err) console.log(err)
                    typeof callback === 'function' && callback()
                })
            }
        })
    },
    // 原文件改名
    renameFile: (path, newPath, callback, error) => {
        fs.rename(path, newPath, (err) => {
            if (err) {
                console.log(err)
                typeof error === 'function' && error(err)
            }
            typeof callback === 'function' && callback()
        })
    }
}