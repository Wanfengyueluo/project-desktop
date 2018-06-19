window.onload = function() {
    //实例并初始化我们的hichat程序
    var hichat = new HiChat();
    hichat.init();
};

//定义我们的hichat类
var HiChat = function() {
    this.socket = null;
};

//向原型添加业务方法
HiChat.prototype = {
    init: function() {//此方法初始化程序
        var that = this;
        var $headPic = $('.headPic li');
        var u=0;
        //建立到服务器的socket连接
        this.socket = io.connect();
        //监听socket的connect事件，此事件表示连接已经建立
        this.socket.on('connect', function() {
            //连接到服务器后，显示昵称输入框
            document.getElementById('info').textContent = 'get yourself a nickname :)';
            //document.getElementById('sign-up').style.display = 'block';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function() {
     document.getElementById('info').textContent = '!nickname is taken, choose another pls'; //显示昵称被占用的提示
 });
        this.socket.on('loginSuccess', function() {
     document.title = 'HZNU | ' + document.getElementById('nicknameInput').value;
     document.getElementById('loginWrapper').style.display = 'none';//隐藏遮罩层显聊天界面
     document.getElementById('messageInput').focus();//让消息输入框获得焦点
 });
        this.socket.on('error', function(err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = '!fail to connect :(';
            } else {
                document.getElementById('info').textContent = '!fail to connect :(';
            }
        });
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewLMsg('system ', msg, '#ffc500');
            var status= document.getElementById('status');
            status.style.marginLeft='40px';
            status.textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        this.socket.on('newMsg', function(user, msg, color) {
            that._displayNewMsg(user, msg, color);
        });
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });

        //选择头像
        $headPic.on('click', function() {
            var which = parseInt($(this).attr('class').slice(3)) - 1;
            $('.chosePic li').each(function(i, item) {
                $(item).children().remove();
                yourHeadPic = undefined;
            });
            $('.chosePic li:eq(' + which + ')').append($('<span></span>'));
            yourHeadPic = which + 1;
            var str=document.createElement('p');
            var s=document.getElementById("ctr-candle");
            str.style.marginLeft='15%';
            str.innerHTML='<img src="../public/'+yourHeadPic+'.png" width=120px;>';
            s.append(str);
        });

        //昵称设置的确定按钮
        document.getElementById('loginBtn').addEventListener('click', function() {
        var nickName = document.getElementById('nicknameInput').value;
        //检查昵称输入框是否为空
            if (nickName.trim().length != 0) {
        //不为空，则发起一个login事件并将输入的昵称发送到服务器
            that.socket.emit('login', nickName);
            } else {
        //否则输入框获得焦点
        document.getElementById('nicknameInput').focus();
            };
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function() {
            u=1;
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
                //color = document.getElementById('colorpalettediv').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg, color,u);
                that._displayNewMsg('Me', msg, color,u);
                return;
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            u=1;
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
                //color = document.getElementById('colorpalettediv').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                that.socket.emit('postMsg', msg, color,u);
                that._displayNewMsg('Me', msg, color,u);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            u=1;
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                    //color = document.getElementById('colorpalettediv').value;
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color,u);
                    that._displayImage('Me', e.target.result, color,u);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
    },


    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, color,u) {
        // var container = document.getElementById('historyMsg');
        // var date = new Date().toTimeString().substr(0, 8),
            //determine whether the msg contains emoji
            msg = this._showEmoji(msg);
        // var len = $("#messageInput").width();
        // msgToDisplay.style.color = color || '#000';
        // msgToDisplay.style.fontSize='30px';
        //     // msgToDisplay.innerHTML = '<img src="../public/'+yourHeadPic+'.png" style="width:30px; height:30px;">'+'<span class="timespan">(' + date + '): </span>' + msg;
        // msgToDisplay.innerHTML ='<span class="mtimespan">' + date + ' </span>'
        if(u){
            var msgToDisplay='<section class="user clearfixx">'
                                        +'<span>'+user+'</span>'
                                        +'<div>'+msg+'</div>'
                                        // +'<span style="marginRight:5px;">'+date+'</span>'
                                     +'</section>';
        }else{
            var msgToDisplay='<section class="server clearfixx">'
                                         +'<span>'+user+'</span>'
                                         +'<div>'+msg+'</div>'
                                      +'</section>';
                }
        $('#historyMsg').append(msgToDisplay);
        $('#historyMsg').scrollTop(99999);
        // container.scrollTop = container.scrollHeight;

    },
    _displayNewLMsg: function(user, msg, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
            msgToDisplay.style.color = color || '#000';
            msgToDisplay.style.textIndent = '30%';
            msgToDisplay.innerHTML =user+'<span class="timespan">(' + date + '): </span>' +msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _displayImage: function(user, imgData, color,u) {
        // var container = document.getElementById('historyMsg'),
        //     msgToDisplay = document.createElement('p'),
        //     date = new Date().toTimeString().substr(0, 8);
        // msgToDisplay.style.color = color || '#000';
        // msgToDisplay.innerHTML ='<span class="mtimespan">(' + date + '): </span> <br/>' +  user + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        // container.appendChild(msgToDisplay);
        // container.scrollTop = container.scrollHeight;
        if(u){
            var msgToDisplay='<section class="user clearfixx">'
                                         +'<span>'+user+'</span>'
                                        +'<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>'
                                        +'</section>';
        }else{
            var msgToDisplay='<section class="server clearfixx">'
                                         +'<span>'+user+'</span>'
                                         +'<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>'
                                        +'</section>';
                }
        $('#historyMsg').append(msgToDisplay);
        $('#historyMsg').scrollTop(99999);
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    }
};