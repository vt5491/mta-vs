# mta-vs

mta-vs stands for "Multi-Theme-Applicator-VScode".  It allows you to apply multipe syntax themes to vscode.  

There is a sister project to this, available for *Atom*,
[located here](http://code.visualstudio.com/docs/languages/markdownhttps://atom.io/packages/multi-theme-applicator).  It has much the same functionality, so refer to that project for sample screen prints.

Unfortunately, because vscode [does not allow direct manipulation of the DOM](https://code.visualstudio.com/docs/extensions/our-approach), this plugin requires an unofficial method to update the dom (it requires you install javascript libraries into the vscode runtime via the developers's console).  As a result, I cannot really make this availabe as an official plugin under the vscode marketplace.

This document describes the special installation process necessary to get the plugin working.

## Features
It allows for file level theming.

## Installation
0) prelim: start a server from the lib dir:  
python -m SimpleHTTPServer (python 2.x) (linux)  
python -m http.server  (python 3.x) (windows)  

1) Install Jquery into the console:  

fetch('http://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);});

2) Install the user libraries from the JS console:  

`
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
`

3) Invoke theme dropdown with either ctrl-shift-v or selecting *mta* from the main command prompt (ctlr-shift-p)

4) apply your themes on a file by file basis.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release on 2016-09-01
