/* Copy From fileprogress.js
 * Constructor
 * file is a SWFUpload file object
 * targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
 * Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
 */
function FileProgress(file, swfupload) {
    this.swfupload = swfupload;
    this.getIconName = function (type) {
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
    };
    this.getShortName = function (filename, limit) {
        if (!limit) limit = 30;
        for (var i = 0, len = 0; i < filename.length; i++) {
            if (filename[i].match(/[^\x00-\xff]/g) != null) {
                len += 2;
            } else {
                len++;
            }
            if (len > limit) {
                break;
            }
        }
        return filename.substr(0, i) + (i >= filename.length ? '' : '...');
    };
    this.getFileSize = function (filesize) {
        var units = ['B', 'K', 'M', 'G', 'T'];
        var p = Math.min(Math.max(Math.floor(Math.log(filesize) / Math.LN2 / 10), 1), 5);
        return Math.round(filesize * 100 / Math.pow(2, p * 10)) / 100 + units[p];
    };

    this.fileProgressWrapper = document.getElementById(swfupload.customSettings.progressTarget).firstChild;
    this.fileIcon = T('.fileIcon', this.fileProgressWrapper)[0];
    this.progressName = T('.progressName', this.fileProgressWrapper)[0];
    this.progressSize = T('.progressSize', this.fileProgressWrapper)[0];
    this.progressRename = T('.progressRename', this.fileProgressWrapper)[0];
    this.progressRenameValue = T('.progressRenameValue', this.fileProgressWrapper)[0];
    this.progressMessage = T('.progressMessage', this.fileProgressWrapper)[0];
    this.progressBarWrapper = T('.progressBarWrapper', this.fileProgressWrapper)[0];
    this.progressBar = T('.progressBar', this.fileProgressWrapper)[0];
    this.progressBarText = T('.progressBarText', this.fileProgressWrapper)[0];
    this.progressCancel = T('.progressCancel', this.fileProgressWrapper)[0];
    this.fileOperator = T('.progressFileOperator', this.fileProgressWrapper)[0];
    this.fileOperatorRename = T('a.rename', this.fileOperator)[0];
    this.fileOperatorDelete = T('a.remove', this.fileOperator)[0];
    this.setFileInfo(file.name, file.size);
}

FileProgress.prototype.setFileInfo = function (filename, filesize, hideNewName) {
    var tmpArr;
    if (!hideNewName) {
        this.progressName.innerHTML = this.getShortName(filename, 30);
        this.progressName.setAttribute('title', filename);
    }
    if (this.swfupload.customSettings.currentFile) {
        this.swfupload.customSettings.currentFile.name = filename;
    }
    if (filesize != null) {
        this.progressSize.innerHTML = '(' + this.getFileSize(filesize) + ')';
    }
    tmpArr = filename.match(/\.([^\.]+)$/);
    if (tmpArr != null) {
        this.fileIcon.className = "fileIcon " + this.getIconName(tmpArr[1]);
    } else {
        this.fileIcon.className = "fileIcon " + this.getIconName('');
    }
};

