/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
GraphicTemplate = {
    tid: 0,
    template: {
        title: ' <div class="title">美食食材</div>',
        section: '<div class="section">' +
            '<div class="subtitle">$$</div>' +
            '<div class="content">%%</div>' +
            '</div>',
        module: function () {
            return '<div class="module" id="' + (GraphicTemplate.tid++) + '">' +
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
            tpl = me.template;

        var mainNum = data ? data["main"].length : 4;
        var subNum = data ? data["other"].length : 4;

        arr.push(tpl.title);
        arr.push(tpl.section.replace("$$", "主料").replace("%%", me._addModule(mainNum)));
        arr.push(tpl.foot);
        arr.push(tpl.section.replace("$$", "辅料").replace("%%", me._addModule(subNum)));
        arr.push(tpl.foot);

        G("J_main").innerHTML = arr.join('');
        //默认为true、不需要检查数据
        frameElement.setAttribute("hasempty","true");
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
    },
    _addSection: function (tgt) {
        var me = this,
            tmpDiv = document.createElement("div");

        var content = domUtils.getElementsByTagName(tgt.parentNode.previousSibling, "div", "content")[0];
        var sum = domUtils.getElementsByTagName(content, "div", "module").length;

        var len = sum % 2 ? 1 : 2;
        for (var i = 0; i < len; i++) {
            tmpDiv.innerHTML = me.template.module();
            content.appendChild(tmpDiv.children[0]);
        }

        iframeAutoHeight();
    },
    _addModule: function (num) {
        var me = this, str = "";
        for (var i = 0; i < num; i++) {
            str += me.template.module();
        }
        return str;
    },
    _deleteModule: function (tgt) {
        var node = tgt.parentNode;
        var content = node.parentNode;
        var list = domUtils.getElementsByTagName(content, "div", "module");
        if (list.length > 1) {
            content.removeChild(node);
        }
    },

    setPageData: function (data) {
        if (data) {
            var list = domUtils.getElementsByTagName(document, "div", "content");

            for (var i = 0, len = list.length; i < len; i++) {
                var arr = i == 0 ? data["main"] : data["other"];
                var modules = domUtils.getElementsByTagName(list[i], "div", "module");
                for (var j = 0, node; node = modules[j++];) {
                    node.children[0].value = arr[j - 1].name;
                    node.children[1].value = arr[j - 1].content;
                }
            }
        }
    },
    savePageData: function () {
        editor["graphictemplate"][frameElement.id] = {};
        var data = editor["graphictemplate"][frameElement.id];
        data["main"] = [];
        data["other"] = [];

        var list = domUtils.getElementsByTagName(document, "div", "content");
        for (var i = 0, len = list.length; i < len; i++) {
            var key = i == 0 ? "main" : "other";
            var modules = domUtils.getElementsByTagName(list[i], "div", "module");
            for (var j = 0, node; node = modules[j++];) {
                var obj = {};
                obj.name = node.children[0].value;
                obj.content = node.children[1].value;
                data[key].push(obj);
            }
        }
    }
};
