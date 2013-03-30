///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var MorePicker = baidu.editor.ui.MorePicker = function (options) {
        this.initOptions(options);
        this.initMorePicker();
    };
    MorePicker.prototype = {
        initMorePicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            return '<div id="##" class="edui-morepicker %%">' +
                '<div class="edui-morepicker-body">' +
                    '<div onclick="$$._onClickTemplate(event);" class="edui-morepicker-item edui-answertemplate" stateful>' +
                        '<div class="edui-icon"></div><div class="edui-label">回答模板</div>' +
                    '</div>' +
                    '<div onclick="$$._onClickVideo(event);" class="edui-morepicker-item  edui-insertvideo" stateful>' +
                        '<div class="edui-icon"></div><div class="edui-label">插入视频</div>' +
                    '</div>'+
                '</div>'+
                '</div>';
        },
        getStateDom:function () {
            return this.target;
        },
        _onClickTemplate:function (evt) {
            this.editor.fireEvent("answertemplateclick");
            Popup.postHide(evt);
        },
        _onClickVideo:function (evt) {
            if(!this.editor.getDialog("insertvideo")){
                UE.ui.insertvideo(this.editor);
            }
            this.editor.getDialog("insertvideo").open();
            Popup.postHide(evt);
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(MorePicker, UIBase);
    utils.extend(MorePicker.prototype, Stateful, true);
})();



