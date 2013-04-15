/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
function Soft() {
}
(function () {
    Soft.prototype = {
        initPageByData:function () {
            var me = this,
                data = editor["graphictemplate"][frameElement.id];

            me._addPageListener();
            me.setPageData(data);
            movetemplate("J_drag");
            iframeAutoHeight();
        },
        _addPageListener:function () {
            var me = this;

            domUtils.on($G("J_systemask"), "click", function (e) {
                var tgt = e.target || e.srcElement;
                if (domUtils.hasClass(tgt, "active")) {
                    domUtils.removeClasses(tgt, ['active']);
                } else {
                    if (domUtils.hasClass(tgt, "way")) {
                        domUtils.addClass(tgt, "active")
                    }
                }
            });

            domUtils.on($G("J_pc"), "click", function () {
                me._showTab(0);
            });
            domUtils.on($G("J_mobile"), "click", function () {
                me._showTab(1);
            });
            domUtils.on($G("J_free"), "click", function () {
                me._setBoxEdit(true);
            });
            domUtils.on($G("J_pay"), "click", function () {
                me._setBoxEdit(false);
            });
        },
        _showTab:function (index) {
            var me = this;
            var list = domUtils.getElementsByTagName(document, "div", "tab");
            if (index == 0) {
                domUtils.addClass(list[0], "cur");
                domUtils.removeClasses(list[1], "cur");
            } else if (index == 1) {
                domUtils.removeClasses(list[0], "cur");
                domUtils.addClass(list[1], "cur");
            }

            iframeAutoHeight();
        },
        _setBoxEdit:function (isEdit) {
            var money = $G("J_money");
            money.readOnly = isEdit;
            money.style.cursor = isEdit ? "not-allowed" : "default";
        },
        _getActiveTxtById:function (id) {
            var node = $G(id);
            if (domUtils.hasClass(node, "active")) {
                return node.innerText || node.textContent || node.nodeValue;
            } else {
                return "";
            }
        },
        _setTabByTxt:function (selTxt) {
            var me=this;
            var cur = $G("J_pc");
            var txt = domUtils.getNextDomNode(cur, function (node) {
                return node.nodeType == 3 && !domUtils.isFillChar(node)
            });
            if (txt == selTxt) {
                me._showTab(0);
                cur.checked = true;
            } else {
                me._showTab(1);
                cur.checked = false;
                $G("J_mobile").checked = true;
            }
        },
        _setEditByTxt:function (selTxt) {
            var me=this;
            var cur = $G("J_free");
            var txt = domUtils.getNextDomNode(cur, function (node) {
                return node.nodeType == 3 && !domUtils.isFillChar(node)
            });
            if (txt == selTxt) {
                me._setBoxEdit(true);
                cur.checked = true;
            } else {
                me._setBoxEdit(false);
                cur.checked = false;
                $G("J_pay").checked = true;
            }
        },
        _getTxtBySelect:function (id) {
            var cur = $G(id);
            var txt = "";
            if (cur.checked) {
                txt = domUtils.getNextDomNode(cur, function (node) {
                    return node.nodeType == 3 && !domUtils.isFillChar(node)
                });
            }
            return txt;
        },
        setPageData:function (data) {
            if (data) {
                var me = this;
                $G("J_name").value = data["J_name"];
                $G("J_size").value = data["J_size"];
                $G("J_version").value = data["J_version"];
                $G("J_systemtool").value = data["J_systemtool"];
                $G("J_lang").value = data["J_lang"];
                $G("J_money").value = data["J_money"];
                $G("J_systemNeed").value = data["J_systemNeed"];
                $G("J_downloadlink").value = data["J_downloadlink"];
                $G("J_money").value = data["J_money"];

                me._setTabByTxt(data["J_pc"]);
                me._setEditByTxt(data["J_free"]);

                var list = domUtils.getElementsByTagName($G("J_systemask"), "span");
                for (var i = 0, node; node = list[i++];) {
                    if (data[node.id]) {
                        domUtils.addClass(node, "active");
                    }
                }
            }
        },
        savePageData:function () {
            var me = this;
            editor["graphictemplate"][frameElement.id] = {};
            var data = editor["graphictemplate"][frameElement.id];

            data["J_name"] = $G("J_name").value;
            data["J_size"] = $G("J_size").value;
            data["J_version"] = $G("J_version").value;
            data["J_systemtool"] = $G("J_systemtool").value;
            data["J_lang"] = $G("J_lang").value;
            data["J_money"] = $G("J_money").value;
            data["J_systemNeed"] = $G("J_systemNeed").value;
            data["J_downloadlink"] = $G("J_downloadlink").value;

            data["J_ios"] = me._getActiveTxtById("J_ios");
            data["J_android"] = me._getActiveTxtById("J_android");
            data["J_winphone"] = me._getActiveTxtById("J_winphone");

            data["J_pc"] = me._getTxtBySelect("J_pc");
            data["J_mobile"] = me._getTxtBySelect("J_mobile");
            data["J_free"] = me._getTxtBySelect("J_free");
            data["J_pay"] = me._getTxtBySelect("J_pay");
        }
    };
})();
