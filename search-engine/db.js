const constant = require('./constant');
const fs = require('fs');

const searchData = (obj) => {
    return new Promise((resolve, reject) => {
        // for checking key's entry in constant file
        if (constant.key[obj.mode]) {
            let path = './database' + '/' + constant.key[obj.mode] + '.json';
            fs.readFile(path, 'utf-8', (err, readFiledata) => {
                if (err) {
                    reject(err);
                } else {
                    let readDataArr = JSON.parse(readFiledata);
                    let result = [];
                    if (readFiledata) {
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

                        if (!obj.endDate && !obj.startDate) {
                            result = readDataArr;
                        }

                        //for customer filter
                        if (obj.mode == constant.key.customer) {
                            if (obj.name) {
                                result = result.filter(e => {
                                    if (e.first_name == obj.name) {
                                        return true;
                                    }
                                })
                            } else {
                                result = result;
                            }
                        }

                        if (obj.mode == constant.key.item) {
                            if (obj.itemCode) {
                                result = result.filter(e => {
                                    if (e.itemCode == obj.itemCode) {
                                        return true;
                                    }
                                })
                            }
                            if (obj.itemName) {
                                result = result.filter(e => {
                                    if (e.itemName == obj.itemName) {
                                        return true;
                                    }
                                })
                            }
                            if (obj.buyFrom) {
                                result = result.filter(e => {
                                    if (e.buyFrom == obj.buyFrom) {
                                        return true;
                                    }
                                })
                            }
                            if (obj.billNumber) {
                                result = result.filter(e => {
                                    if (e.billNumber == obj.billNumber) {
                                        return true;
                                    }
                                })
                            }
                        }

                        // for bill
                        if (obj.mode == constant.key.bill) {
                            if (obj.billNumber) {
                                result = result.filter(e => {
                                    if (e.billNumber == obj.billNumber) {
                                        return true;
                                    }
                                })
                            } else {
                                result = result;
                            }
                        }

                        resolve(result);
                    } else {
                        resolve([]);
                    }
                }
            })
        } else {
            reject("key not found")
        }
    })
}

const addData = (obj) => {
    return new Promise((resolve, reject) => {
        // for checking key's entry in constant file
        if (constant.key[obj.mode]) {
            let path = './database' + '/' + constant.key[obj.mode] + '.json';
            fs.readFile(path, 'utf-8', (err, readFileData) => {
                if (err) {
                    reject(error);
                } else {
                    let readDataArr = [];
                    if (readFileData) {
                        readDataArr = JSON.parse(readFileData);

                        if (obj.editMode && obj.mode == constant.key.customer) {
                            const removeIndex = readDataArr.findIndex(e => e.customerId == obj.customerId);
                            // remove object
                            readDataArr.splice(removeIndex, 1);
                            readDataArr.push(obj);
                        } else {
                            readDataArr.push(obj);
                        }
                    } else {
                        obj.remainingWeight = obj.netWeight; // at initial stage netWeight and remainingWeight both are equals
                        readDataArr.push(obj);
                    }
                    fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(true);
                        }
                    })
                }
            })
        }
    })
}

const makeBill = (obj) => {
    return new Promise((resolve, reject) => {
        if (constant.key[obj.mode]) {
            let path = './database' + '/' + constant.key[obj.mode] + '.json';
            fs.readFile(path, 'utf-8', (err, readFileData) => {
                if (err) {
                    reject(err);
                } else {
                    let readDataArr = [];
                    if (readFileData) {
                        readDataArr = JSON.parse(readFileData);
                    }
                    const index = readDataArr.findIndex(item => item.billNumber === obj.billNumber);
                    let isReturnExist = obj.item.findIndex(item => item.type == "return");
                    if (isReturnExist < 0 && index >= 0) {
                        reject("already bill exist");
                    }
                    if (index >= 0 && isReturnExist >= 0) {
                        if (obj.item && obj.item.length > 0) {
                            // for return we can edit bill
                            if (isReturnExist >= 0) {
                                let returnItemArr = obj.item.filter(i => {
                                    console.log(i.type)
                                    if (i.type == "return") {
                                        return true;
                                    }
                                });
                                readDataArr[index].item = readDataArr[index].item.concat(returnItemArr);
                            }
                            else {
                                readDataArr.push(obj);
                                // for sell we send error - bill already exist you can't enter same bill
                            }
                            addCustomerBaseonBill(obj).then((result) => {
                                updateItemBasedOnBill(obj).then((resp) => {
                                    //bill json write
                                    fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            resolve(true);
                                        }
                                    })
                                }, (err) => {
                                    reject(err);
                                })
                            }, (err) => {
                                reject(err);
                            })
                        }
                    }
                }
            })
        }
    })
}

