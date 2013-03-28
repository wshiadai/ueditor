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
            'core/filterword.js',
            'core/node.js',
            'core/htmlparser.js',
            'core/filternode.js',
            'plugins/defaultfilter.js',
            'plugins/inserthtml.js',
            'plugins/_autotypeset.js',
            'plugins/_image.js',
            'plugins/_link.js',
            'plugins/selectall.js',
            'plugins/wordcount.js',
            'plugins/undo.js',
            'plugins/paste.js',           //粘贴时候的提示依赖了UI
            'plugins/list.js',
            'plugins/enterkey.js',
            'plugins/keystrokes.js',
            'plugins/fiximgclick.js',
            'plugins/autolink.js',
            'plugins/_autoheight.js',
            'plugins/puretxtpaste.js',
            'plugins/video.js',
            'ui/ui.js',
            'ui/uiutils.js',
            'ui/uibase.js',
            'ui/separator.js',
            'ui/mask.js',
            'ui/popup.js',
            'ui/stateful.js',
            'ui/_button.js',
            'ui/_linkPicker.js',
            'ui/_toolbar.js',
            'ui/dialog.js',
            'ui/_editorui.js',
            'ui/editor.js'
        ],
        baseURL = '../_src/';
    for (var i=0,pi;pi = paths[i++];) {
        document.write('<script type="text/javascript" src="'+ baseURL + pi +'"></script>');
    }
})();
