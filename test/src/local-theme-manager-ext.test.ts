// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as YAML from "yamljs";
// You can import and use all API from the 'vscode' module
// as well as import your mta-vs to test it
import * as vscode from 'vscode';
import {LocalThemeManagerExt} from '../../src/local-theme-manager-ext';
import {ThemeInfo} from '../../src/local-theme-manager-ext';
import { expect } from 'chai';
import * as fs from "fs-extra"; //works
import * as sinon from "sinon";

// Defines a Mocha test suite to group tests of similar kind together
// suite("local-theme-manager-client Tests", () => {

//     // Defines a Mocha unit test
//     test("Something 1", () => {
//         assert.equal(-1, [1, 2, 3].indexOf(5));
//         assert.equal(-1, [1, 2, 3].indexOf(0));
//     });

// });

describe('simple test', () => {
  var localThemeManagerExt : LocalThemeManagerExt;
  var sandbox; 
  var mockYAML;
  var mockFs;
  var testThemeDir = '/tmp/themes/'

  before(() => {
    let params = {}
    
    var themeInfo : ThemeInfo =  {
      'display_name' : 'Kimbie Dark' ,
      'class_name' : 'kimbie_dark',
      'class_name_fq' : 'vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme.yml',  
      'dom_text' : `
    .monaco-editor.vs-dark.vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme .token.variable.parameter.function { color: rgba(211, 175, 134, 1); }
    .monaco-editor.vs-dark.vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme .token.comment { color: rgba(165, 122, 76, 1); }
    .monaco-editor.vs-dark.vscode-theme-kimbie-dark-themes-Kimbie_dark-tmTheme .token.punctuation.definition.comment { color: rgba(165, 122, 76, 1); } 
    `
    };

   sandbox = sinon.sandbox.create();

   try {
   mockYAML = sandbox.stub(YAML, "load")
    .withArgs(testThemeDir + 'kimbie_dark.yml')
    .returns(themeInfo) 
   }
   catch(e){
     console.log('caught error: ' + e)
   }

   try {
   mockFs = sandbox.stub(fs, "readdirSync")
    .returns(['kimbie_dark.yml', 'red.yml', 'vt_note.txt']) 
   }
   catch(e){
     console.log('caught error: ' + e)
   }

    params['YAML'] = mockYAML
    params['fs'] = mockFs;
    params['themeDir'] = '/tmp/dummy'

    localThemeManagerExt = new LocalThemeManagerExt(params);
  })  

  after(() => {
    sandbox.restore()
  });

  it('is an instance of the proper type', () => {
    assert(localThemeManagerExt instanceof LocalThemeManagerExt)
  });  

  it('has an mtaExtension instance variable', () => {
    expect(localThemeManagerExt).to.have.property('mtaExtension');
  });

  // Note: too hard to mock up an extension
  // it('getThemeDir returns the proper value', () => {
  //   expect(localThemeManagerExt.getThemeDir).to.equal('C:/tmp/themes');
  // });

  it('doIt returns 7', () => {
    assert(localThemeManagerExt.doIt() == 7);
  });

  it('getThemeInfo works', () => {
    let theme = 'kimbie_dark'
    let params = {'fs' : fs, 'themeDir' : '/tmp/dummy'}
    console.log('ut: hello')

    // mockup getThemeDir to return a dummy directory
    localThemeManagerExt.getThemeDir = function() { return testThemeDir}
    let themeInfo : ThemeInfo = localThemeManagerExt.getThemeInfo(theme);
    expect(themeInfo).to.be.instanceof(Object)
    expect(themeInfo.class_name).to.equal('kimbie_dark')

  })

  it('getThemeList works', () => {

    let themeList : string[] = localThemeManagerExt.getThemeList()
    expect(themeList.length).to.equal(2)
  })
})