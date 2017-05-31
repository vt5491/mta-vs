import * as vscode from 'vscode';
import * as http from "http";
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import * as YAML from "yamljs";
var MTA_VS = require('./mta-vs-ext');

export class CmdServerExt {

  public server : any

  public start() {
    this.server = http.createServer(function (req, res) {
      var reqKey, reqValue;
      [reqKey, reqValue] = req.url.split("=");

      reqKey = reqKey.replace(/^\/\?/,'')

      let localThemeManagerExt = MTA_VS.getLocalThemeManagerExt();

      if (reqKey === 'theme') {
        var theme = reqValue;
        var workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
        var mtaVscode: any = workspaceConfig.get('mta-vscode')

        var themeInfo = localThemeManagerExt.getThemeInfo(theme);
        res.end(JSON.stringify(themeInfo));
      }
      else if (reqKey === 'writeFileLookup') {
        localThemeManagerExt.writeFileLookup(reqValue);
      }
      else if (reqKey === 'readFileLookup') {
        res.end(localThemeManagerExt.readFileLookup());
      }
    })

    // determine what port we should start on
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    var port = mtaVscode.server.port || 3000;
    var workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode: any = workspaceConfig.get('mta-vscode')
    let localThemeManagerExt = new LocalThemeManagerExt({
      themeDir: mtaVscode.themeDir
    });
    this.server.on('error', (e) => {
      console.log(`CmdServerExt.start: error:${e}`);
    });
    // A listen event is fired whenever the server becomes active for the first time.
    // In other words, this is a one time event, not a recurring event.  Basically think
    // of this as an 'onready' event.
    this.server.listen(port, function(){
      localThemeManagerExt.setDefaultTheme()
      // and trigger a cmdChannel event to let native side know the server is
      // up and to do any server dependent processing, such as loading fileLookup
      localThemeManagerExt.cmdChannel.text = `Event: cmdServerUp`
      localThemeManagerExt.cmdChannel.show();
    });
  }
}