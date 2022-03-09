import $ from 'jquery';

// button event  
export const openLocal = ()=>{
    console.log('click btn_openLocal');
}

export const createNew = async (elm) => {
  try {
    let ret = confirm('Create new file.');
    if (ret) {
      await elm.data.bpmnModeler.importXML(elm.data.initialDiagram);
      $('#file_name').text('new file')
      $('#id').text('')
    }
  } catch (err) {
    console.error(err);
  }
}

export const uploadBpmn = ()=>{
    console.log('click btn_uploadBpmn');
}

export const saveLocal = ()=>{
    console.log('click btn_saveLocal');
}

export const saveSvg = ()=>{
    console.log('click btn_saveSvg');
}

