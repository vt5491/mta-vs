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

//TODO: remove this dependencyjjjjjj
// $('#workbench\\.parts\\.statusbar').addClass('vt-class');

//(function CmdChannelListenerNative () {
// This has to be a global because we need addressability inside the observer,
// but 'this' refers to the observer in there.
document.localThemeManagerNative = new document.LocalThemeManagerNative();

(document.CmdChannelListenerNative = function () {
  var factory = {};

  //TODO pretty sure you can remove this
  // factory.$target =  $('.statusbar-item.left.statusbar-entry').children();

  factory.doIt = () => {
    return 7;
  };

  console.log('CmdChannelListenerNative: document.LocalThemeManagerNative=' + document.LocalThemeManagerNative);
  factory.localThemeManagerNative = new document.LocalThemeManagerNative();

  factory.observer = new MutationObserver(function(mutations) {
  // factory.observer = new MutationObserver((mutations) => {
      console.log('observer entered');
      for( var i =0; i < mutations.length; i++) {
        console.log('observer: mutations[' + i + '].type=' + mutations[i].type
          + ', target=' + mutations[i].target
        );

        if (mutations[i].addedNodes.length > 0) {
          for (var j=0; j < mutations[i].addedNodes.length; j++) {
            var addedNode = mutations[i].addedNodes[j];
            console.log('addedNode.innerText=' + addedNode.innerText);

            if (typeof addedNode.innerText !== 'undefined' && addedNode.innerText.match(/Theme:/)) {
              console.log('about to call sayHello');
              console.log('cmd=' + addedNode.innerText)
              fetch('http://localhost:3000')
                .then(r => r.text())
                .then(r => console.log('fetch msg=' + r))
               // and farm the main work handling back to local-theme-manager-native
              // var ltmn = new document.LocalThemeManagerNative(); 
              // console.log('ltmn.doIt() says: ' + ltmn.doIt());
              // debugger;
              // console.log('cmd-channel-listener-native: this.localThemeManagerNative=' + this.localThemeManagerNative);
              // console.log('this.localThemeManagerNative.doIt() says: ' + this.localThemeManagerNative.doIt());
              //NEXT: call applyTheme here instead.
              console.log('cmd-channel-listener-native: document.localThemeManagerNative=' + document.localThemeManagerNative);
              console.log('document.localThemeManagerNative.doIt() says: ' + document.localThemeManagerNative.doIt());
              //setupTheme.sayHello();
              // setupTheme.applyTheme();
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

  return factory;
}
)() 
// document.cmd_p1 = new Promise(
//   // The resolver function is called with the ability to resolve or
//   // reject the promise
//   function (resolve, reject) {
//     console.log('about to get document.cmdChannelListenerNative ');
//     document.cmdChannelListenerNative = new document.CmdChannelListenerNative();
//     console.log('done getting document.cmdChannelListenerNative ');
//     console.log('cmd-channnel-listener-native: document.cmdChannelListenerNative=' + document.cmdChannelListenerNative)
//     resolve();
//   })

// document.cmdChannelListenerNative = new document.CmdChannelListenerNative();