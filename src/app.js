import $ from 'jquery';

//-- project libs of UtilClass
import SessionStateStore from './lib/SessionStateStore';
import DataUtil from  './lib/DataUtil';
import HbsUtil from  './lib/HbsUtil';

//-- project libs: acton event
import { openLocal, createNew, uploadBpmn, saveLocal, saveSvg } from './modeler/components/io-import-export';
import { zoomReset, zoomIn, zoomOut } from './modeler/components/io-zoom-controls';
import { displayKeyMap, toggleFullscreen } from './modeler/components/io-editing-tools';
import { togglePanel } from './lib/togglePanel';
import { registerFileDrop } from './lib/registerFileDrop';

// -- Custom Modeler
import { CustomBpmnModelerFactory } from "./modeler/CustomBpmnModelerFactory";

import './modeler/modeler.css'

// local setting for debug
// TODO: remove on production
const init = (sessuuid) => {
  const sessdata = {
    'id': '1',
    'file_name': 'qr-code.bpmn',
    'SESSUUID': sessuuid,
    'SCREEN_NAME': 'Modeler'
  }
  SessionStateStore.saveState(sessuuid, sessdata);
}

const displayDiagram = async (xml_data, file_name) => {
  try {
    const result = bpmnModeler.importXML(xml_data);
    const { warnings } = result;
    console.log("Open a file :" + file_name);
  } catch (err) {
    console.log(err.message, err.warnings);
    alert('could not import BPMN 2.0 XML, see console');
  }
}

// draw canvas: document ready action
const drawCanvas = (bpmnXML, file_name) => {
  
  // import xml into canvas
  displayDiagram(bpmnXML, file_name);
  
  // canvas.zoom
  const canvas = bpmnModeler.get("canvas");
  canvas.zoom("fit-viewport");
  
}


const renderHbs = async (sessuuid, elApp, elComponents) => {
  // load session state store
  const stateData = SessionStateStore.loadState(sessuuid);
  const file_name = stateData.file_name;
  
  // rendering hbs
  //// modeler.hbs
  await HbsUtil.renderComponent(elApp, HBS_MAIN_TEMPLATE, stateData);
  $(elComponents).html(divComponents);

  //// componets/*.hbs  // -- Can not use ary.forEach
  for(let itm of aryHbsComponents) {
    console.log(`render ${itm.hbsPath} ...`);
    await HbsUtil.renderComponent(
      itm.el, 
      itm.hbsPath, 
      itm.data
    );
  }
  
  // new Bpmn Modeler
  const factory = new CustomBpmnModelerFactory()
  bpmnModeler = factory.get_modeler(EL_CANVAS, EL_PROPERTIES_PANEL_PARENT)
  
  // Event- Actions
  $("#btn_openLocal").on("click", openLocal);
  $("#btn_createNew").on("click", {bpmnModeler: bpmnModeler, initialDiagram: initialDiagram, fileName: INITIAL_XML_NAME}, createNew);
  $("#btn_uploadBpmn").on("click", uploadBpmn);
  $("#btn_saveLocal").on("click", saveLocal);
  $("#btn_saveSvg").on("click", saveSvg);
  $("#btn_displayKeyMap").on("click", displayKeyMap);
  $("#btn_toggleFullscreen").on("click", toggleFullscreen);
  $("#btn_zoomReset").on("click", zoomReset);
  $("#btn_zoomIn").on("click", zoomIn);
  $("#btn_zoomOut").on("click", zoomOut)
  // Event- Actions : toggle Properties Panel
  $(".toggle-panel").on("click", togglePanel);
  // Event- Actions : drop a file
  const dropArea = $('#row-main');
  if (!window.FileList || !window.FileReader) {
    window.alert(
      'Looks like you use an older browser that does not support drag and drop. ' +
      'Try using Chrome, Firefox or the Internet Explorer > 10.');
  } else {
    registerFileDrop(dropArea, displayDiagram);
  }

  
  // get bpmn XML data
  const url = "../../media/xml/" + file_name;
  const bpmnXML = await DataUtil.fetchData(url);
  // 
  drawCanvas(bpmnXML, file_name)

};

// -------------------------------------------// document.ready
// variables
const INITIAL_XML_NAME = 'initialDiagram.bpmn';
const initialDiagram = await DataUtil.fetchData("../../media/xml/" + INITIAL_XML_NAME);
const HBS_MAIN_TEMPLATE = './modeler/modeler.hbs';
const aryHbsComponents = [
  {el: '#io-alerts', data: {}, hbsPath: './modeler/components/io-alerts.hbs'},
  {el: '#io-dialog-import-warnings', data: {}, hbsPath: './modeler/components/io-dialog import-warnings.hbs'},
  {el: '#io-dialog-keybindings-dialog', data: {}, hbsPath: './modeler/components/io-dialog keybindings-dialog.hbs'},
  {el: '#io-editing-tools', data: {}, hbsPath: './modeler/components/io-editing-tools.hbs'},
  {el: '#io-import-export', data: {}, hbsPath: './modeler/components/io-import-export.hbs'},
  {el: '#io-zoom-controls', data: {}, hbsPath: './modeler/components/io-zoom-controls.hbs'},
];
const divComponents = `
    <div id='io-alerts'></div>
    <div id='io-dialog-import-warnings'></div>
    <div id='io-dialog-keybindings-dialog'></div>
    <div id='io-editing-tools'></div>
    <div id='io-import-export'></div>
    <div id='io-zoom-controls'></div>
`;

let bpmnModeler = {};

// TODO: get session id
const sessuuid = '999999999999999';
// save session state for debug
// TODO: remove 
init(sessuuid);

const EL_APP = "#app";
const EL_COMPONENTS = "#div-components";
const EL_CANVAS = "#js-canvas";
const EL_PROPERTIES_PANEL_PARENT = "#properties-panel-parent";

$(document).on('load', renderHbs(sessuuid, EL_APP, EL_COMPONENTS));
