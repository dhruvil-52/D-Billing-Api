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
                            delete obj.mode;
                            if (obj.name) {
                                result = result.filter(e => {
                                    if (e.firstName.toLowerCase() == obj.name.toLowerCase()) {
                                        return true;
                                    }
                                })
                            }
                            else if (obj.customerId) {
                                result = result.filter(e => {
                                    if (e.customerId == obj.customerId) {
                                        return true;
                                    }
                                })
                            } else {
                                result = result;
                            }
                        }

                        // for item
                        if (obj.mode == constant.key.item) {
                            delete obj.mode;
                            if (obj.itemCode) {
                                result = result.filter(e => {
                                    if (e.itemCode == obj.itemCode) {
                                        return true;
                                    }
                                })
                            }
                            if (obj.itemName) {
                                result = result.filter(e => {
                                    if (e.itemName.toLowerCase() == obj.itemName.toLowerCase()) {
                                        return true;
                                    }
                                })
                            }
                            if (obj.buyFrom) {
                                result = result.filter(e => {
                                    if (e.buyFrom.toLowerCase() == obj.buyFrom.toLowerCase()) {
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
                            delete obj.mode;
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

                        if (obj.mode == constant.key.profile) {
                            result = result;
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

// add customer ,edit customer ,add items
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
                        //for add edit customer profile
                        if (obj.mode == constant.key.customer) {
                            delete obj.mode;
                            if (obj.editMode) {
                                const removeIndex = readDataArr.findIndex(e => e.customerId == obj.customerId);
                                //just change those field which user want to change,other info will be conside old.
                                readDataArr[removeIndex].firstName = obj.firstName ? obj.firstName : readDataArr[removeIndex].firstName;
                                readDataArr[removeIndex].lastName = obj.lastName ? obj.lastName : readDataArr[removeIndex].lastName;
                                readDataArr[removeIndex].mobileNumber = obj.mobileNumber ? obj.mobileNumber : readDataArr[removeIndex].mobileNumber;
                                readDataArr[removeIndex].email = obj.email ? obj.email : readDataArr[removeIndex].email;
                                readDataArr[removeIndex].address = obj.address ? obj.address : readDataArr[removeIndex].address;
                                readDataArr[removeIndex].GSTNumber = obj.GSTNumber ? obj.GSTNumber : readDataArr[removeIndex].GSTNumber;
                                readDataArr[removeIndex].customerId = obj.customerId ? obj.customerId : readDataArr[removeIndex].customerId;
                                readDataArr[removeIndex].date = obj.date ? obj.date : readDataArr[removeIndex].date;
                                readDataArr[removeIndex].dueAmount = obj.dueAmount ? obj.dueAmount : readDataArr[removeIndex].dueAmount;
                            } else {
                                readDataArr.push(obj);
                            }
                        }
                        // for add item
                        else if (obj.mode == constant.key.item) {
                            delete obj.mode;
                            obj.remainingWeight = obj.netWeight; // at initial stage netWeight and remainingWeight both are equals
                            readDataArr.push(obj);
                        }
                        // for add edit my profile
                        else if (obj.mode == constant.key.profile) {
                            delete obj.mode;
                            if (obj.editMode) {
                                delete obj.editMode;
                                readDataArr[0] = obj;
                            } else {
                                readDataArr.push(obj);
                            }
                        }
                        fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(true);
                            }
                        })
                    }
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
                    let needToUpdate = false;

                    if (isReturnExist < 0 && index >= 0) {
                        // for sell we send error - bill already exist you can't enter same bill
                        reject("already bill exist");
                    }

                    if (index >= 0 && isReturnExist >= 0) {
                        if (obj.item && obj.item.length > 0) {
                            // for return we can edit bill
                            needToUpdate = true;
                            if (isReturnExist >= 0) {
                                let returnItemArr = obj.item.filter(i => {
                                    if (i.type == "return") {
                                        return true;
                                    }
                                });
                                readDataArr[index].item = readDataArr[index].item.concat(returnItemArr);
                            }

                        }
                    }

                    if (index < 0) {
                        //if bill not exist then add bill
                        readDataArr.push(obj);
                        needToUpdate = true;
                    }

                    if (needToUpdate) {
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
                        let paymentObj = {
                            billNumber: customerObj.billNumber,
                            paymentMode: (customerObj.paymentMode ? customerObj.paymentMode : undefined),
                            paidAmount: customerObj.payAmount,
                            dueAmount: customerObj.amount - (customerObj.payAmount ? customerObj.payAmount : 0),
                            date: customerObj.date
                        }
                        //try
                        readDataArr[index].paymentHistory ? readDataArr[index].paymentHistory.push(paymentObj) : readDataArr[index].paymentHistory = [paymentObj]
                        if (customerObj.item && customerObj.item.length > 0) {
                            // if selling then add due in customer account ,for return item minus return bill amount from customer account
                            readDataArr[index].dueAmount = customerObj.payAmount ? (customerObj.item[0].type == "sell" ? readDataArr[index].dueAmount + (customerObj.amount - customerObj.payAmount) : readDataArr[index].dueAmount - customerObj.amount) : (customerObj.item[0].type == "sell" ? readDataArr[index].dueAmount + customerObj.amount : readDataArr[index].dueAmount - customerObj.amount);
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
                            readDataArr[index].remainingWeight = currentItemObj.type == "sell" ? readDataArr[index].remainingWeight - currentItemObj.netWeight : readDataArr[index].remainingWeight + currentItemObj.netWeight;
                            readDataArr[index].remainingWeight = Math.round(readDataArr[index].remainingWeight * 100) / 100
                            if (readDataArr[index].remainingWeight < 0) {
                                reject("remaining weight should not less than 0 kg.")
                            } else if (readDataArr[index].remainingWeight > readDataArr[index].netWeight) {
                                reject("remaining weight should not more than bought item's weight.")
                            } else {
                                //readDataArr[index].remainingWeight=Math.round(readDataArr[index].remainingWeight)
                                fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(updateItem(itemObj));
                                    }
                                })
                            }
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
                let readDataArr = [];
                if (readFileData) {
                    readDataArr = JSON.parse(readFileData);
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
                else {
                    reject("data not available");
                }
            }
        })
    })
}

