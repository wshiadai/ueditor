/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-8
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
(function () {
    var parent = window.parent;

    UE = parent.parent.UE;

    //ie9和ie10下会加载2次，第一次报错，第二次正常
    if (UE) {
        editor = UE.instants['ueditorInstant' + parent.frameElement.id.replace("ueditor_", "")];

        domUtils = UE.dom.domUtils;

        utils = UE.utils;

        browser = UE.browser;

        ajax = UE.ajax;

        utils.loadFile(document, {
            href: editor.options.themePath + editor.options.theme + "/dialogbase.css?cache=" + Math.random(),
            tag: "link",
            type: "text/css",
            rel: "stylesheet"
        });

        G = function (id) {
            return document.getElementById(id)
        };

        /*
         * iframe自动长高
         * */
        iframeAutoHeight = function () {
            if (browser.ie && browser.version < 8) {
                frameElement.height = frameElement.Document.body.scrollHeight
            } else {
                frameElement.height = frameElement.contentDocument.body.scrollHeight;
            }
            editor.fireEvent("autoHeight");
        };
        /*
         * 页面数据加载
         * */
        domUtils.on(window, 'load', function () {
            var tpl = GraphicTemplate;
            var data = editor["graphictemplate"][frameElement.id];

            tpl.initPage && tpl.initPage(data);
            tpl.addPageListener();
            tpl.setPageData(data);
            tpl.savePageData();
            editor.moveTemplate("J_drag", document, frameElement);
            iframeAutoHeight();
        });
        /*
         * 页面数据保存
         * */
        domUtils.on(browser.ie ? frameElement : window, "blur", function () {
            GraphicTemplate.savePageData();
        });
    }
})();