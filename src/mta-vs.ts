'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {LocalThemeManagerExt} from './local-theme-manager-ext';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "mta-vs" is now active!');

    let localThemeManagerExt = new LocalThemeManagerExt({})

    let exts = vscode.extensions.all;
    console.log('LocalThemeManagerClient.activate: exts.length=' + exts.length)
    console.log('LocalThemeManagerClient.activate: exts=' + exts)
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mta-vs.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('mta-vs: Hello World!');
        // console.log('mta-vs: now calling LocalThemeManagerExt')
        // var result = localThemeManagerExt.getThemeInfo("abc", "abc")
        // console.log('mta-vs: result=' + result)
        var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
        console.log('mta-vs: result=' + workspaceConfig)
        var editor : any = workspaceConfig.get('editor')
        console.log('mta-vs: editor.fontSize=' + editor.fontSize)
        console.log('mta-vs. editor.fontSize' + workspaceConfig.has('editor'))

        var mtaVscode : any = workspaceConfig.get('mta-vscode')
        console.log('mta-vs: mta-vscode.themeDir=' + mtaVscode.themeDir)
        console.log('mta-vs: mta-vscode.themeDir2=' + mtaVscode.themeDir2)
        var a: number =7
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}