const returnAllItems = (obj) => {
    return new Promise((resolve, reject) => {
        let path = './database/' + constant.key[obj.mode] + '.json';
        fs.readFile(path, 'utf-8', (err, readFileData) => {
            if (err) {
                reject(err);
            } else {
                let readDataArr = [];
                if (readFileData) {
                    readDataArr = JSON.parse(readFileData);
                    let removeIndex = readDataArr.findIndex(item => item.billNumber === obj.billNumber);
                    if (removeIndex >= 0) {
                        //find which item is sold on that bill  and make it return it and send it to make bill
                        //make bill function consider it return items and make changes according it
                        let sellArry = readDataArr[removeIndex].item.map(p =>
                            p.type === 'sell'
                                ? { ...p, type: 'return' }
                                : p
                        );
                        readDataArr[removeIndex].item = sellArry;

                        //change in customer json and item json
                        makeBill(readDataArr[removeIndex]).then((result) => {
                            if (result) {
                                //change in bill json
                                readDataArr.splice(removeIndex, 1);
                                fs.writeFile(path, JSON.stringify(readDataArr), (error) => {
                                    if (error) {
                                        reject(error);
                                    } else {
                                        resolve(true);
                                    }
                                })
                            }
                        }, (error) => {
                            reject(error);
                        })
                    } else {
                        reject("bill not available");
                    }
                } else {
                    reject("bill data not available");
                }
            }
        })
    })
}

module.exports = {
    searchData: searchData,
    addData: addData,
    removeData: removeData,
    makeBill: makeBill,
    removeData: removeData,
    returnAllItems: returnAllItems
}