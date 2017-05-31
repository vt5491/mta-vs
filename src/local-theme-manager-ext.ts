import * as vscode from 'vscode';
import {window, commands, Disposable, ExtensionContext,
  StatusBarAlignment, StatusBarItem, TextDocument, extensions} from 'vscode';
import * as fs from "fs-extra";
import * as path from 'path';
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
    public cmdChannel : StatusBarItem
    public mtaExtension
    public storagePath : string

    constructor(params) {
      console.log(`LocalThemeManagerExt.ctor: storagePath=${params.storagePath}`);
      this.fs = params.fs || fs;
      this.YAML = params.YAML || YAML;
      // Note: this is defunct. replace by mtaExtension.extensionPath
      this.themeDir = params.themeDir;
      this.mtaExtension = vscode.extensions.getExtension('vt5491.mta-vs')

      if (!this.cmdChannel) {
        this.cmdChannel = window.createStatusBarItem(StatusBarAlignment.Left);
      }
      this.addActiveEditorChangeListener();

      this.storagePath = params.storagePath;
    }

    public doIt() : number {
      return 7;
    }

    // this is basically the main entry and management method.
    updateLocalThemeManagerExt() {
      var themeList = this.getThemeList()
      vscode.window.showQuickPick(themeList)
        .then(val => {
          if (val) {
            // Update the status bar
            this.cmdChannel.text = `Theme: ${val}`
            this.cmdChannel.show();
          }
        });
    }

    // add a listener for 'onDidChangeActiveTextEditor'
    addActiveEditorChangeListener() {
      vscode.window.onDidChangeActiveTextEditor(
        (event) => {
          // Update the status bar
          this.cmdChannel.text = `Event: activeEditorChange`
          this.cmdChannel.show();
       })
    } 

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

    //Getters and Setters

    public getThemeInfo(theme) : ThemeInfo {
      let themeInfo : ThemeInfo
      var themeFile = this.getThemeDir() + theme + '.yml'

      themeInfo = <ThemeInfo> YAML.load(themeFile);

      return themeInfo
    }

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

    public setDefaultTheme() {
      //set the default theme
      const workbenchConfig = vscode.workspace.getConfiguration('workbench')
      let defaultTheme = workbenchConfig.get('colorTheme')

      if (defaultTheme === 'Default Light+') {
        defaultTheme = 'vs_light_plus';
      }
      
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
      mtavsFn = path.join(this.storagePath, '.mta-vs');
      
      if (!fs.existsSync(mtavsFn)) {
        fs.createFileSync(mtavsFn)
      }

      return mtavsFn;
    }

    // persist the current themeInfo to '.mta-vs.json' in the current dir, so
    // we can restore themes upon restart.
    writeFileLookup(fileLookup) {
      let persistanceFile = this.getMtaVsPersistenceFile();

      fs.writeFileSync(persistanceFile, fileLookup);
    }

    readFileLookup() : {} {
      let persistanceFile = this.getMtaVsPersistenceFile();

      if (fs.existsSync(persistanceFile)) {
        const stats = fs.statSync(persistanceFile)
        const fileSizeInBytes = stats.size

        if (fileSizeInBytes > 0) {
          let s = fs.readFileSync(persistanceFile).toString();
          return s;
        }
      }

      return JSON.stringify({});
    }
}
