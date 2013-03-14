/**
 * 开发版本的文件导入
 */
(function (){
    var paths  = [
            'editor.js',
            'core/browser.js',
            'core/utils.js',
            'core/EventBase.js',
            'core/dtd.js',
            'core/domUtils.js',
            'core/Range.js',
            'core/Selection.js',
            'core/Editor.js',
            'core/ajax.js',
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'plugins/autotypeset.js',
            'plugins/image.js',
            'plugins/selectall.js',
            'plugins/wordcount.js',
            'plugins/undo.js',
            'plugins/paste.js',           //粘贴时候的提示依赖了UI
            'plugins/list.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/fiximgclick.js',
            'plugins/autoheight.js',
            'plugins/autofloat.js',  //依赖UEditor UI,在IE6中，会覆盖掉body的背景图属性
            'plugins/serialize.js',
            'plugins/video.js',
            'plugins/basestyle.js',
            'plugins/heading.js',
            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'ui/stateful.js',
            'ui/button.js',
            'ui/splitbutton.js',
            'ui/toolbar.js',
            'ui/menu.js',
            'ui/combox.js',
            'ui/dialog.js',
            'ui/menubutton.js',
            'ui/editorui.js',
            'ui/editor.js',
            'ui/multiMenu.js'
        ],
        baseURL = '../_src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
