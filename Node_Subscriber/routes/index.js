
/*
 * GET home page.
 */

exports.index = function(req, res){
  var urlToListen = "http://"+req.headers.host+"/";
  res.render('index', { title: 'Subscriber application powered by RabbitMQ, Node, Express, Jade' , urlToListen:urlToListen});
};