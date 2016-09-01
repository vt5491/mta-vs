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
// import * as LocalThemeManagerClient from '../src/local-theme-manager-client';
import {LocalThemeManagerExt} from '../../src/local-theme-manager-ext';
import {ThemeInfo} from '../../src/local-theme-manager-ext';
//var expect = require('chai').expect;
// import * as expect from 'chai';
import { expect } from 'chai';
// var expect = require('chai')
// var expect = require('chai').expect();
// var expect = require('chai').expect; //works
import * as fs from "fs-extra"; //works
// var fs = require('fs');
import * as sinon from "sinon";
// var sinon = require('sinon')//works

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

  console.log('now in simple test')
  //var fs;
  //var fs = require('fs'); 
  // var fs = new fs()

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

    // var mock_readFileSync = sinon.stub().returns(themeInfo); 
    // fs.readFileSync = mock_readFileSync;
// var stub = sinon.stub(object, "method", func);
    // var mockYAMLLoad = sinon.stub().returns(themeInfo)
    // YAML.load = mockYAMLLoad
    // var mockYAML = sinon(YAML, "load", () => {
      
    // })
   //var mockYAML = sinon.stub(YAML, "load")
   console.log('before: mockYAML 1=' + mockYAML)
   sandbox = sinon.sandbox.create();

   try {
   mockYAML = sandbox.stub(YAML, "load")
    // .withArgs('/tmp/dummy/kimbie_dark.yml')
    // .withArgs('/tmp/dummy/kimbie_dark.yml')
    .withArgs(testThemeDir + 'kimbie_dark.yml')
    .returns(themeInfo) 

    console.log('before: mockYAML 2=' + mockYAML)
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

    // //mock up extensions.getExtension('vt5491.mta-vs')
    // vscode.extensions.getExtension = 
  })  

  after(() => {
    // console.log('before: mockYAML=' + mockYAML)
    // mockYAML.restore();
    sandbox.restore()
    // mockYAML.reset();
  });

  it('is an instance of the proper type', () => {
    console.log('typeof localThemeManagerClient=' + typeof localThemeManagerExt)
    assert(localThemeManagerExt instanceof LocalThemeManagerExt)
    //  assert(typeof localThemeManagerClient === 'LocalThemeManagerClient')
  });  

  // it.only('has an mtaExtension instance variable', () => {
  it('has an mtaExtension instance variable', () => {
    // assert(localThemeManagerExt.mtaExtension).exists
    expect(localThemeManagerExt).to.have.property('mtaExtension');
  });

  // Note: too hard to mock up an extension
  // it('getThemeDir returns the proper value', () => {
  //   expect(localThemeManagerExt.getThemeDir).to.equal('C:/tmp/themes');
  // });

  it('doIt returns 7', () => {
    //expect(localThemeManagerClient.doIt()).equals(7));
    assert(localThemeManagerExt.doIt() == 7);
  });

  it('getThemeInfo works', () => {
    // let themeClass = 'vscode-theme-red-themes-red-tmTheme.dom_theme'
    let theme = 'kimbie_dark'
    let params = {'fs' : fs, 'themeDir' : '/tmp/dummy'}
    console.log('ut: hello')

    // mockup getThemeDir to return a dummy directory
    localThemeManagerExt.getThemeDir = function() { return testThemeDir}
    // let r = fs.statSync('/home/vturner/vtstuff/tmp')
    // console.log('ut: r=' + r)
    // alert('ut: r=' + r)
    let themeInfo : ThemeInfo = localThemeManagerExt.getThemeInfo(theme);
    console.log('ut: themeInfo=' + themeInfo)
    //console.log('domTextTheme=' + domTextTheme)
    // let domTextTheme : string = localThemeManagerClient.getDomTextTheme(params);
    // var r = localThemeManagerClient.getDomTextTheme({fs: 'fuck', dir: 'fuck'})
    // assert(typeof r !== 'undefined' )
    // var a =1;
    // expect(a).to.equal(1)
   // expect(true).to.be.equal(true)
    // expect(domTextTheme.split(/\n/).length).to.equal(5)
    expect(themeInfo).to.be.instanceof(Object)
    expect(themeInfo.class_name).to.equal('kimbie_dark')

  })

  it('getThemeList works', () => {

    let themeList : string[] = localThemeManagerExt.getThemeList()
    // console.log('ut: themeList=' + themeList)
    // console.log('ut: themeList.length=' + themeList.length)
    expect(themeList.length).to.equal(2)
  })
})