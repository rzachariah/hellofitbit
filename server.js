var express = require('express');
var fs = require('fs');

var app = express();
app.use('/', express.static(__dirname));

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log(`server started on localhost:${port}`);
});