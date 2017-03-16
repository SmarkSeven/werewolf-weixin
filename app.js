var express = require('express');
var app = express();

app.get('/hello',function(req, res){
    res.send('Hello Wolrd!')
});
app.use('/', express.static('./public'));


var server = app.listen(5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listen at http://%s:%s', host, port);
})
