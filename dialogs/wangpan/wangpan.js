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

    function getIconName(type) {
        var fileTypes = {
            'icon_file_image':'jpg,jpeg,gif,bmp,png,jpe,cur,svg,svgz,tif,tiff,ico',
            'icon_file_visio':'vsd,vsdx',
            'icon_file_pdf':'pdf',
            'icon_file_word':'doc,docx,ods,ots,odt,rtf,dot,dotx,odm',
            'icon_file_excel':'xls,xlsx,xlt,xltx,csv',
            'icon_file_text':'txt,html,htm,xhtml,xml,js,css',
            'icon_file_music':'wma,wav,mp3,aac,ra,ram,mp2,ogg,aif,mpega,amr,mid,midi',
            'icon_file_video':'wmv,rmvb,mpeg4,mpeg2,flv,avi,3gp,mpga,qt,rm,wmz,wmd,wvx,wmx,wm,swf,mpg,mp4,mkv,mpeg,mov',
            'icon_file_powerpoint':'ppt,pptx,pps,pot,ppsx,potx',
            'icon_file_ipa':'ipa',
            'icon_file_exe':'exe,msi',
            'icon_file_zip':'zip,rar,7z,tar,gz',
            'icon_file_apk':'apk',
            'icon_file_default':'default',
            'icon_file_torrent':'torrent'
        }, iconNames = {};
        for (i in fileTypes) {
            var suffix = fileTypes[i].split(',');
            for (j in suffix) {
                iconNames.hasOwnProperty(suffix[j]);
                if (iconNames[suffix[j]] == undefined) {
                    iconNames[suffix[j]] = i;
                }
            }
        }
        return iconNames[type.toLowerCase()] ? iconNames[type.toLowerCase()] : iconNames['default'];
    }
    function getShortName(filename, limit) {
        if (!limit) limit = 27;
        for (var i = 0, len = 0; i < filename.length; i++) {
            if (filename.charAt(i).match(/[^\x00-\xff]/g) != null) {
                len += 2;
            } else {
                len++;
            }
            if (len > limit) {
                break;
            }
        }
        return filename.substr(0, i) + (i >= filename.length ? '' : '...');
    }
    function getFileSize(filesize) {
        var units = ['B', 'K', 'M', 'G', 'T'];
        var p = Math.min(Math.max(Math.floor(Math.log(filesize) / Math.LN2 / 10), 1), 5);
        return Math.round(filesize * 100 / Math.pow(2, p * 10)) / 100 + units[p];
    }
    function showFileTree(treeNode, data) {
        var file, treeNodeHtml = '', treeNodeTDom = T(treeNode);
        if (data && !treeNodeTDom.hasClass('nodeEnd')) {
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
        if (data) {
            for (var i in data.list) {
                file = data.list[i];
                if (!file.isdir) {
                    fileListHtml += '<li>' +
                        '<div class="fileItem" data-path="' + file.path + '" data-fs_id="' + file.fs_id + '">' +
                        '<span class="fileIcon ' + getIconName(file.server_filename.substr(file.server_filename.lastIndexOf('.')+1)) + '"></span>' +
                        '<span class="fileName">' + getShortName(file.server_filename, 32) + '</span>' +
                        '<span class="fileSize">' + getFileSize(file.size) + '</span>' +
                        '</div>' +
                        '</li>';
                }
            }
            if(!isInsertAfter) {
                T('#fileList').html('<ul>' + (fileListHtml != '' ? fileListHtml : '<div class="noFile">该文件夹下没有文件</div>') + '</ul>');
            } else {
                T('#fileList ul').append(fileListHtml);
            }
        } else {
            var errMsg;
            if(T.cookie.get("BDUSS")) errMsg = "文件列表获取失败";
            else errMsg = "用户未登录";
            T('#fileList').html('<ul><div class="noFile">'+errMsg+'</div></ul>');
        }
    }

    function expandFileTree(treeNode, isOpen) {
        var treeNodeTDom = T(treeNode),
            isEmpty = T.trim(treeNodeTDom.next('ul').html()) == '';

        if (isOpen) {
            if (isEmpty) {
                getFileList(treeNode, function(data){
                    treeNodeTDom.removeClass('nodeLoading');
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
            T(treeNode).addClass('nodeLoading');
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
        try{
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
                    if (data.list) {
                        if (page==0) {
                            WangPanData[path] = data;
                        } else {
                            for (var i in data.list) {
                                WangPanData[path].list.push(data.list[i]);
                            }
                        }
                        WangPanData[path].isEnd = (data.list.length<PAGESIZE ? true:false);
                        callback(data);
                    } else {
                        callback(null);
                    }
                }
            });
        }catch(ex){
            callback(null);
        }
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
                treeNodeTDom.removeClass('nodeLoading');
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
            if (listdata && !listdata.isEnd && listdata.list) {
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
            editor.setUploadFile({error: false, fileInfo: file}, true);
            return true;
        }
    };
    dialog.oncancel = function () {
    };
})();