var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/* Socket */
var jwtAuth = require('socketio-jwt-auth');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.use(jwtAuth.authenticate({
  secret:'SignSecretKey'
}, (payload, done) => {
  if (!payload || !payload.username || !payload.exp || !payload.rooms) return;
  var now = Math.floor(Date.now()/1000);
  if (payload.exp < now) return;
  return done(null, { username: payload.username, rooms: payload.rooms});
}));
io.on('connection', socket => {
  var user = socket.request.user;
  socket.emit('users-list', [ { username: user.username, socketId: socket.id } ]);
  user.rooms.forEach((room) => { 
    socket.join(room);
    socket.broadcast.to(room).emit('user-connected', { username: user.username, socketId: socket.id });
  });
  socket.on('disconnect', () => {
    for (var room in socket.rooms)
      socket.broadcast.to(room).emit('user-disconnected', user);
  });
  socket.on('message', payload => { 
    io.to(payload.socketId).emit('message', { message: payload.message, from: socket.id });
  });
});
server.listen(3001);
/* End */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
