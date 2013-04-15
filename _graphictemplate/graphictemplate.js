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

    editor = UE.instants['ueditorInstant' + parent.frameElement.id.replace("baidu_editor_", "")];

    domUtils = UE.dom.domUtils;

    utils = UE.utils;

    browser = UE.browser;

    ajax = UE.ajax;


    utils.loadFile(document, {
        href:editor.options.themePath + editor.options.theme + "/dialogbase.css?cache=" + Math.random(),
        tag:"link",
        type:"text/css",
        rel:"stylesheet"
    });

    G = function (id) {
        return document.getElementById(id)
    };

    /*
     * 移动图文模板
     * */
    moveTemplate = function (id) {
        var isSelect = false;
        domUtils.on(document, "click", function (e) {
            var tgt = e.target || e.srcElement;
            if (tgt.id == id) {
                var rng = editor.selection.getRange();
                rng.setStart(frameElement, 0);
                rng.setEnd(frameElement, 1);
                rng.select(true);
                isSelect = true;
            }
        });
        editor.addListener("click", function () {
            if (isSelect && frameElement) {
                var rng = editor.selection.getRange();
                rng.insertNode(frameElement);
            }
        });
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
        editor.fireEvent("contentchange");
    };
})();

