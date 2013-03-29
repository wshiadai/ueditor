
var InsertFile, SelectedFsId, WangPanData = {}, FileListData = {};
function getFileSize(filesize) {
    var units = ["B", "K", "M", "G", "T"];
    var p = Math.min(Math.max(Math.floor(Math.log(filesize) / Math.LN2 / 10), 1), 5);
    return Math.round(filesize * 100 / Math.pow(2, p * 10)) / 100 + units[p]
}
function setFileList(clickTarget, data, isFromServer) {
    var file, treeNodeHtml = '', fileListHtml = '';
    for (var i in data.list) {
        file = data.list[i];
        if (file.isdir) {
            treeNodeHtml += '<li>' +
                '<div class="treeNode" data-path="' + file.path + '">+' + file.server_filename + '</div>' +
                '<ul></ul>' +
                '</li>';
        } else {
            fileListHtml += '<li>' +
                '<div class="fileItem" data-path="' + file.path + '" data-fs_id="' + file.fs_id + '">' + file.server_filename + ' (' + getFileSize(file.size) + ')</div>' +
                '</li>';
            if (isFromServer) {
                FileListData[file.fs_id] = file;
            }
        }
    }
    T.dom(clickTarget).next('ul').html(treeNodeHtml);
    T.dom('#fileList').html('<ul>' + (fileListHtml != '' ? fileListHtml : '文件夹下没有文件') + '</ul>');
}
T.dom('#treeRoot_WangPan').delegate('.treeNode', 'click', function (e) {
    var me = e.target, requestPath = T(me).attr('data-path');
    T('.treeNode').removeClass('treeNode_selected');
    T(e.target).addClass('treeNode_selected');
    if (WangPanData[requestPath]) {
        setFileList(me, WangPanData[requestPath]);
    } else {
        T.ajax({
            url: 'https://pcs.baidu.com/rest/2.0/pcs/file',
            dataType: 'jsonp',
            data: {
                'method': 'list',
                'app_id': 598913,
                'response-status': 200,
                'dir': requestPath,
                'by': 'time',
                'order': 'asc',
                'limit': '0-100'
            },
            success: function (data) {
                WangPanData[requestPath] = data;
                setFileList(me, data, true);
            }
        });
    }
});
T.dom('#fileList').delegate('.fileItem', 'click', function (e) {
    SelectedFsId = T(e.target).attr('data-fs_id');
    T('.fileItem').removeClass('fileItem_selected');
    T(e.target).addClass('fileItem_selected');
});
dialog.onok = function(){
    editor.setUploadFile({data:[FileListData[SelectedFsId]],error:false});
};
dialog.oncancel = function(){
    InsertFile = SelectedFsId = WangPanData = FileListData = null;
};