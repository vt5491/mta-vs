//2016-08-10
// based on code from:
//  http://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
//
//fetch('http://localhost:8000/statusBarListener.js').then(r => r.text()).then(r => eval(r))
//
// super setup (do after doing ctrl-r from developer tools)
// and running wordcount so a status message appears.
/*
fetch('http://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);});

// then do a word setup so a "Theme:" appears in the status line
// then do 'mta-vs-server' to start a server on port 3000
fetch('http://localhost:8000/cmd-channel-listener.js').then(r => r.text()).then(r => eval(r));
*/


// var setupTheme = new document.SetupTheme();
// add 'vt-class' to the parent div, so we can more easily identify it
$('#workbench\\.parts\\.statusbar').addClass('vt-class');

var $target =  $('.statusbar-item.left.statusbar-entry').children();

// var observer = new MutationObserver(function(mutations) {
//     //$('#log').text('input text changed: "' + target.text() + '"');
//     console.log('-->mo: mutations=' + mutations + ', length=' + mutations.length);
//     for( var i =0; i < mutations.length; i++) {
//       console.log('mo: mutations[' + i + '].type=' + mutations[i].type
//         + ', target=' + mutations[i].target );
//     }
//     //console.log('input text changed: "' + $target.text() + '"');
// });

var observer = new MutationObserver(function(mutations) {
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
            //setupTheme.sayHello();
            // setupTheme.applyTheme();
          }
        }
      }
    }
});

// observer.observe($target[1], {
//   childList: true,
//   characterData: true,
//   subtree: true,
//   attributes: true
// });

observer.observe($('.vt-class')[0], {
  childList: true,
  characterData: true,
  subtree: true,
  attributes: true
});