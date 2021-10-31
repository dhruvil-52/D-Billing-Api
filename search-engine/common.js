const constant = require('./constant');
const fs = require('fs');

const searchData = (obj) => {
    return new Promise((resolve, reject) => {
        let path;

        // for checking key's entry in constant file
        if (constant.key[obj.mode]) {
            path = './database' + '/' + constant.key[obj.mode] + '.json';
            fs.readFile(path, 'utf-8', (err, readFiledata) => {
                if (err) {
                    reject(err);
                } else {
                    let readDataArr = JSON.parse(readFiledata);
                    let result = [];

                    //start date not empty
                    if (obj.startDate) {
                        // if endDate and startDate not empty
                        if (obj.endDate) {
                            result = readDataArr.filter(e => {
                                if (new Date(e.date) >= new Date(obj.startDate) && new Date(e.date) <= new Date(obj.endDate)) {
                                    return true;
                                }
                            })
                        }
                        // if endDate is empty but startDate not empty
                        else {
                            result = readDataArr.filter(e => {
                                if (new Date(e.date) >= new Date(obj.startDate)) {
                                    return true;
                                }
                            })
                        }
                    }
                    // startDate is empty
                    else {
                        //if endDate is not empty but startDate is empty
                        if (obj.endDate) {
                            result = readDataArr.filter(e => {
                                if (new Date(e.date) <= new Date(obj.endDate)) {
                                    return true;
                                }
                            })
                        }
                        // startDate and endDate both are empty then return whole data
                        else {
                            result = readDataArr;
                        }
                    }

                    //for customer filter
                    if (obj.mode == constant.key.customer) {
                        if (obj.name) {
                            result = result.filter(e => {
                                if (e.first_name == obj.name) {
                                    return true;
                                }
                            })
                        }
                    }

                    if (obj.mode == constant.key.item){
                        itemName :'kasab',
    itemCode:'H1243',//come from constant,
    buyFrom:'pallu',
    billNumber:6547,
                        if(obj.itemName){

                        }
                        if(obj.buyFrom){

                        }
                        if(obj.billNumber){
                            
                        }
                    }
                        resolve(JSON.stringify(result));
                }
            })
        } else {
            reject("key not found")
        }
    })
}


module.exports = {
    searchData: searchData
}