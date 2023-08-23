const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(req);

    //Requisição
    // console.log(req.url);
    // console.log(req.method);
    // console.log(req.headers);

    //Response

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My first page</title></head>');
    res.write('<body><h1>Hello from my new Node.js Server!</h1></body>');
    res.write('</html>');

    res.end(); 
});

server.listen(4000);