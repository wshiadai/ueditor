UE.plugins['basicinfo'] = function () {
    var me = this;
    me["basicinfo"]={};
    var id = 0;


    me.commands['basicinfo'] = {
        execCommand:function (cmd) {
            id += 1;

            var ifr = "<iframe  width='600' height='210' unselectable='on' align='center' scroling='no' frameborder='0'" +
                "class='foodinfo'" +
                "data_type='basicinfo'"+
                "id='" + id + "'" +
                "src=" + me.options["basicinfoUrl"].food +
                "></iframe>";

            me.execCommand("inserthtml", "<p style='text-align: center;'>" + ifr + "</p>");

            var info=me.document.getElementById(id);
            domUtils.on(info, 'blur', function () {
                editor.fireEvent("getbasicinfo"+id);
            });
            info.onload=function () {
                me.fireEvent("setbasicinfo"+id);
            };
        },
        queryCommandState:function () {

        }
    };

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('iframe'), function (node) {
            var val;
            if ((val = node.getAttr('data_type')) && /basicinfo/.test(val)) {
                var id=node.getAttr('id');
                var str =me['basicinfo'][id];
                node.tagName = 'pre';
                var attrs = {
                    'data-type':val,
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
            if (val = pi.getAttr('data_type') && /basicinfo/.test(val)) {
                var tmpDiv = me.document.createElement('div');
                var data = (new Function('return' + pi.innerHTML()))();

                tmpDiv.innerHTML = "<iframe  width='600' height='210' unselectable='on' align='center' scroling='no' frameborder='0'" +
                    "id='" + pi.getAttr("id") + "'" +
                    "src=" + pi.getAttr("src") +
                    "class='" + pi.getAttr("class") + "'" +
                    "data_type='" + val + "'" +
                    "></iframe>";

                var node = UE.uNode.createElement(tmpDiv.innerHTML);
                pi.parentNode.replaceChild(node, pi);

            }
        });
    });

    //销毁被删除iframe对应的数据
    me.addListener("contentchange",function(){

    });


};
