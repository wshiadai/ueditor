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
            var decorative = $G("J_decorative");
            domUtils.on(decorative, "click", function (e) {
                var tgt = e.target || e.srcElement;
                if (domUtils.hasClass(tgt, "active")) {
                    domUtils.removeClasses(tgt, ['active']);
                } else {
                    if (domUtils.hasClass(tgt, "way")) {
                        domUtils.addClass(tgt, "active")
                    }
                }
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
                $G("J_shi").value=data["J_shi"];
                $G("J_ting").value=data["J_ting"];
                $G("J_wei").value=data["J_wei"] ;
                $G("J_meter").value=data["J_meter"];
                data["J_wan"] = $G("J_wan").value;
                data["J_quanbao"] = $G("J_quanbao").value;
                data["J_hunfang"] = $G("J_hunfang").value;

                data["J_jianyue"] = $G("J_jianyue").className;
                data["J_xiandai"] = $G("J_xiandai").className;
                data["J_tianyuan"] = $G("J_tianyuan").className;
                data["J_zhongshi"] = $G("J_zhongshi").className;
                data["J_hunda"] = $G("J_hunda").className;
                data["J_oushi"] = $G("J_oushi").className;
                data["J_dizhonghai"] = $G("J_dizhonghai").className;
                data["J_other"] = $G("J_other").value;
            }
        },
        savePageData:function () {
            editor["graphictemplate"][frameElement.id] = {};
            var data = editor["graphictemplate"][frameElement.id];
            data["J_shi"] = $G("J_shi").value;
            data["J_ting"] = $G("J_ting").value;
            data["J_wei"] = $G("J_wei").value;
            data["J_meter"] = $G("J_meter").value;
            data["J_wan"] = $G("J_wan").value;
            data["J_quanbao"] = $G("J_quanbao").value;
            data["J_hunfang"] = $G("J_hunfang").value;

            data["J_jianyue"] = $G("J_jianyue").className;
            data["J_xiandai"] = $G("J_xiandai").className;
            data["J_tianyuan"] = $G("J_tianyuan").className;
            data["J_zhongshi"] = $G("J_zhongshi").className;
            data["J_hunda"] = $G("J_hunda").className;
            data["J_oushi"] = $G("J_oushi").className;
            data["J_dizhonghai"] = $G("J_dizhonghai").className;
            data["J_other"] = $G("J_other").value;
        }
    };
})();