const addCustomerBaseonBill = (obj) => {
    return new Promise((resolve, reject) => {
        let path = './database/' + constant.key.customer + '.json';
        fs.readFile(path, 'utf-8', (err, readFileData) => {
            if (err) {
                reject(err);
            } else {
                let readDataArr = [];
                let customerObj = JSON.parse(JSON.stringify(obj));
                if (readFileData) {
                    readDataArr = JSON.parse(readFileData);

                    const index = readDataArr.findIndex(item => item.customerId === obj.customerId);
                    if (index >= 0) {
                        if (customerObj.payAmount) {                       //cheque payment or cash payment
                            let paymentObj = {
                                billNumber: customerObj.billNumber,
                                paymentMode: customerObj.paymentMode,
                                paidAmount: customerObj.payAmount,
                                date: customerObj.date
                            }
                            //try
                            readDataArr[index].paymentHistory ? readDataArr[index].paymentHistory.push(paymentObj) : readDataArr[index].paymentHistory = [paymentObj]
                            if (customerObj.item && customerObj.item.length > 0) {
                                // if selling then add due in customer account ,for return item minus return bill amount from customer account
                                console.log(customerObj.item[0].type, readDataArr[index].dueAmount, (customerObj.amount - customerObj.payAmount), customerObj.amount)
                                readDataArr[index].dueAmount = customerObj.item[0].type == "sell" ? readDataArr[index].dueAmount + (customerObj.amount - customerObj.payAmount) : readDataArr[index].dueAmount - customerObj.amount;
                            }
                        }
                        else {
                            readDataArr[index].dueAmount = readDataArr[index].dueAmount + customerObj.amount;
                        }

                    } else {
                        if (customerObj.payAmount) {                       //cheque payment or cash payment
                            let paymentObj = {
                                billNumber: customerObj.billNumber,
                                paymentMode: customerObj.paymentMode,
                                paidAmount: customerObj.payAmount,
                                date: customerObj.date
                            }
                            customerObj.paymentHistory = [paymentObj]
                            customerObj.dueAmount = customerObj.amount - customerObj.payAmount;
                        }
                        else {
                            customerObj.dueAmount = customerObj.amount;
                        }
                        delete customerObj.payAmount;
                        delete customerObj.item;
                        delete customerObj.amount;
                        delete customerObj.mode;
                        delete customerObj.billNumber;
                        delete customerObj.paymentMode;

                        readDataArr.push(customerObj);
                        resolve(true);
                    }
                } else {
                    if (customerObj.payAmount) {                       //cheque payment or cash payment
                        let paymentObj = {
                            billNumber: customerObj.billNumber,
                            paymentMode: customerObj.paymentMode,
                            paidAmount: customerObj.payAmount,
                            date: customerObj.date
                        }
                        customerObj.paymentHistory = [paymentObj]
                        customerObj.dueAmount = customerObj.amount - customerObj.payAmount;
                    }
                    else {
                        customerObj.dueAmount = customerObj.amount;
                    }
                    delete customerObj.payAmount;
                    delete customerObj.item;
                    delete customerObj.amount;
                    delete customerObj.mode;
                    delete customerObj.billNumber;
                    delete customerObj.paymentMode;

                    readDataArr.push(customerObj);

                    resolve(true);
                }
                fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                })
            }
        })

    })
}

const updateItemBasedOnBill = (obj) => {
    return new Promise((resolve, reject) => {
        let path = './database/' + constant.key.item + '.json';
        fs.readFile(path, 'utf-8', (err, readFileData) => {
            if (err) {
                reject(err);
            } else {
                let billItemObj = JSON.parse(JSON.stringify(obj));
                let readDataArr = [];
                if (readFileData) {
                    readDataArr = JSON.parse(readFileData);
                    if (billItemObj.item && billItemObj.item.length > 0) {
                        updateItem(billItemObj.item).then((res) => {
                            if (res) {
                                resolve(true);
                            }
                        }, (err) => {
                            reject(err);
                        })
                    } else {
                        resolve(true);
                    }
                }
            }
        })
    })
}

const updateItem = (itemObj) => {
    return new Promise((resolve, reject) => {
        if (itemObj.length > 0) {
            let currentItemObj = itemObj.pop()
            let path = './database/' + constant.key.item + '.json';
            fs.readFile(path, 'utf-8', (err, readFileData) => {
                if (err) {
                    reject(err);
                } else {
                    let readDataArr = [];
                    if (readFileData) {
                        readDataArr = JSON.parse(readFileData);
                        let index = readDataArr.findIndex(item => item.itemCode === currentItemObj.itemCode);
                        if (index >= 0) {
                            console.log("index", currentItemObj.type, readDataArr[index].remainingWeight, currentItemObj.netWeight)
                            readDataArr[index].remainingWeight = currentItemObj.type == "sell" ? readDataArr[index].remainingWeight - currentItemObj.netWeight : readDataArr[index].remainingWeight + currentItemObj.netWeight;
                            readDataArr[index].remainingWeight = parseFloat(readDataArr[index].remainingWeight).toFixed(2);
                            console.log(readDataArr[index].remainingWeight)
                            //readDataArr[index].remainingWeight=Math.round(readDataArr[index].remainingWeight)
                            fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(updateItem(itemObj));
                                }
                            })
                        } else {
                            resolve(updateItem(itemObj));
                        }
                    }
                }
            })
        } else {
            resolve(true);
        }
    })
}

const removeData = (obj) => {
    return new Promise((resolve, reject) => {
        let path = './database/' + constant.key[obj.mode] + '.json';
        fs.readFile(path, 'utf-8', (err, readFileData) => {
            if (err) {
                reject(err);
            } else {
                let readDataArr = JSON.parse(readFileData);
                let removeIndex;
                if (obj.mode == "customer") {
                    removeIndex = readDataArr.findIndex(item => item.customerId === obj.customerId);
                }
                if (obj.mode == "item") {
                    removeIndex = readDataArr.findIndex(item => item.itemCode === obj.itemCode);
                }
                if (obj.mode == "bill") {
                    removeIndex = readDataArr.findIndex(item => item.billNumber === obj.billNumber);
                }
                if (removeIndex > 0) {
                    readDataArr.splice(removeIndex, 1);
                }
                fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(true);
                    }
                })
            }
        })
    })
}

module.exports = {
    searchData: searchData,
    addData: addData,
    removeData: removeData,
    makeBill: makeBill,
    removeData: removeData
}