FileProgress.prototype.setStatus = function (status, message, errorCode, percentage) {
    //displayCode:icon,name,size,rename,message,bar,cancel,torename,remove
    var displayCode = '', displayArr, swfupload = this.swfupload;

    this.progressMessage.innerHTML = message || '';
    switch (status) {
        case 'ready':
            swfupload.customSettings.setBindUploadStatus('ready');
            displayCode = '1,1,1,0,0,0,0,1,1';
            swfupload.setButtonDisabled(false);
            break;
        case 'uploading':
            if (percentage != undefined) {
                this.progressMessage.innerHTML = percentage;
                this.progressBar.style.width = percentage + "%";
                this.progressBarText.innerHTML = (percentage >= 100 ? 99 : percentage) + "%";
            }
            this.progressBar.className = "progressBar";
            this.fileProgressWrapper.className = "progressWrapper";
            swfupload.customSettings.setBindUploadStatus('uploading');
            displayCode = '1,1,1,0,0,1,1,0,0';
            swfupload.setButtonDisabled(true);
            break;
        case 'finish':
            this.progressBar.style.width = "99%";
            this.progressBarText.innerHTML = "99%";
            swfupload.customSettings.setBindUploadStatus('finish');
            displayCode = '1,1,1,0,0,1,1,0,0';
            swfupload.setButtonDisabled(true);
            break;
        case 'complete':
            this.progressBar.style.width = "";
            this.progressBarText.innerHTML = "100%";
            this.progressBar.className = "progressBar progressBarComplete";
            swfupload.customSettings.setBindUploadStatus('complete');
            displayCode = '1,1,1,0,0,1,0,1,1';
            swfupload.setButtonDisabled(false);
            break;
        case 'error':
            this.progressBar.style.width = "";
            this.fileProgressWrapper.className = "progressWrapper progressWrapperError";
            if (errorCode != undefined) {
                swfupload.customSettings.setBindUploadStatus('error', errorCode);
            } else {
                swfupload.customSettings.setBindUploadStatus('error', -1);
            }
            displayCode = '1,1,1,0,1,0,0,0,1';
            swfupload.setButtonDisabled(false);
            break;
        case 'setfilesuccess':
            this.progressBar.style.width = "";
            this.progressBarText.innerHTML = "100%";
            this.progressBar.className = "progressBar";
            swfupload.customSettings.setBindUploadStatus('complete');
            displayCode = '1,1,1,0,0,1,0,1,1';
            break;
        case 'setfileerror':
            this.fileProgressWrapper.className = "progressWrapper progressWrapperError";
            this.progressMessage.innerHTML = this.getShortName(message, 50);
            swfupload.customSettings.setBindUploadStatus('error', -1);
            displayCode = '0,0,0,0,1,0,0,0,1';
            break;
        case 'renamestart':
            displayCode = '1,0,0,1,0,0,0,0,0';
            break;
        case 'renamecomplete':
            swfupload.customSettings.setBindUploadStatus('complete');
            displayCode = '1,1,1,0,0,1,0,1,1';
            break;
        case 'renameerror':
            this.fileProgressWrapper.className = "progressWrapper progressWrapperError";
            swfupload.customSettings.setBindUploadStatus('error', -1);
            displayCode = '1,0,0,1,1,0,0,0,0';
            break;
        default:
            displayCode = '1,1,1,0,0,0,0,0,0';
            break;
    }
    displayArr = displayCode.split(',');
    if (swfupload.customSettings.isEditorFile) displayArr[5] = 0;
    this.fileIcon.style.display = displayArr[0] == '1' ? 'block' : 'none';
    this.progressName.style.display = displayArr[1] == '1' ? 'block' : 'none';
    this.progressSize.style.display = displayArr[2] == '1' ? 'block' : 'none';
    this.progressRename.style.display = displayArr[3] == '1' ? 'block' : 'none';
    this.progressMessage.style.display = displayArr[4] == '1' ? 'block' : 'none';
    this.progressBarWrapper.style.display = displayArr[5] == '1' ? 'block' : 'none';
    this.progressCancel.style.display = displayArr[6] == '1' ? 'block' : 'none';
    this.fileOperatorRename.style.display = displayArr[7] == '1' ? 'inline' : 'none';
    this.fileOperatorDelete.style.display = displayArr[8] == '1' ? 'inline' : 'none';
    this.fileProgressWrapper.style.display = 'block';
};


/* callbacks.js
 * swfupload的回调函数
 * */
/*swfupload加载之前*/
window.swfUploadPreLoad = function () {
};

