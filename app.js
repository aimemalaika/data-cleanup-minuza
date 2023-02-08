function handleFile(e) {
    // var files = e.target.files, f = files[0];
    // var reader = new FileReader();
    // reader.onload = function(e) {
    //   var data = new Uint8Array(e.target.result);
    //   var workbook = XLSX.read(data, {type: 'array'});
    //   var firstSheetName = workbook.SheetNames[0];
    //   var worksheet = workbook.Sheets[firstSheetName];
    //   var json = XLSX.utils.sheet_to_json(worksheet);

    //   var tableHead = document.getElementById("tableHead");
    //   var headers = Object.keys(json[0]);
    //   var headerRow = tableHead.insertRow();
    //   for (var i = 0; i < headers.length; i++) {
    //     var headerCell = headerRow.insertCell();
    //     headerCell.innerHTML = headers[i];
    //   }

    //   var tableBody = document.getElementById("tableBody");
    //   var undefinedIndexes = [];
    //   for (var i = 0; i < json.length; i++) {
    //     var row = tableBody.insertRow();
    //     for (var j = 0; j < headers.length; j++) {
    //       var cell = row.insertCell();
    //       cell.innerHTML = json[i][headers[j]];
    //       if (j === 0 && !json[i][headers[j]]) {
    //         undefinedIndexes.push(i);
    //       }
    //     }
    //   }
    //   console.log(undefinedIndexes);

        // };
        // reader.readAsArrayBuffer(f);


        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, {type: 'array'});
          var firstSheetName = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[firstSheetName];
          var json = XLSX.utils.sheet_to_json(worksheet);
    
          var tableHead = document.getElementById("tableHead");
          var headers = Object.keys(json[0]);
          var headerRow = tableHead.insertRow();
          for (var i = 0; i < headers.length; i++) {
            var headerCell = headerRow.insertCell();
            headerCell.innerHTML = headers[i];
          }
    
          var tableBody = document.getElementById("tableBody");
          var concatenatedContent = '';
          var cutSequences = [];
          var index = 0;
          for (var i = 0; i < json.length; i++) {
            var row = tableBody.insertRow();
            for (var j = 0; j < headers.length; j++) {
              var cell = row.insertCell();
              cell.innerHTML = json[i][headers[j]];
              if (j === 3) {
                if (json[i][headers[j]]) {
                  concatenatedContent += json[i][headers[j]];
                } else {
                  cutSequences.push({index: index, content: concatenatedContent});
                  index++;
                  concatenatedContent = '';
                }
              }
            }
          }
          if (concatenatedContent) {
            cutSequences.push({index: index, content: concatenatedContent});
          }
          console.log(cutSequences);
        };
        reader.readAsArrayBuffer(f);
        
   
  }
function regroup() {
   
}