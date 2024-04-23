function showBagFields() {
    var tableBody = document.getElementById('bagListBody');

    var newRow = tableBody.insertRow(0); 

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);

    // input
    var inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.placeholder = 'Enter bag name';
    inputName.style.color = 'rgb(222, 93, 183)';
    inputName.style.border = '1px solid rgb(216, 30, 160)';
    cell1.appendChild(inputName);

    var inputColor = document.createElement('input');
    inputColor.type = 'text';
    inputColor.placeholder = 'Enter bag color';
    inputColor.style.color = 'rgb(222, 93, 183)';
    inputColor.style.border = '1px solid rgb(216, 30, 160)';
    cell2.appendChild(inputColor);

    var saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = function() {
        var bagName = inputName.value;
        var bagColor = inputColor.value;
        cell1.textContent = bagName;
        cell2.textContent = bagColor;

        // edit
        var editButton = cell3.querySelector('.edit-btn'); 
        if (!editButton) {
            editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn'; 
            editButton.onclick = function() {
                editButton.style.display = 'none';
                saveButton.style.display = 'inline';


                var currentBagName = cell1.textContent;
                var currentBagColor = cell2.textContent;

                cell1.appendChild(inputName);
                inputName.value = currentBagName;

                cell2.appendChild(inputColor);
                inputColor.value = currentBagColor;

                cell1.innerHTML = '';
                cell2.innerHTML = '';
                cell1.appendChild(inputName);
                cell2.appendChild(inputColor);
    


            };
            cell3.appendChild(editButton);
        }else{
            editButton.style.display = 'inline'; // jak juz istnieje to przestan go ukrywac
        }

        // delete
        var deleteButton = cell3.querySelector('.delete-btn'); 
        if (!deleteButton) {
            deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn'; 
            deleteButton.onclick = function() {
                deleteBag(newRow);
            };
            cell3.appendChild(deleteButton);
        }else{
            deleteButton.style.display = 'inline';
        }

        saveButton.style.display = 'none';
        cancelButton.style.display = 'none';
    };

    cell3.appendChild(saveButton);

    var cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.onclick = function() {
        // usuwanie
        tableBody.removeChild(newRow);
    };

    cell3.appendChild(cancelButton);
}


function deleteBag(row) {
    if (confirm('Are you sure you want to delete this bag?')) {
        row.parentNode.removeChild(row);
    }
}



