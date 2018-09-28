ui.initialiseCodeUI = function(){
  var textarea = document.querySelector('.code');
  window.codeMirror = CodeMirror(textarea, {
    value: startingCode,
    lineNumbers: true,
    mode: 'javascript',
    fullscreen: true,
    electricChars: true,
    extraKeys: {
      "F11": function(cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
      "Esc": function(cm) {
        if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
      }
    }
  });
}

logger.log = function(message, attentionCalling){
  var log = document.querySelector('.log');
  var attentionCallingClass = attentionCalling ? 'attention-calling' : '';
  log.innerHTML += '<p class="' + attentionCallingClass + '">' + message + '</p>';
  log.scrollTop = log.scrollHeight;
}

logger.clearLog = function(){
  var log = document.querySelector('.log');
  log.innerHTML = '';
}
