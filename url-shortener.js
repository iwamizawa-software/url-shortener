!function () {
  var lastTimer, msg = function (msg, title) {
    chrome.notifications.create('notify', {
      type: 'basic',
      title: title || chrome.i18n.getMessage('extName'),
      iconUrl: 'icon.png',
      message: msg
    });
    setTimeout(lastTimer = function t() {
      if (lastTimer === t)
        chrome.notifications.clear('notify');
    }, 3000);
  };
  var Ajax = function (url, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (xhr.status === 200 && xhr.responseText && !xhr.responseText.indexOf('http'))
        success(xhr.responseText);
      else
        error();
    };
    xhr.onerror = error;
    xhr.send();
  };
  var shorten;
  chrome.browserAction.onClicked.addListener(function (tab) {
    var url = tab.url || tab.pendingUrl, title = tab.title || url;
    var APIList = chrome.runtime.getManifest().permissions.slice(3);
    (shorten = function s() {
      if (s !== shorten)
        return;
      if (!APIList.length) {
        msg(chrome.i18n.getMessage('failed'));
        return;
      }
      Ajax(APIList.shift() + encodeURIComponent(url), function (result) {
        if (s !== shorten)
          return;
        var input = document.body.appendChild(document.createElement('input'));
        input.value = result;
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        msg(title, chrome.i18n.getMessage('copied'));
      }, s);
    })();
  });
}();
