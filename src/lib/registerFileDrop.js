export const registerFileDrop = (containerArea, cbFunc) => {

  const handleFileSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    var file = files[0];
    var reader = new FileReader();
    
    reader.onload = function(e) {
      var xml = e.target.result;
      cbFunc(xml);
    };
    reader.readAsText(file);
  }

  const handleDragOver = (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  containerArea.get(0).addEventListener('dragover', handleDragOver, false);
  containerArea.get(0).addEventListener('drop', handleFileSelect, false);
}
