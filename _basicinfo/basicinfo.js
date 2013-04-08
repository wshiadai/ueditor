/**
 * Created with JetBrains PhpStorm.
 * User: 恒
 * Date: 13-4-8
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
(function () {
    var iframe=window.parent.frameElement;

    var parent = window.parent.parent;
    UE = parent.UE;

    editor=UE.instants['ueditorInstant'+iframe.id.replace("baidu_editor_","")];
    domUtils = UE.dom.domUtils;

    utils = UE.utils;

    browser = UE.browser;

    ajax = UE.ajax;

    $G = function (id) {
        return document.getElementById(id)
    };
    //focus元素
    $focus = function (node) {
        setTimeout(function () {
            if (browser.ie) {
                var r = node.createTextRange();
                r.collapse(false);
                r.select();
            } else {
                node.focus()
            }
        }, 0)
    };
    utils.loadFile(document, {
        href:editor.options.themePath + editor.options.theme + "/dialogbase.css?cache=" + Math.random(),
        tag:"link",
        type:"text/css",
        rel:"stylesheet"
    });
})();

