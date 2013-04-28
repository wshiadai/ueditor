/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
Template = {
    tid: 0,
    moduleNum: 0,
    main: {
        title: ' <div class="title">美食食材</div>',
        section: '<div class="section">' +
            '<div class="subtitle">$$</div>' +
            '<div class="content">%%</div>' +
            '</div>',
        module: function () {
            return '<div class="module" id="' + (Template.tid++) + '">' +
                '<input type="text" class="name" maxlength="8" value="输入食材名称" />' +
                '<input type="text" class="num"  maxlength="6" value="份量" />' +
                '<a class="delete"></a>' +
                ' </div>'
        },
        foot: '<div class="foot">' +
            '<a class="add">+ 添加食材</a>' +
            '</div>'
    },
    initPage: function (data) {
        var me = this,
            arr = [],
            tpl = me.main;

        var mainNum = data ? data["main"].length : 4;
        var subNum = data ? data["other"].length : 4;

        arr.push(tpl.title);
        arr.push(tpl.section.replace("$$", "主料").replace("%%", me._addModule(mainNum)));
        arr.push(tpl.foot);
        arr.push(tpl.section.replace("$$", "辅料").replace("%%", me._addModule(subNum)));
        arr.push(tpl.foot);

        G("J_content").innerHTML = arr.join('');
    },
    addPageListener: function () {
        var me = this;
        domUtils.on(document, "click", function (e) {
            var tgt = e.target || e.srcElement;
            //添加食材处理函数
            if (domUtils.hasClass(tgt, "add")) {
                me._addSection(tgt);
            } else if (domUtils.hasClass(tgt, "delete")) {
                me._deleteModule(tgt);
            }

        });

        me._addFocusHandler(G("J_content"))
    },
    _addFocusHandler: function (container) {
        var list = domUtils.getElementsByTagName(container, "input");
        for (var i = 0, node; node = list[i++];) {
            domUtils.on(node, "focus", function (e) {
                var tgt = e.target || e.srcElement;

                //focus时文本框交互
                var list = domUtils.getElementsByTagName(document, "div", "module");
                for (var i = 0, node; node = list[i++];) {
                    domUtils.removeClasses(node, ["focus"]);
                }
                var cur = domUtils.findParent(tgt, function (node) {
                    return domUtils.hasClass(node, "module");
                });
                domUtils.addClass(cur, "focus");

                //第一次删除文字、此后不删除
                if (tgt.tagName.toLowerCase() == "input" && !domUtils.hasClass(tgt, "hasClick")) {
                    domUtils.addClass(tgt, "hasClick");
                    tgt.value = "";
                }
            });
        }

    },
    _addSection: function (tgt) {
        var me = this,
            tmpDiv = document.createElement("div");

        var content = domUtils.getElementsByTagName(tgt.parentNode.previousSibling, "div", "content")[0];
        var sum = domUtils.getElementsByTagName(content, "div", "module").length;

        var len = sum % 2 ? 1 : 2;
        for (var i = 0; i < len; i++) {
            tmpDiv.innerHTML = me.main.module();
            me._addFocusHandler(tmpDiv);

            content.appendChild(tmpDiv.children[0]);
        }

        me.moduleNum += len;
        graphictemplate.iframeAutoHeight(frameElement)
    },
    _addModule: function (num) {
        var me = this, str = "";
        for (var i = 0; i < num; i++) {
            str += me.main.module();
        }
        me.moduleNum += num;
        return str;
    },
    _deleteModule: function (tgt) {
        var me = this;
        var node = tgt.parentNode;
        var content = node.parentNode;
        var list = domUtils.getElementsByTagName(content, "div", "module");
        if (list.length > 1) {
            me.moduleNum -= 1;
            content.removeChild(node);
        }
        graphictemplate.iframeAutoHeight(frameElement);
    },
    _setHasEmpty: function (arr, sum) {
        var me = this;
        var str = /true/g.test(arr.join('')).toString();
        if (sum / 2 == me.moduleNum || str == "true") {
            frameElement.setAttribute("hasempty", "true");
        } else {
            frameElement.setAttribute("hasempty", "false");
        }
    },
    setPageData: function (data) {
        var list = domUtils.getElementsByTagName(document, "div", "content");

        for (var i = 0, len = list.length; i < len; i++) {
            var arr = i == 0 ? data["main"] : data["other"];
            var modules = domUtils.getElementsByTagName(list[i], "div", "module");
            for (var j = 0, node; node = modules[j++];) {
                var name = arr[j - 1].name;
                var content = arr[j - 1].content;

                node.children[0].value = name == "" ? "输入食材名称" : name;
                node.children[1].value = content == "" ? "份量" : content;
            }
        }
    },
    savePageData: function (data) {
        data["main"] = [];
        data["other"] = [];
        var arr = [];
        var sum = 0;

        var list = domUtils.getElementsByTagName(document, "div", "content");
        for (var i = 0, len = list.length; i < len; i++) {
            var key = i == 0 ? "main" : "other";
            var modules = domUtils.getElementsByTagName(list[i], "div", "module");
            for (var j = 0, node; node = modules[j++];) {
                var obj = {};
                obj.name = node.children[0].value;
                obj.content = node.children[1].value;

                //数据验证
                if ((obj.name == "输入食材名称" && obj.content != "份量")
                    || (obj.name != "输入食材名称" && obj.content == "份量")) {
                    arr.push(true);
                } else {
                    arr.push(false);
                }

                //存储替换数据
                if (obj.name == "输入食材名称" || obj.name == "") {
                    obj.name = "";
                    sum += 1;
                }
                if (obj.content == "份量" || obj.content == "") {
                    obj.content = "";
                    sum += 1;
                }
                data[key].push(obj);
            }
        }
        //全部都为空或有一个模块中的一个为空时设置为true
        this._setHasEmpty(arr, sum);
    }
};
