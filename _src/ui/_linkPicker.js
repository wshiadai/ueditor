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
            var opt = this.editor.options,
                list = opt.linkList,
                arr = [], height = "";

            height = list.length > opt.linkCountLimit ? (opt.linkCountLimit * opt.linkSingleHeight + 'px') : "";

            arr.push('<div id="##" class="edui-linkpicker %%">' +
                '<div class="edui-linkpicker-body" style="height:' + height + '">');

            for (var i = 0, item; item = list[i++];) {
                var txt = item.title;
                if (txt.length > opt.linkWordLimit) {
                    txt = txt.substring(0, opt.linkWordLimit) + "...";
                }
                arr.push('<div onclick="$$._onClick(event);" class="edui-linkpicker-item" stateful  _href="' +
                    item.href + '" _title="' + item.title + '">' + txt + '</div>');
            }
            arr.push('</div>' +
                '<div onclick="$$._showDialog(event);" class="edui-linkpicker-edit edui-linkpicker-item">编辑</div>' +
                ' </div>');

            return arr.join("");
        },
        getStateDom:function () {
            return this.target;
        },

        _showDialog:function (evt) {
            this.editor.fireEvent("linkeditclick");
            Popup.postHide(evt);
        },
        _onClick:function (evt) {
            var target = evt.target || evt.srcElement, obj = {};
            obj["href"] = target.getAttribute("_href");
            obj["_href"] = target.getAttribute("_href");
            obj["textValue"] = target.getAttribute("_title");
            this.editor.execCommand('link', obj);
            Popup.postHide(evt);

        },
        _UIBase_render:UIBase.prototype.render
    };
    utils.inherits(LinkPicker, UIBase);
    utils.extend(LinkPicker.prototype, Stateful, true);
})();



