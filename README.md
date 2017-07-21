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

To start as a remote server:  
`python -c 'import BaseHTTPServer as bhs, SimpleHTTPServer as shs; bhs.HTTPServer(("0.0.0.0", 8888), shs.SimpleHTTPRequestHandler).serve_forever()'
`  

To start on a different port:    
`python -m SimpleHTTPServer 8001`  

Note: themes starting with 'vs_' are light themes.  Currently, you cannot mix and match light and
dark themes.  If you want to get into light theme mode, do ctrl-shift-p and apply light+ (default
theme) as the starting theme.  You may also need to do a ctrl-r from the javascript console as well.

1) Install Jquery and user libraries into the console:  

`
fetch('https://code.jquery.com/jquery-latest.min.js').then(r => r.text()).then(r => {eval(r); eval(r);}).then( r => {document.MTA_VS = {}; $.when( fetch('http://localhost:8000/editor-theme-change-listener.js').then(r => r.text()).then(r => eval(r)), fetch('http://localhost:8000/local-theme-manager-native.js').then(r => r.text()).then(r => eval(r)), fetch('http://localhost:8000/mta-vs-native.js').then(r => r.text()).then(r => eval(r)) ) .done(function(first_call, second_call, third_call){ console.log('all loaded'); }) .fail(function(){ console.log('load failed'); });})
`

2) Invoke theme dropdown with either ctrl-shift-v or selecting *mta* from the main command prompt (ctlr-shift-p)

3) apply your themes on a file by file basis.

## How to create a theme.yml:
Basic Format:
```
display_name : Abyss
class_name : abyss
class_name_fq : vscode-theme-abyss-themes-Abyss-tmTheme
dom_text : >
    .monaco-editor.vs-dark.vscode-theme-abyss-themes-Abyss-tmTheme .token.comment { color: rgba(34, 51, 85, 1); }

```

2) it's important that the theme start with "vscode-theme".  For instance the amy theme originally looked like:
```
display_name : Amy
class_name : amy
class_name_fq : gerane-Theme-Amy-themes-Amy-tmTheme  
dom_text : >
    .monaco-editor.vs-dark.gerane-Theme-Amy-themes-Amy-tmTheme .token.comment.block { font-style: italic; color: rgba(64, 64, 128, 1); }

```

You have to covert it to be like:

```
display_name : Amy
class_name : amy
class_name_fq : vscode-theme-gerane-Theme-Amy-themes-Amy-tmTheme
dom_text : >
    .monaco-editor.vs-dark.vscode-theme-gerane-Theme-Amy-themes-Amy-tmTheme .token.comment.block { font-style: italic; color: rgba(64, 64, 128, 1); }

```
The reason for this is the code just assumes the classname for a theme starts with 'vscode-theme'.  I really just need to improve the regex expression in 'LocalThemeManagerNative.applyTheme' to be able to detect all the different native theme name formats.


## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Known Issues
2016-05-18:
1. If you ever reset the base vscode theme (using "Set Theme" from the global pallet, and not from mta-vs), you may reset the global theme to a theme that does not start with 'vscode_theme'.  Whenever you start vscode, the physical DOM is initially primed with whatever global theme you last used (and if you always only apply local themes, you may have last set the global theme six months ago).  When you then invoke mta-vs and apply a local theme, it goes to the physical DOM and replaces the class name on a few key dom elements with the new name.  However, it appears to only do this against the "soft" DOM.  That is to say the physical "hard" DOM still stays with the seed global theme.  This is fine, but the regex code expects the seed global DOM to start with 'vscode_theme'.  If you globally apply a theme that doesn't start with "vscode_theme" (which is a lot of them), you've now screwed up the seed environment and the regex won't match, and local themes will not be applied.

Bottom Line is to seed with either "Dark+(default theme)" or the Default light theme _always_ because they start with 'vscode_theme'. You may run into this situation if you want to test out a new theme, but don't want to create the custom .yml file (by going into the DOM header and pulling out the parsed style info and putting into the github dir 'dom-text-themes') until you're sure you like it, and then you forget to reset it back to Dark+ or Light+

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release on 2016-09-01

### 0.2.0
2017-05-30
- Allow for mixed light and dark themes.
- Add support for reloading themes upon Vscode restart (persistent theming).
