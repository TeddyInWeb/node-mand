
/**
 * 图片上传模块
 */

(function(window){
    var isUploading = false;
    var uploadQuene = [];

    function selectFiles() {
        document.getElementById('upload-input').click();
    }

    // 处理input选择的图片
    function handleFileSelect(o) {

        if (isUploading) {
            return;
        }

        isUploading = true;
        uploadQuene = [];

        var files = o.files;
        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                uploadQuene.push(files[i]);
            }
            clearTip();
            uploadFiles();
        } else {
            writeTip('您没有选择文件哦, 请选择要上传的文件');
        }
    }

    function uploadFiles() {

        var xhr = new XMLHttpRequest();
        var formData = new FormData();

        for (var i in uploadQuene) {
            formData.append('files', uploadQuene[i]);
        }

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    uploadSuccess(xhr.responseText);
                } else {
                    uploadError(xhr.responseText);
                }
                isUploading = false;
            }
        }

        xhr.open('POST', '/demo/upload', true);
        xhr.send(formData);
    }

    function uploadSuccess(res) {
        var result = JSON.parse(res);
        if(result.code == 0){
            var data = result.data;
            var successList = data.success_list;
            var html = '';

            for(var i in successList){
                html += '<li class="file-preview-box">\
                    <img src="' + successList[i] + '">\
                </li>';
            }

            var previewList = document.getElementById('file-preview-list');
            previewList.innerHTML = html;
        }else{
            writeTip(result.msg);
        }
    }

    function uploadError(res) {
        writeTip('未知错误, 请重试');
    }

    function writeTip(tip){
        document.getElementById('file-tip').innerText = tip || '';
    }

    function clearTip(){
        document.getElementById('file-tip').innerText = '';
    }

    window.uploader = {};
    window.uploader.selectFiles = selectFiles;
    window.uploader.handleFileSelect = handleFileSelect;

}(window));