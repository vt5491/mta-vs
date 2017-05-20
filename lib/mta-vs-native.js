 // 2016-08-22
//
// This is the wrapper for the native side
/*
prelim: start a server from the lib dir:
python -m SimpleHTTPServer (python 2.x) (linux)
python -m http.server  (python 3.x) (windows)

1a) load jquery (note: may need a real active file open for this to work)
Note: get message 'VM148:52 Uncaught (in promise) TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.(…)'
if a real file is not open and active, when loading the second file.
Note: refer to yaml libray as 'jsyaml' e.g. 'jsyaml.load()'
fetch('http://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);});

1b) make sure you're editing a real file.
test: make sure:
document.getElementById('workbench.editors.files.textFileEditor')

1c) load all the other files
Note: you'll get this message if not in a split-panel
  'editor-theme-change-listener.js:39 Uncaught (in promise) TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node''

document.MTA_VS = {};
$.when(
    fetch('http://localhost:8000/editor-theme-change-listener.js').then(r => r.text()).then(r => eval(r)),
    fetch('http://localhost:8000/local-theme-manager-native.js').then(r => r.text()).then(r => eval(r)),
    fetch('http://localhost:8000/mta-vs-native.js').then(r => r.text()).then(r => eval(r))
    )
    .done(function(first_call, second_call, third_call){
      console.log('all loaded');
    })
    .fail(function(){
      console.log('load failed');
    });

// Note: server now automatically starts when your run 'mta-vs'
3)
// then do a word setup so a "Theme:" appears in the status line


4) then change the theme with 'mta-vs'
*/
fetch('http://localhost:8000/cmd-channel-listener-native.js')
  .then(r => r.text())
  .then(r => eval(r))
  .then(() => {
    console.log('mta-vs-naitve: Now in final then for cmd-channel-listener setup.')
    var cmdChannelListenerNative = new document.CmdChannelListenerNative();
    cmdChannelListenerNative.observe();
  });

//@ sourceURL=mta-vs-native.js
