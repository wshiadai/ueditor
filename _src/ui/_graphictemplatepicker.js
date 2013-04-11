///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var GraphicTemplatePicker = baidu.editor.ui.GraphicTemplatePicker = function (options) {
        this.initOptions(options);
        this.initGraphicTemplatePicker();
    };
    GraphicTemplatePicker.prototype = {
        initGraphicTemplatePicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            return '<div id="##" class="edui-graphictemplatepicker %%">' +
                '<div class="edui-graphictemplatepicker-body">' +
                '<div onclick="$$._onClickFoodTemplate(event);" class="edui-graphictemplatepicker-item edui-foodtemplate" stateful>' +
                '<div class="edui-label">美食食材</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        },
        getStateDom:function () {
            return this.target;
        },
        _onClickFoodTemplate:function (evt) {
            this.editor.execCommand("graphictemplate");
            Popup.postHide(evt);
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(GraphicTemplatePicker, UIBase);
    utils.extend(GraphicTemplatePicker.prototype, Stateful, true);
})();



