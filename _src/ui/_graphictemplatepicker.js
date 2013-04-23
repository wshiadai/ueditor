///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        Button = baidu.editor.ui.Button,
        UIBase = baidu.editor.ui.UIBase;

    var GraphicTemplatePicker = baidu.editor.ui.GraphicTemplatePicker = function (options) {
        this.initOptions(options);
        this.initGraphicTemplatePicker();
    };
    GraphicTemplatePicker.prototype = {
        initGraphicTemplatePicker: function () {
            this.initUIBase();
            this.initButtons();
            this.Stateful_init();
        },
        initButtons: function () {
            var btnCmds = ['insertfood', 'insertfitment', 'insertsoft'];
            var editor = this.editor;
            var editorui = editor.ui;

            for (var i = 0, ci; ci = btnCmds[i++];) {
                ci = ci.toLowerCase();
                editorui[ci] = function (cmd) {
                    return function (editor) {
                        var opt=editor.options["graphictemplateLabel"];
                        var ui = new Button({
                            className: 'edui-for-' + cmd,
                            title:opt[cmd],
                            onclick: function () {
                                editor.execCommand("graphictemplate");
                            },
                            label:opt[cmd],
                            theme: editor.options.theme,
                            showIcon: false,
                            showText: true
                        });
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
                    }(editor);
                }(ci);
            }
        },
        getHtmlTpl: function () {
            var editorui = this.editor.ui;
            return '<div id="##" class="edui-graphictemplatepicker %%">' +
                '<div class="edui-graphictemplatepicker-body">' +
                '<div class="edui-graphictemplatepicker-item" >' +
                    editorui['insertfood'].getHtmlTpl() +
                '</div>' +
                '<div  class="edui-graphictemplatepicker-item" >' +
                    editorui['insertfitment'].getHtmlTpl() +
                '</div>' +
                '<div class="edui-graphictemplatepicker-item" >' +
                    editorui['insertsoft'].getHtmlTpl() +
                '</div>' +
                '</div>' +
                '</div>';
        },
        getStateDom: function () {
            return this.target;
        },
//        _onClick: function (event) {
//            this.editor.execCommand("graphictemplate");
//            Popup.postHide(e);
//        },
        _UIBase_render: UIBase.prototype.render
    };
    utils.inherits(GraphicTemplatePicker, UIBase);
    utils.extend(GraphicTemplatePicker.prototype, Stateful, true);
})();