window.swfUploadLoaded = function () {
    try {
        SWFUpload.SERVER_ERROR = {
            '31042':'您尚未登录',
            '31061':'已存在同名文件',
            '31062':'文件名称非法',
            '31073':'重命名失败',
            '31218':'容量超出限额'
        };

        var swfupload = this;
        if (!swfupload.customSettings.isLogin) {
            swfupload.setButtonDisabled(true);
        }
        swfupload.customSettings.cancelHandler = function (e) {
            var progress = swfupload.progress;
            e.preventDefault();
            swfupload.cancelUpload(swfupload.customSettings.currentFile.id);
            swfupload.customSettings.successCount = 0;
            swfupload.customSettings.isUploading = false;
            progress.setStatus('ready');
            T(progress.fileProgressWrapper).hide();
        };
        swfupload.customSettings.deleteHandler = function (e) {
            var progress = swfupload.progress,
                fileinfo = swfupload.customSettings.getBindUploadFile();
            e.preventDefault();
            swfupload.customSettings.successCount = 0;
            swfupload.customSettings.setBindUploadFile(null);
            progress.setStatus('ready');
            T(progress.fileProgressWrapper).hide();
            if (swfupload.customSettings.isEditorFile) { //编辑回答的时候，假删除原来的文件
                swfupload.customSettings.setBindBackupFile('delete', true);
            } else {
                if (fileinfo) {
                    T.ajax({
                        url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=delete&app_id=598913&response-status=200&op=permanent&fs_id=' + fileinfo.fs_id),
                        dataType:'jsonp',
                        success:function (response) {
                        }
                    });
                }
            }

            swfupload.customSettings.setEditorStatusBar('');
        };
        swfupload.customSettings.inputHandler = function (e) {
            if (e.keyCode == 13) {
                swfupload.customSettings.doRenameHandler();
            }
        };
        swfupload.customSettings.renameHandler = function (e) {
            var progress = swfupload.progress;
            e.preventDefault();
            progress.setStatus('renamestart');
            progress.progressRenameValue.value = progress.progressName.title;
            (function setSelectionRange(t,S,E){
                if (t.createTextRange) {
                    var range = t.createTextRange();
                    range.collapse(true);
                    range.moveStart("character", S);
                    range.moveEnd("character", E);
                    range.select();
                } else {
                    if (t.setSelectionRange) {
                        t.setSelectionRange(S, E);
                    } else {
                        if (t.selectionStart) {
                            t.selectionStart = S;
                            t.selectionEnd = E;
                        }
                    }
                }
            })(progress.progressRenameValue,0,progress.progressRenameValue.value.lastIndexOf('.'));
            progress.progressRenameValue.focus();
        };
        swfupload.customSettings.doRenameHandler = function () {
            var progress = swfupload.progress,
                newname = T.trim(progress.progressRenameValue.value);
            if (/\.((jpg)|(jpeg)|(gif)|(bmp)|(png)|(jpe)|(cur)|(tif)|(tiff)|(ico))$/.test(newname)){
                progress.setStatus('renameerror', '不允许改成图片格式');
            } else if (/[\\\/:\*\?"<>|]/.test(newname)) {
                progress.setStatus('renameerror', '文件名不能包含下列字符 \\ \/ : * ? " < > |');
            } else {
                //发送到重命名到网盘
                var showName = progress.progressName.title,
                    pathfrom = swfupload.customSettings.getBindUploadFile().path,
                    pathto = pathfrom.substr(0, pathfrom.lastIndexOf('/')+1) + newname;

                if (pathfrom != pathto && swfupload.customSettings.isEditorFile) { //编辑回答的时候，假重命名原来的文件
                    swfupload.customSettings.setBindBackupFile('rename', pathto);
                    progress.setFileInfo(newname);
                    progress.setStatus('renamecomplete');
                } else if (newname != "" && newname != showName.substr(showName.lastIndexOf('.')+1) && newname != showName && pathto != pathfrom) {
                    // 新文件名 不为空 && 不等于之前的后缀名 && 有修改过文本框 && 不与实际文件名相同
                    T.ajax({
                        url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=move&app_id=598913&response-status=200&from=' + pathfrom + '&to=' + pathto),
                        dataType:'jsonp',
                        success:function (response) {
                            if (response.error_code) {
                                if (response.error_code == 31218 || response.error_code == 31112) {
                                    progress.setStatus('renameerror', '<span>网盘已满</span><a href="http://yun.baidu.com/disk/award" class="progressExtend" target="_blank">扩容</a>');
                                } else {
                                    progress.setStatus('renameerror', SWFUpload.SERVER_ERROR[response.error_code]);
                                }
                            } else {  //正真修改成功
                                progress.setStatus('renamecomplete');
                                progress.setFileInfo(newname);
                                swfupload.progress.setFileInfo(newname);
                                swfupload.customSettings.setBindUploadFile('path', pathto);
                            }
                        }
                    });
                } else {
                    progress.setStatus('complete');
                }
            }
        };

        var fileProgressWrapper = document.getElementById(swfupload.customSettings.progressTarget).firstChild;
        var progressCancel = T('.progressCancel', fileProgressWrapper)[0];
        var progressRenameValue = T('.progressRenameValue', fileProgressWrapper)[0];
        var progressRenameButton = T('.progressRenameBtn', fileProgressWrapper)[0];
        var fileOperatorRename = T('.progressFileOperator a', fileProgressWrapper)[0];
        var fileOperatorDelete = T('.progressFileOperator a', fileProgressWrapper)[1];
        T.on(progressCancel, 'click', swfupload.customSettings.cancelHandler);
        T.on(fileOperatorRename, 'click', swfupload.customSettings.renameHandler);
        T.on(progressRenameValue, 'keyup', swfupload.customSettings.inputHandler);
        T.on(progressRenameButton, 'click', swfupload.customSettings.doRenameHandler);
        T.on(fileOperatorDelete, 'click', swfupload.customSettings.deleteHandler);

        if (swfupload.customSettings.isEditorFile) {
            if (swfupload.customSettings.getBindUploadFile()) {
                swfupload.customSettings.setBindUploadStatus('complete');
            } else {
                swfupload.customSettings.setBindUploadStatus('error', -1);
            }
        } else {
            swfupload.customSettings.setBindUploadStatus('ready');
        }
    } catch (ex) {}
};

window.swfUploadLoadFailed = function () {
};

/*选择文件对话框结束*/
window.swfUploadFileDialogComplete = function (numFilesSelected, numFilesQueued) {
};

/*上传队列*/
window.swfUploadFileQueued = function (file) {
    try {
        var swfupload = this;

        if(/\.((jpg)|(jpeg)|(gif)|(bmp)|(png)|(jpe)|(cur)|(tif)|(tiff)|(ico))$/.test(file.type)) {
            alert('请使用插入图片功能，可直接在线预览');
        } else if (swfupload.customSettings.successCount > 0 || swfupload.customSettings.isUploading == true) {
            if (confirm("即将删除上一个附件,确定吗？")) {
                var fileinfo = swfupload.customSettings.getBindUploadFile();
                swfupload.progress = new FileProgress(file, swfupload);
                swfupload.customSettings.setBindUploadFile(null);
                swfupload.customSettings.successCount = 0;
                if (swfupload.customSettings.isEditorFile) { //编辑回答的时候，假删除原来的文件
                    swfupload.customSettings.setBindBackupFile('delete', true);
                } else {
                    if (fileinfo) {
                        T.ajax({
                            url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=delete&app_id=598913&response-status=200&op=permanent&fs_id=' + fileinfo.fs_id),
                            dataType:'jsonp',
                            success:function (response) {
                            }
                        });
                    }
                }
                swfupload.cancelUpload(swfupload.customSettings.currentFile.id, false);
                swfupload.startUpload();
            } else {
                swfupload.cancelUpload(file.id, false);
            }
        } else {
            swfupload.progress = new FileProgress(file, swfupload);
            swfupload.startUpload();
        }
    } catch (ex) {
    }
}
window.swfUploadQueueComplete = function (numFilesUploaded) {
};
window.swfUploadFileQueueError = function (file, errorCode, message) {
    try {
        var swfupload = this, progress;

        if (swfupload.progress) {
            progress = swfupload.progress;
        } else {
            progress = swfupload.progress = new FileProgress(file, swfupload);
        }

        swfupload.customSettings.setBindUploadStatus('error', -1);
        swfupload.customSettings.isUploading = false;

        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                progress.setStatus('error', "文件超过2G或为空");
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                progress.setStatus('error', "上传文件类型不允许");
                break;
            default:
                if (file !== null) {
                    progress.setStatus('error', "上传失败请重试或");
                }
                break;
        }
    } catch (ex) {}
};

