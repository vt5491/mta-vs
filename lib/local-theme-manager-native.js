// 2016-08-22
//

// console.log("now in local-theme-manager-native.js");

(document.LocalThemeManagerNative = function () {
  var factory = {};

  factory.domThemeLookup = {};
  factory.themeInfo;
  factory.themeStatusLookup = {};
  // fileLookup is where we keep track of the theme applied to each file
  factory.fileLookup = {};

  factory.init = function () {
    console.log('LocalThemeManagerNative.init: doIt=' + this.doIt());
    // init a listener on the dom for future editor theme changes
    this.editorDomThemeChangeListener();
  };

  factory.setThemeInfo = function (info) {
    this.themeInfo = info;
  }

  factory.doIt = () => {
    return 7;
  }

  // factory.applyTheme = function (themeClassName, themeDomText) {
  // factory.applyTheme = function (themeClassName, themeInfo) {
  factory.applyTheme = function (themeInfo) {
    console.log('LocalThemeManagerNative.applyTheme: themeClassName=' + themeInfo.class_name);
    var themeClassName = themeInfo.class_name;
    var themeClassNameFQ = themeInfo.class_name_fq;
    var themeDomText = themeInfo.dom_text;
    var focusedFile = VT_HELPER.getFocusedFile();

    console.log('applyTheme: focusedFile=' + focusedFile);
    // console.log('CmdChannelListenerNative.applyTheme: themeDomText=' + themeDomText);
    // console.log('CmdChannelListenerNative.applyTheme: themeInfo.dom_text=' + themeInfo.dom_text);
    // First see if we have this theme in our themeStatusLookup table.
    if (!this.themeStatusLookup[themeClassName]) {
      this.themeStatusLookup[themeClassName] = {};

      this.themeStatusLookup[themeClassName].addedToDomGlobalStyle = false;
      this.themeStatusLookup[themeClassName].themeDomText = themeDomText;
    }
    // var newThemeText, newThemeClass;
    // var redThemeText, redThemeClass;

    // redThemeText = factory.getRedTheme();

    // redThemeClass = 'vscode-theme-red-themes-red-tmTheme';
    // newThemeClass = redThemeClass;

    // // $.find('.contributedColorTheme')[0].textContent = redThemeText + kimbieThemeText + solarizedDarkThemeText;
    // debugger;
    if(!this.themeStatusLookup[themeClassName].addedToDomGlobalStyle) {
      console.log('applyTheme: now appending theme ' + themeClassName + "to dom");
      this.themeStatusLookup[themeClassName].addedToDomGlobalStyle = true;
      // console.log('applyTheme: appending to dom: prior dom text= ' + $.find('.contributedColorTheme')[0].textContent);
      $.find('.contributedColorTheme')[0].textContent += themeDomText;
    }

    // Before we apply the theme record the theme info for this file
    //TODO this jquery will need to be generalized
    var $editors = $('#workbench\\.editors\\.files\\.textFileEditor');

    // apply the theme to each open editor pane
    console.log('applyTheme: $editors.length=' + $editors.length);
    for(var i =0; i< $editors.length; i++) {
      console.log('applyTheme: now processing editor: ' + i);

      var $nodeBase = $($editors[i]);

      // For the initial apply we only go against the active editor
      // if(!VT_HELPER.editorIsFocused($nodeBase)) {
      //   // skip and go the next editor
      //   console.log('applyTheme: skipping editor ' + i ' because its not active');
      //   continue;
      // }
      // var $nodeBase = $('#workbench\\.editors\\.files\\.textFileEditor')
      // .first();
      var activeFile = VT_HELPER.getActiveFileForEditor($nodeBase.parent());
      console.log('applyTheme: activeFile=' + activeFile);

      // if(! this.fileLookup[activeFile]) {
      //   t
      // }
      if(VT_HELPER.editorIsFocused($nodeBase)) {
        // for the active editor only, overlay the theme with the new theme
        // for now we simply replace the entire node with the new info.  If we
        // ever have additional keys other than what's in themeInfo, then we would
        // have to be more surgical about it.
        this.fileLookup[activeFile] = themeInfo;
        console.log('applyTheme: overlaying editor ' + i +' with new theme ' + themeInfo.class_name);
        console.log('applyTheme: new theme class_name_fq=' + themeInfo.class_name_fq);
      }
      else if (typeof this.fileLookup[activeFile] !== 'undefined') {
        // else use the last theme
        var fileThemeInfo = this.fileLookup[activeFile];
        // and update the apply theme variables to be that of the last local theme.
        themeClassName = fileThemeInfo.class_name;
        themeClassNameFQ = fileThemeInfo.class_name_fq;
        themeDomText = fileThemeInfo.dom_text;
        console.log('applyTheme: using last theme of ' + themeClassName + ' because editor is not active');
      }
      else {
        console.log('applyTheme: no fileLookup found..skipping');
        // no local theme set -- just skip it.
        continue;
      }

      // Now apply the theme
      var bodyClass = $('body').attr('class');

      var newBodyClass = bodyClass.replace(/vscode-theme.*\b/, themeClassNameFQ);

      if(VT_HELPER.editorIsFocused($nodeBase)) {
        $('body').attr('class', newBodyClass);
      }

      // // editor div class
      // var $leftEditor = $('.editor-left').find('.monaco-editor:eq(0)');
      // var editorClass = $leftEditor.attr('class');
      // var newEditorClass = editorClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
      // $leftEditor.attr('class', newEditorClass);
      //
      // // overflow-guard.scrollable-element
      // var scrollableClass = $('.editor-left').find('.overflow-guard').children('.monaco-scrollable-element').attr('class');
      // var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
      // $('.editor-left').find('.overflow-guard')
      // .children('.monaco-scrollable-element')
      // .attr('class', newScrollableClass);

      // editor div class
      var editorType;
      if (i === 0) {
        editorType = '.editor-left';
      }
      else if (i === 1) {
        editorType = '.editor-center';
      }
      else {
        editorType = '.editor-right';
      };

      console.log('applyTheme: editorType=' + editorType);

      var $editor = $(editorType).find('.monaco-editor:eq(0)');
      console.log('applyTheme: $editor=' + $editor);
      var editorClass = $editor.attr('class');
      console.log('applyTheme: old $editor.class=' + editorClass);
      var newEditorClass = editorClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
      $editor.attr('class', newEditorClass);

      // overflow-guard.scrollable-element
      var scrollableClass = $(editorType).find('.overflow-guard').children('.monaco-scrollable-element').attr('class');
      var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
      $(editorType).find('.overflow-guard')
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

  // because this is called from in a mutationObserver, where 'this' is
  // not this object, we can't put this method here.  We have to use
  // the one in VT_HELPER instead.
  // factory.getActiveFileForEditor = function ($editorNode) {
  //   var $tabs = $editorNode.find('.tabs-container').children();

  //   console.log('getActiveFileForEditor: $tabs=' + $tabs);
  //   for (var i = 0; i < $tabs.length; i++) {
  //     if ($($tabs[i]).attr('aria-selected') === 'true') {
  //       return $($tabs[i]).attr('title');
  //     }
  //   }
  // };

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

  factory.editorDomThemeChangeListener = function () {
    console.log('LocalThemeManagerNative.edditorDomThemeChangeListener: entered');
    var observeDOM = this.observeDOMFactory();

    observeDOM( document.getElementById('workbench.editors.files.textFileEditor')
     ,function () {
        console.log('dom changed');
        var $editors = $('#workbench\\.editors\\.files\\.textFileEditor');

        console.log('observeDom:$editors.length=' + $editors.length);
        for(var i =0; i< $editors.length; i++) {
          console.log('observeDom: now processing editor: ' + i);
          // var $node = $('#workbench\\.editors\\.files\\.textFileEditor').children().first();
          var $node = $($editors[i]);
          console.log('$node.class=' + $node.attr('class'));

          if (typeof $node != "undefined") {
            var nodeClass = $node.attr('class');

            // var activeFile = this.getActiveFileForEditor($node);
            // var activeFile = VT_HELPER.getActiveFileForEditor($node);
            // var $nodeBase = $('#workbench\\.editors\\.files\\.textFileEditor')
            // .first();
            var $nodeBase = $($('#workbench\\.editors\\.files\\.textFileEditor')[i]);
            var activeFile = VT_HELPER.getActiveFileForEditor($nodeBase.parent());
            console.log('LocalThemeManagerNative.editorDomThemeChangeListener: activeFile=' + activeFile);
            // debugger;

            if (typeof document.localThemeManagerNative.fileLookup[activeFile] !== 'undefined') {
              console.log('LocalThemeManagerNative.editorDomThemeChangeListener: fileLookup.class_name=' + document.localThemeManagerNative.fileLookup[activeFile].class_name);
              console.log('LocalThemeManagerNative.editorDomThemeChangeListener: fileLookup.class_name_fq=' + document.localThemeManagerNative.fileLookup[activeFile].class_name_fq);
              var fileThemeInfo = document.localThemeManagerNative.fileLookup[activeFile];
              // var fileThemeClassFQ = document.localThemeManagerNative.fileLookup[activeFile].class_name_fq;
              var fileThemeClassFQ = fileThemeInfo.class_name_fq;

              if (!nodeClass.match(new RegExp(fileThemeClassFQ)) ) {
                console.log('LocalThemeManagerNative.editorDomThemeChangeListener: reapplying theme' + fileThemeInfo.class_name);
                // the dom change has altered the theme in effect for this file, so
                // we need to restore the original
                document.localThemeManagerNative.applyTheme(fileThemeInfo);
              }
            }
          }
        }
      });
  };

  return factory;
})();

// get a global "singleton" localThemeManagerNative instance that sits on the document tree.
// This can be used by other "modules" as well.
document.localThemeManagerNative = new document.LocalThemeManagerNative();

// init it
document.localThemeManagerNative.init();

var VT_HELPER = {
  dummy : function () {
    return "howdy pardner";
  },

  getActiveFileForEditor : function ($editorNode) {
     var $tabs = $editorNode.find('.tabs-container').children();

     console.log('getActiveFileForEditor: $tabs=' + $tabs);
    for(var i=0; i < $tabs.length; i++) {
      if( $($tabs[i]).attr('aria-selected') === 'true' ) {
        // return $($tabs[i]).attr('title');
        var fn = $($tabs[i]).attr('title');
        // replace any '\' with a '/'
        // return fn.replace(String.fromCharCode(92),String.fromCharCode(47));
        // return fn.replace(/\x92/g,String.fromCharCode(47));
        // normalize to unix style with forward slashes only
        return fn.replace(/\\/g,'/');
      }
    }
  },

  // determine if this editor is the active editor (with keyboard focus)
  editorIsFocused : function ($editorNode) {
    // the active editor has a class structure like:
    // <div class="one-editor-silo editor-left"..
    //   <div class="container"..
    //     <div class="title tabs acive"...
    // if its not the active editor, it will have:
    //     <div class="title tabls"
    //
    // So this is just kind of a hacky way to determine the active editor
    return $editorNode.parent().find('.title.tabs').hasClass('active');
  },

  getFocusedFile : function () {
    var focusedFile = $('.title.tabs.active').find('.tabs-container').find("div[aria-selected='true']").attr('title');
    return focusedFile.replace(/\\/g,'/');
  }
};
// end helper methods

// var observeDOM = (function(){
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
//         eventListenerSupported = window.addEventListener;

//     return function(obj, callback){
//         if( MutationObserver ){
//             // define a new observer
//             var obs = new MutationObserver(function(mutations, observer){
//                 if( mutations[0].addedNodes.length || mutations[0].removedNodes.length )
//                     callback();
//             });
//             // have the observer observe foo for changes in children
//             obs.observe( obj, { childList:true, subtree:true });
//         }
//         else if( eventListenerSupported ){
//             obj.addEventListener('DOMNodeInserted', callback, false);
//             obj.addEventListener('DOMNodeRemoved', callback, false);
//         }
//     }
// })();

// console.log('setupListener2: entered');
// console.log('setupListener2: VT.dummy says ' + VT_HELPER.dummy());
// observeDOM( document.getElementById('workbench.editors.files.textFileEditor') ,function(){
//     console.log('dom changed');
//     var $node= $('#workbench\\.editors\\.files\\.textFileEditor').children().first();
//     console.log('$node.class=' + $node.attr('class'));

//     if (typeof $node != "undefined" ) {

//       var nodeClass = $node.attr('class');

//       redThemeClass = 'vscode-theme-red-themes-red-tmTheme';
//       solarizedDarkThemeClass = 'vscode-theme-solarized-dark-themes-Solarized-dark-tmTheme';
//       var newThemeClass = 'vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme';

//       if (!nodeClass.match(new RegExp(newThemeClass)) ) {

//         var newNodeClass;
//         var $nodeBase = $('#workbench\\.editors\\.files\\.textFileEditor')
//           .first();

//         var activeFile = VT_HELPER.getActiveFileForEditor($nodeBase.parent());
//         console.log("activeFile=" + activeFile);

//         if(activeFile.match(new RegExp('monadutils'))) {
//           console.log('found monadutils.js so would set solarizedDark theme here');
//           newNodeClass = nodeClass.replace(/vscode-theme.*\b/, solarizedDarkThemeClass);

//           // overflow-guard.scrollable-element
//           var scrollableClass = $('.editor-left').find('.overflow-guard')
//             .children('.monaco-scrollable-element').attr('class');
//           var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, redThemeClass);
//           $('.editor-left').find('.overflow-guard')
//           .children('.monaco-scrollable-element')
//           .attr('class', newScrollableClass);

//           var bodyClass = $('body').attr('class');

//           var newBodyClass = bodyClass.replace(/vscode-theme.*\b/, redThemeClass);

//           $('body').attr('class', newBodyClass);
//         }
//         else {
//           newNodeClass = nodeClass.replace(/vscode-theme.*\b/, newThemeClass);
//         }
//         $node.attr('class', newNodeClass);
//       }
//     }

// });
//@ sourceURL=local-theme-manager-native.js
