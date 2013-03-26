///import core
///import plugins\inserthtml.js
///import plugins\catchremoteimage.js
///commands 插入图片，操作图片的对齐方式
///commandsName  InsertImage,ImageNone,ImageLeft,ImageRight,ImageCenter
///commandsTitle  图片,默认,居左,居右,居中
///commandsDialog  dialogs\image\image.html
/**
 * Created by .
 * User: zhanyi
 * for image
 */
UE.plugins['image'] = function(){
    var flag = true,
        options = this.options;

    UE.commands['insertimage'] = {
        execCommand : function (cmd, opt){
            var me  = this;
            if(!opt.src) return;
            var str;
            str = '<p><img '+(opt.id?' id="'+opt.id+'"':'') + ' src="'+opt.src+'" '+ (opt.data_ue_src ? ' data_ue_src="' + opt.data_ue_src +'" ':'') +
                (opt.width ? 'width="'+opt.width+'" ':'') +
                (opt.height ? ' height="'+opt.height+'" ':'') +
                (opt.alt?' alt="'+opt.alt+'"':'') +'/></p>';
            me.execCommand('inserthtml',str);

            if (flag) {
                me.setHeight(options.initialFrameHeight + options.heightIncrement);
                flag = false;
            }
        },
        queryCommandState:function(){
            var images = this.document.getElementsByTagName("img");
            return images.length > options.maxImagesCount-1 ?-1:0;
        }
    };
};
