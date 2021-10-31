const service = require('./dbilling-service')

module.exports = (app) => {
    app.post('/addItem', service.addItem);
    app.post('/getItem', service.getItem);
    app.post('/removeItem', service.removeItem);
    app.post('/updateItem', service.updateItem);
    app.post('/addCustomer', service.addCustomer);
    app.post('/getCustomer', service.getCustomer);
    app.post('/removeCustomer', service.removeCustomer);
    app.post('/updateCustomer')
    app.post('/bill')
}