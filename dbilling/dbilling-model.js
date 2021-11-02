const db = require('../search-engine/db')

let dbillingModel = {

}

dbillingModel.addDataToDoc = (data) => {
    return new Promise((resolve, reject) => {
        db.addData(data).then((result) => {
            resolve(result)
        }, (error) => {
            reject(error)
        })
    })
}

dbillingModel.removeDataFromDoc = (data) => {
    return new Promise((resolve, reject) => {
        db.removeData(data).then((result) => {
            resolve(result)
        }, (error) => {
            reject(error)
        })
    })
}

dbillingModel.makeBill = (data) => {
    return new Promise((resolve, reject) => {
        db.makeBill(data).then((result)=>{
            resolve(result);
        },(error)=>{
            reject(error);
        })
    })
}

dbillingModel.getDataFromDoc = (data) => {
    return new Promise((resolve, reject) => {
        db.searchData(data).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        })
    })
}

dbillingModel.returnAllItems=(data)=>{
    return new Promise((resolve, reject) => {
        db.returnAllItems(data).then((result) => {
            resolve(result);
        }, (error) => {
            reject(error);
        })
    })
}

module.exports = dbillingModel