
/**
 * Module dependencies.
 */

var express = require('express')
  , app = express()
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , amqp = require('amqp')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);
  

server.listen(3001);

app.configure(function(){
  app.set('port', process.env.PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  io.set('log level', 1);
});



app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

	
var messages=["messages from queue: "];
io.sockets.on('connection', function (socket) {
		console.log("emitting event now from server..........."+messages.length);
		//socket.emit('event1', data);
		io.sockets.emit('event1', messages);//instant update without page refresh
	});



//1 create connection with amqp
var conn = amqp.createConnection({ host: 'localhost' });
conn.on('ready', setup);

//2 define the exchange
var exchange;
function setup() {
 	exchange = conn.exchange('my_exchange1', {'type': 'fanout', durable: false}, exchangeSetup);
}

//3 define the queue
var queue;
var deadQueue;
function exchangeSetup() {
   queue = conn.queue('my_queue1');
   queue.subscribe(function(msg) {
   	console.log("msg from q is=="+msg.data);
   	messages[messages.length]= msg.data;
	io.sockets.emit('event1', messages);
   });
}

//4 subscribe on queue and bind exchange and q
function queueSetup() {
	 console.log("q setup done");
}

//5 queue ready event
function onQueueReady(exchange){
	console.log("queue binding done...........................");
}





	



