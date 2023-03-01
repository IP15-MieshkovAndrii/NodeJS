
// const express = require('express')
// const app = express()
// const server = require('http').createServer(app)


// server.listen(3000)
// app.use('/logo.png', express.static(__dirname + './img/logo.png'))
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

users = []
connections = []








const fastify = require('fastify')({ logger: true })
const fastifyStatic = require('fastify-static')
const path = require('path')
const server = require('http').createServer(fastify)
const io = require('socket.io')(server)

server.listen(3000)


fastify.register(require('fastify-formbody'))

fastify.register(fastifyStatic, {
  root: path.join(__dirname)
})

fastify.register(require('fastify-socket.io'))

fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html')
  })

let server_port = process.env.PORT || 8000
let server_host = process.env.YOUR_HOST || '0.0.0.0'

fastify.io.on('connection', (socket) => {
    console.log("Успішне з'єднання")
    connections.push(socket)
    
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1)
        console.log("Відключилися")

    })

    socket.on('send mess', (data) => {
        fastify.io.emit('add mess', {mess: data.mess, name: data.name, className: data.className})
    })
})

fastify.listen(3000)

const start = async () => {
    try {
      await fastify.listen(server_port,server_host)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()

