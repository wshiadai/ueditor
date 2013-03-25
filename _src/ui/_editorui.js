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
        'map':'~/dialogs/map/map.html',
        'insertvideo':'~/dialogs/video/video.html'
    };
    //为工具栏添加按钮，以下都是统一的按钮触发命令，所以写在一起
    var btnCmds = ['undo', 'redo', 'formatmatch',
        'bold', 'italic', 'underline', 'fontborder', 'touppercase', 'tolowercase',
        'strikethrough', 'subscript', 'superscript', 'source', 'indent', 'outdent',
        'blockquote', 'pasteplain', 'pagebreak',
        'selectall', 'print', 'preview', 'horizontal', 'removeformat', 'time', 'date', 'unlink',
        'insertparagraphbeforetable', 'insertrow', 'insertcol', 'mergeright', 'mergedown', 'deleterow',
        'deletecol', 'splittorows', 'splittocols', 'splittocells', 'mergecells', 'deletetable'];

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
        ok:['link','map', 'gmap','insertvideo']
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

    //有序，无序列表
    var lists = ['insertorderedlist', 'insertunorderedlist'];
    for (var l = 0, cl; cl = lists[l++];) {
        (function (cmd) {
            editorui[cmd] = function (editor) {
                var vals = editor.options[cmd],
                    _onMenuClick = function () {
                        editor.execCommand(cmd, this.value);
                    }, items = [];
                for (var i in vals) {
                    items.push({
                        label:vals[i] || editor.getLang()[cmd][i] || "",
                        value:i,
                        theme:editor.options.theme,
                        onclick:_onMenuClick
                    })
                }
                var ui = new editorui.MenuButton({
                    editor:editor,
                    className:'edui-for-' + cmd,
                    title:editor.getLang("labelMap." + cmd) || '',
                    'items':items,
                    onbuttonclick:function () {
                        var value = editor.queryCommandValue(cmd) || this.value;
                        editor.execCommand(cmd, value);
                    }
                });
                editorui.buttons[cmd] = ui;
                editor.addListener('selectionchange', function () {
                    var state = editor.queryCommandState(cmd);
                    if (state == -1) {
                        ui.setDisabled(true);
                    } else {
                        ui.setDisabled(false);
                        var value = editor.queryCommandValue(cmd);
                        ui.setValue(value);
                        ui.setChecked(state)
                    }
                });
                return ui;
            };
        })(cl)
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

})();
