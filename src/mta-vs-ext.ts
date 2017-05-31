'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import {CmdServerExt} from './cmd-server-ext';

var MTA_VS : any = {};
exports MTA_VS;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log(`MtaVsExt.activate: __dirname=${__dirname}`);
    console.log(`MtaVsExt.activate: context.storagePath=${context.storagePath}`);
    
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    var mtaServerActive: boolean = false;

    MTA_VS['localThemeManagerExt'] = new LocalThemeManagerExt({
        themeDir : mtaVscode.themeDir,
        storagePath : context.storagePath 
    })

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('mta-vs.mta-vs', () => {
        // The code you place here will be executed every time your command is executed

        // check if the server is active. 
        // if not start it up ourselves, so the user doesn't have to manually start
        if (!mtaServerActive) {
            console.log('mta-vs: Now starting cmdServerExt.')
            let cmdServerExt = new CmdServerExt()

            mtaServerActive = true;
            cmdServerExt.start()
        }

        MTA_VS.localThemeManagerExt.updateLocalThemeManagerExt()
    });

    context.subscriptions.push(disposable);

    let disposableServer = vscode.commands.registerCommand('mta-vs.server', () => {
        if (!mtaServerActive) {
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

export function getLocalThemeManagerExt() {
    return MTA_VS.localThemeManagerExt;
}