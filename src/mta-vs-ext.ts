'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import {CmdServerExt} from './cmd-server-ext';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mta-vs" is now active!');
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    console.log('mta-vs: mta-vscode.themeDir=' + mtaVscode.themeDir)
    var mtaServerActive: boolean = false;

    let localThemeManagerExt = new LocalThemeManagerExt({
        themeDir : mtaVscode.themeDir
    })

    // let exts = vscode.extensions.all;
    // console.log('LocalThemeManagerClient.activate: exts.length=' + exts.length)
    // console.log('LocalThemeManagerClient.activate: exts=' + exts)
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mta-vs.mta-vs', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        // vscode.window.showInformationMessage('mta-vs: Hello World!');
        // console.log('mta-vs: now calling LocalThemeManagerExt')
        // var result = localThemeManagerExt.getThemeInfo("abc", "abc")
        // console.log('mta-vs: result=' + result)
        // console.log('mta-vs: result=' + workspaceConfig)
        // var editor : any = workspaceConfig.get('editor')
        // console.log('mta-vs: editor.fontSize=' + editor.fontSize)
        // console.log('mta-vs. editor.fontSize' + workspaceConfig.has('editor'))
        // check if the server is active. 
        // if not start it up ourselves, so the user doesn't have to manually start
        if (!mtaServerActive) {
            console.log('mta-vs: now starting cmdServerExt automatically')
            let cmdServerExt = new CmdServerExt()

            mtaServerActive = true;
            cmdServerExt.start()
        }

        localThemeManagerExt.updateLocalThemeManagerExt()
     
    // TODO: make dir an instance variable 

    });

    context.subscriptions.push(disposable);

    let disposableServer = vscode.commands.registerCommand('mta-vs.server', () => {
        if (!mtaServerActive) {
            console.log('mta-vs: now starting cmdServerExt')
            let cmdServerExt = new CmdServerExt()

            mtaServerActive = true;
            cmdServerExt.start()
        }
    }) 

    context.subscriptions.push(disposableServer);
}

// this method is called when your extension is deactivated
export function deactivate() {
}