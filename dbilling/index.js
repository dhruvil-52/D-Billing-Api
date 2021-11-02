const service = require('./dbilling-service')

module.exports = (app) => {
    app.post('/addItem', service.addItem);
    app.post('/getItem', service.getItem);
    app.post('/removeItem', service.removeItem);
    app.post('/makeBill', service.makeBill);
    //-----------------never call----------------------------------------------
   // app.post('/addCustomer', service.addCustomer);// add customer data from bill req. 
    
    app.post('/getCustomer', service.getCustomer);
    app.post('/removeCustomer', service.removeCustomer);
    app.post('/updateCustomer', service.updateCustomer);
    app.post('/getBill', service.getBill);
    app.post('/returnAllItems',service.returnAllItems);
}