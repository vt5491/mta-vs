// 2016-08-22
//
// This is the wrapper for the native side
/*


1a) load jquery (note: may need a real active file open for this to work)
Note: get message 'VM148:52 Uncaught (in promise) TypeError: Failed to execute 'observe' on 'MutationObserver': parameter 1 is not of type 'Node'.(…)'
if a real file is not open and active, when loading the second file.
Note: refer to yaml libray as 'jsyaml' e.g. 'jsyaml.load()'
fetch('http://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);});

fetch('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.6.1/js-yaml.min.js').then(r => r.text()).then(r => {eval(r);});
fetch('http://localhost:8000/local-theme-manager-native.js').then(r => r.text()).then(r => eval(r));
fetch('http://localhost:8000/mta-vs-native.js').then(r => r.text()).then(r => eval(r));

1b) make sure you're editing a real file.

1c) load all the other files
Note: I dont need js-yaml anymore
$.when(
    fetch('https://cdnjs.cloudflare.com/ajax/libs/js-yaml/3.6.1/js-yaml.min.js').then(r => r.text()).then(r => {eval(r);}),
    fetch('http://localhost:8000/local-theme-manager-native.js').then(r => r.text()).then(r => eval(r)),
    fetch('http://localhost:8000/mta-vs-native.js').then(r => r.text()).then(r => eval(r))
    )
    .done(function(first_call, second_call, third_call){
      console.log('all loaded');
    })
    .fail(function(){
      console.log('load failed');
    });
2a)
// then do a word setup so a "Theme:" appears in the status line

2b) then open a real file (not just the default untitled.txt)
test: make sure:
document.getElementById('workbench.editors.files.textFileEditor')

3) then select 'mta-server' from the dropdown
-> do a netstat -atn | grep 3000 to verify

4) then change the theme with 'mta-vs'
*/

//dynamically pull in the cmd-channel-listener-native/
// fetch('http://code.jquery.com/jquery-latest.min.js')
// .then(r => r.text())
// .then(r => 
//   {return new Promise(function (resolve,reject) {
//     eval(r); eval(r); resolve();})
//   })
// .then(() => {
// fetch('http://code.jquery.com/jquery-latest.min.js')
//   .then(r => r.text()).then(r => {eval(r); eval(r);})
//   .then(() => eval(
// //sleep(5000).then(() => {
//   setTimeout( () => {
//     // Do something after the sleep!
//     console.log('back from sleep. now loading channel listener');

// This following stanza works, but I cannot get it to load before
// the cmd-channel stanza next.  So for now, must manually load
// 'local-theme-manager-native'
// console.log('about to fetch local-theme-manager-native.js');
// fetch('http://localhost:8000/local-theme-manager-native.js')
//   .then(r => r.text())
//   .then(r => eval(r));

// the following comment out works
console.log('about to fetch cmd-channel-listener-native.js');
fetch('http://localhost:8000/cmd-channel-listener-native.js')
  .then(r => r.text())
  .then(r => eval(r))
  .then(() => {
    console.log('mta-vs-naitve: now in final then for cmd-channel-listener setup')
    // console.log('mta-vs-naitve: document.cmd_p1=' + document.cmd_p1);
    // cmdChannelListenerNative = document.CmdChannelListenerNative();
    // console.log('inner: document.CmdChannelListenerNative=' + document.CmdChannelListenerNative);
    var cmdChannelListenerNative = new document.CmdChannelListenerNative();
    console.log('inner: cmdChannelListenerNative=' + cmdChannelListenerNative);
    // debugger;
    cmdChannelListenerNative.observe();
    // document.cmdChannelListenerNative.observe();
    // document.cmd_p1.then(() => {
    //   console.log('inner: document.cmdChannelListenerNative=' + document.cmdChannelListenerNative);
    //   debugger;
    //   console.log('inner: doIt=' + document.cmdChannelListenerNative.doIt());
    //   document.cmdChannelListenerNative.observe();
    //   // document.cmdChannelListenerNative.observe();
    // }
    // );
  });
// }, 5000)
//   ) //end eval
//   )

// }
// )

          //console.log('found monadutils.js so would set red theme here');