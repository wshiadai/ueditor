UE.plugins['graphictemplate'] = function () {
    var me = this;
    var id = 0;

    me["graphictemplate"] = {};
    var tpl= me["graphictemplate"];

    me.commands['graphictemplate'] = {
        execCommand: function (cmd, value) {
            id=parseInt(id);
            id += 1;
            var ifr = "<iframe  width='678'  align='center' scroling='no' frameborder='0'  " +
                "class=" + value + "-template " +
                "id='graphictemplate-" + id + "'" +
                "src=" + me.options["graphictemplateUrlMap"][value] +
                "></iframe>";

            me.execCommand("inserthtml",'<p contenteditable="false">'+ifr+'</p>');
        },
        queryCommandState: function () {
            var rng = this.selection.getRange().cloneRange();
            if (rng.collapsed && rng.startContainer.nodeType == 3) {
                rng.trimBoundary()
            }
            var rs = domUtils.findTagNamesInSelection(rng, ['li', 'img', 'iframe', 'sup', 'td', 'th', 'caption', 'em', 'i', 'strong', 'b']);
            if (rs) {
                return -1;
            }
            return 0;
        }
    };
//    me.commands['insertfood'] = {
//        queryCommandState: function () {
//
//        }
//    };


    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('iframe'), function (node) {
            var val = node.getAttr('class');
            if (val && /-template/.test(val)) {
                var id = node.getAttr('id');
                var str = utils.stringify(me['graphictemplate'][id]);
                node.tagName = 'pre';
                var attrs = {
                    'class': node.getAttr('class'),
                    'hasempty': node.getAttr('hasempty'),
                    'id': id
                };
                node.setAttr();
                node.setAttr(attrs);
                node.children = [];
                node.appendChild(UE.uNode.createText(str))
            }
        })
    });
    me.addInputRule(function (root) {
        var me = this;
        utils.each(root.getNodesByTagName('pre'), function (pi) {
            var val;
            if ((val = pi.getAttr('class')) && /-template/.test(val)) {
                var tmpDiv = me.document.createElement('div');
                id = pi.getAttr("id").replace("graphictemplate-","");
                me.graphictemplate[id] = (new Function("return (" + pi.innerHTML() + ")"))();
                tmpDiv.innerHTML = "<iframe  width='678'  align='center' scroling='no' frameborder='0'" +
                    "class='" + val + "'" +
                    "id='graphictemplate-" + id + "'" +
                    "src=" + me.options.graphictemplateUrlMap[val.replace("-template", "")] +
                    "></iframe>";

                var node = UE.uNode.createElement(tmpDiv.innerHTML);
                pi.parentNode.replaceChild(node, pi);

            }
        });
    });


    //缓存所有iframe高度，阻止undo属性改变时重复保存
    var heightStorage = [];
    me.addListener("beforegetscene", function () {
        heightStorage = [];
        var list = domUtils.getElementsByTagName(me.body, "iframe", function (node) {
            return domUtils.hasClass(node, "-template");
        });
        utils.each(list, function (node) {
            var tmp = node.getAttribute("height");
            heightStorage.push(tmp);
            node.removeAttribute("height");
        });
    });
    me.addListener("aftergetscene", function () {
        if (heightStorage.length) {
            var list = domUtils.getElementsByTagName(me.body, "iframe", function (node) {
                return domUtils.hasClass(node, "-template");
            });
            utils.each(list, function (node, i) {
                node.setAttribute("height", heightStorage[i]);
            });
        }
    });


    //移动模板
    tpl.isSelect = false;
    tpl.currentTemplate=null;

    tpl.moveTemplate = function (dragId,win) {
        var doc=win.document;
        domUtils.on(doc, "click", function (e) {
            var tgt = e.target || e.srcElement;
            if (tgt.id == dragId) {
                doc.getElementById("J_mask").style.display="";
                me.graphictemplate.isSelect = true;
            }
            tpl.currentTemplate=win.frameElement;
        });
    };
    me.addListener("click", function () {
        var ifr= tpl.currentTemplate;
        if (me.graphictemplate.isSelect && ifr) {
            var rng = me.selection.getRange();
            var node = domUtils.findParentByTagName(rng.startContainer, "li");
            if (node) {
                me.body.style.cursor = "not-allowed";
            } else {
                me.execCommand("inserthtml",ifr.parentNode.outerHTML);
                domUtils.remove(ifr.parentNode);
            }
            tpl.isSelect = false;
        } else {
            me.body.style.cursor = "default";
        }
    });

};
