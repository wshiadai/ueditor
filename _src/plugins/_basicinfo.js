UE.plugins['basicinfo'] = function () {
    var me = this;
    UE.plugins['basicinfo'].id = 0;

    me.commands['basicinfo'] = {
        execCommand:function (cmd) {
            UE.plugins['basicinfo'].id += 1;

            var ifr = "<iframe  width='300' height='300' unselectable='on' class='foodinfo' align='center' scroling='no' frameborder='0'" +
                "id='" + UE.plugins['basicinfo'].id  + "'" +
                "src=" + me.options["basicinfoUrl"].food +
                "></iframe>";

            me.execCommand("inserthtml", "<p style='text-align: center;'>" + ifr + "</p>");
        },
        queryCommandState:function () {
        }
    }
};
