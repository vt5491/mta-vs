import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import * as fs from "fs-extra";
import * as YAML from "yamljs";

// export type ThemeInfo<T> = {
export interface ThemeInfo  {
    display_name: string;
    class_name: string;
    class_name_fq: string;
    dom_text: string;
}

export class LocalThemeManagerExt {
    private _statusBarItem: StatusBarItem;
    // private fs : Object;
    // dependencies
    private fs : any; //works
    private YAML: any;    
    public themeDir: string
    
    // private fs : fs;

    constructor(params) {
      this.fs = params.fs || fs;
      this.YAML = params.YAML || YAML; 
      this.themeDir = params.themeDir;
    }

    public doIt() : number { 
      return 7;
    }

// private _layers: { [id: string] : SimpleLayer } = {};
    // return the theme text (suitable for insertion into the dom) 
    // give a theme class name (the filename), and a directory.
    // public getDomTextTheme(themeClass : string, directory : string) : string {
    // public getDomTextTheme(params : {[fs : string], [dir : string] }) : string {
    // public getDomTextTheme({['fs' : string], ['dir' : string] }) : string {
    // public getDomTextTheme({['themeClass' : string] : string}) {
    // public getDomTextTheme(params : {themeClass, dir}) : string {
    public getThemeInfo(theme) : ThemeInfo {
      // let themeInfo = {}
      let themeInfo : ThemeInfo
      // let themeClasses = [];
      // var themeClass = params.themeClass;
      // var dir = params.dir;

      // let r = fs.statSync('/home/vturner/vtstuff/tmp')

      // console.log('LocalThemeManagerClient.getDomThemeClasses: r=' + r)
      var themeFile = this.themeDir + '/' + theme + '.yml'
      console.log('LocalThemeManagerExt.getThemeInfo: themeFile=' + themeFile)
      // var themeFile = '/home/vturner/vtstuff/vscode/dom-text-themes/kimbie_dark.yml'
      // var themeFile = '/vtstuff/vscode/dom-text-themes/kimbie_dark.yml'

      themeInfo = <ThemeInfo> YAML.load(themeFile);
      console.log('LocalThemeManagerExt.getDomTextTheme: themeInfo=' + themeInfo)
      // return themeClasses;
      // let domThemeText = '';

      // domThemeText = this.fs.readFileSync(themeClass, dir)

      // return domThemeText;
      return themeInfo

    }

    // TODO: make dir an instance variable 
    public getThemeList() {
      let fileList : string[] = fs.readdirSync(this.themeDir)
      let themeList : string[] = []

      for( var i=0; i < fileList.length; i++) {
        if( fileList[i].match(/\.yml/)) {
          themeList.push( fileList[i])
        }
      }

      return themeList
    }
}