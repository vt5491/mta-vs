import * as vscode from 'vscode';
import * as http from "http";
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import * as YAML from "yamljs";

export class CmdServerExt {

  public server : any

  public start() {
    this.server = http.createServer(function (req, res) {
      var theme = req.url.split('=')[1];
      var workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
      var mtaVscode: any = workspaceConfig.get('mta-vscode')

      let localThemeManagerExt = new LocalThemeManagerExt({
        themeDir: mtaVscode.themeDir
      })

      var themeInfo = localThemeManagerExt.getThemeInfo(theme);
      res.end(JSON.stringify(themeInfo));
    })

    // determine what port we should start on
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    console.log('mta-vs: mta-vscode.server.port=' + mtaVscode.server.port)
    var port = mtaVscode.server.port || 3000;
    this.server.listen(port)
  }
}