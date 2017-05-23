import * as vscode from 'vscode';
import {window, commands, Disposable, ExtensionContext,
  StatusBarAlignment, StatusBarItem, TextDocument, extensions} from 'vscode';
import * as fs from "fs-extra";
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

    constructor(params) {
      //vt add
      console.log(`LocalThemeManagerExt.ctor: entered`);
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
      let defaultTheme = 'vs_light_plus';
      // defaultTheme += ".yml";
      if (!this.cmdChannel) {
        this.cmdChannel = window.createStatusBarItem(StatusBarAlignment.Left);
      };
      this.cmdChannel.text = `setDefaultTheme: ${defaultTheme}`;
      this.cmdChannel.show();
    }
    //vt end
}
