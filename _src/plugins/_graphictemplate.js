UE.plugins['graphictemplate'] = function () {
    var me = this;
    me["graphictemplate"] = {};

    var tpl = me["graphictemplate"];
    tpl.id = "graphictemplate-0";
    tpl.dataList = {};
    tpl.template = "<p contenteditable='false'><iframe  width='678' height='300' align='center' scroling='no' frameborder='0'  " +
        "class='%%' " +
        "id='##' " +
        "src='$$?q='" + Math.random() + ' ' +
        "></iframe></p>";


    me.commands['graphictemplate'] = {
        execCommand: function (cmd, value) {
            tpl.id = tpl.id.replace(/\d/g, function (id) {
                id = parseInt(id) + 1;
                return id;
            });

            var ifr = tpl.template.replace("%%", value + "-template")
                .replace("##", tpl.id)
                .replace('$$', me.options["graphictemplateUrlMap"][value]);

            me.execCommand("inserthtml", ifr);
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

    /*
     *转换数据
     */
    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('iframe'), function (node) {
            var val = node.getAttr('class');
            if (val && /-template/.test(val)) {
                var id = node.getAttr('id');
                var str = utils.stringify(me['graphictemplate'].dataList[id]);
                node.tagName = 'pre';
                var attrs = {
                    'class': node.getAttr('class'),
                    'hasempty': node.getAttr('hasempty'),
                    'id': id
                };
                node.setAttr();
                node.setAttr(attrs);
                node.children = [];
                node.appendChild(UE.uNode.createText(str));
                var parent = node.parentNode;
                parent.parentNode.replaceChild(node, parent);
            }
        })
    });
    me.addInputRule(function (root) {
        var me = this,
            tpl = me.graphictemplate;

        utils.each(root.getNodesByTagName('pre'), function (pi) {
            var val = pi.getAttr('class');
            if (val && /-template/.test(val)) {
                tpl.id = pi.getAttr("id");
                me.graphictemplate.dataList[tpl.id] = (new Function("return (" + pi.innerHTML() + ")"))();

                var html = tpl.template.replace("%%", val)
                    .replace("##", tpl.id)
                    .replace('$$', me.options.graphictemplateUrlMap[val.replace("-template", "")]);

                var node = UE.uNode.createElement(html);
                pi.parentNode.replaceChild(node, pi);

            }
        });
    });


    /*
     *缓存所有iframe改变属性，阻止undo属性改变时重复保存
     */
    var attrs = {
        heightStorage: [],
        hasemptyStorage: []
    };
    me.addListener("beforegetscene", function () {
        //清空
        attrs = {
            heightStorage: [],
            hasemptyStorage: []
        };

        var list = domUtils.getElementsByTagName(me.body, "iframe", function (node) {
            return domUtils.hasClass(node, "-template");
        });
        utils.each(list, function (node) {
            var tmp = node.getAttribute("height");
            attrs.heightStorage.push(tmp);
            tmp = node.getAttribute("hasempty");
            attrs.hasemptyStorage.push(tmp);

            node.setAttribute('height', 300);
            node.removeAttribute('hasempty');
        });
    });
    me.addListener("aftergetscene", function () {
        if (attrs.heightStorage.length) {
            var list = domUtils.getElementsByTagName(me.body, "iframe", function (node) {
                return domUtils.hasClass(node, "-template");
            });
            utils.each(list, function (node, i) {
                node.setAttribute("height", attrs.heightStorage [i]);
                node.setAttribute("hasempty", attrs.hasemptyStorage [i]);
            });
        }
    });


    /*
     *移动、关闭模板
     */
    tpl.isSelect = false;
    tpl.currentTemplate = null;
    tpl.templateAction = function (win) {
        var doc = win.document;
        domUtils.on(doc, "click", function (e) {
            var tgt = e.target || e.srcElement;
            tpl.currentTemplate = win.frameElement;

            switch (tgt.id) {
                case "J_drag":
                    //此处写死，减去浮层偏移和边框的宽度
                    doc.getElementById("J_mask").style.cssText = "height:" + (tpl.currentTemplate.height-27)
                        + "px;display:block;width:" + (tpl.currentTemplate.width-12) + "px";

                    me.graphictemplate.isSelect = true;
                    break;
                case "J_close":
                    domUtils.remove(tpl.currentTemplate.parentNode);
                    break;
            }

        });
    };
    me.addListener("click", function () {
        var ifr = tpl.currentTemplate;
        if (tpl.isSelect && ifr) {
            var rng = me.selection.getRange();
            var node = domUtils.findParentByTagName(rng.startContainer, "li");
            if (node) {
                me.body.style.cursor = "not-allowed";
            } else {
                me.execCommand("inserthtml", ifr.parentNode.outerHTML);
                domUtils.remove(ifr.parentNode);
            }
            tpl.isSelect = false;
        } else {
            me.body.style.cursor = "default";
        }
        autoClearData();
    });

    /*
     * iframe自动长高
     * */
    tpl.iframeAutoHeight = function (frameElement) {
        if (browser.ie && browser.version < 8) {
            frameElement.height = frameElement.Document.body.scrollHeight
        } else {
            frameElement.height = frameElement.contentDocument.body.scrollHeight;
        }
        me.fireEvent("autoHeight");
    };

    /*
     *click时自动清楚无效数据
     * */
    function autoClearData() {
        var dataList = tpl.dataList;
        var doc = me.document;
        for (var pro in dataList) {
            var node = doc.getElementById(pro);
            if (!node) {
                delete tpl.dataList[pro];
            }
        }
    }
};
