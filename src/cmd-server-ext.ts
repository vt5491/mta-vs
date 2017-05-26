import * as vscode from 'vscode';
import * as http from "http";
import {LocalThemeManagerExt} from './local-theme-manager-ext';
import * as YAML from "yamljs";
//vt add
// var MTA_VS = require('./mta-vs-ext').MTA_VS;
// var abc = require('./mta-vs-ext').abc;
// var abc = require('./mta-vs-ext'); // works
var MTA_VS = require('./mta-vs-ext');
// var MTA_VS_localThemeManagerExt = require('./mta-vs-ext');
// import {abc} from './mta-vs-ext';
//vt end

export class CmdServerExt {

  public server : any

  public start() {
    this.server = http.createServer(function (req, res) {
      //vt add
      var reqKey, reqValue;
      [reqKey, reqValue] = req.url.split("=");

      // remove the leading '/?'
      // reqKey = reqKey.replace(/[\\/|\\?]/g,'')
      reqKey = reqKey.replace(/^\/\?/,'')

      if (reqKey === 'theme') {
      //vt end
        //vt var theme = req.url.split('=')[1];
        var theme = reqValue;
        var workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
        var mtaVscode: any = workspaceConfig.get('mta-vscode')

        //vt let localThemeManagerExt = new LocalThemeManagerExt({
        //   themeDir: mtaVscode.themeDir
        // })

        console.log(`CmdServerExt.createServer: now getting info for the theme=${theme}`);

        //vtvar themeInfo = localThemeManagerExt.getThemeInfo(theme);
        // console.log(`CmdServerExt: abc=${abc}`);
        
        // var themeInfo = MTA_VS_localThemeManagerExt.getThemeInfo(theme);
        let localThemeManagerExt = MTA_VS.getLocalThemeManagerExt();
        var themeInfo = localThemeManagerExt.getThemeInfo(theme);
        res.end(JSON.stringify(themeInfo));
      }
      else if (reqKey === 'themeInfo') {
        console.log(`CmdServerExt.createServer: now in themeInfo handler`);
        let localThemeManagerExt = MTA_VS.getLocalThemeManagerExt();
        localThemeManagerExt.writeThemeInfo(reqValue);
      }
    })

    // determine what port we should start on
    var workspaceConfig : vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode : any = workspaceConfig.get('mta-vscode')
    console.log('mta-vs: mta-vscode.server.port=' + mtaVscode.server.port)
    var port = mtaVscode.server.port || 3000;
    //vt add
    var workspaceConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration()
    var mtaVscode: any = workspaceConfig.get('mta-vscode')
    let localThemeManagerExt = new LocalThemeManagerExt({
      themeDir: mtaVscode.themeDir
    });
    this.server.on('error', (e) => {
      console.log(`CmdServerExt.start: error:${e}`);
    });
    //vt this.server.listen(port);
    // A listen event is fired whenever the server becomes active for the first time.
    // In other words, this is a one time event, not a recurring event.  Basically think
    // of this as an 'onready' event.
    this.server.listen(port, function(){localThemeManagerExt.setDefaultTheme()});
    //vt end
    // this.server.listen(port)
  }
}