/*发送文件过程*/
window.swfUploadSendStart = function (file) {
    try {
        var swfupload = this, bduss = T.cookie.get('BDUSS'),
            progress = swfupload.progress;

        swfupload.customSettings.isUploading = false;
        swfupload.customSettings.isEditorFile = false;
        swfupload.customSettings.currentFile = file;
        if (!bduss) {
            progress.setStatus('error', '您尚未登录');
            swfupload.cancelUpload(file.id, false);
        } else {
            progress.setStatus('uploading', '', null, 0);
            swfupload.setUploadURL(encodeURI(swfupload.customSettings.swfUploadUrl + '&path=' +swfupload.customSettings.swfUploadDir + file.name + '&BDUSS=' + bduss));
        }
    } catch (ex) {}

    return true;
};

window.swfUploadSendProgress = function (file, bytesLoaded, bytesTotal) {
    try {
        var swfupload = this, progress = swfupload.progress,
            percentage = Math.ceil((bytesLoaded / bytesTotal) * 100);
        swfupload.customSettings.isUploading = true;
        if (percentage != 100) {
            progress.setStatus('uploading', '', null, percentage);
        } else {
            progress.setStatus('finish');
        }
    } catch (ex) {}
};

window.swfUploadSendSuccess = function (file, serverData) {
    try {
        var swfupload = this, progress = swfupload.progress,
            error_message, fileinfo = eval('(' + serverData + ')');

        swfupload.customSettings.isUploading = false;
        if (fileinfo.error_code == 31218 || fileinfo.error_code == 31112) {
            progress.setStatus('error', '<span>网盘已满</span><a href="http://yun.baidu.com/disk/award" class="progressExtend" target="_blank">扩容</a>', fileinfo.error_code);
        } else if (fileinfo.error_code) {
            error_message = SWFUpload.SERVER_ERROR[fileinfo.error_code];
            if (!error_message) {
                error_message = '上传失败';
            }
            progress.setStatus('error', error_message + ',请重试或者 ', fileinfo.error_code);
        } else {  //正真上传成功
            var serverFileName = fileinfo.path.substr(fileinfo.path.lastIndexOf('/')+1);
            if (serverFileName != swfupload.customSettings.currentFile.name) {
                progress.setFileInfo(serverFileName, null, true);
            }
            progress.setStatus('complete');
            swfupload.customSettings.successCount++;
            swfupload.customSettings.setBindUploadFile(fileinfo);
        }
    } catch (ex) {
        var swfupload = this, progress = swfupload.progress;
        if (ex.name == 'SyntaxError') {
            progress.setStatus('error', '上传失败请重试或');
        }
    }
};

