const db = require('./search-engine/db')
const constant = require('./search-engine/constant')

let obj = {
    mode: 'customer',
    name: 'Morgan'
}

/**
 * use for search perticular customer
 * name = morgan
 * date = 4/4/2021
          8/16/2021
          1/8/2021
          12/24/2021
          6/12/2021
 */
let paymentObj = {
    mode: 'customer',
    name: 'Morgan', //it is mandatory
    startDate: '1/8/2021',
    endDate: '12/24/2021'
}

let itemObj = {
    itemName: 'kasab',
    itemCode: 'H1243',//come from constant,
    buyFrom: 'pallu',
    billNumber: 6547,
    startDate: '4/1/2021',
    endDate: '8/16/2021'
}

let addItemObj = {
    mode: 'item',
    itemName: 'kasab',
    itemCode: 'H1243',
    fromBuyer: true,// when we buying // radio
    fromSeller: false, // for when we got return from customer //radio
    buyFrom: 'pallu',
    billNumber: 6547,
    date: '1/1/2021',
    noOfPcs: 12,
    grossweight: 2.450,
    coneWieght: 0.250,
    netWeigth: 2.200,
    rate: 175,
    amount: 385
}

let RemoveItemObj = {
    mode:'item',
    itemCode: 'H1243'
}

let removeCustomer={
    customerId:'dhruviltalaviya@1',
    name:'dhruvil talaviya'
}

//auto add
let addCustomerObj = {
    mode: 'customer',
    firstName: 'dhruvil',
    lastName: 'talaviya',
    customerId: 'dhruviltalaviya@1',//unique
    mobileNumber: 9876543210,
    email: 'xyz@gmail.com',
    address: 'mongo db street near express js , codeWorld',
    GSTNumber: '12#244479-498193',
    dueAmount: 0,// atomatically set
    addingDate: '1/1/2021' // at the backend (date when add new customer)
}

//for delete customer
let removeCustomerObj = {
    mode: 'customer',
    customerId: 'dhruviltalaviya@1',
    name:'dhruvil talaviya' //optional
}

// db.searchData(paymentObj).then((result) => {
//     console.log(result);
//     console.log(JSON.parse(result).length)
// }, (error) => {
//     console.log(error);
// })

db.addData(addItemObj).then((result) => {
    console.log(result);
}, (error) => {
    console.log(error);
})