"use strict";
// 2016-08-26
//
// this class listens and handles dom theme change events.  It needs to be a
// separate class from LocalThemeManagerNative because it needs to call
// into that module for support, and we need the 'this' of LocalThemeManagerNative
// to be different than the 'this' of the mutation observer/handler (the functionality
// for this class originally resided in LocalThemeManagerNative)
//
// we prefix this class with 'MTA_VS' to reduce the likelihood of global namespace
// pollution

(document.MTA_VS.EditorThemeChangeListener = function () {
  var factory = {};

  factory.doIt = function () {
    return 8;
  }

  var get_type= function (thing){
    if(thing===null)return "[object Null]"; // special case
    return Object.prototype.toString.call(thing);
  }

  // factory.observer = new MutationObserver(function(mutations, callback) {
  //   if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
  //   callback();
  // });

  factory.observeDOMFactory = function() {
    var MutationObserver = window.MutationObserver;
    // var eventListenerSupported = window.addEventListener;

    return function(obj, callback){
      // if( MutationObserver ){
      // define a new observer
      // var obs = new MutationObserver(function(mutations, observer){
      console.log('now in EditorThemeChangeLister.observer');
      var mo = new MutationObserver(function(mutations){
        if( mutations[0].addedNodes.length || mutations[0].removedNodes.length ) {
          console.log('about to call callback');
          callback();
        }
      });
      // have the observer observe foo for changes in children
      // if( obs instanceof Node) {
      // if( obj instanceof Node) {
        console.log('EditorThemeChangeListener.observeDom: type of obj=' + get_type(obj));
        mo.observe( obj, {
          // childList is required
          childList:true,
          //subtree is required
          subtree:true,
          attributes: true,
          characterData: true // dont seem to need this
        });
      // }
      // else {
      //   console.log('obj is not instanceof Node');
      // }
      // }
    // };
  // };
  }
}

  // this is the function that will actually handle a listen event when it
  // does happen.
  // Note 'editor' is a string, not an editor object
  var changeHandler = function (editor) {
    console.log('dom changed for editor ' + editor);
    // var $editors = $('#workbench\\.editors\\.files\\.textFileEditor');
    //
    // console.log('observeDom:$editors.length=' + $editors.length);
    // for(var i =0; i< $editors.length; i++) {
      // console.log('observeDom: now processing editor: ' + i);
      // var $node = $($editors[i]);
      // var $node = $editor;
      var $node;
      var $editor;
      if (editor.match(/left/)) {
        $node = $('.editor-left').find('#workbench\\.editors\\.files\\.textFileEditor');
        $editor = $('.editor-left');
      }
      else if (editor.match(/center/)) {
        $node = $('.editor-center').find('#workbench\\.editors\\.files\\.textFileEditor');
        $editor = $('.editor-center');
      }
      else if (editor.match(/right/)) {
        $node = $('.editor-right').find('#workbench\\.editors\\.files\\.textFileEditor');
        $editor = $('.editor-right');
      }
      console.log('$node.class=' + $node.attr('class'));

      if (typeof $node != "undefined") {
        var nodeClass = $node.attr('class');
        var childNodeClass = $node.children(':eq(0)').attr('class');

        // var $nodeBase = $($('#workbench\\.editors\\.files\\.textFileEditor')[i]);
        // var activeFile = document.localThemeManagerNative.getActiveFileForEditor($nodeBase.parent());
        // var activeFile = document.localThemeManagerNative.getActiveFileForEditor($editor);
        var activeFile = document.localThemeManagerNative.getActiveFileForEditor($editor);
        console.log('EditorThemeChangeListener.editorDomThemeChangeListener: activeFile=' + activeFile);

        // we need to re-apply the theme if the body node is different than what
        // what the file level theme should be.  Otherwise the body class theme
        // will override the lower level theme
        var bodyClasses = $('body').attr('class').split(' ');
        var bodyTheme;
        for(var i = 0; i < bodyClasses.length; i++) {
          if(bodyClasses[i].match(/theme/i)) {
            bodyTheme = bodyClasses[i];
            break;
          }
        }
        console.log("EditorThemeChangeListener.changeHandler: bodyTheme=" + bodyTheme);
        console.log("EditorThemeChangeListener.changeHandler: nodeClass=" + nodeClass);
        console.log("EditorThemeChangeListener.changeHandler: childNodeClass=" + childNodeClass);
        console.log("EditorThemeChangeListener.changeHandler: fileLookup[" + activeFile
           + "]=" + document.localThemeManagerNative.fileLookup[activeFile] );

        if (typeof document.localThemeManagerNative.fileLookup[activeFile] !== 'undefined') {
          console.log('EditorThemeChangeListener.editorDomThemeChangeListener: fileLookup.class_name=' + document.localThemeManagerNative.fileLookup[activeFile].class_name);
          console.log('EditorThemeChangeListener.editorDomThemeChangeListener: fileLookup.class_name_fq=' + document.localThemeManagerNative.fileLookup[activeFile].class_name_fq);
          var fileThemeInfo = document.localThemeManagerNative.fileLookup[activeFile];
          var fileThemeClassFQ = fileThemeInfo.class_name_fq;

          // if (!nodeClass.match(new RegExp(fileThemeClassFQ)) ) {
          if (!childNodeClass.match(new RegExp(fileThemeClassFQ)) ) {
            console.log('EditorThemeChangeListener.editorDomThemeChangeListener: reapplying theme' + fileThemeInfo.class_name);
            // the dom change has altered the theme in effect for this file, so
            // we need to restore the original
            document.localThemeManagerNative.applyTheme(fileThemeInfo, $editor);
          }
        }
        //Note: this is never driven
        // reapply the existing theme at the leaf nodes, to 'fake-out' vscode
        // into overriding the body theme (if the body theme and leaf node diverge)
        // else if (!nodeClass.match(new RegExp(bodyTheme))) {
        //   console.log('EditorThemeChangleListener: now in body-leaf mismatch path');
        //   var tmpThemeInfo = {};
        //   tmpThemeInfo.class_name = null;
        //   tmpThemeInfo.class_name_fq = bodyTheme ;
        //   tmpThemeInfo.dom_text = null ;
        //   console.log('EditorThemeChangleListener: tmpThemeInfo.class_name_fq=' + tmpThemeInfo.class_name_fq);
        //
        //   document.localThemeManagerNative.applyTheme(tmpThemeInfo, $editor, {skipBodyNode: true});
        // }
      }
    // }
  };

  // These we want to be jquery objects
  var leftEditorChangeHandler = function () {
    // var $leftEditor = $('.editor-left');
    // var $leftEditor = $('.editor-left').find('#workbench\\.editors\\.files\\.textFileEditor');
    // changeHandler($leftEditor);
    var leftEditor = 'editor-left';
    changeHandler(leftEditor);
  }

  var centerEditorChangeHandler = function () {
    // var $centerEditor = $('.editor-center');
    // var $centerEditor = $('.editor-center').find('#workbench\\.editors\\.files\\.textFileEditor');
    // changeHandler($centerEditor);
    var centerEditor = 'editor-center';
    changeHandler(centerEditor);
  }

  var rightEditorChangeHandler = function () {
    // var $rightEditor = $('.editor-right');
    // var $rightEditor = $('.editor-right').find('#workbench\\.editors\\.files\\.textFileEditor');
    // changeHandler($rightEditor);
    var rightEditor = 'editor-right';
    changeHandler(rightEditor);
  }

  // factory.editorDomThemeChangeListener = function () {
  factory.listen = function () {
    console.log('EditorThemeChangeListener.edditorDomThemeChangeListener: entered');
    var observer = this.observeDOMFactory();

    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor')
    //  , changeHandler );
    // left-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), leftEditorChangeHandler);
    // observeDOM($('.editor-left'), leftEditorChangeHandler);
    //Note the first arg needs to be a Node, not a JQuery object.  Thus we collapse the Jquery wave with '[0]'
    //TODO: you'll get an error of "obj is not of type node" if you don't
    // have split screens setup
    //TODO: this is oversensitive.  It gets driven every time you press a key
    // observeDOM($('.editor-left').find('#workbench\\.editors\\.files\\.textFileEditor')[0], leftEditorChangeHandler);
    // observer($('.editor-left').find('#workbench\\.editors\\.files\\.textFileEditor')
    //   .find('.monaco-editor')[0], leftEditorChangeHandler);
    // the following works, but I'm trying to narrow it down
    observer($('.editor-left')[0], leftEditorChangeHandler);
    // observer($('.editor-center').find('.monaco-editor')[0], centerEditorChangeHandler);//no work
    // the following works
    // observer($('.editor-left').find('.monaco-editor:eq(0)').parent()[0], leftEditorChangeHandler);
    // center-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), centerEditorChangeHandler);
    // observeDOM($('.editor-center'), leftEditorChangeHandler);
    // observer($('.editor-center').find('#workbench\\.editors\\.files\\.textFileEditor')
      // .find('.monaco-editor')[0], centerEditorChangeHandler);
    observer($('.editor-center')[0], centerEditorChangeHandler);
    // observer($('.editor-center').find('.monaco-editor')[0], centerEditorChangeHandler);
    // observer($('.editor-center').find('.monaco-editor:eq(0)').parent()[0], centerEditorChangeHandler);
    // right-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), rightEditorChangeHandler);
    // observeDOM($('.editor-right'), leftEditorChangeHandler);
    // observer($('.editor-right').find('#workbench\\.editors\\.files\\.textFileEditor')
    //   .find('.monaco-editor')[0], rightEditorChangeHandler);
    observer($('.editor-right')[0], rightEditorChangeHandler);
  };

  return factory;
})()

//@ sourceURL=editor-theme-change-listener.js
