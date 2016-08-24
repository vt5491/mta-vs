// 2016-08-22
//

console.log("now in local-theme-manager-native.js");

(document.LocalThemeManagerNative = function () {
  var factory = {};

  factory.domThemeLookup = {};
  factory.themeInfo;
  factory.themeStatusLookup = {};

  factory.setThemeInfo = function (info) {
    this.themeInfo = info;
  }

  factory.doIt = () => {
    return 7;
  } 

  // factory.applyTheme = function (themeClassName, themeDomText) {
  // factory.applyTheme = function (themeClassName, themeInfo) {
  factory.applyTheme = function (themeInfo) {
    console.log('CmdChannelListenerNative.applyTheme: themeClassName=' + themeInfo.class_name);
    var themeClassName = themeInfo.class_name;
    var themeClassNameFQ = themeInfo.class_name_fq;
    var themeDomText = themeInfo.dom_text;
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
    if(!this.themeStatusLookup[themeClassName].addedToDomGlobalStyle) {
      $.find('.contributedColorTheme')[0].textContent = themeDomText;
    }
    var bodyClass = $('body').attr('class');

    var newBodyClass = bodyClass.replace(/vscode-theme.*\b/, themeClassNameFQ);

    $('body').attr('class', newBodyClass);

    // editor div class
    var $leftEditor = $('.editor-left').find('.monaco-editor:eq(0)');
    var editorClass = $leftEditor.attr('class');
    var newEditorClass = editorClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
    $leftEditor.attr('class', newEditorClass);

    // overflow-guard.scrollable-element
    var scrollableClass = $('.editor-left').find('.overflow-guard').children('.monaco-scrollable-element').attr('class');
    var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, themeClassNameFQ);
    $('.editor-left').find('.overflow-guard')
    .children('.monaco-scrollable-element')
    .attr('class', newScrollableClass);
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

  return factory;
})();

var VT_HELPER = {
  dummy : function () {
    return "howdy pardner";
  },

  getActiveFileForEditor : function ($editorNode) {
     var $tabs = $editorNode.find('.tabs-container').children();

     console.log('getActiveFileForEditor: $tabs=' + $tabs);
    for(var i=0; i < $tabs.length; i++) {
      if( $($tabs[i]).attr('aria-selected') === 'true' ) {
        return $($tabs[i]).attr('title');
      }
    }
  },
};
// end helper methods

var observeDOM = (function(){
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
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }
})();

console.log('setupListener2: entered');
console.log('setupListener2: VT.dummy says ' + VT_HELPER.dummy());
observeDOM( document.getElementById('workbench.editors.files.textFileEditor') ,function(){
    console.log('dom changed');
    var $node= $('#workbench\\.editors\\.files\\.textFileEditor').children().first();
    console.log('$node.class=' + $node.attr('class'));

    if (typeof $node != "undefined" ) {

      var nodeClass = $node.attr('class');

      redThemeClass = 'vscode-theme-red-themes-red-tmTheme';
      solarizedDarkThemeClass = 'vscode-theme-solarized-dark-themes-Solarized-dark-tmTheme';
      var newThemeClass = 'vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme';

      if (!nodeClass.match(new RegExp(newThemeClass)) ) {

        var newNodeClass;
        var $nodeBase = $('#workbench\\.editors\\.files\\.textFileEditor')
          .first();

        var activeFile = VT_HELPER.getActiveFileForEditor($nodeBase.parent());
        console.log("activeFile=" + activeFile);

        if(activeFile.match(new RegExp('monadutils'))) {
          console.log('found monadutils.js so would set solarizedDark theme here');
          newNodeClass = nodeClass.replace(/vscode-theme.*\b/, solarizedDarkThemeClass);

          // overflow-guard.scrollable-element
          var scrollableClass = $('.editor-left').find('.overflow-guard')
            .children('.monaco-scrollable-element').attr('class');
          var newScrollableClass = scrollableClass.replace(/vscode-theme.*\b/, redThemeClass);
          $('.editor-left').find('.overflow-guard')
          .children('.monaco-scrollable-element')
          .attr('class', newScrollableClass);

          var bodyClass = $('body').attr('class');

          var newBodyClass = bodyClass.replace(/vscode-theme.*\b/, redThemeClass);

          $('body').attr('class', newBodyClass);
        }
        else {
          newNodeClass = nodeClass.replace(/vscode-theme.*\b/, newThemeClass);
        }
        $node.attr('class', newNodeClass);
      }
    }

});