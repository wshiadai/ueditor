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
        subTitle:'<div class="subtitle">$$</div>',
        section:function (hasSubTitle) {
            return '<div class="section">' +
                (hasSubTitle ? '<div class="subtitle">$$</div>' : '') +
                '<div class="module">' +
                '<input type="text" class="name"/>' +
                ' <input type="text" class="num"/>' +
                '<span class="delete" btn-type="delete"></span>' +
                ' </div>' +
                ' <div class="module">' +
                '<input type="text" class="name"/>' +
                ' <input type="text" class="num"/>' +
                '<span class="delete" btn-type="delete"></span>' +
                '</div>' +
                '</div>';
        },
        foot:'<div class="foot">' +
            '<div class="add" btn-type="add">+ 添加食材</div>' +
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
            arr.push(tpl.section(true).replace("$$", "主料"));
            arr.push(tpl.section(false));
            arr.push(tpl.foot);

            arr.push(tpl.section(true).replace("$$", "辅料"));
            arr.push(tpl.section(false));
            arr.push(tpl.foot);

            $G("J_wrapper").innerHTML = arr.join('');
        },
        _addFoodListener:function () {
            var me = this;

            domUtils.on(document, "click", function (e) {
                var tgt = e.target || e.srcElement;
                var btnType = tgt.getAttribute("btn-type");

                if (btnType == "add") {
                    me._addsection(tgt);
                } else if (btnType == "delete") {
                    me._delteModule(tgt);
                }
            });
        },
        _addsection:function (tgt) {
            var me = this;
            var node = tgt.parentNode;
            var tmpDiv = document.createElement("div");
            tmpDiv.innerHTML = me.template.section(false);
            node.parentNode.insertBefore(tmpDiv.children[0], node);
            me._iframeAutoHeight();
        },
        _delteModule:function () {

        },
        _iframeAutoHeight:function () {
            frameElement.height = frameElement.contentDocument.body.scrollHeight
                ||frameElement.contentWindow.document.scrollHeight;
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
