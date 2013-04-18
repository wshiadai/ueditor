UE.plugins['graphictemplate'] = function () {
    var me = this;
    var id = 0;
    me["graphictemplate"] = {};

    me.commands['graphictemplate'] = {
        execCommand:function (cmd, value) {
            id += 1;
            var ifr = "<iframe  width='678'  align='center' scroling='no' frameborder='0'  class='graphictemplate' " +
                "id='graphictemplate-" + id + "'" +
                "src=" + me.options["graphictemplateUrlMap"][value] +
                "></iframe>";

            me.execCommand("inserthtml", ifr);
        }
    };

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('iframe'), function (node) {
            var val = node.getAttr('class');
            if (val && /graphictemplate/.test(val)) {
                var id = node.getAttr('id');
                var str = stringify(me['graphictemplate'][id]);
                node.tagName = 'pre';
                var attrs = {
                    'class':node.getAttr('class'),
                    'id':id,
                    'src':node.getAttr('src')
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
            if ((val = pi.getAttr('class')) && /graphictemplate/.test(val)) {
                var tmpDiv = me.document.createElement('div');

                tmpDiv.innerHTML = "<iframe  width='678'  align='center' scroling='no' frameborder='0' class='graphictemplate' " +
                    "id='" + pi.getAttr("id") + "'" +
                    "src=" + pi.getAttr("src") +
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
            return domUtils.hasClass(node, "graphictemplate");
        });

        utils.each(list, function (node) {
            var tmp = node.getAttribute("height");
            if (tmp) {
                heightStorage.push(tmp);
            }
            node.removeAttribute("height");
        });
    });
    me.addListener("aftergetscene", function () {
        if (heightStorage.length) {
            var list = domUtils.getElementsByTagName(me.body, "iframe", function (node) {
                return domUtils.hasClass(node, "graphictemplate");
            });
            utils.each(list, function (node, i) {
                node.setAttribute("height", heightStorage[i]);
            });
        }
    });

    var stringify = (function () {
        /**
         * 字符串处理时需要转义的字符表
         * @private
         */
        var escapeMap = {
            "\b":'\\b',
            "\t":'\\t',
            "\n":'\\n',
            "\f":'\\f',
            "\r":'\\r',
            '"':'\\"',
            "\\":'\\\\'
        };

        /**
         * 字符串序列化
         * @private
         */
        function encodeString(source) {
            if (/["\\\x00-\x1f]/.test(source)) {
                source = source.replace(
                    /["\\\x00-\x1f]/g,
                    function (match) {
                        var c = escapeMap[match];
                        if (c) {
                            return c;
                        }
                        c = match.charCodeAt();
                        return "\\u00"
                            + Math.floor(c / 16).toString(16)
                            + (c % 16).toString(16);
                    });
            }
            return '"' + source + '"';
        }

        /**
         * 数组序列化
         * @private
         */
        function encodeArray(source) {
            var result = ["["],
                l = source.length,
                preComma, i, item;

            for (i = 0; i < l; i++) {
                item = source[i];

                switch (typeof item) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (preComma) {
                            result.push(',');
                        }
                        result.push(baidu.json.stringify(item));
                        preComma = 1;
                }
            }
            result.push("]");
            return result.join("");
        }

        /**
         * 处理日期序列化时的补零
         * @private
         */
        function pad(source) {
            return source < 10 ? '0' + source : source;
        }

        /**
         * 日期序列化
         * @private
         */
        function encodeDate(source) {
            return '"' + source.getFullYear() + "-"
                + pad(source.getMonth() + 1) + "-"
                + pad(source.getDate()) + "T"
                + pad(source.getHours()) + ":"
                + pad(source.getMinutes()) + ":"
                + pad(source.getSeconds()) + '"';
        }

        return function (value) {
            switch (typeof value) {
                case 'undefined':
                    return 'undefined';

                case 'number':
                    return isFinite(value) ? String(value) : "null";

                case 'string':
                    return encodeString(value);

                case 'boolean':
                    return String(value);

                default:
                    if (value === null) {
                        return 'null';
                    } else if (value instanceof Array) {
                        return encodeArray(value);
                    } else if (value instanceof Date) {
                        return encodeDate(value);
                    } else {
                        var result = ['{'],
                            encode = stringify,
                            preComma,
                            item;

                        for (var key in value) {
                            if (Object.prototype.hasOwnProperty.call(value, key)) {
                                item = value[key];
                                switch (typeof item) {
                                    case 'undefined':
                                    case 'unknown':
                                    case 'function':
                                        break;
                                    default:
                                        if (preComma) {
                                            result.push(',');
                                        }
                                        preComma = 1;
                                        result.push(encode(key) + ':' + encode(item));
                                }
                            }
                        }
                        result.push('}');
                        return result.join('');
                    }
            }
        };
    })();
};