window.swfUploadSendError = function (file, errorCode, message) {
    try {
        var swfupload = this, progress = swfupload.progress;
        if (errorCode != SWFUpload.UPLOAD_ERROR.FILE_CANCELLED) {
            swfupload.customSettings.setBindUploadStatus('error', -1);
            progress.setStatus('error', '上传失败请重试或');
        }
    } catch (ex) {}
};

window.swfUploadSendComplete = function () {
};

//修改问题，设置之前上传的文件
window.editorSetUploadFile = function (data, editor) {
    var swfupload = editor.swfupload;
    if(swfupload.customSettings.successCount>0 && !confirm('即将删除上一个附件,确定吗？')){
        return;
    } else {
        if (data && !data.error && data.data.length) {
            var fileinfo = data.data[0];
            fileinfo.path = decodeURIComponent(fileinfo.path);
            var filename = fileinfo.path.substr(fileinfo.path.lastIndexOf('/')+1),
                filesize = fileinfo.size,
                tmpArr = fileinfo.path.match(/(\.[^\.]*)$/),
                filetype = tmpArr ? tmpArr[1] : '.',
                createTime = new Date(fileinfo.ctime),
                modifyTime = new Date(fileinfo.ctime);

            editor.uploadFile.fileInfo = fileinfo;
            editor.uploadFile.backFileInfo = fileinfo;
            swfupload.customSettings.isEditorFile = true;
            swfupload.customSettings.successCount = 1;
            swfupload.customSettings.currentFile = {
                id:"SWFUpload_0_EDIT",
                name:filename || '',
                size:filesize || 0,
                type:filetype || '',
                filestatus:-4,
                index:1,
                creationdate:createTime || +new Date(),
                modificationdate:modifyTime || +new Date()
            };
            swfupload.progress = new FileProgress(swfupload.customSettings.currentFile, swfupload);
            swfupload.progress.setStatus('setfilesuccess');
            swfupload.progress.setFileInfo(filename, filesize);
        } else {
            editor.uploadFile.fileInfo = null;
            editor.uploadFile.backFileInfo = null;
            swfupload.customSettings.isEditorFile = true;
            swfupload.customSettings.successCount = 0;
            swfupload.customSettings.currentFile = {
                id:"SWFUpload_0_NULL", name:'', size:0, type:'', filestatus:-4, index:1, creationdate:0, modificationdate:0
            };
            swfupload.progress = new FileProgress(swfupload.customSettings.currentFile, swfupload);
            swfupload.progress.setStatus('setfileerror', '<span style="padding-left:5px;">很抱歉，您上传的附件已失效，请重新上传或</span>');
            swfupload.progress.setFileInfo('', 0);
        }
    }
};

