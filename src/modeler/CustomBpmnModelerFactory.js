import BpmnModeler from "bpmn-js/lib/Modeler";
import propertiesPanelModule from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";
import camundaModdleExtension from "camunda-bpmn-moddle/lib";
import customDescriptor from "./descripter/camundaDescriptor.json";

// export class CustomBpmnModeler extends BpmnModeler {}
export class CustomBpmnModelerFactory {}

export class CustomBpmnModeler extends BpmnModeler {}

// Custom Bpmn Modeler Class
// CustomBpmnModeler.prototype._modules = [
CustomBpmnModeler.prototype._modules = [
  ...BpmnModeler.prototype._modules,
  propertiesPanelModule,
  propertiesProviderModule
];

CustomBpmnModelerFactory.prototype.get_instance = (divIdContainer, divIdParentPropertiesPanel) => {
  // new Bpmn Modeler
  const bpmnModeler = new CustomBpmnModeler({
    container: divIdContainer,
    keyboard: {
      bindTo: document
    },
    propertiesPanel: {
      parent: divIdParentPropertiesPanel
    },
    additionalModules: [camundaModdleExtension],
    moddleExtensions: {
      camunda: customDescriptor
    }
  });
  return bpmnModeler
}

