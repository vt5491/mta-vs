"use strict";
// 2016-08-22
// This is the main global object and entry point for "mta_vs".  It is responsible for getting
// all dependencies.  "outside" modules such as EditorThemeChangeListener, can
// call this module by referring to 'document.localThemeManagerNative'.  Thus
// it's assumed that this module is a singleton.

// this is the global namespace objec for this app.  Unfortunately, I don't use
// it everywhere, so its usage is currently optional
// (document.MTA_VS = {})();
// commands to get your way around the dom
// $e=$.find('.monaco-editor:eq(0)')
// $.find('.monaco-editor:eq(0)')[0].className

// Note: it's not possible to unit test this with vscodes mocha tests.  vscode
// tests assume your running under node in a process different than the browser's
// thread.

(document.LocalThemeManagerNative = function () {
  var factory = {};

  factory.themeInfo;
  factory.themeStatusLookup = {};
  // fileLookup is where we keep track of the theme applied to each file
  factory.fileLookup = {};

  factory.init = function () {
    // get an instance of an editor-theme-change-listener
    this.editorThemeChangeListener = new document.MTA_VS.EditorThemeChangeListener();
    // init a listener on the dom for future editor theme changes
    this.editorThemeChangeListener.listen();
  };

  factory.setThemeInfo = function (info) {
    this.themeInfo = info;
  }

  factory.doIt = () => {
    return 7;
  }

  // We call this once during intialization.  We loop through each open editor,
  // get the filename, and see if that file is the fileLookup that we loaded from
  // previous session.  If it is, we then call applyTheme against that one editor
  factory.initEditorThemes = function () {

  }

  // apply the theme from 'themeInfo' for a certain set of editors.  If no
  // 'mutatedEditor' is passed, then we assume this is the inital apply, and we will
  // apply the theme against all editors that have the current active file opened.
  // If a $mutatedEditor is passed, then we assume this is being driven by a mutatedEditor
  // listener event, and we will apply the theme agasinst only that mutated editor.
  factory.applyTheme = function (themeInfo, $mutatedEditor, params) {
    var themeClassName = themeInfo.class_name;
    var themeClassNameFQ = themeInfo.class_name_fq;
    var themeDomText = themeInfo.dom_text;
    var focusedFile = this.getFocusedFile();
    var skipBodyNode;

    if(params)
    {
      skipBodyNode = params.skipBodyNode;
    };

    // First see if we have this theme in our themeStatusLookup table.
    if (themeClassName && !this.themeStatusLookup[themeClassName]) {
      this.themeStatusLookup[themeClassName] = {};

      this.themeStatusLookup[themeClassName].addedToDomGlobalStyle = false;
      this.themeStatusLookup[themeClassName].themeDomText = themeDomText;
    }

    if(themeClassName && !this.themeStatusLookup[themeClassName].addedToDomGlobalStyle) {
      this.themeStatusLookup[themeClassName].addedToDomGlobalStyle = true;
      $.find('.contributedColorTheme')[0].textContent += themeDomText;
    }

    var $editors;

    if($mutatedEditor) {
      $editors = $mutatedEditor;
    }
    else {
      $editors = this.getEditorsForFile(focusedFile);
    }

    // apply the theme to each open editor pane
    for(var i =0; i< $editors.length; i++) {
      //TODO: rename this to someting like $editor
      var $nodeBase = $($editors[i]);

      var activeFile = this.getActiveFileForEditor($nodeBase);

      if(this.editorIsFocused($nodeBase)) {
        // for the active editor only, overlay the theme with the new theme
        // for now we simply replace the entire node with the new info.  If we
        // ever have additional keys other than what's in themeInfo, then we would
        // have to be more surgical about it.
        this.fileLookup[activeFile] = themeInfo;
      }

      // Now apply the theme
      var bodyClass = $('body').attr('class');

      var newBodyClass = bodyClass.replace(/vscode-theme.*\b/, themeClassNameFQ);

      skipBodyNode = true;
      if (!skipBodyNode) {
        if(this.editorIsFocused($nodeBase)) {
          $('body').attr('class', newBodyClass);
        }
      }

      var $editor = $nodeBase.find('.monaco-editor:eq(0)');
      var editorClass = $editor.attr('class');
      //TODO: if this works, figure out why we are being driven on redundant
      // application.  Checks before applyTheme should determine if we need to
      // re-apply.  I shouldnt have to it down here
      // if( editorClass.match(new RegExp(themeClassNameFQ))) {
      //   console.log('LTMN: skipping theme re-application because its redundant');
      //   continue;
      // }
      var newEditorClass = editorClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
      if (newEditorClass === editorClass) {
        // editor class not changed, so instead we need to *add* the newEditorClass
        newEditorClass += ` ${themeClassNameFQ}`; 
      }

      $editor.attr('class', newEditorClass);

      // overflow-guard.scrollable-element
      var scrollableClass = $nodeBase.find('.overflow-guard').children('.monaco-scrollable-element').attr('class');
      var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, themeClassNameFQ);

      $nodeBase.find('.overflow-guard')
      .children('.monaco-scrollable-element')
      .attr('class', newScrollableClass);
    }
  };

  // add a method to read the the text of the "command channel", which is
  // a status bar text item
  factory.getCmdChannelTheme = function () {
    let channelStr = $('#workbench\\.parts\\.statusbar')
      .find('span:contains("Theme:")')
      .text()

    // remove the "Theme: " keyword
    let themeName = channelStr.split(':')[1];

    // remove spaces
    themeName.replace(/ /g, '');

    return themeName;
  };

  // only return the editor if the file the displayed file in the editor e.g.
  // not just if it's a tab under the editor somewhere
  factory.getActiveFileForEditor = function ($editorContainerNode) {
    var $tabs = $editorContainerNode.find('.tabs-container').children();

    for(var i=0; i < $tabs.length; i++) {
      if( $($tabs[i]).attr('aria-selected') === 'true') {
        var fn = $($tabs[i]).attr('title');
        // replace any '\' with a '/'
        return fn.replace(/\\/g,'/');
      }
    }
  };

  factory.getFocusedFile = function () {
    var focusedFile = $('.title.tabs.active').find('.tabs-container').find("div[aria-selected='true']").attr('title');
    return focusedFile.replace(/\\/g,'/');
  };

  // return all the editor dom element parents (the ones with 'editor-left',
  // 'editor-center', and 'editor-right') that are opened on the specified file
  factory.getEditorsForFile = function (fileName) {
    //just determine the active file for each editor, and if it matches
    // the 'fn' add it to the result array
    var editorsForFile = [];
    var activeFile, $editor;

    // one editor
    $editor = $('.editor-one');
    activeFile = this.getActiveFileForEditor($editor);

    if (activeFile === fileName) {
      editorsForFile.push($editor);
    }

    // two editor
    $editor = $('.editor-two');
    activeFile = this.getActiveFileForEditor($editor);

    if (activeFile === fileName) {
      editorsForFile.push($editor);
    }

    // three editor
    $editor = $('.editor-three');
    activeFile = this.getActiveFileForEditor($editor);

    if (activeFile === fileName) {
      editorsForFile.push($editor);
    }

    return editorsForFile;
  };

  // determine if this editor is the active editor (with keyboard focus)
  factory.editorIsFocused = function ($editorContainerNode) {
    // the active editor has a class structure like:
    // <div class="one-editor-silo editor-left"..
    //   <div class="container"..
    //     <div class="title tabs acive"...
    // if its not the active editor, it will have:
    //     <div class="title tabls"
    //
    // So this is just kind of a hacky way to determine the active editor
    return $editorContainerNode.parent().find('.title.tabs').hasClass('active');
  };

  factory.activeEditorChangeHandler = function() {
    let $editor = factory.getActiveEditor();

    // get the current active fileName
    let activeFile = this.getActiveFileForEditor($editor);

    // get the theme it should have
    let intendedTheme = factory.fileLookup[activeFile] || factory.fileLookup['defaultTheme'];

    // get current active theme
    let activeTheme = factory.getEditorThemeFromClass($editor);

    if (intendedTheme && intendedTheme.class_name_fq !== activeTheme) {
      factory.applyTheme(intendedTheme);
    }
  }
  // Get the current theme applied to the specified editor (defaults to active editor)
  // by examining its class attribute
  factory.getEditorThemeFromClass = function($editor) {
    let $ed = $editor || factory.getActiveEditor();

    let theme = '';
    try {
      let classString = $ed.find('.monaco-editor').attr('class')
      theme = classString.match(/(vscode-theme[^ ]*)\b/)[1]
    }
    catch (e) {
      console.log(`LocalThemeManagerNative.getEditorThemeFromClass: theme not found`);
    }

    return theme;
  }

  factory.getActiveEditor = function() {
    return $('.title.tabs.active').closest('.one-editor-silo')
  }

  factory.setDefaultThemeHandler = function(defaultTheme) {
    // set the default theme
    var themeInfo;
    fetch('http://localhost:3000' + '?theme=' + defaultTheme)
    .then(r => r.text())
    .then(r => {
      var themeInfo = JSON.parse(r);
      factory.fileLookup['defaultTheme'] = themeInfo;
    });
  }

  factory.initFileLookup = function() {
    let loadPromise = new Promise((resolve, reject) => {
      fetch('http://localhost:3000' + '?readFileLookup')
      .then((r) => r.text())
      .then((r) => {
        var fileLookup = JSON.parse(unescape(r));
        factory.fileLookup = fileLookup;

        resolve("fileLookupLoaded");
      });
    });
    return loadPromise;
  }

  return factory;
})();

// get a global "singleton" localThemeManagerNative instance that sits on the document tree.
// This can be used by other "modules" as well.
document.localThemeManagerNative = new document.LocalThemeManagerNative();

// init it
document.localThemeManagerNative.init();

//@ sourceURL=local-theme-manager-native.js
