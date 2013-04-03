/**
 * @file
 * @name wangpan dialog
 * @desc 插入网盘文件的对话框
 * @user: xujinquan
 * @date: 13-4-1
 * @time: 下午15:35
 */


(function(){
    var PAGESIZE = 100; // 每次拉取数据的条数
    var SelectedFsId, SelectedPath, WangPanData = {};
    function showFileTree(treeNode, data) {
        var file, treeNodeHtml = '', treeNodeTDom = T(treeNode);
        if (!treeNodeTDom.hasClass('nodeEnd')) {
            for (var i in data.list) {
                file = data.list[i];
                if (file.isdir) {
                    treeNodeHtml += '<li>' +
                        '<div class="treeNode nodeToOpen" data-path="' + file.path + '">' +
                        '<span class="nodeExpand"></span>' +
                        '<span class="nodeFolder"></span>' +
                        '<span class="nodeName">' + file.server_filename + '</span>' +
                        '</div>' +
                        '<ul></ul>' +
                        '</li>';
                }
            }
            if (treeNodeHtml=='') treeNodeTDom.addClass('nodeEnd');
            else if (treeNodeTDom.next('ul').html() == '') treeNodeTDom.next('ul').html(treeNodeHtml);
        }
    }

    function showFileList(data, isInsertAfter) {
        var file, fileListHtml = '';
        for (var i in data.list) {
            file = data.list[i];
            if (!file.isdir) {
                fileListHtml += '<li>' +
                    '<div class="fileItem" data-path="' + file.path + '" data-fs_id="' + file.fs_id + '">' +
                    '<span class="fileIcon ' + editor.getIconName(file.server_filename.substr(file.server_filename.lastIndexOf('.')+1)) + '"></span>' +
                    '<span class="fileName">' + editor.getShortName(file.server_filename, 32) + '</span>' +
                    '<span class="fileSize">' + editor.getFileSize(file.size) + '</span>' +
                    '</div>' +
                    '</li>';
            }
        }
        if(!isInsertAfter) {
            T('#fileList').html('<ul>' + (fileListHtml != '' ? fileListHtml : '<div class="noFile">该文件夹下没有文件</div>') + '</ul>');
        } else {
            T('#fileList ul').append(fileListHtml);
        }
    }

    function expandFileTree(treeNode, isOpen) {
        var treeNodeTDom = T(treeNode),
            isEmpty = T.trim(treeNodeTDom.next('ul').html()) == '';

        if (isOpen) {
            if (isEmpty) {
                getFileList(treeNode, function(data){
                    showFileTree(treeNode, data);
                });
            }
            treeNodeTDom.removeClass('nodeToOpen').addClass('nodeToClose');
            treeNodeTDom.next('ul').show();
        } else {
            treeNodeTDom.removeClass('nodeToClose').addClass('nodeToOpen');
            treeNodeTDom.next('ul').hide();
        }
    }

    function getFileList(treeNode, callback) {
        var requestPath = T(treeNode).attr('data-path');
        if (WangPanData[requestPath]) {
            callback(WangPanData[requestPath]);
        } else {
            pullFileList(requestPath, 0, callback);
        }
    }

    function getFileInfo(fs_id) {
        if (SelectedPath && WangPanData[SelectedPath]) {
            var list = WangPanData[SelectedPath].list;
            for (var i in list) {
                if(fs_id == list[i].fs_id) {
                    return list[i]; break;
                }
            }
        }
        return null;
    }

    function pullFileList(path, page, callback) {
        var start = PAGESIZE*page, end = PAGESIZE*(page+1);
        T.ajax({
            url: 'https://pcs.baidu.com/rest/2.0/pcs/file',
            dataType: 'jsonp',
            data: {
                'method': 'list',
                'app_id': 598913,
                'response-status': 200,
                'dir': path,
                'by': 'time',
                'order': 'asc',
                'limit': start + '-' + end,
                'BDUSS': 'BiWGZ3UGZ-Tnc0WC0zZ3BzZUVob0YyVk9oZU14SWRwc1NQUHFlMTY2ZHhUNE5SQVFBQUFBJCQAAAAAAAAAAAEAAABvw0MYc25zYXBpNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHCW1FxwltRfj'
            },
            success: function (data) {
                if (page==0) {
                    WangPanData[path] = data;
                } else {
                    for (var i in data.list) {
                        WangPanData[path].list.push(data.list[i]);
                    }
                }
                WangPanData[path].isEnd = (data.list.length<PAGESIZE ? true:false);
                callback(data);
            }
        });
    }

    T('#treeRoot').delegate('.treeNode>*', 'click', function (e) {
        var treeNode = e.target.parentNode,
            treeNodeTDom = T(treeNode),
            isExpand = T(e.target).hasClass('nodeExpand'),
            isToOpen = T(treeNode).hasClass('nodeToOpen'),
            isEnd = treeNodeTDom.hasClass('nodeEnd');

        if (isExpand) {
            //展开收缩文件数目录
            if (isEnd) {
                return false;
            } else {
                expandFileTree(treeNode, isToOpen)
            }
        } else {
            //直接获取文件列表
            getFileList(treeNode, function(data){
                showFileTree(treeNode, data);
                showFileList(data);
                //expandFileTree(treeNode, true);
                expandFileTree(treeNode, isToOpen);
                SelectedPath = treeNodeTDom.attr('data-path');
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
        file = getFileInfo(SelectedFsId);
        if (/\.((jpg)|(jpeg)|(gif)|(bmp)|(png)|(jpe)|(cur)|(tif)|(tiff)|(ico))$/.test(file.path.substr(file.path.lastIndexOf('.')))) {
            T('#errorMsg').html('插入图片请使用图片功能！');
        } else {
            T('#errorMsg').html('');
        }
    });

    T('#fileList').on('scroll', function () {
        var me = T(this), page, listdata;
        if (this.scrollHeight - me.height() - me.scrollTop() <= 50 ) {
            listdata = WangPanData[SelectedPath];
            if (listdata && !listdata.isEnd) {
                page = Math.ceil(listdata.list.length/PAGESIZE);
                pullFileList(SelectedPath, page, function(data){
                    showFileList(data, true);
                });
            }
        }
    });

    dialog.onok = function () {
        var file = getFileInfo(SelectedFsId);
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
    };
})();