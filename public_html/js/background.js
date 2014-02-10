chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'bounds': {
      'width': window.screen.width,
      'height': window.screen.height
    }
  });
});