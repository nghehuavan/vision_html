var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use('/plugins', express.static(__dirname + '/plugins'));
app.use(express.static(__dirname));
app.listen(port, function () {
  console.log('listening on port http://localhost:' + port);
});
