const convict = require('convict')

const config = convict({
    server: {
        port: {
            doc: 'HTTP port to bind',
            format: 'port',
            default: 3000,
            env: 'PORT',
            arg: 'port'
        }
    }
})

module.exports = config;