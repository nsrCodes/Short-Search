// let options = {
//     "gh": "github.com",
//     "fb": "facebook.com",
//     "rd": "reddit.com",
//     "in": "instagram.com",
//     "yt": "youtube.com",
// }
let options = {}
let headers = []
let isEmpty = true


chrome.storage.sync.get(['cmd'], function (data) {
    if (data) {
        const tableDiv = document.getElementById("tableDiv")
        console.log(tableDiv)
        options = data;
        // tableDiv.innerText = data.cmd;
        tableDiv.appendChild(createTable(data.cmd))
        isEmpty = false
        console.log("made table")
    }
});

function updateTable(optionsObject) {
    console.log(optionsObject)
    const tableDiv = document.getElementById("tableDiv")
    if (!options) {
        //pass
    } else {
        const table = document.getElementById('mainTable')
        // tableDiv.removeChild(tableDiv.childNodes[0])
        removeAllChildNodes(tableDiv)
        console.log(tableDiv)
        if (table) {
            if (!optionsObject) {
                tableDiv.appendChild(noCmds())
                isEmpty = true
            }
            else {
                tableDiv.appendChild(createTable(optionsObject))
            }
        }
    }
}    
// document.addEventListener('DOMContentLoaded', updateTable);
// document.querySelector('#update').addEventListener('click', () =>{
//     chrome.storage.sync.set({'value': "randoms"}, function() {
//         // Notify that we saved.
//         console.log('Settings saved');
//       });
// })

// Creating table
const createTable = (cmdObject) => {
    const table = document.createElement('table')
    const tableDataArray = buildTableArrayFromCmdObject(cmdObject)
    
    // adding headers
    const headerTr = document.createElement('tr')
    for (const key in tableDataArray[0]) {
        headers.push(key)
        var th = document.createElement('th')
        th.appendChild(document.createTextNode(key));
        headerTr.appendChild(th);
    }
    table.appendChild(headerTr)

    // Adding Rows
    for (const alias of tableDataArray) {
        table.appendChild(createRow(headers, alias, table));
    }
    table.setAttribute("id", 'mainTable')
    return table
}

// UTILS
// Table Utils
const createRow = (headers, alias, table) => {
    const tr = document.createElement('tr')
    for (const header of headers) {
        const td = document.createElement('td');
        td.addEventListener('click', () => makeEditable(td, table, headers));
        td.innerText = alias[header] || '';
        tr.appendChild(td);
    }
    tr.appendChild(createDeleteButtonForRow(table, tr, headers))
    return tr
}

const makeEditable = (cell, tb, h) => {
    if (!cell.classList.contains('editable')) {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = cell.innerText;
        cell.innerText = '';
        input.addEventListener('blur', () => cancelEditable(cell, tb, h));
        input.addEventListener('keyup', event => {
            if (event.keyCode === 13 || event.keyCode === 27) {   // enter or ESC
                cancelEditable(cell. h);
            }
        });
        input.classList.add('table-input');
        if (cell.parentElement.classList.contains('gray'))
            input.classList.add('gray');
        cell.appendChild(input);
        cell.classList.add('editable');
        input.focus();
    }
};

const cancelEditable = (cell, table, headers) => {
    const input = cell.children[0];
    cell.innerText = input.value;
    cell.classList.remove('editable');
    updateObject(table, headers);
};

const createDeleteButtonForRow = (table, row, headers) => {
    const td = document.createElement('td');
    const deleteButton = document.createElement('button');
    const src = './assets/delete-icon.svg';
    deleteButton.innerHTML = `<img src="${src}"/>`;
    deleteButton.children[0].classList.add('svg-filter');
    deleteButton.classList.add('centered', 'btn', 'btn-danger');
    deleteButton.addEventListener('click', () => removeRow(table, row))
    td.appendChild(deleteButton);
    return td
}

const removeRow = (table, row, headers) => {
    table.removeChild(row);
    updateObject(table, headers)
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// Data utils
const buildTableArrayFromCmdObject = (dataObject) => {
    let finalArray = []
    for (key in dataObject) {
        let entry = {
            cmd: key,
            target: dataObject[key]
        }
        finalArray.push(entry)
    }
    return finalArray
}
const buildObjectFromTable = (table, headers) => {
    const cmdArray = buildArrayFromTable(table, headers)
    return buildObjectFromTableArray(cmdArray, headers)
}

const buildArrayFromTable = (table, headers) => {
    let finalArray = []
    console.log(headers)
    // To avoid headers we use i = 1 rather than 0
    for (var i = 1, row; row = table.rows[i]; i++) {
        let entry = {}
        for (var j = 0, cell; cell = row.cells[j]; j++) {
            entry[headers[j]] = cell.innerText
        }  
        finalArray.push(entry)
    }
    return finalArray
}

// Only used when there are two headers only
const buildObjectFromTableArray = (arr, headers) => {
    let finalObj = {}
    for (const ele of arr) {
        finalObj[ele[headers[0]]] = ele[headers[1]]
    }
    return finalObj
}
const updateObject = (table, headers) => {
    options = buildObjectFromTable(table, headers)
    // createTable(options)
    console.log(options)
    updateTable(options)
    // TODO: update local storage so that changes are synced with background
}

const noCmds = () => {
    var text = document.createElement('p')
    text.innerText = "Please setup Commands"
    return text
}