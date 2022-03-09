import $ from 'jquery';
import * as Handlebars from "handlebars";
// import * as layouts from 'handlebars-layouts';
import { loadState, saveState } from './libs/sessionStorage';
import { togglePanel } from './libs/togglePanel';
import { openLocal, createNew, uploadBpmn, saveLocal, saveSvg } from './modeler/components/io-import-export';
// import { openLocal, uploadBpmn, saveLocal, saveSvg } from './modeler/components/io-import-export';
import { zoomReset, zoomIn, zoomOut } from './modeler/components/io-zoom-controls';
import { displayKeyMap, toggleFullscreen } from './modeler/components/io-editing-tools';

import BpmnModeler from "bpmn-js/lib/Modeler";

import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleExtension from "camunda-bpmn-moddle/lib";

import customDescriptor from "./modeler/descripter/camundaDescriptor.json";
// import customDescriptor from "./modeler/descripter/magicDescriptor.json";

// import './style.css'
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
  saveState(sessuuid, sessdata);
}

// fetch file data
const fetchData = async (url) => {
  return fetch(url).then(response => response.text());
}

// event actions
// const createNew = async (elm) => {
//   try {
//     let ret = confirm('Create new file.');
//     if (ret) {
//       await elm.data.bpmnModeler.importXML(initialDiagram);
//       $('#file_name').text('new file')
//       $('#id').text('')
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }


// draw canvas: document ready action
const drawCanvas = (bpmnXML) => {
  
  // import diagram
  try {
    const result = bpmnModeler.importXML(bpmnXML);
    const { warnings } = result;
    console.log(warnings);
  } catch (err) {
    console.log(err.message, err.warnings);
  }
  // access viewer components
  const canvas = bpmnModeler.get("canvas");
  
  // zoom to fit full viewport
  canvas.zoom("fit-viewport");
  
}

const renderTemplate = (divId, templateSrc, jsonObj) => {
  // rendering hbs
  const template = Handlebars.compile(templateSrc);
  $(divId).html(template(jsonObj));

}

const renderComponent = async (divId, hbs_file_name, jsonObj) => {
  const templateUrl = "./src/" + hbs_file_name;
  const templateSrc = await fetchData(templateUrl);
  renderTemplate(divId, templateSrc, jsonObj)
}

const renderHbs = async (sessuuid) => {
  // load session state store
  const jsonObj = loadState(sessuuid);
  const file_name = jsonObj.file_name;
  
  // rendering hbs
  //// modeler.hbs
  await renderComponent('#app', './modeler/modeler.hbs', jsonObj);
  //// componets/io-alerts.hbs
  await renderComponent('#io-alerts', './modeler/components/io-alerts.hbs');
  //// componets/io-dialog import-warnings.hbs
  await renderComponent('#io-dialog-import-warnings', './modeler/components/io-dialog import-warnings.hbs', {});
  //// componets/io-dialog keybindings-dialog.hbs
  await renderComponent('#io-dialog-keybindings-dialog', './modeler/components/io-dialog keybindings-dialog.hbs', {});
  //// componets/io-editing-tools.hbs
  await renderComponent('#io-editing-tools', './modeler/components/io-editing-tools.hbs', {});
  //// componets/io-import-export.hbs
  await renderComponent('#io-import-export', './modeler/components/io-import-export.hbs', {});
  //// componets/io-zoom-controls.hbs
  await renderComponent('#io-zoom-controls', './modeler/components/io-zoom-controls.hbs', {});
  
  // new Bpmn Modeler
  bpmnModeler = new CustomBpmnModeler({
    container: '#js-canvas',
    keyboard: {
      bindTo: document
    },
    propertiesPanel: {
      parent: "#properties-panel-parent"
    },
    additionalModules: [camundaModdleExtension],
    moddleExtensions: {
      camunda: customDescriptor
    }
  });
  
  // Event- Actions
  $("#btn_openLocal").on("click", openLocal);
  $("#btn_createNew").on("click", {bpmnModeler: bpmnModeler, initialDiagram: initialDiagram}, createNew);
  $("#btn_uploadBpmn").on("click", uploadBpmn);
  $("#btn_saveLocal").on("click", saveLocal);
  $("#btn_saveSvg").on("click", saveSvg);
  $("#btn_displayKeyMap").on("click", displayKeyMap);
  $("#btn_toggleFullscreen").on("click", toggleFullscreen);
  $("#btn_zoomReset").on("click", zoomReset);
  $("#btn_zoomIn").on("click", zoomIn);
  $("#btn_zoomOut").on("click", zoomOut)
  // Event- Actions : properties Panel
  $(".toggle-panel").on("click", togglePanel);
  
  // get bpmn XML data
  const url = "../../media/xml/" + file_name;
  const bpmnXML = await fetchData(url);
  // 
  drawCanvas(bpmnXML)
};

// -------------------------------------------// document.ready
// Custom Bpmn Modeler Class
class CustomBpmnModeler extends BpmnModeler {}

CustomBpmnModeler.prototype._modules = [
  ...BpmnModeler.prototype._modules,
  propertiesPanelModule,
  propertiesProviderModule
];

// variables
const container = $('#row-main');
const initialDiagram = await fetchData("../../media/xml/" + 'initialDiagram.bpmn');
let bpmnModeler = {};

// TODO: get session id
const sessuuid = '999999999999999';
// save session state for debug
// TODO: remove 
init(sessuuid);

$(document).ready(renderHbs(sessuuid));
