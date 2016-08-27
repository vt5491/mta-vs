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

  factory.observeDOMFactory = function() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
                    callback();
            });
            // have the observer observe foo for changes in children
            // if( obs instanceof Node) {
            console.log('EditorThemeChangeListener.observeDom: type of obj=' + get_type(obj));
            obs.observe( obj, { childList:true, subtree:true });
            // }
            // else {
            //   console.log('obs is not instanceof Node');
            // }
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    };
  };

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

        // var $nodeBase = $($('#workbench\\.editors\\.files\\.textFileEditor')[i]);
        // var activeFile = document.localThemeManagerNative.getActiveFileForEditor($nodeBase.parent());
        // var activeFile = document.localThemeManagerNative.getActiveFileForEditor($editor);
        var activeFile = document.localThemeManagerNative.getActiveFileForEditor($editor);
        console.log('EditorThemeChangeListener.editorDomThemeChangeListener: activeFile=' + activeFile);

        if (typeof document.localThemeManagerNative.fileLookup[activeFile] !== 'undefined') {
          console.log('EditorThemeChangeListener.editorDomThemeChangeListener: fileLookup.class_name=' + document.localThemeManagerNative.fileLookup[activeFile].class_name);
          console.log('EditorThemeChangeListener.editorDomThemeChangeListener: fileLookup.class_name_fq=' + document.localThemeManagerNative.fileLookup[activeFile].class_name_fq);
          var fileThemeInfo = document.localThemeManagerNative.fileLookup[activeFile];
          var fileThemeClassFQ = fileThemeInfo.class_name_fq;

          if (!nodeClass.match(new RegExp(fileThemeClassFQ)) ) {
            console.log('EditorThemeChangeListener.editorDomThemeChangeListener: reapplying theme' + fileThemeInfo.class_name);
            // the dom change has altered the theme in effect for this file, so
            // we need to restore the original
            document.localThemeManagerNative.applyTheme(fileThemeInfo);
          }
        }
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
    var observeDOM = this.observeDOMFactory();

    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor')
    //  , changeHandler );
    // left-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), leftEditorChangeHandler);
    // observeDOM($('.editor-left'), leftEditorChangeHandler);
    //Note the first arg needs to be a Node, not a JQuery object.  Thus we collapse the Jquery wave with '[0]'
    //TODO: you'll get an error of "obj is not of type node" if you don't
    // have split screens setup
    //TODO: this is oversensitive.  It gets driven every time you press a key
    observeDOM($('.editor-left').find('#workbench\\.editors\\.files\\.textFileEditor')[0], leftEditorChangeHandler);
    // center-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), centerEditorChangeHandler);
    // observeDOM($('.editor-center'), leftEditorChangeHandler);
    observeDOM($('.editor-center').find('#workbench\\.editors\\.files\\.textFileEditor')[0], centerEditorChangeHandler);
    // right-editor
    // observeDOM( document.getElementById('workbench.editors.files.textFileEditor'), rightEditorChangeHandler);
    // observeDOM($('.editor-right'), leftEditorChangeHandler);
    observeDOM($('.editor-right').find('#workbench\\.editors\\.files\\.textFileEditor')[0], rightEditorChangeHandler);
  };

  return factory;
})()

//@ sourceURL=editor-theme-change-listener.js
