/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-9
 * Time: 下午2:57
 * To change this template use File | Settings | File Templates.
 */
function Fitment() {
    var me = this;
    me.tid = 0;
}
(function () {
    Fitment.prototype = {
        initPageByData:function () {
            var me = this,
                data = editor["graphictemplate"][frameElement.id];

            me._addPageListener();
            me.setPageData(data);
            movetemplate("J_drag");
            iframeAutoHeight();
        },
        _addPageListener:function () {
            var decorative = $G("J_decorative");
            domUtils.on(decorative, "click", function (e) {
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
        _getActiveTxtById:function(id){
            var node=$G(id);
            if(domUtils.hasClass(node,"active")){
                return node.innerText||node.textContent||node.nodeValue;
            }else{
                return "";
            }
        },
        setPageData:function (data) {
            if (data) {
                $G("J_shi").value=data["J_shi"];
                $G("J_ting").value=data["J_ting"];
                $G("J_wei").value=data["J_wei"] ;
                $G("J_meter").value=data["J_meter"];
                $G("J_wan").value=data["J_wan"] ;
                $G("J_quanbao").value=data["J_quanbao"];
                $G("J_hunfang").value=data["J_hunfang"];
                $G("J_other").value= data["J_other"];

                var list=domUtils.getElementsByTagName($G("J_decorative"),"span");
                for(var i= 0,node;node=list[i++];){
                    if(data[node.id]){
                        domUtils.addClass(node,"active");
                    }
                }
            }
        },
        savePageData:function () {
            var me=this;
            editor["graphictemplate"][frameElement.id] = {};
            var data = editor["graphictemplate"][frameElement.id];
            data["J_shi"] = $G("J_shi").value;
            data["J_ting"] = $G("J_ting").value;
            data["J_wei"] = $G("J_wei").value;
            data["J_meter"] = $G("J_meter").value;
            data["J_wan"] = $G("J_wan").value;
            data["J_quanbao"] = $G("J_quanbao").value;
            data["J_hunfang"] = $G("J_hunfang").value;
            data["J_other"] = $G("J_other").value;

            data["J_jianyue"] =me._getActiveTxtById("J_jianyue");
            data["J_xiandai"] = me._getActiveTxtById("J_xiandai");
            data["J_tianyuan"] = me._getActiveTxtById("J_tianyuan");
            data["J_zhongshi"] = me._getActiveTxtById("J_zhongshi");
            data["J_hunda"] = me._getActiveTxtById("J_hunda");
            data["J_oushi"] = me._getActiveTxtById("J_oushi");
            data["J_dizhonghai"] = me._getActiveTxtById("J_dizhonghai");
        }
    };
})();
