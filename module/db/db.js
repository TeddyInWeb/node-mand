/**
 *  DB类
 */

const mongoose = require('mongoose')
const schemaList = require('./schemaList.js')

const connectMongoDb = (database = 'demo', success, error) => {

    const db = mongoose.connection

    mongoose.connect(`mongodb://localhost:27017/${database}`, {
        useNewUrlParser: true,
        keepAlive: true,
        reconnectTries: 30,
        socketTimeoutMS: 5000
    })

    db.on('open', () => {
        console.log(`db ${database} connect success`)
        typeof success === 'function' && success()
    })

    db.on('error', () => {
        console.log(`db ${database} connect failed, make sure your device had correctly installed MongoDB , 
        learn more 'https://blog.csdn.net/qq_27378621/article/details/80933354'`)
        typeof error === 'function' && error()
    })

    db.on('close', () => {
        console.log(`db ${database} connect close`)
    })

}

const closeMongoDb = () => {
    mongoose.connection.close();
}

const getSchema = (schema) => {
    if (schema && schemaList[schema]) {
        return mongoose.model(schema, schemaList[schema])
    } else {
        return false
    }
}

module.exports = {
    connectMongoDb: connectMongoDb,
    closeMongoDb: closeMongoDb,
    getSchema: getSchema
}