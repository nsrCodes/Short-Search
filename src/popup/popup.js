// let options = {
//     "gh": "github.com",
//     "fb": "facebook.com",
//     "rd": "reddit.com",
//     "in": "instagram.com",
//     "yt": "youtube.com",
// }
let options = {}
main()
// mainFunction, called once
function main() {
  loadEvents();
  chrome.storage.sync.get(['cmd'], function (data) {
    if (data.cmd) {
      console.log(data.cmd)
      options = data.cmd;
      for (const cmd in options) {
        if (Object.hasOwnProperty.call(options, cmd)) {
          const target = options[cmd];
          addCmd(cmd, target)
        }
      }
      console.log("made table")
    }
  });

}
// load every event in the page
function loadEvents(){
  document.querySelector('form').addEventListener('submit',handleSubmit);
  document.getElementById('clear').addEventListener('click',clearList);
  document.querySelector('ul').addEventListener('click',deleteCmd);
}
// Send to backend
function updateBGOptions(options){
  chrome.storage.sync.set({'cmd': options}, function() {
    // Notify that we saved.
    console.log('Settings saved');
  });
}
// subit data function
function handleSubmit(e){
  e.preventDefault();
  let cmd = document.querySelector('#cmdInput');
  let target = document.querySelector('#targetInput');
  if(cmd.value != '' && target.value != '')
    addCmd(cmd.value, target.value);
  cmd.value = '';
  target.value = '';
}

// add cmd
function addCmd(cmd,target){
  let ul = document.querySelector('ul');
  let li = document.createElement('li');
  li.innerHTML = `<label class="cmd">${cmd}</label>:<label class="target">${target}</label><span class="delete">×</span>`;
  ul.appendChild(li);
  document.querySelector('.cmdBoard').style.display = 'block';
  options[cmd] = target
  console.log("Added Cmd",options)
  updateBGOptions(options)
}

// clear the LIST
function clearList(e){
  let ul = document.querySelector('ul').innerHTML = '';
  options = {}
  updateBGOptions(options)
}

// delete cmd
function deleteCmd(e){
  let remove = e.target.parentNode;
  let parentNode = remove.parentNode;
  parentNode.removeChild(remove);
  const cmdToremove = remove.querySelector(".cmd").innerText
  delete options[cmdToremove]
  console.log("Removed Cmd",options)
  if (Object.keys(options).length == 0) {
    document.querySelector('.cmdBoard').style.display = 'none';
  }
  updateBGOptions(options)
}
