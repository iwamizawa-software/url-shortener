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
  var shorten, onclick = function (tab) {
    var url = tab.url || tab.pendingUrl, title = tab.title || url;
    if (url.indexOf('http'))
      return msg(chrome.i18n.getMessage('failed'));
    var permissions = chrome.runtime.getManifest().permissions;
    var APIList = permissions.slice(permissions.findIndex(s=>!s.indexOf('http')));
    (shorten = function s() {
      if (s !== shorten)
        return;
      if (!APIList.length)
        return msg(chrome.i18n.getMessage('failed'));
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
  };
  chrome.browserAction.onClicked.addListener(onclick);
  chrome.contextMenus.create({
    title: chrome.i18n.getMessage('extName'),
    onclick: function (info, tab) {
      onclick(tab);
    }
  });
}();
