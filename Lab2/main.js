function showBagFields() {
    var tableBody = document.getElementById('bagListBody');

    // Creating a new table row
    var newRow = tableBody.insertRow(0); 

    // Inserting cells into the new row
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

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
        var bagName = inputName.value;
        var bagColor = inputColor.value;
        cell1.textContent = bagName;
        cell2.textContent = bagColor;

        // Create/Edit Edit button
        var editButton = cell3.querySelector('.edit-btn'); // Check if edit button already exists
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn'; // Add a class to identify edit buttons
            editButton.onclick = function() {
                editButton.style.display = 'none';
                saveButton.style.display = 'inline';
                editBag(newRow, cell1, cell2);
            };
            cell3.appendChild(editButton);
        }else{
            editButton.style.display = 'inline';
        }

        // Create/Delete Delete button
        var deleteButton = cell3.querySelector('.delete-btn'); // Check if delete button already exists
        if (!deleteButton) {
            deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn'; // Add a class to identify delete buttons
            deleteButton.onclick = function() {
                deleteBag(newRow);
            };
            cell3.appendChild(deleteButton);
        }else{
            deleteButton.style.display = 'inline';
        }

        // Hide save and cancel buttons
        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    };
    cell3.appendChild(saveButton);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function() {
        // Remove the row if cancel is clicked
        tableBody.removeChild(newRow);
    };
    cell3.appendChild(cancelButton);
}


function editBag(row, cell1, cell2) {
    // Get the existing values from the cells
    var currentBagName = cell1.textContent;
    var currentBagColor = cell2.textContent;

    // Create input fields to edit the values
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.value = currentBagName;

    var inputColor = document.createElement('input');
    inputColor.type = 'text';
    inputColor.value = currentBagColor;

    // Replace the text content of the cells with the input fields
    cell1.innerHTML = '';
    cell2.innerHTML = '';
    cell1.appendChild(inputName);
    cell2.appendChild(inputColor);

    // Update the bag on save
    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function() {
        var newBagName = inputName.value;
        var newBagColor = inputColor.value;
        cell1.textContent = newBagName;
        cell2.textContent = newBagColor;
        // You may also want to add back the Edit and Delete buttons here if needed
    };
    
}


function deleteBag(row) {
    if (confirm('Are you sure you want to delete this bag?')) {
        row.parentNode.removeChild(row);
    }
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