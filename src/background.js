let options = {}

chrome.storage.sync.get(['cmd'], (result) => {   
  if(result.cmd) {
    options = result.cmd
  }
});
// AFTER MAIN
/*
    key is the key of value that was changed
    changes is object that has storrage change according to keys (old and new value)
    namespace is type of storage, sync or local
*/
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      if (key == "cmd") {
        chrome.storage.sync.set({cmd: storageChange.newValue}, function() {
          chrome.storage.sync.get(['cmd'], function(result) {    
            options = result.cmd
          });
        });
        break
      }
    }
  }
);
  
chrome.omnibox.onInputEntered.addListener(
    function(text) {
      // Encode user input for special characters , / ? : @ & = + $ #
      const input = encodeURIComponent(text)
      if (input in options) {
        const urlTrail = "https://"
        let URL = options[input]
        var searchPattern = new RegExp('^' + urlTrail, 'i');
        if (!searchPattern.test(options[input])) {
          URL = urlTrail + options[input];
        }
        chrome.tabs.update(null, {url: URL})
    }  
}
);