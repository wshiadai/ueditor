UE.plugins['graphictemplate'] = function () {
    var me = this;
    me["graphictemplate"]={};
    var id = 0;


    me.commands['graphictemplate'] = {
        execCommand:function (cmd,value) {
            id += 1;
            var ifr = "<iframe  width='678'  unselectable='on' align='center' scroling='no' frameborder='0'" +
                "class='foodtemplate'" +
                "id='" + id + "'" +
                "src=" + me.options["graphictemplateUrlMap"][value] +
                "></iframe>";

            me.execCommand("inserthtml", ifr);
        },
        queryCommandState:function () {

        }
    };

    me.addOutputRule(function (root) {
        utils.each(root.getNodesByTagName('iframe'), function (node) {
            var val;
            if ((val = node.getAttr('class')) && /foodtemplate/.test(val)) {
                var id=node.getAttr('id');
                var str =me['graphictemplate'][id];
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
            if (val = pi.getAttr('class') && /foodtemplate/.test(val)) {
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

    //缓存所有iframe高度，阻止undo属性改变时重复保存
    var heightStorage=[];
    me.addListener("beforegetscene",function(){
        heightStorage=[];
        utils.each(domUtils.getElementsByTagName(me.body,"iframe","foodtemplate"),function(node){
            var tmp=node.getAttribute("height");
            if(tmp){
                heightStorage.push(tmp);
            }
            node.removeAttribute("height");
        });
    });
    me.addListener("aftergetscene",function(){
        if(heightStorage.length){
            utils.each(domUtils.getElementsByTagName(me.body,"iframe","foodtemplate"),function(node,i){
                node.setAttribute("height",heightStorage[i]);
            });
        }
    });
};
