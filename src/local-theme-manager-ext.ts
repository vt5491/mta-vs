import * as vscode from 'vscode';
import {window, commands, Disposable, ExtensionContext,
  StatusBarAlignment, StatusBarItem, TextDocument, extensions} from 'vscode';
import * as fs from "fs-extra";
import * as YAML from "yamljs";

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
      this.fs = params.fs || fs;
      this.YAML = params.YAML || YAML;
      // Note: this is defunct. replace by mtaExtension.extensionPath
      this.themeDir = params.themeDir;
      this.mtaExtension = vscode.extensions.getExtension('vt5491.mta-vs')

      if (!this.cmdChannel) {
        this.cmdChannel = window.createStatusBarItem(StatusBarAlignment.Left);
      }
    }

    public doIt() : number {
      return 7;
    }

    // this is basically the main entry and management method.
    updateLocalThemeManagerExt() {
      var themeList = this.getThemeList()
      vscode.window.showQuickPick(themeList)
        .then(val => {
          // Update the status bar
          this.cmdChannel.text = `Theme: ${val}`
          this.cmdChannel.show();
        });
    }

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

      // //vt add
      // // add the files under 'light_themes' as well
      // fileList = fs.readdirSync(this.getThemeDir() + '/light_themes');
      // console.log('getThemeList: fileList (light)=' + fileList);
      //
      // for( var i=0; i < fileList.length; i++) {
      //   if( fileList[i].match(/\.yml/)) {
      //     var themeName = fileList[i].replace(/\.yml/, '')
      //     themeList.push( 'light_themes/' + themeName);
      //   }
      // }
      //vt end
      return themeList
    }

    public getThemeDir() {
      var themeDir = this.mtaExtension.extensionPath.replace(/\\/g, "/");

      // normalize to unix conventions
      return themeDir + '/dom-text-themes/'
    }
}
