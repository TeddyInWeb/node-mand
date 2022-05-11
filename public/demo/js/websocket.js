
/**
 *  websocket模块
 */

(function(window){

    var socketChat = null, 
        isConnecting = false;
        
    var typeList = {
        'system': 'ws-message-system', //系统消息
        'broadcast': 'ws-message-broadcast', // 广播消息
        'message': 'ws-message-message', // 公开消息
        'private': 'ws-message-private' // 私信
    };

    function setEvents(type){
        // 回车快捷发送
        document.getElementById('ws-input').onkeydown = type == 'clear' ? undefined : function(e){
            keyBoardSend(e);
        };
    }

    function startWebsocket(){
        if(typeof WebSocket === 'function'){
            var username = document.getElementById('ws-chat-username-input').value;
            if(username != '' && !isConnecting){

                isConnecting = true;
                socketChat = io('http://localhost:8088/', {
                    path: '/chatroom',
                    query: {
                        user: username
                    }
                });

                socketChat.on('connect', onConnect); // 连接处理
                socketChat.on('disconnect', onDisconnect); // 断开处理
                socketChat.on('broadcast', onBroadcast); // 系统广播消息
                socketChat.on('message', onMessage) // 用户公开消息
                socketChat.on('private message', onPrivateMessage) // 私信

            }else{
                alert('请填写用户名');
            }
        }else{
            alert('当前浏览器不支持Websocket协议');
        }
    }
    
    function closeWebsocket(){
        socketChat.close();
        logoutDone();
    }

    function sendMsg(){
        var input = document.getElementById('ws-input');
        var msg = input.value;
        if(socketChat && msg){
            var targetUserMatch = isPrivateMsg(msg);
            if(targetUserMatch && targetUserMatch[1]){
                var targetUser = targetUserMatch[1];
                msg = msg.split(/[ ]+/)[1];
                socketChat.emit('private message', targetUser, msg);
                appendToScreen('private', '发送给 ' + targetUser + ' 的私信', msg);
            }else{
                socketChat.send(msg);
            }
            input.value = '';
        }
    }

    function isPrivateMsg(msg){
        return msg && msg.match(/^@([\u4E00-\uFA29]+|[\uE7C7-\uE7F3]+|\w+)\s+/);
    }

    function onConnect(){
        loginDone();
    }

    function onDisconnect(data){
        data.msg && appendToScreen('system', '系统消息', data.msg);
        socketChat.close();
    }

    function onBroadcast(data){
        data.msg && appendToScreen('broadcast', '广播消息', data.msg)
    }

    function onMessage(data){   
        var user = data.user || '未知';
        var input = document.getElementById('ws-input');
        data.msg && appendToScreen('message', user, data.msg, function(sender){
            input.value = '@' + sender + ' ' + input.value;
        })
    }

    function onPrivateMessage(data){
        var from = data.from || '未知';
        var input = document.getElementById('ws-input');
        data.msg && appendToScreen('private', '来自 '+from+' 的私信', data.msg, function(sender){
            input.value = '@' + sender + ' ' + input.value;
        })
    }

    function loginDone(){
        appendToScreen('system', '系统消息', '已连接至聊天室');
        setEvents();
        var usernameInput = document.getElementById('ws-chat-username-input');
        var username = usernameInput.value;
        usernameInput.style.display = 'none';
        usernameInput.value = '';
        document.getElementById('ws-login').style.display = 'none';
        document.getElementById('ws-chat-username').innerText = username;
        document.getElementById('ws-chat-username').style.display = 'inline';
        isConnecting = false;
    }

    function logoutDone(){
        socketChat = null;
        setEvents('clear');
        appendToScreen('system', '系统消息', '你已断开连接');
        document.getElementById('ws-login').style.display = 'inline';
        document.getElementById('ws-chat-username-input').style.display = 'inline';
        document.getElementById('ws-chat-username').style.display = 'none';
    }

    function appendToScreen(msgType, sender, msg, callback){
        var el = document.createElement('p');
        el.innerHTML = sender + ': ' + msg;
        el.setAttribute('class', typeList[msgType] || '');
        if(typeof callback === 'function'){
            el.addEventListener('click', function(){
                callback(sender);
            });
            el.style.cursor = 'pointer';
        }
        document.getElementById('ws-chat-screen').appendChild(el);
        scrollToBottom();
    }

    function scrollToBottom(){
        var screen = document.getElementById('ws-chat-screen');
        screen.scrollTop = screen.scrollHeight;
    }

    function keyBoardSend(e){
        if (e.keyCode == 13) {
            sendMsg();
        }
    }

    window.websocketServer = {};
    window.websocketServer.startWebsocket = startWebsocket;
    window.websocketServer.closeWebsocket = closeWebsocket;
    window.websocketServer.sendMsg = sendMsg;
    window.websocketServer.keyBoardSend = keyBoardSend;

}(window))