// default
let options = {
    "gh": "github.com",
    "fb": "facebook.com",
    "rd": "reddit.com",
    "in": "instagram.com",
    "yt": "youtube.com",
}

chrome.storage.sync.set({cmd: options}, function() {
    console.log("set")
    console.log(options);
  });
  
  chrome.storage.sync.get(['cmd'], function(result) {
    console.log("set")
    console.log(result.cmd);
    console.log(typeof(result.cmd))
    
    resultFromStorage = result.cmd
});
/*
    key is the key of value that was changed
    changes is object that has storrage change according to keys (old and new value)
    namespace is type of storage, sync or local
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      console.log('Storage key "%s" in namespace "%s" changed. ' +
                  'Old value was "%s", new value is "%s".',
                  key,
                  namespace,
                  storageChange.oldValue,
                  storageChange.newValue);
    }
  }
);
  
chrome.omnibox.onInputEntered.addListener(
    function(text) {
      // Encode user input for special characters , / ? : @ & = + $ #
      const input = encodeURIComponent(text)
      if (input in options) {
        const URL = "https://" + options[input];
        chrome.tabs.update(null, {url: URL})
    }
    
}
);

// let suggestList = []
// for (opt in options) {
//     let suggestion = {
//         content: options[opt],
//         description: options[opt]
//     }
//     suggestList.push(suggestion)
// }
// chrome.omnibox.onInputChanged.addListener(
//     function(text, suggest) {
//       console.log('inputChanged: ' + text);
//     //   suggest([
//     //     {content: text + " one", description: "the first one"},
//     //     {content: text + " number two", description: "the second entry"}
//     //   ]);
//         suggest(suggestList)
//     }
// );