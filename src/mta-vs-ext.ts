'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import {CmdServerExt} from './cmd-server-ext';

//vt add
// var MTA_VS : any = {'abc' : 7};
var MTA_VS : any = {};
exports MTA_VS;
// module.exports.MTA_VS = {'abc' : 7};
// module.exports.MTA_VS;
// var MTA_VS_localThemeManagerExt : LocalThemeManagerExt;
// module.exports.MTA_VS_localThemeManagerExt;
// exports MTA_VS_localThemeManagerExt;
// module.exports.abc = 8; //works
// vscode.MTA_VS : any = {};
// let global.MTA_VS :any = {};
// exports MTA_VS['localThemeManagerExt'];
// exports LocalThemeManagerExt;
// export MTA_VS = {};
// exports MTA_VS;
// global.MTA_VS :any = {};
// MTA_VS.localThemeManagerExt : LocalThemeManagerExt;
// exports var storagePath;
//vt end
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log(`MtaVsExt.activate: __dirname=${__dirname}`);
    
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    var mtaServerActive: boolean = false;

    // let localThemeManagerExt = new LocalThemeManagerExt({
    // MTA_VS_localThemeManagerExt = new LocalThemeManagerExt({
    // export localThemeManagerExt = new LocalThemeManagerExt({
    MTA_VS['localThemeManagerExt'] = new LocalThemeManagerExt({
        themeDir : mtaVscode.themeDir,
        //vt add
        storagePath : context.storagePath 
        //vt end
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

        //vtlocalThemeManagerExt.updateLocalThemeManagerExt()
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
    console.log(`MtaVsExt.deactivate: entered`);
    //vt comment out
    // MTA_VS.localThemeManagerExt.deactivate();
}

//vt add
export function getLocalThemeManagerExt() {
    return MTA_VS.localThemeManagerExt;
}
//vt end