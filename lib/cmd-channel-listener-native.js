"use strict";
//2016-08-10
// based on code from:
//  http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
//
//fetch('http://localhost:8000/statusBarListener.js').then(r => r.text()).then(r => eval(r))
//
// super setup (do after doing ctrl-r from developer tools)
// and running wordcount so a status message appears.
/*
1)
fetch('http://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);});

2)
// then do a word setup so a "Theme:" appears in the status line
// then do 'mta-vs-server' to start a server on port 3000
fetch('http://localhost:8000/cmd-channel-listener-native.js').then(r => r.text()).then(r => eval(r));

3) then select 'mta-server' from the dropdown
4) then change the theme with 'mta-vs'
*/

//TODO: remove this dependency
// $('#workbench\\.parts\\.statusbar').addClass('vt-class');

//(function CmdChannelListenerNative () {
// This has to be a global because we need addressability inside the observer,
// but 'this' refers to the observer in there.
// the following instantiation is now done in local-theme-manager-native.js
//  document.localThemeManagerNative = new document.LocalThemeManagerNative();

(document.CmdChannelListenerNative = function () {
  var factory = {};

  factory.doIt = () => {
    return 7;
  };

  factory.observer = new MutationObserver(function(mutations) {
      console.log('CmdChannelListenerNative.observer entered');
      for( var i =0; i < mutations.length; i++) {
        console.log('observer: mutations[' + i + '].type=' + mutations[i].type
          + ', target=' + mutations[i].target
        );

        if (mutations[i].addedNodes.length > 0) {
          for (var j=0; j < mutations[i].addedNodes.length; j++) {
            var addedNode = mutations[i].addedNodes[j];
            console.log('addedNode.innerText=' + addedNode.innerText);

            if (typeof addedNode.innerText !== 'undefined' && addedNode.innerText.match(/Theme:/)) {
              // console.log('about to call sayHello');
              console.log('cmd=' + addedNode.innerText);
              var cmd = addedNode.innerText;

              if (cmd.match(/Theme:/)) {
                var theme = cmd.split(':')[1].replace(/ /g,'');
                //TODO following line not necessary
                document.localThemeManagerNative.theme = theme;
                console.log('theme=' + theme);

                var themeInfo;
                fetch('http://localhost:3000' + '?theme=' + theme)
                  .then(r => r.text())
                  // .then(r => console.log('fetch msg=' + r))
                  .then(r => {
                    // console.log('r=' + r);
                    // console.log('jsyaml.load=' + jsyaml.load(r));
                    var themeInfo = JSON.parse(r);
                    //TODO following line not necessary
                    document.localThemeManagerNative.setThemeInfo(themeInfo);
                    //document.localThemeManagerNative.applyTheme(document.localThemeManagerNative.theme, themeInfo);
                    document.localThemeManagerNative.applyTheme(themeInfo);
                    // console.log('cmd-channel-listener-native: document.localThemeManagerNative=' + document.localThemeManagerNative);
                    // console.log('cmd-channel-listener-native: themeInfo=' + document.localThemeManagerNative.themeInfo);
                    // console.log('cmd-channel-listener-native: themeInfo.class_name_fq=' + document.localThemeManagerNative.themeInfo.class_name_fq);
                    // console.log('cmd-channel-listener-native: themeInfo.dom_text=' + document.localThemeManagerNative.themeInfo.dom_text);
                  });
                // debugger;
                // console.log('document.localThemeManagerNative.doIt() says: ' + document.localThemeManagerNative.doIt());
              }
            }
          }
        }
      }
  });


  // observer.observe($('.vt-class')[0], {
  // factory.observe = () => {
  factory.observe = function () {
    // $('#workbench\\.parts\\.statusbar').addClass('vt-class');
    // console.log('factory.observe: $.find=' + $.find);
    this.observer.observe($('#workbench\\.parts\\.statusbar')[0], {
    // document.cmd_observer = this.observer;
    // document.cmd_observer.observe($('.vt-class')[0], {
    // this.observer.observe($('.vt-class')[0], {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true
    });
  }

  //
  return factory;
}
)()

//@ sourceURL=cmd-channnel-listener-native.js
