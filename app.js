var express = require('express');
var app = express();

app.get('/hello',function(req, res){
    res.send('Hello Wolrd!')
});
app.use('/', express.static('./public'));


var server = app.listen(process.env.PORT || 5000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listen at http://%s:%s', host,port);
})
