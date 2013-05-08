/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
var Template = {
    tabIndex: 0,
    addPageListener: function () {
        var me = this;

        domUtils.on(G("J_systemask"), "click", function (e) {
            var tgt = e.target || e.srcElement;
            if (domUtils.hasClass(tgt, "active")) {
                domUtils.removeClasses(tgt, ['active']);
            } else {
                if (domUtils.hasClass(tgt, "way")) {
                    domUtils.addClass(tgt, "active")
                }
            }
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });

        domUtils.on(document, "click", function (e) {
            var tgt = e.target || e.srcElement;
            switch (tgt.id) {
                case "J_pc":
                    me._showTab(true);
                    break;
                case "J_mobile":
                    me._showTab(false);
                    break;
                case "J_free":
                    me._setBoxEdit(true);
                    break;
                case "J_pay":
                    me._setBoxEdit(false);
                    break;
                default :
                    break;
            }

            //文本框下拉框交互
            var list = domUtils.getElementsByTagName(document, "input");
            for (var i = 0, node; node = list[i++];) {
                if (/J_name|J_downloadlink/.test(node.id))  continue;

                if (utils.trim(node.value) == "") {
                    node.style.borderColor = "";
                    node.style.color = ""
                } else {
                    node.style.borderColor = "";
                }
            }
            if (/input/i.test(tgt.tagName)) {
                if (tgt.id == "J_money" && G("J_free").checked) {

                } else {
                    tgt.style.color = "#333";
                    tgt.style.borderColor = "#77d068";
                }
            }

            if (/select/i.test(tgt.tagName)) {
                tgt.style.color = "#333";
            }

        });

        me._sTxtBoxHandler("J_name", "例:百度拼音输入法");
        me._sTxtBoxHandler("J_downloadlink", "http://");
        me._priceHandler();
    },

    _sTxtBoxHandler: function (id, value) {
        domUtils.on(G(id), ["focus", "blur"], function (e) {
            var tgt = e.target || e.srcElement;
            if (e.type == "focus") {
                if (tgt.value == value) {
                    tgt.value = "";
                }
            } else {
                if (utils.trim(tgt.value) == "") {
                    tgt.value = value;
                    tgt.style.color = "";
                    tgt.style.borderColor = "";
                } else {
                    tgt.style.borderColor = "";
                }
            }
        });
    },
    _priceHandler: function () {
        domUtils.on(G("J_money"), ["keyup", "afterpaste"], function () {
            if (G("J_free").checked) return;
            if (isNaN(this.value)){
                this.value="";
            }
        });
    },

    _showTab: function (isTab0, cur) {
        var list = domUtils.getElementsByTagName(document, "div", "tab");
        if (isTab0) {
            domUtils.addClass(list[0], "cur");
            domUtils.removeClasses(list[1], "cur");
            Template.tabIndex = 0;
        } else {
            domUtils.addClass(list[1], "cur");
            domUtils.removeClasses(list[0], "cur");
            Template.tabIndex = 1;
        }
        cur && (cur.checked = isTab0);

        graphictemplate.iframeAutoHeight(frameElement);
    },
    _setBoxEdit: function (isEdit, cur) {
        var money = G("J_money");
        money.readOnly = isEdit;
        money.style.cursor = isEdit ? "not-allowed" : "default";
        cur && (cur.checked = isEdit);
    },
    _innerTxt: function (node) {
        return   node.innerText || node.textContent || node.nodeValue;
    },
    _formatSetData: function (data, id, value) {
        if (data[id] == "") {
            G(id).value = value;
        }
    },
    _setTextBox: function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            G(id).value = data[id];
        }

        var me = this;
        me._formatSetData(data, "J_name", "例:百度拼音输入法")
        me._formatSetData(data, "J_downloadlink", "http://")
    },
    _setCheckBox: function (data, containerId) {
        var list = domUtils.getElementsByTagName(G(containerId), "span");
        for (var i = 0, node; node = list[i++];) {
            if (data[node.id]) {
                domUtils.addClass(node, "active");
            }
        }
    },
    _setRadioValue: function (data, list) {
        var me = this;
        for (var i = 0, obj; obj = list[i++];) {
            var cur = G(obj.id1);
            var standardTxt = domUtils.getNextDomNode(cur, function (node) {
                return node.nodeType == 3 && !domUtils.isFillChar(node)
            });
            if (me._innerTxt(standardTxt) == data[obj.id1]) {
                obj.callBack(true, cur);
            } else {
                G(obj.id2).checked = true;
                obj.callBack(false, cur);
            }
        }
    },
    _setDrawdownBox: function (data, list) {
        for (var i = 0, id; id = list[i++];) {
            var cur = G(id);
            for (var j = 0, opt; opt = cur.options[j++];) {
                if (opt.value == data[id]) {
                    cur.selectedIndex = j - 1;
                }
            }
        }
    },
    setPageData: function (data) {
        var me = this;
        //设置文本框值
        me._setTextBox(data, ["J_name", "J_size", "J_version",
            "J_mobileLang", "J_money", "J_systemNeed", "J_downloadlink"]);
        //设置复选框值
        me._setCheckBox(data, "J_systemask");
        //设置单选框值
        me._setRadioValue(data, [
            {
                id1: "J_free",
                id2: "J_pay",
                callBack: me._setBoxEdit
            },
            {
                id1: "J_pc",
                id2: "J_mobile",
                callBack: me._showTab
            }
        ]);
        //设置下拉框值
        me._setDrawdownBox(data, ["J_pcType", "J_mobileType", "J_pcLang"]);
    },

    _setHasEmpty: function (arr) {
        var str = /true/g.test(arr.join('')).toString();
        frameElement.setAttribute("hasempty", str);
    },
    _saveTextBox: function (data, list) {
        var me = this;
        var arr = [], txt, res, id;

        var optional = "J_version";//选填

        for (var i = 0, tmp; tmp = list[i++];) {
            if (utils.isString(tmp)) {
                data[tmp] = G(tmp).value;
            } else {
                id = tmp['id'];
                txt = G(id).value;
                data[id] = txt;

                //判断当前tab下是否为空
                var index = tmp["tabIndex"];
                if (index == me.tabIndex || index === undefined) {
                    if (id == "J_money" && G('J_free').checked)    continue;

                    if (optional.indexOf(id) == -1) {
                        res = !txt.replace(/'[ \t\r\n]*'/g, "").length;
                        arr.push(res);
                    }
                }
            }
        }

        me._setHasEmpty(arr);

        //必填
        me._formatSaveData(data, "J_name", "例:百度拼音输入法", true);
        //非必填
        me._formatSaveData(data, "J_downloadlink", "http://");
    },
    _formatSaveData: function (data, id, value, isRequire) {
        if (data[id] == value) {
            data[id] = "";
            if (isRequire) {
                frameElement.setAttribute("hasempty", "true");
            }
        }
    },
    _saveCheckBox: function (data, list) {
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
    _saveRadioValue: function (data, list) {
        var me = this;
        var cur, txt;
        for (var i = 0, id; id = list[i++];) {
            cur = G(id);
            txt = "";
            if (cur.checked) {
                var tmp = domUtils.getNextDomNode(cur, function (node) {
                    return node.nodeType == 3 && !domUtils.isFillChar(node)
                });
                txt = me._innerTxt(tmp);
            }
            data[id] = txt;
        }
    },
    savePageData: function (data) {
        var me = this;

        //文本框保存值
        me._saveTextBox(data, [
            {id: "J_name", "tabIndex": 0},
            {id: "J_size"},
            {id: "J_version"},
            {id: "J_mobileLang", "tabIndex": 1},
            {id: "J_systemNeed"},
            {id: "J_money", 'tabIndex': 1},
            {id: "J_downloadlink"},
            "J_pcLang",
            "J_pcType",
            "J_mobileType"
        ]);

        //复选狂保存值
        me._saveCheckBox(data, ["J_ios", "J_android", "J_winphone"]);

        //保存单选框值
        me._saveRadioValue(data, ["J_pc", "J_mobile", "J_free", "J_pay"]);
    }
};
