/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
function Fitment() {
    var me = this;
    me.tid = 0;
}
(function () {
    Fitment.prototype = {
        initPageByData:function () {
            var me = this,
                data = editor["graphictemplate"][frameElement.id];

            me._addPageListener();
            me.setPageData(data);
            me._iframeAutoHeight();
        },
        _addPageListener:function () {
            var me = this;

            domUtils.on(document, "click", function (e) {
                var tgt = e.target || e.srcElement;

            });
        },
        _iframeAutoHeight:function () {
            if (browser.ie && browser.version < 8) {
                frameElement.height = frameElement.Document.body.scrollHeight
            } else {
                frameElement.height = frameElement.contentDocument.body.scrollHeight;
            }
            editor.fireEvent("contentchange");
        },
        setPageData:function (data) {
            if (data) {
                var list = domUtils.getElementsByTagName(document, "div", "content");

                for (var i = 0, len = list.length; i < len; i++) {
                    var inputs = domUtils.getElementsByTagName(list[i], "input");
                    for (var j = 0, node; node = inputs[j++];) {
                        node.value = data[i][j];
                    }
                }
            }
        },
        savePageData:function () {
            editor["graphictemplate"][frameElement.id] = {};
            var data = editor["graphictemplate"][frameElement.id];
            var list = domUtils.getElementsByTagName(document, "div", "content");

            for (var i = 0, len = list.length; i < len; i++) {
                data[i] = {};
                var inputs = domUtils.getElementsByTagName(list[i], "input");
                for (var j = 0, node; node = inputs[j++];) {
                    data[i][j] = node.value;
                }
            }
        }
    };
})();
