
/**
 *  Excel-json 转换模块
 */

const Fs = require('fs')
const Xlsx = require('xlsx')
const Formidable = require('formidable')
const JsonParse = require('../lib/jsonParse.js')

const getRows = (key) => {
    return key.replace(/[a-zA-Z]/g, '')
}

const getCols = (key) => {
    return key.replace(/[0-9]/g, '')
}

const excelTojson = (request, response) => {
    let form = new Formidable.IncomingForm()
    let tmpPath = './public/demo/upload/tmp/'
    form.uploadDir = tmpPath   // 文件保存目录
    form.maxFileSize = 10 * 1024 * 1024  // 上传文件大小限制为最大10M  
    form.keepExtensions = true        // 使用文件的原扩展名
    
    form.parse(request, function(err, fields, file) {

        if(err){
            return void JsonParse.sendResult(response, -5000) // 上传的包超过大小或未知错误
        }

        if(!file || !file.file){
            return void JsonParse.sendResult(response, -5001) // 上传的包为空
        }

        let path = file.file.path
        let doc = Xlsx.readFile(path)
        let worksheet = doc.Sheets[doc.SheetNames[0]]
        let data = JSON.stringify(Xlsx.utils.sheet_to_json(worksheet))

        Fs.unlink(path, (err) => { // 删除临时文件
            if(err) console.log(err)
            JsonParse.sendResult(response, 0, {
                type: 'json',
                data: data
            }) // 返回给前端
        })
    })
}

const jsonToExcel = (request, response) => {
    let form = new Formidable.IncomingForm()
    let tmpPath = './public/demo/upload/tmp/'
    form.uploadDir = tmpPath   // 文件保存目录
    form.maxFileSize = 10 * 1024 * 1024  // 上传文件大小限制为最大10M  
    form.keepExtensions = true        // 使用文件的原扩展名
    
    form.parse(request, function(err, fields, file) {

        if(err){
            return void JsonParse.sendResult(response, -5000) // 上传的包超过大小或未知错误
        }

        if(!file || !file.file){
            return void JsonParse.sendResult(response, -5001) // 上传的包为空
        }

        let path = file.file.path

        Fs.readFile(path, (err, bytesData) => {
            if(err){
                JsonParse.sendResult(response, -5003) // 读取失败
            }else{
                let data = JSON.parse(bytesData)
                let sheet = Xlsx.utils.json_to_sheet(data) // json转表对象
                let html = Xlsx.utils.sheet_to_html(sheet) // 表对象再转为html

                // 返回给前端
                JsonParse.sendResult(response, 0, {
                    type: 'excel',
                    data: html
                })
            }
        })
    })
}

exports.excelTojson = excelTojson
exports.jsonToExcel = jsonToExcel