//var bk = require('base'),
//    baidu = require('ueditor');

//经验的标题

var ueditor = baidu.editor || {},
    domUtils = baidu.editor.dom.domUtils,
    utils = baidu.editor.utils,
    browser = baidu.editor.browser;

UE.plugins['heading'] = function () {
    var me = this;

    me.addListener('keydown', function (type, evt) {
        var keyCode = evt.keyCode || evt.which, h;
        if (keyCode == 13) {
            var range = me.selection.getRange();
            if (range.collapsed && (h = domUtils.findParentByTagName(range.startContainer, ['h2', 'h3'], true) ) ) {
                var p = me.document.createElement('p');
                p.innerHTML = baidu.editor.browser.ie ? '' : '<br/>';
                if(h.nextSibling){
                    h.parentNode.insertBefore(p, h.nextSibling);
                }else{
                    h.parentNode.appendChild(p);
                }
                range.setStart(p, 0).setCursor();
                evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
            }
        }
    });
    me.addListener('keyup', function (type, evt) {
        var keyCode = evt.keyCode || evt.which;
        if (keyCode == 13) {
            var range = me.selection.getRange(),
                start = domUtils.isFillChar(range.startContainer) ? range.startContainer.parentNode : range.startContainer,
                pre = start.previousSibling;
            if (pre && pre.nodeType == 1 && (pre.tagName == 'H2' || pre.tagName == 'H3' ) && domUtils.isEmptyNode(pre)) {
                domUtils.remove(pre)
            }
            evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false)
        }
    });
//    var tagMap = me.options.baike.headingTagMap||{'heading1':"h2"};
    var tagMap = {'heading1':"h2"};
//    var maxLength = me.options.headingMaxLength||100;
    var maxLength = 100;

    function showTextLimit(text) {
        text = text.replace(/(^\s*)|(\s*$)/g, '').replace(new RegExp(domUtils.fillChar, 'g'), '');
//        var isValidLen = baidu.string.getByteLength(text) <= maxLength;
//        if (!isValidLen && !bk.editor.cmdPreview) {
//            var dialog = Fe.Dialog.alert("目录最多" + maxLength + "个字节!", { title:"提示", locked:true});
//            return 0;
//        }
        return 1;
    }

