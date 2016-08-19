import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import * as fs from "fs-extra";
import * as YAML from "yamljs";

export class LocalThemeManagerExt {
    private _statusBarItem: StatusBarItem;
    // private fs : Object;
    private fs : any; //works
    // private fs : fs;

    constructor(params) {
      this.fs = params.fs || fs;
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
    public getThemeInfo(themeClass, dir) {
      let themeInfo = {}
      // let themeClasses = [];
      // var themeClass = params.themeClass;
      // var dir = params.dir;

      // let r = fs.statSync('/home/vturner/vtstuff/tmp')

      // console.log('LocalThemeManagerClient.getDomThemeClasses: r=' + r)
      // var themeFile = dir + '/' + themeClass + '.yml'
      var themeFile = '/home/vturner/vtstuff/vscode/dom-text-themes/kimbie_dark.yml'

      themeInfo = YAML.load(themeFile);
      console.log('LocalThemeManagerExt.getDomTextTheme: themeInfo=' + themeInfo)
      // return themeClasses;
      // let domThemeText = '';

      // domThemeText = this.fs.readFileSync(themeClass, dir)

      // return domThemeText;
      return themeInfo

    }
}