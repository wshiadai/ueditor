///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase,
        Button = baidu.editor.ui.Button,
        Popup = baidu.editor.ui.Popup,
        Dialog = baidu.editor.ui.Dialog;

    var AttachPicker = baidu.editor.ui.AttachPicker = function (options) {
        this.initOptions(options);
        this.initAttechPicker();
    };
    var editor, uploadfileButton, wangpanButton, wangpanDialog;

    AttachPicker.prototype = {
        initAttechPicker:function () {
            this.initUIBase();
            this.initButtons();
            this.Stateful_init();
        },
        initButtons:function(){
            editor = this.editor;
            editor.ui.uploadfile = uploadfileButton = (function (editor) {
                var cmd = 'uploadfile',
                    title = editor.options.buttonConfig["attachment"]["list"][cmd],
                    timestamp = +new Date(),
                    placeholderId = 'swfuPlaceholder' + timestamp,
                    flashContainerId = 'swfuFlash' + timestamp,
                    uploadProgressId = 'swfuProgress' + timestamp,
                    wealthSelecterId = 'swfuWealth' + timestamp;

                var ui = new Button({
                    className:'edui-for-' + cmd,
                    label:title,
                    showText:true,
                    getHtmlTpl:function () {
                        return '<div id="##">' + this.label + '</div>' +
                            '<div class="ue_flash" id="' + flashContainerId + '"><div id="' + placeholderId + '"></div></div>';
                    }
                });

                ui.addListener("postrender", function () {
                    var wealthHtml = "",
                        wealthList = editor.options.wealthList,
                        div = document.createElement("div");

                    for (var i in wealthList) {
                        var item = wealthList[i];
                        wealthHtml += '<option value="'+item['key']+'">'+item['value']+'</option>';
                    }

                    div.id = uploadProgressId;
                    div.innerHTML = '<div class="progressWrapper" style="display:none;">' +
                        '<div class="fileIcon icon_file_default"></div>' +
                        '<div class="progressName textClip"></div>' +
                        '<div class="progressSize"></div>' +
                        '<div class="progressRename">' +
                        '<input class="progressRenameValue" type="text">' +
                        '<a class="btn btn-20-green progressRenameBtn" rel="nofollow"><em><b>确定</b></em></a>' +
                        '</div>' +
                        '<div class="progressMessage"></div>' +
                        '<div class="progressBarWrapper">' +
                        '<div class="progressBar"></div>' +
                        '<span class="progressBarText"></span>' +
                        '</div>' +
                        '<div class="progressWealthWrapper">' +
                        '<span class="progressWealthText">定价:</span>' +
                        '<select name="wealth" class="progressWealth" id="' + wealthSelecterId + '">' +
                        wealthHtml +
                        '</select>' +
                        '</div>' +
                        '<a class="progressCancel" href="#">取消</a>' +
                        '<div class="progressFileOperator">' +
                        '<a href="#" class="rename">重命名</a>' +
                        '<a href="#" class="remove">删除</a>' +
                        '</div>' +
                        '</div>';

                    editor.ui.getDom().insertBefore(div, editor.ui.getDom("iframeholder"));
                    editor._uploadFile = {fileInfo:null, backFileInfo:null, score: 0, status:'ready', errorCode:null};
                    editor.swfupload = new SWFUpload({
                        flash_url:editor.options.swfUploadFlashUrl,
                        upload_url:editor.options.swfUploadUrl,
                        file_post_name:editor.options.swfUploadPostName,
                        file_types:"*.*",
                        file_types_description:"All Files",
                        file_queue_limit:0,
                        file_size_limit : "4 GB",
                        custom_settings:{                                         //自定义设置，用户可在此向服务器传递自定义变量
                            progressTarget:uploadProgressId,
                            swfUploadUrl:editor.options.swfUploadUrl,
                            swfUploadDir:editor.options.swfUploadDir,
                            isLogin:editor.options.isLogin,
                            isInsertFromWangPan:false,
                            isEditorFile:false,
                            isUploading:false,
                            successCount:0,
                            currentFile:null,
                            getUploadFile:function (p) {
                                if(p==undefined) p='fileInfo';
                                return editor._uploadFile[p] || null;
                            },
                            setUploadFile:function (p, value, key) {
                                if (editor._uploadFile.hasOwnProperty(p)) {
                                    if (key && editor._uploadFile[p]) {
                                        editor._uploadFile[p][key] = value;
                                    } else {
                                        editor._uploadFile[p] = value;
                                    }
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            setBindUploadStatus:function (state, errorCode) {
                                editor._uploadFile.status = state;
                                if (state == 'error') editor._uploadFile.errorCode = errorCode;
                                else editor._uploadFile.errorCode = null;
                                // ready    就绪，未上传
                                // uploading上传中
                                // finish   上传结束等待文件检查
                                // complete 检查完成，上传成功
                                // error    上传出错
                            },
                            setEditorStatusBar:function(msg){
                                if (T('.f-red', editor.container).length){
                                    T(".edui-editor-wordcount", editor.container).eq(0).html(msg);
                                }
                            },
                            hideAllPopup:function(){
                                Popup.postHide();
                            }
                        },
                        // 按钮设置
                        button_action:SWFUpload.BUTTON_ACTION.SELECT_FILE,
                        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                        button_cursor: SWFUpload.CURSOR.HAND,
                        button_placeholder_id : placeholderId,
                        button_width:70,
                        button_height: 24,
                        // SWFupload对象加载设置
                        minimum_flash_version:"9.0.28",
                        swfupload_pre_load_handler:swfUploadPreLoad,
                        swfupload_loaded_handler:swfUploadLoaded,
                        swfupload_load_failed_handler:swfUploadLoadFailed,
                        // 上传流程回调函数
                        file_dialog_start_handler:swfUploadFileDialogStart,
                        file_dialog_complete_handler:swfUploadFileDialogComplete,
                        file_queued_handler:swfUploadFileQueued,
                        file_queue_error_handler:swfUploadFileQueueError,
                        queue_complete_handler:swfUploadQueueComplete,
                        upload_start_handler:swfUploadSendStart,
                        upload_progress_handler:swfUploadSendProgress,
                        upload_success_handler:swfUploadSendSuccess,
                        upload_error_handler:swfUploadSendError,
                        upload_complete_handler:swfUploadSendComplete
                    });
                    editor.setUploadFile = function (data, isWangPan) {
                        editorSetUploadFile(data, isWangPan, editor);
                        document.getElementById(wealthSelecterId).selectedIndex = data['fileInfo']['wealth'] || 0;
                    };
                    editor.getUploadFile = function () {
                        var result = {};
                        result['status'] = editor._uploadFile['status'];
                        result['errorCode'] = editor._uploadFile['errorCode'];
                        result['fileInfo'] = editor._uploadFile['fileInfo'];
                        result['fileInfo']['wealth'] = document.getElementById(wealthSelecterId).value;
                        return result;
                    };
                    editor.uploadAction = function (method, callback) {
                        editorSubmitUploadFile(method, editor, callback);
                    };

                    var $ = function (id) {
                        return document.getElementById(id);
                    };
                    //Flash插件版本过低提示
                    var flashContainer = $(flashContainerId);
                    if (!/^[\s]*<object/i.test(flashContainer.innerHTML)) {
                        flashContainer.title = "您的Flash插件版本过低，请更新后再尝试！";
                    }
                });

                return ui;
            })(this.editor);

            editor.ui.wangpan = wangpanButton = (function (editor) {
                var cmd = "wangpan",
                    title = editor.options.buttonConfig["attachment"]["list"][cmd];

                wangpanDialog = new Dialog(utils.extend({
                    iframeUrl: editor.options.UEDITOR_HOME_URL + 'dialogs/wangpan/wangpan.html',
                    editor:editor,
                    className:'edui-for-wangpan',
                    title:'从百度网盘插入文件',
                    closeDialog: '关闭'
                }, {
                    buttons:[
                        {
                            className:'edui-okbutton',
                            label: '确定',
                            editor:editor,
                            onclick:function () {
                                wangpanDialog.close(true);
                            }
                        },
                        {
                            className:'edui-cancelbutton',
                            label: '取消',
                            editor:editor,
                            onclick:function () {
                                wangpanDialog.close(false);
                            }
                        }
                    ]
                }));
                wangpanDialog.render();
                wangpanDialog.reset();

                var ui = new Button({
                    className:'edui-for-' + cmd + ' ' + cmd,
                    label:title,
                    onclick:function () {
                        Popup.postHide(evt);
                        if (editor.swfupload && editor.swfupload.customSettings.successCount>0 && !confirm('即将删除上一个附件,确定吗？')) {
                            return false;
                        } else {
                            return true;
                        }
                        wangpanDialog.showAtCenter();
                    },
                    getHtmlTpl:function(){
                        return '<div id="##" onclick="$$._onClickWangpan(event);">' + this.label + '</div>';
                    },
                    showText:true
                });
                return ui;
            })(this.editor);
        },
        getHtmlTpl:function () {
            return '<div id="##" class="edui-attachpicker %%">' +
                '<div class="edui-attachpicker-top"></div>' +
                '<div class="edui-attachpicker-body">' +
                '<div class="edui-attachpicker-item edui-attachpicker-uploadfile" stateful _title="上传文件到网盘">' +
                uploadfileButton.getHtmlTpl() +
                '</div>' +
                '<div class="edui-attachpicker-item edui-attachpicker-wangpan" stateful _title="从网盘插入文件">' +
                wangpanButton.getHtmlTpl() +
                '</div>' +
                '</div>' +
                '</div>';
        },
        getStateDom:function () {
            return this.target;
        },
        postRender:function () {
            uploadfileButton.fireEvent('postrender');
            this.fireEvent('postrender');
        },
        _onClick:function (evt) {
            Popup.postHide(evt);
            if (!this.isDisabled()) {
                this.fireEvent('click');
            }
        },
        _onMouseOver:function (evt) {
            if (!this.isDisabled()) {
                this.fireEvent('mouseover');
            }
        },
        _onMouseOut:function (evt) {
            if (!this.isDisabled()) {
                this.fireEvent('mouseout');
            }
        },
        _onClickWangpan:function (evt) {
            Popup.postHide(evt);
            wangpanDialog.showAtCenter();
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(AttachPicker, UIBase);
    utils.extend(AttachPicker.prototype, Stateful, true);
})();
