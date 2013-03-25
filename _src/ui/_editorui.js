//ui跟编辑器的适配層
//那个按钮弹出是dialog，是下拉筐等都是在这个js中配置
//自己写的ui也要在这里配置，放到baidu.editor.ui下边，当编辑器实例化的时候会根据editor_config中的toolbars找到相应的进行实例化
(function () {
    var utils = baidu.editor.utils;
    var editorui = baidu.editor.ui;
    var _Dialog = editorui.Dialog;
    editorui.buttons = {};

    editorui.Dialog = function (options) {
        var dialog = new _Dialog(options);
        dialog.addListener('hide', function () {

            if (dialog.editor) {
                var editor = dialog.editor;
                try {
                    if (browser.gecko) {
                        var y = editor.window.scrollY,
                            x = editor.window.scrollX;
                        editor.body.focus();
                        editor.window.scrollTo(x, y);
                    } else {
                        editor.focus();
                    }


                } catch (ex) {
                }
            }
        });
        return dialog;
    };

    var iframeUrlMap = {
        'link':'~/dialogs/link/link.html',
        'insertvideo':'~/dialogs/video/video.html'
    };
    //为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
    var btnCmds = ['insertorderedlist', 'insertunorderedlist','autotypeset'];

    for (var i = 0, ci; ci = btnCmds[i++];) {
        ci = ci.toLowerCase();
        editorui[ci] = function (cmd) {
            return function (editor) {
                var ui = new editorui.Button({
                    className:'edui-for-' + cmd,
                    title:editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '',
                    onclick:function () {
                        editor.execCommand(cmd);
                    },
                    theme:editor.options.theme,
                    showText:false
                });
                editorui.buttons[cmd] = ui;
                editor.addListener('selectionchange', function (type, causeByUi, uiReady) {
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                        ui.setChecked(false);
                    } else {
                        if (!uiReady) {
                            ui.setDisabled(false);
                            ui.setChecked(state);
                        }
                    }
                });
                return ui;
            };
        }(ci);
    }

    var dialogBtns = {
        noOk:[],
        ok:['link','insertvideo']
    };

    for (var p in dialogBtns) {
        (function (type, vals) {
            for (var i = 0, ci; ci = vals[i++];) {
                //todo opera下存在问题
                if (browser.opera && ci === "searchreplace") {
                    continue;
                }
                (function (cmd) {
                    editorui[cmd] = function (editor, iframeUrl, title) {
                        iframeUrl = iframeUrl || (editor.options.iframeUrlMap || {})[cmd] || iframeUrlMap[cmd];
                        title = editor.options.labelMap[cmd] || editor.getLang("labelMap." + cmd) || '';

                        var dialog;
                        //没有iframeUrl不创建dialog
                        if (iframeUrl) {
                            dialog = new editorui.Dialog(utils.extend({
                                iframeUrl:editor.ui.mapUrl(iframeUrl),
                                editor:editor,
                                className:'edui-for-' + cmd,
                                title:title,
                                closeDialog:editor.getLang("closeDialog")
                            }, type == 'ok' ? {
                                buttons:[
                                    {
                                        className:'edui-okbutton',
                                        label:editor.getLang("ok"),
                                        editor:editor,
                                        onclick:function () {
                                            dialog.close(true);
                                        }
                                    },
                                    {
                                        className:'edui-cancelbutton',
                                        label:editor.getLang("cancel"),
                                        editor:editor,
                                        onclick:function () {
                                            dialog.close(false);
                                        }
                                    }
                                ]
                            } : {}));

                            editor.ui._dialogs[cmd + "Dialog"] = dialog;
                        }

                        var ui = new editorui.Button({
                            className:'edui-for-' + cmd,
                            title:title,
                            onclick:function () {
                                if (dialog) {
                                    switch (cmd) {
                                        case "wordimage":
                                            editor.execCommand("wordimage", "word_img");
                                            if (editor.word_img) {
                                                dialog.render();
                                                dialog.open();
                                            }
                                            break;
                                        case "scrawl":
                                            if (editor.queryCommandState("scrawl") != -1) {
                                                dialog.render();
                                                dialog.open();
                                            }

                                            break;
                                        default:
                                            dialog.render();
                                            dialog.open();
                                    }
                                }
                            },
                            theme:editor.options.theme,
                            disabled:cmd == 'scrawl' && editor.queryCommandState("scrawl") == -1
                        });
                        editorui.buttons[cmd] = ui;
                        editor.addListener('selectionchange', function () {
                            //只存在于右键菜单而无工具栏按钮的ui不需要检测状态
                            var unNeedCheckState = {'edittable':1};
                            if (cmd in unNeedCheckState)return;

                            var state = editor.queryCommandState(cmd);
                            if (ui.getDom()) {
                                ui.setDisabled(state == -1);
                                ui.setChecked(state);
                            }

                        });

                        return ui;
                    };
                })(ci.toLowerCase())
            }
        })(p, dialogBtns[p])
    }

    editorui.autotypeset = function (editor) {
        var ui = new editorui.AutoTypeSetButton({
            editor:editor,
            title:editor.options.labelMap['autotypeset'] || editor.getLang("labelMap.autotypeset") || '',
            className:'edui-for-autotypeset',
            onbuttonclick:function () {
                editor.execCommand('autotypeset')
            }
        });
        editorui.buttons['autotypeset'] = ui;
        editor.addListener('selectionchange', function () {
            ui.setDisabled(editor.queryCommandState('autotypeset') == -1);
        });
        return ui;
    };

    //以下代码：for zhidao by xuheng
    editorui.InsertPlace = function (editor) {
        var iframeUrl = editor.options.iframeUrlMap["insertPlace"],
            title = iframeUrl.title,
            unTitle = iframeUrl.unTitle,
            hoverTitle = iframeUrl.hoverTitle;
        var ui = new editorui.Button({
            className:'edui-for-insertplace insertplace',
            title:hoverTitle,
            label:title,
            onclick:function () {
                if (editor.options.isLoginForPlace) {
                    editor.fireEvent("showPlaceDialog", "add");
                }
            },
            showText:true
        });
        ui.addListener("renderReady", function () {
            var dom = ui.getDom();
            var label = $(dom.id + "_body").children[1];
            if (!editor.options.isLoginForPlace) {
                label.style.color = "#999";
                ui.onclick = function () {
                    editor.fireEvent("isLogout");
                };
            } else {
                ui.onclick = function () {
                    editor.fireEvent("showPlaceDialog", "add");
                };
                ui.removeClass(["editplace"]);
                ui.addClass("insertplace");
                label.innerHTML = title;
            }
            dom.onclick = function (e) {
                e = e || window.event;
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            };
        });
        editor.addListener("addPlace", function () {
            var label = $(ui.getDom().id + "_body").children[1];
            if (!editor.options.isLoginForPlace) {
                label.style.color = "#999";
                editor.fireEvent("isLogout");
                return;
            }
            ui.onclick = function () {
                editor.fireEvent("showPlaceDialog", "edit");
            };
            ui.removeClass(["insertplace"]);
            ui.addClass("editplace");
            label.innerHTML = unTitle;
        });
        editor.addListener('deletePlace', function () {
            var label = $(ui.getDom().id + "_body").children[1];
            if (!editor.options.isLoginForPlace) {
                label.style.color = "#999";
                editor.fireEvent("isLogout");
                return;
            }
            ui.onclick = function () {
                editor.fireEvent("showPlaceDialog", "add");
            };
            ui.removeClass(["editplace"]);
            ui.addClass("insertplace");
            label.innerHTML = title;
        });

        return ui;
    };

    editorui.InsertImage = function (editor) {
        var iframeUrl = editor.options.iframeUrlMap["insertImage"],
            title = iframeUrl['title'],
            hovertitle = iframeUrl['hoverTitle'],
            overflowMsg = iframeUrl['overflowMsg'],
            obj, containerID = "ue_con_" + +new Date();
        var ui = new editorui.Button({
            className:'edui-for-insertimage',
            title:hovertitle || '',
            label:title || '',
            getHtmlTpl:function () {
                return '<div id="##" class="edui-box %%" ' + (this.title ? 'title="' + this.title + '"' : '') + '>' +
                    '<div id="##_state" stateful>' +
                    '<div class="%%-wrap">' +
                    '<div id="##_body" unselectable="on" class="%%-body" >' +
                    (this.showIcon ? '<div class="edui-box edui-icon"></div>' : '') +
                    (this.showText ? '<div class="edui-box edui-label">' + this.label + '</div>' : '') +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div id="' + containerID + '" class="ue_flash"></div>' +
                    '</div>';
            },
            showText:true
        });


        ui.addListener("renderReady", function () {
            //by xuheng
            domUtils.on(ui.getDom(), "mouseover", function (e) {
                ui.addState("hover");
            });
            domUtils.on(ui.getDom(), "mouseout", function (e) {
                ui.removeState("hover");
            });

            var flashid = "ue_flash_" + +new Date();
            baidu.swf.create({
                id:flashid,
                url:editor.options.flashUrl, //flash地址
                width:"48", //flash舞台宽度
                height:"22", //flash舞台高度
                errorMessage:"您的Flash插件版本过低，请更新后再尝试！",
                wmode:"transparent", //设为透明
                ver:"9.0.0",
                // 初始化传入flash的参数，width和height是设置按钮的宽高,url是上传的地址,fieldName为表单名，title为表单标签
                vars:{
                    width:48,
                    height:22,
                    fileExtension:editor.options.acceptImageType,
                    fileSize:editor.options.imageMaxSize
                }
            }, containerID);

            //修复flash版本低时问题
            var flashContainer = $(containerID);
            if (!flashContainer.children[0]) {
                if (browser.firefox) {
                    flashContainer.innerText = "";
                } else {
                    flashContainer.textContent = "";
                }
                flashContainer.title = "您的Flash插件版本过低，请更新后再尝试！";
            }

            var t = setInterval(checkState, 50);
            obj = baidu.swf.getMovie(flashid);
            //五个回调
            var success = "ue_success" + +new Date,
                error = "ue_error" + +new Date,
                select = "ue_select" + +new Date,
                checkupload = "ue_checkupload" + +new Date,
                logout = "ue_logout" + +new Date;

            function checkState() {
                if (obj && obj.flashInit && obj.flashInit()) {
                    clearInterval(t);
                    // 设置透明的flash为手型
                    obj.setHandCursor(true);
                    //注：设置被调用的函数名，顺序不能变，uploadComplete上传完成。uploadError上传失败。selectFileCheck文件检查。logFailed未登录提示
                    obj.setJSFuncName([success, error, select, logout, checkupload]);
                    //obj.setMEFuncName("gestureType");	// 设置flash鼠标事件的响应函数
                }
            }

            if (!editor.options.isLogin) {
                var dom = ui.getDom(),
                    label = $(dom.id + "_body").children[1];
                label.style.color = "#999";
                dom.setAttribute("title", hovertitle);

                var icon = $(dom.id + "_body").children[0];
                domUtils.removeClasses(icon, ["edui-icon"]);
                domUtils.addClass(icon, "edui_disableIcon");
            }

            window[checkupload] = function () {
                //获取当前是否登录状态
                editor.fireEvent("flashClicked");
                return editor.options.isLogin;
            };
            window[select] = function (data) {
                if (data.errorNo) {
                    editor.fireEvent("imageSizeError");
                    return;
                }
                var index = +new Date,
                    src = editor.options.waitImageUrl;
                editor.execCommand("insertimage", {
                    id:"ue_waitflag_" + index,
                    src:src,
                    data_ue_src:src
                });
                editor.fireEvent("contentchange");

                var customObj = editor.options.customObj;
                customObj['position'] = index;
                customObj['editorIndex'] = containerID;
                obj.upload(editor.options.imageUrl, editor.options.imageFieldName, customObj);
            };

            window[success] = function (data) {
                replaceWait(data.index, data.url ? editor.options.imagePath + data.url : null);
                editor.fireEvent("uploadSuccess", data);
            };
            window[logout] = function () {
                editor.fireEvent("isLogout");
            };
            window[error] = function (msg) {
                replaceWait(msg.index);
                editor.fireEvent("networkError", msg);
            };
            function replaceWait(index, url) {
                var image = editor.document.getElementById("ue_waitflag_" + index);
                image.hasLoaded = false;
                if (url && image) {
                    image.setAttribute("data_ue_src", url);
                    image.removeAttribute("id");
                    image.onload = function () {
                        if (this.hasLoaded)return;
                        this.hasLoaded = true;
                        var span = editor.document.createElement('span');
                        span.style.cssText = 'display:block;width:0;margin:0;padding:0;border:0;clear:both;';
                        span.innerHTML = '.';
                        var tmpNode = span.cloneNode(true);
                        editor.selection.getRange().insertNode(tmpNode);
                        domUtils.scrollToView(tmpNode, domUtils.getWindow(tmpNode), 0);
                        tmpNode && tmpNode.parentNode.removeChild(tmpNode);
                        editor.fireEvent("contentchange");
                    };
                    image.src = url;
                } else {
                    image && image.parentNode.removeChild(image);
                }
                //解决flash和中文输入法不兼容问题
                fixFlash(editor);

                editor.fireEvent("contentchange");
            }

        });
        /**
         * 检测flash方法是否具备，
         * @param fn  检测的方法
         * @param step  检测间隔毫秒数
         * @param num  检测次数上限
         */
        function checkFlashFun(flashObj, fn, step, num) {
            if (!flashObj) return;
            var time = setInterval(function () {
                if (num == 0)clearInterval(time);
                if (!flashObj[fn]) {
                    num--;
                } else {
                    flashObj[fn]();
                    clearInterval(time);
                }
            }, step);
        }

        editor.addListener('selectionchange', function () {
            var state = editor.queryCommandState("insertimage"),
                dom = ui.getDom(),
                label = $(dom.id + "_body").children[1];
            if (!editor.options.isLogin) {
                label.style.color = "#999";
                dom.setAttribute("title", hovertitle);

                var icon = $(dom.id + "_body").children[0];
                domUtils.removeClasses(icon, ["edui-icon"]);
                domUtils.addClass(icon, "edui_disableIcon");
                return;
            }

            if (state == -1) {
                label.style.color = "#999";
                checkFlashFun(obj, "disabledUpload", 200, 100);
                ui.getDom().setAttribute("title", overflowMsg);
            } else {
                label.style.color = "";
                checkFlashFun(obj, "enabledUpload", 200, 100);
                ui.getDom().setAttribute("title", hovertitle);
            }

        });
        return ui;
    };
})();
