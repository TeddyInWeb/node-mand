
/**
 * 数据api请求模块
 */

(function(window){
    
    function sendGet(){
        var name = document.getElementById('get-name').value || '';
        sendRequest('GET', '/demo/data?name='+name);
    }

    function sendPost(){
        var tip = document.getElementById('post-tip');
        var name = document.getElementById('post-name').value || '';
        var password = document.getElementById('post-password').value || '';
        if(!name || !password){
            tip.innerText = '请先填写name和password';
        }else{
            tip.innerText = '';
            sendRequest('POST', '/demo/data', {
                name: name,
                password: password
            });
        }
    }

    function sendPut(){
        var tip = document.getElementById('put-tip');
        var name = document.getElementById('put-name').value || '';
        var password = document.getElementById('put-password').value || '';
        if(!name || !password){
            tip.innerText = '请先填写name和password';
        }else{
            tip.innerText = '';
            sendRequest('PUT', '/demo/data', {
                name: name,
                password: password
            });
        }
    }

    function sendDelete(){
        var tip = document.getElementById('delete-tip');
        var name = document.getElementById('delete-name').value;
        if(!name){
            tip.innerText = '请先填写要删除的name';
        }else{
            tip.innerText = '';
            sendRequest('DELETE', '/demo/data', {
                name: name
            });
        }
    }

    function sendRequest(type, url, data){

        if(!type || !url){
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText);
                }
            }
        }

        xhr.open(type, url, true);
        if(type == 'PUT' || type == 'POST'){
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        xhr.send(formatParams(data));
    }

    function success(res){
        console.log('success', res);
        document.getElementById('rest-api-result').innerText = res;
    }

    function error(res){
        console.log('err', res);
    }

    //格式化参数
    function formatParams(data){
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }

    window.restful = {};
    window.restful.sendGet = sendGet;
    window.restful.sendPost = sendPost;
    window.restful.sendPut = sendPut;
    window.restful.sendDelete = sendDelete;
    
}(window));