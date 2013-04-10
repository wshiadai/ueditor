///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var AttachPicker = baidu.editor.ui.AttachPicker = function (options) {
        this.initOptions(options);
        this.initAttechPicker();
    };
    AttachPicker.prototype = {
        initAttechPicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            return '<div id="##" class="edui-attachpicker %%">' +
                '<div class="edui-attachpicker-top"></div>' +
                '<div class="edui-attachpicker-body">' +
                '<div onclick="$$._showUploadFile(event);" class="edui-attachpicker-item" stateful _title="上传文件到网盘">上传文件</div>' +
                '<div onclick="$$._showWangPan(event);" class="edui-attachpicker-item" stateful _title="从网盘插入文件">插入网盘</div>' +
                '</div>' +
                '</div>';
        },
        getStateDom:function () {
            return this.target;
        },
        _showUploadFile:function (evt,cmd) {
            console.log(cmd);
            this.editor.fireEvent("linkeditclick");
            Popup.postHide(evt);
        },
        _showWangPan:function (evt,cmd) {
            console.log(cmd);
            this.editor.fireEvent("linkeditclick");
            Popup.postHide(evt);
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(AttachPicker, UIBase);
    utils.extend(AttachPicker.prototype, Stateful, true);
})();
