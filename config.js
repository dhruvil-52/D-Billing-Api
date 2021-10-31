const convict = require('convict')

const config = convict({
    server: {
        port: {
            doc: 'HTTP port to bind',
            format: 'port',
            default: 8080,
            env: 'PORT',
            arg: 'port'
        }
    }
})

module.exports = config;