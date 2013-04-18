/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
GraphicTemplate = {
    initPageByData:function () {
        var me = this,
            data = editor["graphictemplate"][frameElement.id];

        me._addPageListener();
        me.setPageData(data);
        me.savePageData();
        moveTemplate("J_drag");
        iframeAutoHeight();
    },
    _addPageListener:function () {
        domUtils.on(G("J_decorative"), "click", function (e) {
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

    _setTextBox:function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            G(id).value = data[id];
        }
    },
    _setCheckBox:function (data, containerId) {
        var list = domUtils.getElementsByTagName(G(containerId), "span");
        for (var i = 0, node; node = list[i++];) {
            if (data[node.id]) {
                domUtils.addClass(node, "active");
            }
        }
    },
    setPageData:function (data) {
        if (data) {
            var me = this;
            //设置文本框值
            me._setTextBox(data, ["J_shi", "J_ting", "J_wei", "J_meter", "J_wan", "J_quanbao", "J_hunfang", "J_other"]);
            //设置复选框值
            me._setCheckBox(data, "J_decorative");
        }
    },

    _saveTextBox:function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            data[id] = G(id).value;
        }
    },
    _saveCheckBox:function (data, list) {
        var node, txt;
        for (var i = 0, id; id = list[i++];) {
            node = G(id);
            txt = "";
            if (domUtils.hasClass(node, "active")) {
                txt = node.innerText || node.textContent || node.nodeValue;
            }
            data[id] = txt;
        }
    },
    savePageData:function () {
        var me = this;
        editor["graphictemplate"][frameElement.id] = {};
        var data = editor["graphictemplate"][frameElement.id];

        //文本框保存值
        me._saveTextBox(data, ["J_shi", "J_ting", "J_wei",
            "J_meter", "J_wan", "J_quanbao", "J_hunfang", "J_other"]);

        //复选狂保存值
        me._saveCheckBox(data, ["J_jianyue", "J_xiandai", "J_tianyuan",
            "J_zhongshi", "J_hunda", "J_oushi", "J_dizhonghai"]);
    }
};
