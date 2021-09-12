var proxy = require('express-http-proxy');
var app = require('express')();

app.get('/api/delegators', function(req, res){
   res.send("{}");
});
app.use('/api', proxy('http://box2.charterino.ru:7176', {
  parseReqBody: false
}));
app.use('', proxy('http://localhost:5000'));
app.listen(80);
