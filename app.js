function handleFile(e) {
    var files = e.target.files, f = files[0];
    var extension = f.name.split('.').pop();
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      
      var range = XLSX.utils.decode_range(worksheet['!ref']);
      var startRow = prompt("Start from row: ");
      if (startRow == null || startRow == "") {
        alert("You must enter a number");
        location.reload();
      }
      localStorage.setItem("startRow", startRow);
      range.s.r = startRow - 1;
      var subSheet = {};
      subSheet[firstSheetName] = worksheet;
      subSheet[firstSheetName]['!ref'] = XLSX.utils.encode_range(range);
      var json = XLSX.utils.sheet_to_json(subSheet[firstSheetName]);

      var tableHead = document.getElementById("tableHead");
      tableHead.innerHTML = "";
      var headers = Object.keys(json[0]);
      var headerRow = tableHead.insertRow();
      for (var i = 0; i < headers.length; i++) {
        var headerCell = headerRow.insertCell();
        headerCell.innerHTML = headers[i];
        headerCell.style.backgroundColor = "green";
        headerCell.style.color = "white";
      }

      var tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";
      for (var i = 0; i < json.length; i++) {
        var row = tableBody.insertRow();
        for (var j = 0; j < headers.length; j++) {
          var cell = row.insertCell();
          cell.innerHTML = json[i][headers[j]];
        }
      }
      $("#clean-file").removeClass("d-none");
    };
    reader.readAsArrayBuffer(f);
}


function regroup() {
  var fileInput = document.getElementById("fileInput");
  var files = fileInput.files, f = files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      
      var range = XLSX.utils.decode_range(worksheet['!ref']);
      var startRow = localStorage.getItem("startRow");
      range.s.r = startRow - 1;
      var subSheet = {};
      subSheet[firstSheetName] = worksheet;
      subSheet[firstSheetName]['!ref'] = XLSX.utils.encode_range(range);
      var json = XLSX.utils.sheet_to_json(subSheet[firstSheetName]);

    var tableHead = document.getElementById("tableHead");
    tableHead.innerHTML = "";
    var headers = Object.keys(json[0]);
    var headerRow = tableHead.insertRow();
    for (var i = 0; i < headers.length; i++) {
      var headerCell = headerRow.insertCell();
      headerCell.innerHTML = headers[i];
      headerCell.style.backgroundColor = "green";
      headerCell.style.color = "white";
    }

    let consecutive = true;
    let group = [];
    var tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";
    var undefinedIndexes = [];
    let thecol = null;
    for (var i = 1; i < json.length; i++) {
      var row = tableBody.insertRow();
      if(json[i][headers[0]] == undefined) {
        consecutive = true;
        group.push(json[i][headers[3]]);
        thecol = null;
      }else{
        for (var j = 0; j < headers.length; j++) {
          var cell = row.insertCell();
          cell.innerHTML = json[i][headers[j]];
        }
        consecutive = false;
        thecol = row.cells[3]
      }
      if(!consecutive) {
        undefinedIndexes.push(group);
        if (thecol) {
          thecol.innerHTML += ', '+group.join(", ");
        }
        group = [];
      }
    }
    $("#download-excel").removeClass("d-none");
  };
  reader.readAsArrayBuffer(f);
}

function download () {
  let file_name = prompt("what name to assigne to this file")
  var table = document.getElementById("data-table");
  var data = [];
  for (var i = 0, row; row = table.rows[i]; i++) {
    var rowData = [];
    for (var j = 0, col; col = row.cells[j]; j++) {
      rowData[j] = col.innerHTML;
    }
    if (rowData.join('').trim().length > 0) {
      data.push(rowData);
    }
  }
  
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, `${file_name}.xlsx`);
}
