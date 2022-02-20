// libraries requirement
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sio = require('socket.io')

// requiring route controllers
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

// declaring express.js app
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// registering middlewares
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// registering routes to use controllers
app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

// setting express.js 'app' to listen for requests
// declaring 'server', an instance of express.js 'app' listening on port 4000 for requests
const server = app.listen(4000, () => {
    console.log('running on port 4000')
})

// declaring socket.io server
// socket.io listens for socket protocol requests through 'server'
const io = sio(server)

// socket.io server event listener declaration
// listening for 'connection' event, then managing 'app' specified event emits
io.on('connection', (socket) => {
    console.log(`socket established ${socket.id}`)
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data)
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data)
    })
})

module.exports = app