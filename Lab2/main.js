function showBagFields() {
    // idk czy dziala
    var tableBody = document.getElementById('bagListBody');

    // Creating a new table row
    var newRow = tableBody.insertRow(0); 

    // Inserting cells into the new row
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);

    // Creating input fields and buttons within the cells
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.placeholder = 'Enter bag name';
    cell1.appendChild(inputName);

    var inputColor = document.createElement('input');
    inputColor.type = 'text';
    inputColor.placeholder = 'Enter bag color';
    cell2.appendChild(inputColor);

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function() {
        // Update the content of the row with the values from input fields
        var bagName = inputName.value;
        var bagColor = inputColor.value;
        cell1.textContent = bagName;
        cell2.textContent = bagColor;
        newRow.appendChild(saveButton);
        newRow.appendChild(cancelButton);
    };
    cell1.appendChild(saveButton);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function() {
        // Remove the row if cancel is clicked
        tableBody.removeChild(newRow);
    };
    cell2.appendChild(cancelButton);
}


function saveBag() {
    var bagName = document.getElementById('bagName').value;
    var bagColor = document.getElementById('bagColor').value;

    var tableBody = document.getElementById('bagListBody');

    var newRow = tableBody.insertRow(0); 

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    cell1.innerHTML = bagName;
    cell2.innerHTML = bagColor;

    document.getElementById('bagName').value = '';
    document.getElementById('bagColor').value = '';
    document.getElementById('bagFields').style.display = 'none';
}

function cancelBag() {

    document.getElementById('bagName').value = '';
    document.getElementById('bagColor').value = '';
    document.getElementById('bagFields').style.display = 'none';
}
