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
            href: "../graphictemplate.css?cache=" + Math.random(),
            tag: "link",
            type: "text/css",
            rel: "stylesheet"
        });

        G = function (id) {
            return document.getElementById(id)
        };

        graphictemplate = editor["graphictemplate"];

        /*
         * 页面数据加载
         * */
        domUtils.on(window, 'load', function () {
            var data = graphictemplate.dataList[frameElement.id];

            Template.initPage && Template.initPage(data);
            Template.addPageListener();
            data && Template.setPageData(data);

            if (!data) {
                graphictemplate.dataList[frameElement.id] = {};
                Template.savePageData(graphictemplate.dataList[frameElement.id]);
            }

            graphictemplate.templateAction(window);
            graphictemplate.iframeAutoHeight(frameElement)
        });

        /*
         * 页面数据保存
         * */
        domUtils.on(browser.ie ? frameElement : window, "blur", function () {
            var data = graphictemplate.dataList[frameElement.id] = {};

            Template.savePageData(data);
            //去掉选中状态
            G("J_mask").style.display = "none";
        });
    }
})();