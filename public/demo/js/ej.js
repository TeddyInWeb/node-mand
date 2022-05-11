
/**
 *  Excel-json 互转
 */

(function(window){

    let fileData;

    let isUploading = false;

    let typeList = ['xlsx', 'json'];

    function handleFileSelect(o) {

        if (isUploading) {
            return;
        }

        isUploading = true;
        var file = o.files[0];
        if(file){
            tip();
            fileData = file;
        }
    }

    function goSwitch(){
        if(fileData){
            var type = fileData.name.split('.')[1];
            if(type && typeList.includes(type)){
                tip();
                type === 'xlsx' ? uploadFile('/demo/excelTojson') : uploadFile('/demo/jsonToExcel');
            }else{
                tip('文件格式必须是.json或.xlsx, 请查验');
            }
        }else{
            tip('请选择文件');
        }
    }

    function uploadFile(url) {

        if(!fileData){
            return;
        }

        var xhr = new XMLHttpRequest();
        var formData = new FormData();

        formData.append('file', fileData);
        
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    success(xhr.responseText);
                } else {
                    error(xhr.responseText);
                }
                isUploading = false;
            }
        }

        xhr.open('POST', url, true);
        xhr.send(formData);
    }

    function success(result){
        var res = JSON.parse(result);
        var type = res.data.type;
        var data = res.data.data;
        if(type === 'json'){
            download(data, 'result.json', 'text/plain');
        }else if(type === 'excel'){   
            download(data, 'result.xlsx', 'application/vnd.ms-excel');     
        }
        isUploading = false;
    }

    function error(result){
        console.log(result);
        isUploading = false;
    }

    function tip(tip){
        document.getElementById('ej-tip').innerText = tip || '';
    }

    window.ej = {};
    window.ej.handleFileSelect = handleFileSelect;
    window.ej.goSwitch = goSwitch;

}(window))