//    bk.editor.showTextLimit = showTextLimit;

    UE.commands['heading1'] = UE.commands['heading2'] = {
        execCommand:function (cmd) {
            var tag = tagMap[cmd];
            var oldH2Dtd = baidu.editor.dom.dtd[tag],
                me = this;
            baidu.editor.dom.dtd[tag] = {'#':1, 'SPAN':1, 'span':1};
            var state = this.queryCommandState(cmd),
                range = this.selection.getRange(),
                bm = range.createBookmark(true),
                h2 = domUtils.findTagNamesInSelection(range, ['h2']),
                h3 = domUtils.findTagNamesInSelection(range, ['h3']);
            //verify length
            if (!range.collapsed) {
                var text = this.selection.getText();
                if (!showTextLimit(text)) {
                    return false;
                }

            }

            if (h2 && !(cmd == 'heading2' && state)) {
                remove(range, 'h2')
            }
            if (h3 && !(cmd == 'heading1' && state)) {

                remove(range, 'h3')
            }

            if (state) {
                range.select();
                return;
            }


            function remove(range, tag) {
                range.enlarge(true);
                var bookmark2 = range.createBookmark(true),
                    filterFn = function (node) {
                        return   node.nodeType == 1 && node.tagName.toLowerCase() == tag
                    },
                    current = domUtils.getNextDomNode(me.document.getElementById(bookmark2.start), false),
                    end = me.document.getElementById(bookmark2.end);


                while (current && !(domUtils.getPosition(current, end) & domUtils.POSITION_FOLLOWING)) {

                    if (current.nodeType == 1 && current.tagName.toLowerCase() == tag) {
                        var p = me.document.createElement('p');
                        while (current.firstChild) {
                            p.appendChild(current.firstChild)
                        }
                        current.parentNode.insertBefore(p, current);
                        domUtils.remove(current);
                        current = domUtils.getNextDomNode(p, false, filterFn);
                    } else {
                        current = domUtils.getNextDomNode(current, current.nodeType == 3 ? false : true, filterFn);
                    }


                }
                range.moveToBookmark(bookmark2);
                bookmark2 = null
                bm && range.moveToBookmark(bm);
                bm = null;
            }


            if (!range.collapsed) {
//                if (!bm) {
                    range.select();
//                }
                this.execCommand('removeformat');
                range = this.selection.getRange()

            }
            if (range.collapsed) {
                range.enlarge(true);
                var startElem = domUtils.findStartElement(range, function (e) {
                    return e.nodeName == 'P'
                })
//                var text = startElem[baidu.editor.browser.ie ? 'innerText' : 'textContent'];
//                if (!showTextLimit(text)) {
//                    return false;
//                }
            }
//            if(range.collapsed){
//                var fnode = me.document.createTextNode(domUtils.fillChar);
//                range.insertNode(fnode);
//                range.selectNode(fnode);
//            }
//            debugger
            range.applyInlineStyle(tag);


            bm && range.moveToBookmark(bm);


            var node = range.startContainer,
                collapsed = range.collapsed;
//            if (node.nodeType == 1 && domUtils.isEmptyNode(node) && !domUtils.isBody(node)) {
//                range.setStartAfter(node);
//                domUtils.remove(node)
//            }
//            if (!collapsed) {
//                node = range.endContainer;
//                if (node.nodeType == 1 && domUtils.isEmptyNode(node) && !domUtils.isBody(node)) {
//                    range.setEndBefore(node);
//                    domUtils.remove(node)
//                }
//            }


            range.collapse(false);


            bm = range.createBookmark(true);
            var hs = domUtils.getElementsByTagName(this.document, tag),
                start , end;
            start = me.document.getElementById(bm.start);
            if (bm.end) {
                end = me.document.getElementById(bm.end);
            }
            for (var i = 0, hi; hi = hs[i++];) {
                if (!domUtils.isBody(hi.parentNode) && hi.parentNode.tagName == 'P') {
                    //百科的特殊性不用判断
                    domUtils.breakParent(hi, hi.parentNode);
                    var pre = hi.previousSibling,
                        next = hi.nextSibling;
                    if (pre && domUtils.isEmptyBlock(pre)) {
                        if (!(start && start.parentNode === pre || end && end.parentNode === pre))
                            domUtils.remove(pre)
                    }
                    if( pre && /^[\xa0\s\u3000]*$/.test(pre[browser.ie?'innerText':'textContent']) ){
                        domUtils.remove(pre);
                    }
                    if (next && domUtils.isEmptyBlock(next)) {
                        if (!(start && start.parentNode === next || end && end.parentNode === next))
                            domUtils.remove(next)
                    }

                }

                var first = hi.firstChild;
                if (first && domUtils.isBookmarkNode(first)) {
                    first = first.nextSibling;
                }
                while (first && first.nodeType == 3) {
                    if (!first.data.replace(/[\xa0\s\u3000]*/, '').length) {
                        var tmpNode = first.nextSibling;
                        domUtils.remove(first);
                        first = tmpNode;
                    } else {
                        first.data = first.data.replace(/^[\xa0\s\u3000]*/, '');
                        break;
                    }

                }
                var last = hi.lastChild;
                if (last && domUtils.isBookmarkNode(last)) {
                    last = last.previousSibling;
                }
                while (last && last.nodeType == 3) {
                    if (!last.data.replace(/[\xa0\s\u3000]*/, '').length) {
                        tmpNode = last.previousSibling;
                        domUtils.remove(last);
                        last = tmpNode;
                    } else {
                        last.data = last.data.replace(/[\xa0\s\u3000]*$/, '');
                        break;
                    }

                }
//                if (domUtils.isEmptyBlock(hi)) {
//                    hi.innerHTML = domUtils.fillChar;
//                }

            }
            if (bm.start) {
                start = me.document.getElementById(bm.start);
                if (start && domUtils.getChildCount(start, function (node) {
                    return !domUtils.isBr(node) && !domUtils.isWhitespace(node) && domUtils.isBookmarkNode(node);
                }) == 1) {
                    if (!domUtils.isBody(start.parentNode)) {
                        domUtils.remove(start.parentNode, true)
                    }
                }
            }
            if (bm.end) {
                end = me.document.getElementById(bm.end);
                if (end && domUtils.getChildCount(end, function (node) {
                    return !domUtils.isBr(node) && !domUtils.isWhitespace(node) && domUtils.isBookmarkNode(node);
                }) == 1) {
                    if (!domUtils.isBody(end.parentNode)) {
                        domUtils.remove(end.parentNode, true)
                    }
                }
            }
            range.moveToBookmark(bm).select(true);
            bm = null;

            if (domUtils.isEmptyBlock(range.startContainer)) {
                range.startContainer.innerHTML = domUtils.fillChar;
            }

            utils.each(domUtils.getElementsByTagName(me.document,'h2'),function(node){
                utils.each(domUtils.getElementsByTagName(node,"span"),function(span){
                    domUtils.remove(span);
                })
            })
//            baidu.forEach(baidu.dom.query('h2 span,h3 span', editor.document), function (i) {
//                baidu.dom.remove(i, editor.document);
//            });
            utils.each(domUtils.getElementsByTagName(me.document,'p'),function(node){
                if (node && !node.childNodes.length) {
                    node.parentNode.removeChild(node);
                }
            })
//            baidu.forEach(editor.document.getElementsByTagName('p'), function (node) {
//                if (node && !node.childNodes.length) {
//                    node.parentNode.removeChild(node);
//                }
//            });
            baidu.editor.dom.dtd[tag] = oldH2Dtd;
        },
        queryCommandState:function (cmd) {
            var range = this.selection.getRange();
            var range2 = range.cloneRange();
            if (range.collapsed && range2.startContainer.nodeType == 3) {
                range2.setStart(range2.startContainer.parentNode, 0);
                range2.setEndAfter(range2.startContainer)
            }
            var rs = domUtils.findTagNamesInSelection(range2, ['li', 'img', 'iframe', 'sup', 'td', 'th', 'caption','em','i','strong','b']);
            if (rs) {
                return -1;
            }
            if (cmd == 'heading1' && me.selection.getStart().tagName == 'H2') {
                return 1;
            }
            return 0;
        }
    }
};


