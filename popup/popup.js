// let options = {
//     "gh": "github.com",
//     "fb": "facebook.com",
//     "rd": "reddit.com",
//     "in": "instagram.com",
//     "yt": "youtube.com",
// }
let options = {}
let isEmpty = true
window.SS = {}
function updateTable() {
    chrome.storage.sync.get(['cmd'], function (data) {
        if (data) {
            options = data;
            // document.getElementById("table").innerText = data.cmd;
            document.getElementById("table").appendChild(createTable(data.cmd))
            isEmpty = false
        } else {
            document.getElementById("table").appendChild(noCmds())
            isEmpty = true
        }
    });
}    
document.addEventListener('DOMContentLoaded', updateTable);
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
    let headers = []
    for (const key in tableDataArray[0]) {
        headers.push(key)
        var th = document.createElement('th')
        th.appendChild(document.createTextNode(key));
        headerTr.appendChild(th);
    }
    table.appendChild(headerTr)

    // Adding Rows
    for (const alias of tableDataArray) {
        // TODO: addeventListener to tr
        // tr.addEventListener('click', handleRowClick(this))
        table.appendChild(getRow(headers, alias));
    }

    return table
}

// UTILS
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

const getRow = (headers, alias) => {
    const tr = document.createElement('tr')
    for (const header of headers) {
        const td = document.createElement('td');
        td.addEventListener('click', () => makeEditable(td));
        td.innerText = alias[header] || '';
        tr.appendChild(td);
    }
    let delBtn = document.createElement('td');
    let deleteButton = document.createElement('button');
    const src = './assets/delete-icon.svg';
    deleteButton.innerHTML = `<img src="${src}"/>`;
    deleteButton.children[0].classList.add('svg-filter');
    deleteButton.classList.add('centered', 'btn', 'btn-danger');
    // deleteButton.addEventListener('click', () => removeRow(table, tr))
    delBtn.appendChild(deleteButton);
    tr.appendChild(delBtn)
    return tr
}

const makeEditable = cell => {
    if (!cell.classList.contains('editable')) {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = cell.innerText;
        cell.innerText = '';
        input.addEventListener('blur', () => cancelEditable(cell));
        input.addEventListener('keyup', event => {
            if (event.keyCode === 13 || event.keyCode === 27) {   // enter or ESC
                cancelEditable(cell);
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

const cancelEditable = cell => {
    const input = cell.children[0];
    cell.innerText = input.value;
    cell.classList.remove('editable');
};

const removeRow = (table, row) => {
    table.removeChild(row);
    recolour(table);
}


const noCmds = () => {
    var text = document.createElement('p')
    text.innerText = "Please setup Commands"
    return text
}