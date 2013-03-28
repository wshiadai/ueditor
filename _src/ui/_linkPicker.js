///import core
///import uicore
(function () {
    var utils = baidu.editor.utils,
        Popup = baidu.editor.ui.Popup,
        Stateful = baidu.editor.ui.Stateful,
        UIBase = baidu.editor.ui.UIBase;

    var LinkPicker = baidu.editor.ui.LinkPicker = function (options) {
        this.initOptions(options);
        this.initLinkPicker();
    };
    LinkPicker.prototype = {
        initLinkPicker:function () {
            this.initUIBase();
            this.Stateful_init();
        },
        getHtmlTpl:function () {
            var list = this.editor.options.linkList;
            var start = '<div id="##" class="edui-linkpicker %%">' +
                '<div class="edui-linkpicker-body">';

            var str = "";
            for (var i = 0, item; item = list[i++];) {
                str += '<div onclick="$$._onClick(event);" class="edui-linkpicker-item" stateful>' + item.title + '</div>';
            }
            var end = '</div></div>';
            return start + str + end;
        },
        getStateDom:function () {
            return this.target;
        },
        _onClick:function (evt) {
            var target = evt.target || evt.srcElement;
            if (/icon/.test(target.className)) {
                this.items[target.parentNode.getAttribute("index")].onclick();
                Popup.postHide(evt);
            }
        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(LinkPicker, UIBase);
    utils.extend(LinkPicker.prototype, Stateful, true);
})();



