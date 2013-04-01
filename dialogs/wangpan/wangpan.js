
var InsertFile, SelectedFsId, WangPanData = {}, FileListData = {};

(function(){
    function showFileList(treeNode, data, isFromServer) {
        var file, treeNodeHtml = '', fileListHtml = '', treeNodeTDom = T(treeNode);
        for (var i in data.list) {
            file = data.list[i];
            if (file.isdir) {
                treeNodeHtml += '<li>' +
                    '<div class="treeNode nodeToOpen" data-path="' + file.path + '">' +
                    '<span class="nodeExpand"></span>' +
                    '<span class="nodeFolder"></span></div>' +
                    '<span class="nodeName">' + file.server_filename + '</span>' +
                    '<ul></ul>' +
                    '</li>';
            } else {
                fileListHtml += '<li>' +
                    '<div class="fileItem" data-path="' + file.path + '" data-fs_id="' + file.fs_id + '">' +
                    '<span class="fileIcon ' + editor.getIconName(file.server_filename.substr(file.server_filename.lastIndexOf('.')+1)) + '"></span>' +
                    '<span class="fileName">' + editor.getShortName(file.server_filename, 32) + '</span>' +
                    '<span class="fileSize">' + editor.getFileSize(file.size) + '</span>' +
                    '</li>';
                if (isFromServer) {
                    FileListData[file.fs_id] = file;
                }
            }
        }
        if (treeNodeTDom.next('ul').html() == '') treeNodeTDom.next('ul').html(treeNodeHtml);
        T('#fileList').html('<ul>' + (fileListHtml != '' ? fileListHtml : '<div class="noFile">该文件夹下没有文件</div>') + '</ul>');
    }

    function getFileList(treeNode, callback) {
        var requestPath = T(treeNode).attr('data-path');
        if (WangPanData[requestPath]) {
            callback(WangPanData[requestPath], false);
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
                    callback(data, true);
                }
            });
        }
    }

    T('#treeRoot').delegate('.treeNode>*', 'click', function (e) {
        var treeNode = e.target.parentNode,
            treeNodeTDom = T(treeNode),
            isExpand = T(e.target).hasClass('nodeExpand'),
            isToOpen = T(treeNode).hasClass('nodeToOpen'),
            isEmpty = T.trim(treeNodeTDom.next('ul').html()) == '',
            isEnd = treeNodeTDom.hasClass('nodeEnd');

        if (isExpand) {
            //展开收缩文件数目录
            if (isEnd) {
                return false;
            } else if (isToOpen) {
                if (isEmpty) {
                    getFileList(treeNode, function(data){
                        showFileList(treeNode, data, true);
                    });
                }
                treeNodeTDom.removeClass('nodeToOpen').addClass('nodeToClose');
                treeNodeTDom.next('ul').show();
            } else {
                treeNodeTDom.removeClass('nodeToClose').addClass('nodeToOpen');
                treeNodeTDom.next('ul').hide();
            }
        } else {
            //直接获取文件列表
            getFileList(treeNode, function(data, isFromServer){
                showFileList(treeNode, data, true);
            });
        }
    });

    T('#fileList').delegate('.fileItem,.fileItem>*', 'click', function (e) {
        var me, file;
        if (T(e.target).hasClass('fileItem')) {
            me = e.target;
        } else {
            me = e.target.parentNode;
        }
        SelectedFsId = T(me).attr('data-fs_id');
        T('.fileItem').removeClass('fileItem_selected');
        T(me).addClass('fileItem_selected');
        file = FileListData[SelectedFsId];
        if (/\.((jpg)|(jpeg)|(gif)|(bmp)|(png)|(jpe)|(cur)|(tif)|(tiff)|(ico))$/.test(file.path.substr(file.path.lastIndexOf('.')))) {
            T('#errorMsg').html('插入图片请使用图片功能！');
        } else {
            T('#errorMsg').html('');
        }
    });

    dialog.onok = function () {
        var file = FileListData[SelectedFsId];
        if (!file) {
            T('#errorMsg').html('未选择文件！');
            return false;
        } else if (/\.((jpg)|(jpeg)|(gif)|(bmp)|(png)|(jpe)|(cur)|(tif)|(tiff)|(ico))$/.test(file.path.substr(file.path.lastIndexOf('.')))) {
            T('#errorMsg').html('插入图片请使用图片功能！');
            return false;
        } else {
            editor.setUploadFile({data: [file], error: false}, true);
            return true;
        }
    };
    dialog.oncancel = function () {
        InsertFile = SelectedFsId = WangPanData = FileListData = null;
    };
})();