//修改问题，设置之前上传的文件
window.editorSubmitUploadFile = function (method, editor) {
    var fileInfo = editor.uploadFile.fileInfo,
        backFileInfo = editor.uploadFile.backFileInfo;

    switch (method) {
        case 'submit':
            if (backFileInfo && backFileInfo['delete']) {
                T.ajax({
                    url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=delete&app_id=598913&response-status=200&op=permanent&fs_id=' + backFileInfo.fs_id),
                    dataType:'jsonp',
                    success:function (response) {
                    }
                });
            } else if (backFileInfo && backFileInfo.rename && backFileInfo.path != backFileInfo.rename) {
                T.ajax({
                    url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=move&app_id=598913&response-status=200&from=' + backFileInfo.path + '&to=' + backFileInfo.rename),
                    dataType:'jsonp',
                    success:function (response) {
                    }
                });
            }
            break;
        case 'cancel':
            if ((fileInfo && !backFileInfo) || (fileInfo && backFileInfo && fileInfo.fs_id != backFileInfo.fs_id)) {
                //当前文件不是上次的文件，才删除
                T.ajax({
                    url:encodeURI('https://pcs.baidu.com/rest/2.0/pcs/file?method=delete&app_id=598913&response-status=200&op=permanent&fs_id=' + fileInfo.fs_id),
                    dataType:'jsonp',
                    success:function (response) {
                    }
                });
            }
            editor.uploadFile.fileInfo = backFileInfo;
            break;
    }
};

window.SWFUpload = SWFUpload;