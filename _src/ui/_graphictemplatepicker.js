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
                '<div onclick="$$._onClick(event);"  class="edui-graphictemplatepicker-item" stateful>' +
                    '<div class="edui-label" _type="food">美食食材</div>' +
                '</div>' +
                '<div onclick="$$._onClick(event);"  class="edui-graphictemplatepicker-item" stateful>' +
                    '<div class="edui-label" _type="home">家居装修</div>' +
                '</div>' +
                '<div onclick="$$._onClick(event);" class="edui-graphictemplatepicker-item" stateful>' +
                    '<div class="edui-label"  _type="soft">软件信息</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        },
        getStateDom:function () {
            return this.target;
        },
        _onClick:function (e) {
            var tgt= e.target || e.srcElement;
            this.editor.execCommand("graphictemplate",tgt.getAttribute("_type"));
            Popup.postHide(e);
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(GraphicTemplatePicker, UIBase);
    utils.extend(GraphicTemplatePicker.prototype, Stateful, true);
})();



