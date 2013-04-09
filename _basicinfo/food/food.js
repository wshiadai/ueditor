/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
function Food() {
    this.template = {
        title:' <div class="title">美食食材</div>',
        section:'<div class="section">' +
            '<div class="subtitle">$$</div>' +
            '<div class="content">%%</div>' +
            '</div>',
        module:'<div class="module">' +
            '<input type="text" class="name"/>' +
            ' <input type="text" class="num"/>' +
            '<span class="delete"></span>' +
            ' </div>',
        foot:'<div class="foot">' +
            '<div class="add">+ 添加食材</div>' +
            '</div>'
    };
    this._init();
}
(function () {
    Food.prototype = {
        _init:function () {
            var me = this;
            me._buildPage();
            me._addFoodListener();
        },
        _buildPage:function () {
            var tpl = this.template, arr = [];

            arr.push(tpl.title);
            arr.push(tpl.section.replace("$$", "主料").replace("%%", me._addModule(4)));
            arr.push(tpl.foot);
            arr.push(tpl.section.replace("$$", "辅料").replace("%%", me._addModule(4)));
            arr.push(tpl.foot);

            $G("J_wrapper").innerHTML = arr.join('');
        },
        _addFoodListener:function () {
            var me = this;

            domUtils.on(document, "click", function (e) {
                var tgt = e.target || e.srcElement;
                if (domUtils.hasClass(tgt, "add")) {
                    me._addSection(tgt);
                } else if (domUtils.hasClass(tgt, "delete")) {
                    me._deleteModule(tgt);
                }
            });
        },
        _addSection:function (tgt) {
            var me = this,
                tmpStr = me.template.module,
                tmpDiv = document.createElement("div");

            var content = domUtils.getElementsByTagName(tgt.parentNode.previousSibling, "div", "content")[0];
            var sum = domUtils.getElementsByTagName(content, "div", "module").length;

            var len = sum % 2 ? 1 : 2;
            for (var i = 0; i < len; i++) {
                tmpDiv.innerHTML = tmpStr;
                content.appendChild(tmpDiv.children[0]);
            }

            me._iframeAutoHeight();
        },
        _addModule:function (num) {
            var me = this, str = "";
            for (var i = 0; i < num; i++) {
                str += me.template.module;
            }
            return str;
        },
        _deleteModule:function (tgt) {
            var node = tgt.parentNode;
            node.parentNode.removeChild(node);
        },
        _iframeAutoHeight:function () {
            if (browser.ie && browser.version < 8) {
                frameElement.height = frameElement.Document.body.scrollHeight
            } else {
                frameElement.height = frameElement.contentDocument.body.scrollHeight;
            }
            editor.fireEvent("contentchange")
        },
        readPageData:function () {
            var data = editor["basicinfo"][frameElement.id];
            if (data) {

            }
        },
        savePageData:function () {

        }
    };
})();
