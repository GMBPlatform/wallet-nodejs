const http = require('http');

const hostname = '127.0.0.1';
const port = 1337;

/*
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello world\n');
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname} : ${port}/`);
})

The following notes and the above notes function the same.
*/



var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello world\n');

});
server.listen(port, hostname, function(){
  console.log(`Server running at http://${hostname} : ${port}/`);
});
