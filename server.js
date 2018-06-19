// //服务器及页面响应部分
// var express = require('express'),
//     app = express(),
//     server = require('http').createServer(app),
//     io = require('socket.io').listen(server); //引入socket.io模块并绑定到服务器
// app.use('/', express.static(__dirname + '/www'));
// server.listen(8000);
// console.log("运行成功")
// //socket部分
// io.on('connection', function(socket) {
//     //接收并处理客户端发送的foo事件
//     socket.on('message', function(data) {
//         //将消息输出到控制台
//         console.log(data);
//     })
// });

//服务器及页面部分
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users=[];//保存所有在线用户的昵称
app.use('/', express.static(__dirname + '/www'));
server.listen(8000);
//socket部分
io.on('connection', function(socket) {
    //昵称设置
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });
    //new file get
});
console.log("ok");