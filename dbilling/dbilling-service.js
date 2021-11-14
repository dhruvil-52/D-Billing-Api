const model = require('./dbilling-model')

const service = {

}

service.addItem = (req, res) => {
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

service.getItem = (req, res) => {
    req.body.mode = 'item'
    model.getDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.removeItem = (req, res) => {
    req.body.mode = 'item'
    model.removeDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.makeBill = (req, res) => {
    req.body.mode = 'bill';
    model.makeBill(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.getCustomer = (req, res) => {
    req.body.mode = 'customer'
    model.getDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.addCustomer = (req, res) => {
    req.body.mode = "customer";
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

service.removeCustomer = (req, res) => {
    req.body.mode = 'customer'
    model.removeDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.getBill = (req, res) => {
    req.body.mode = 'bill'
    model.getDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.updateCustomer = (req, res) => {
    req.body.mode = "customer";
    req.body.editMode = "true";
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

service.returnAllItems = (req, res) => {
    req.body.mode = "bill";
    model.returnAllItems(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.getMyProfile = (req, res) => {
    req.body.mode = "profile";
    model.getDataFromDoc(req.body).then((resp) => {
        res.status(200).send({
            data: resp
        })
    }, (error) => {
        res.status(500).send({
            data: error
        })
    })
}

service.editMyProfile = (req, res) => {
    req.body.mode = "profile";
    req.body.editMode = "true";
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

module.exports = service;