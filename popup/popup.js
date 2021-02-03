// let options = {
//     "gh": "github.com",
//     "fb": "facebook.com",
//     "rd": "reddit.com",
//     "in": "instagram.com",
//     "yt": "youtube.com",
// }

let isEmpty = true
function updateTable() {
    chrome.storage.sync.get(['cmd'], function (data) {
        if (data) {
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
document.querySelector('#update').addEventListener('click', () =>{
    chrome.storage.sync.set({'value': "randoms"}, function() {
        // Notify that we saved.
        console.log('Settings saved');
      });
})

// Creating table
const createTable = (cmdObject) => {
    var _table_ = document.createElement('table'),
        _tr_ = document.createElement('tr'),
        _th_ = document.createElement('th'),
        _td_ = document.createElement('td');

    function buildTableArray (dataObject) {
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

    function buildHtmlTable(object) {
        const arr = buildTableArray(object)
        var table = _table_.cloneNode(false),
            columns = addAllColumnHeaders(arr, table);
        for (var i=0, maxi=arr.length; i < maxi; ++i) {
            var tr = _tr_.cloneNode(false);
            for (var j=0, maxj=columns.length; j < maxj ; ++j) {
                var td = _td_.cloneNode(false);
                    cellValue = arr[i][columns[j]];
                td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        return table;
    }

    function addAllColumnHeaders(arr, table)
    {
        var columnSet = [],
            tr = _tr_.cloneNode(false);
        for (var i=0, l=arr.length; i < l; i++) {
            for (var key in arr[i]) {
                if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key)===-1) {
                    columnSet.push(key);
                    var th = _th_.cloneNode(false);
                    th.appendChild(document.createTextNode(key));
                    tr.appendChild(th);
                }
            }
        }
        table.appendChild(tr);
        return columnSet;
    }

    return buildHtmlTable(cmdObject)
}

const noCmds = () => {
    var text = document.createElement('p')
    text.innerText = "Please setup Commands"
    return text
}