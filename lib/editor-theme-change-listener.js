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
    var MutationObserver = window.MutationObserver;

    return function(obj, callback){
      // define a new observer
      var mo = new MutationObserver(function(mutations){
        if( mutations[0].addedNodes.length || mutations[0].removedNodes.length ) {
          callback();
        }
      });
      mo.observe( obj, {
        // childList is required
        childList:true,
        //subtree is required
        subtree:true,
        attributes: true,
        characterData: true // dont seem to need this
      });
    }
  }

  // this is the function that will actually handle a listen event when it
  // does happen.
  // Note 'editor' is a string, not an editor object
  var changeHandler = function (editor) {
    var $node;
    var $editor;
    if (editor.match(/one/)) {
      $node = $('.editor-one').find('#workbench\\.editors\\.files\\.textFileEditor');
      $editor = $('.editor-one');
    }
    else if (editor.match(/two/)) {
      $node = $('.editor-two').find('#workbench\\.editors\\.files\\.textFileEditor');
      $editor = $('.editor-two');
    }
    else if (editor.match(/three/)) {
      $node = $('.editor-three').find('#workbench\\.editors\\.files\\.textFileEditor');
      $editor = $('.editor-three');
    }

    if (typeof $node != "undefined") {
      var nodeClass = $node.attr('class');
      var childNodeClass = $node.children(':eq(0)').attr('class');
      var activeFile = document.localThemeManagerNative.getActiveFileForEditor($editor);

      if (typeof document.localThemeManagerNative.fileLookup[activeFile] !== 'undefined') {
        var fileThemeInfo = document.localThemeManagerNative.fileLookup[activeFile];
        var fileThemeClassFQ = fileThemeInfo.class_name_fq;

        if (!childNodeClass.match(new RegExp(fileThemeClassFQ)) ) {
          // the dom change has altered the theme in effect for this file, so
          // we need to restore the original
          document.localThemeManagerNative.applyTheme(fileThemeInfo, $editor);
        }
      }
    }
  };

  // These we want to be jquery objects
  var oneEditorChangeHandler = function () {
    var oneEditor = 'editor-one';
    changeHandler(oneEditor);
  }

  var twoEditorChangeHandler = function () {
    var twoEditor = 'editor-two';
    changeHandler(twoEditor);
  }

  var threeEditorChangeHandler = function () {
    var threeEditor = 'editor-three';
    changeHandler(threeEditor);
  }

  factory.listen = function () {
    var observer = this.observeDOMFactory();

    observer($('.editor-one')[0], oneEditorChangeHandler);
    observer($('.editor-two')[0], twoEditorChangeHandler);
    observer($('.editor-three')[0], threeEditorChangeHandler);
  };

  return factory;
})()

//@ sourceURL=editor-theme-change-listener.js
