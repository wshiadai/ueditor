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
                var node = domUtils.findParentByTagName(rng.startContainer, "li");
                if (node) {
                    editor.body.style.cursor = "not-allowed";
                } else {
                    rng.insertNode(frameElement);
                }
                isSelect = false;
            } else {
                editor.body.style.cursor = "default";
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
        editor.fireEvent("autoHeight");
    };
    /*
     * 页面数据加载与保存
     * */
    domUtils.on(window, ['blur', 'load', 'focus'], function (e) {
        switch (e.type) {
            case 'load':
                var tpl = GraphicTemplate;
                var data = editor["graphictemplate"][frameElement.id];

                tpl.initPage && tpl.initPage(data);
                tpl.addPageListener();
                tpl.setPageData(data);
                tpl.savePageData();
                moveTemplate("J_drag");
                iframeAutoHeight();
                break;
            case 'focus':
                editor.body.contenteditable = "false";
                break;
            case 'blur':
                editor.body.contenteditable = "true";
                GraphicTemplate.savePageData();
                break;
            default :
                break;
        }
    });
})();

