import * as vscode from 'vscode';
import {window, commands, Disposable, ExtensionContext,
  StatusBarAlignment, StatusBarItem, TextDocument, extensions} from 'vscode';
import * as fs from "fs-extra";
//vt add
// import {join} from 'path';
import * as path from 'path';
//vt end
import * as YAML from "yamljs";
//vt add
// var app = require('app');
// import * as app from 'app';
// var BrowserWindow = require('browser-window')
// const {BrowserWindow} = require('electron');
// var ipc = require('ipc');
//vt end

export interface ThemeInfo  {
    display_name: string;
    class_name: string;
    class_name_fq: string;
    dom_text: string;
}

export class LocalThemeManagerExt {
    // dependencies
    private fs : any; //works
    private YAML: any;
    public themeDir: string
    private cmdChannel : StatusBarItem
    public mtaExtension
    //vt add
    public storagePath : string
    // private path : any;
    //vt end

    constructor(params) {
      //vt add
      console.log(`LocalThemeManagerExt.ctor: entered`);
      console.log(`LocalThemeManagerExt.ctor: storagePath=${params.storagePath}`);
      //vt end
      this.fs = params.fs || fs;
      this.YAML = params.YAML || YAML;
      // Note: this is defunct. replace by mtaExtension.extensionPath
      this.themeDir = params.themeDir;
      this.mtaExtension = vscode.extensions.getExtension('vt5491.mta-vs')

      if (!this.cmdChannel) {
        this.cmdChannel = window.createStatusBarItem(StatusBarAlignment.Left);
      }
      //vt add
      this.addActiveEditorChangeListener();
      // this.addCloseTerminalListener();

      //vt add
      this.storagePath = params.storagePath;
      // this.getMtaVsPersistenceFile();
      //vt end
      //set the default theme
      // console.log(`LocalThemeManagerExt.ctor: setting default theme`);
      // let defaultTheme = 'vs_light_plus';
      // // defaultTheme += ".yml";
      // this.cmdChannel.text = `setDefaultTheme: ${defaultTheme}`;
      // this.cmdChannel.show();
      //vt end
    }

    public doIt() : number {
      return 7;
    }

    // this is basically the main entry and management method.
    updateLocalThemeManagerExt() {
      var themeList = this.getThemeList()
      vscode.window.showQuickPick(themeList)
        .then(val => {
          //vt add
          if (val) {
            //vt end
            // Update the status bar
            this.cmdChannel.text = `Theme: ${val}`
            this.cmdChannel.show();
          //vt add
          }
          //vt end
        });
    }

    //vt add
    // add a listener for 'onDidChangeActiveTextEditor'
    addActiveEditorChangeListener() {
      console.log(`LocalThemeManagerExt.addActiveEditorChangeLister: entered`);
      
      vscode.window.onDidChangeActiveTextEditor(
        (event) => {
          console.log(`LocalThemeManagerExt: active editor changed, event.id=${event.id}`);
          console.log(`LocalThemeManagerExt: activeEditor=${vscode.window.activeTextEditor}`);
          // debugger;
          // Update the status bar
          this.cmdChannel.text = `Event: activeEditorChange`
          this.cmdChannel.show();
       })
    } 

    // addCloseTerminalListener() {
    //   vscode.window.onDidCloseTerminal(
    //     (event) => {
    //       console.log(`LocalThemeManagerExt.onDidCloseTerminal: now handling event ${event}`);
          
    //     }
    //   )
    // }

    //vt end

    //vt add
    public deactivate() {
      console.log(`LocalThemeManager.deactivate: entered`);
      // Update the status bar
      // the following causes 'cmd-channel-listener-native' to drive
      // cmd-server-ext.ts to fire off the server with a post of 'themeInfo=blah'.
      // then cmd-server call writeThemeInfo in localThemeManagerExt (e.g this module)
      // So it all come back full circle to this module.
      this.cmdChannel.text = `getThemeInfo`
      this.cmdChannel.show();

      //note we get the response (themeInfo JSON) in CmdServerExt under the start().createServer() function
      
    }
    //vt end

    //Getters and Setters

    public getThemeInfo(theme) : ThemeInfo {
      let themeInfo : ThemeInfo
      var themeFile = this.getThemeDir() + theme + '.yml'

      themeInfo = <ThemeInfo> YAML.load(themeFile);

      return themeInfo
    }

    //TODO: update this to use getThemeDir
    public getThemeList() {
      let fileList : string[] = fs.readdirSync(this.getThemeDir())
      let themeList : string[] = []

      for( var i=0; i < fileList.length; i++) {
        if( fileList[i].match(/\.yml/)) {
          var themeName = fileList[i].replace(/\.yml/, '')
          themeList.push( themeName)
        }
      }
      return themeList;
    }

    public getThemeDir() {
      var themeDir = this.mtaExtension.extensionPath.replace(/\\/g, "/");

      // normalize to unix conventions
      return themeDir + '/dom-text-themes/'
    }

    //vt add
    public setDefaultTheme() {
      //set the default theme
      console.log(`LocalThemeManagerExt.setDefaultTheme: setting default theme`);
      // let defaultTheme = 'vs_light_plus';
      const workbenchConfig = vscode.workspace.getConfiguration('workbench')
      let defaultTheme = workbenchConfig.get('colorTheme')

      if (defaultTheme === 'Default Light+') {
        defaultTheme = 'vs_light_plus';
      }
      console.log(`LocalThemeManagerExt.setDefaultTheme: official theme=${defaultTheme}`);
      
      // defaultTheme += ".yml";
      if (!this.cmdChannel) {
        this.cmdChannel = window.createStatusBarItem(StatusBarAlignment.Left);
      };
      this.cmdChannel.text = `setDefaultTheme: ${defaultTheme}`;
      this.cmdChannel.show();
    }

    // this function returns the path to the .mta-vs file.  If the file does not
    // exist, it will create one.  By abstracting this out as a separate function,
    // this allows us to have one place that is repsonsible for the 'policy' of this
    // file i.e it's location.  If we ever decide to alter this policy, then we
    // only need to update this one function and not (potentially) ten places in the
    // code where we have, for example, the default path hard-coded.
    getMtaVsPersistenceFile() {
      let mtavsFn = '';
      console.log(`LocalThemeManagerExt.getMtaVsPersistenceFile: entered`);
      console.log(`LocalThemeManagerExt.getMtaVsPersistenceFile: storagePath=${this.storagePath}`);
      // console.log(`__dirname=${__dirname}`);

      // mtavsFn = __dirname;
      mtavsFn = path.join(this.storagePath, '.mta-vs');
      // mtavsFn = this.storagePath + '\\.mta-vs';
      console.log(`LocalThemeManagerExt.getMtaVsPersistenceFile: mtavsFn=${mtavsFn}`);
      
      if (!fs.existsSync(mtavsFn)) {
        fs.createFileSync(mtavsFn)
      }

      return mtavsFn;

    }

    // persist the current themeInfo to '.mta-vs.json' in the current dir, so
    // we can restore themes upon restart.
    writeThemeInfo(themeInfo) {
      let persistanceFile = this.getMtaVsPersistenceFile();

      fs.writeJsonSync(persistanceFile, themeInfo);
    }

    //vt end
}
