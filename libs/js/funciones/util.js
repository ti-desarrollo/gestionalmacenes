/**Buscador */
function filterTable(filter, table) {
  var rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    var cells = row.getElementsByTagName("td");
    var found = false;
    for (let j = 0; j < cells.length; j++) {
      var cell = cells[j];

      if (cell) {
        var cellText = cell.textContent || cell.innerText;
        if (cellText.toUpperCase().indexOf(filter.toUpperCase()) > -1) {
          found = true;
          break;
        }
      }
    }
    if (found) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}
