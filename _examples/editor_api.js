/**
 * 开发版本的文件导入
 */
(function (){
    var paths  = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/_dtd.js',
            'core/_domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/_Editor.js',
            'core/ajax.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'plugins/_autotypeset.js',
            'plugins/image.js',
            'plugins/selectall.js',
            'plugins/wordcount.js',
            'plugins/undo.js',
            'plugins/paste.js',           //粘贴时候的提示依赖了UI
            'plugins/_list.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/fiximgclick.js',
            'plugins/_autoheight.js',
            'plugins/autofloat.js',  //依赖UEditor UI,在IE6中，会覆盖掉body的背景图属性
            'plugins/_puretxtpaste.js',
            'plugins/_video.js',
            'plugins/_basestyle.js',
            'plugins/_heading.js',
            'plugins/_graphictemplate.js',
            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'ui/stateful.js',
            'ui/button.js',
            'ui/_graphictemplatepicker.js',
            'ui/toolbar.js',
            'ui/dialog.js',
            'ui/_editorui.js',
            'ui/_editor.js'
        ],
        baseURL = '../_src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
