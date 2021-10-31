const model = require('./dbilling-model')

const service = {

}

service.addItem = (req, res) => {
    console.log("-->", req.body)
    req.body.mode = 'item'
    model.addDataToDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.getItem = (data) => {
    data.mode = 'item';
    model.getDataFromDoc(data).then((resp) => {

    }, (error) => {

    })
}

service.removeItem = (data) => {
    data.mode = 'item';
    model.removeDataFromDoc(data).then((resp) => {

    }, (error) => {

    })
}

service.addCustomer = (data) => {
    data.mode = 'customer';
    model.getDataFromDoc(data).then((resp) => {

    }, (error) => {

    })
}

service.getCustomer = (data) => {
    data.mode = 'customer';
    model.addDataToDoc(data).then((resp) => {

    }, (error) => {

    })
}

service.removeCustomer = (data) => {
    data.mode = 'customer';
    model.removeDataFromDoc(data).then((resp) => {

    }, (error) => {

    })
}

module.exports = service;