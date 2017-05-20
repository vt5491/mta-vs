"use strict";
//2016-08-10
// based on code from:
//  http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
//

(document.CmdChannelListenerNative = function () {
  var factory = {};

  factory.doIt = () => {
    return 7;
  };

  factory.observer = new MutationObserver(function(mutations) {
      for( var i =0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) {
          for (var j=0; j < mutations[i].addedNodes.length; j++) {
            var addedNode = mutations[i].addedNodes[j];

            //vtif (typeof addedNode.innerText !== 'undefined' && addedNode.innerText.match(/Theme:/)) {
            if (typeof addedNode.innerText !== 'undefined'
              && (addedNode.innerText.match(/Theme:/) || addedNode.innerText.match(/Event:/))) {
              var cmd = addedNode.innerText;

              if (cmd.match(/Theme:/)) {
                var theme = cmd.split(':')[1].replace(/ /g,'');
                //TODO following line not necessary
                document.localThemeManagerNative.theme = theme;

                var themeInfo;
                fetch('http://localhost:3000' + '?theme=' + theme)
                  .then(r => r.text())
                  .then(r => {
                    var themeInfo = JSON.parse(r);
                    //TODO following line not necessary
                    document.localThemeManagerNative.setThemeInfo(themeInfo);
                    document.localThemeManagerNative.applyTheme(themeInfo);
                  });
              }
              //vt add
              else if (cmd.match(/Event: activeEditorChange/)){
                console.log(`mta-vs-native.MutationObserver: now handling activeEditorChange`);
                let theme = document.localThemeManagerNative.getEditorThemeFromClass();
                console.log(`mta-vs-native.MutationObserver: current theme on active editor=${theme}`);
              }
              //vt end
            }
          }
        }
      } // for
  });

  factory.observe = function () {
    this.observer.observe($('#workbench\\.parts\\.statusbar')[0], {
    //TODO: this is a pretty rigid query.  Needs to be generalized e.g it basically
    // assumes our statusbar-entry is the first etc
    //The following (commented out) query doesn't work becuase it's on the node itself, and vscode doesn't
    // alter the node but replaces it.  Once vscode replaces the node, our hook is gone.
    // Thus, you always have to put your listener on the parent of the actual node.  Unfortuantely,
    // this leads to a lot of extra events becuase you have to specify 'childList:true'
    // and 'subtree:true', so you hook all the sibling events as well.
    // this.observer.observe($('#workbench\\.parts\\.statusbar').find('.statusbar-entry:eq(0)')[0], {
    // document.cmd_observer = this.observer;
    // document.cmd_observer.observe($('.vt-class')[0], {
    // this.observer.observe($('.vt-class')[0], {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true
    });
  }

  return factory;
}
)()

//@ sourceURL=cmd-channnel-listener-native.js
