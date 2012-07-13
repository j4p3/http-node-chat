var userName = "myUserName";
//  keep length of chat array for comparison w/ server
chatLog = [];


function chatAppender(message) {
  console.log('chatAppender called');

  //  add HTML to server response
  for(var mid in message) {
    chatLog.push('<li id="'+message[mid].user+'">'+message[mid].user+': '+message[mid].body+'</li>');
  };

  //  isolate subset of messages to append
  var newChat = chatLog.slice();

  //  print array of chatLog
  console.log('Array generated:');
  for (var i in newChat) {
    console.log(newChat[i]);
    $('ul#chat').append(newChat[i]);
  };
  console.log('Length of: '+chatLog.length);

  //  scroll to bottom of newly elongated chat
  $('div#chatbox').each(function(){
    $(this).scrollTop($(this).prop('scrollHeight'));
  });
};


function updateChat() {
  //  long poll server to pick up any updates
  console.log('updateChat called');

  (function poll() {
   setTimeout(function() {
       $.ajax({ url: "http://localhost:1995/update", success: function(data) {
            chatAppender(data);
       }, dataType: "json", complete: poll });
    }, 30000);
  })();
};


function sendMessage(inputData) {
  //  take inputListener text, put in server-side array
  console.log('sendMessage called');

  (function poll() {
   setTimeout(function() {
       $.ajax({ url: "http://localhost:1995/add", dataType: 'json', data: inputData, success: function(data) {
            chatAppender(data);
       }, dataType: "json", complete: poll });
    }, 30000);
  })();
};


//  input listener - see input, send data to server
function inputListener() {
  console.log('inputListener called');

  //  look for submission
  $('form#messagebox').submit(function() {
    var inputText = $('input#inputText').val();
    $('input#inputText').val('');
    event.preventDefault();

    console.log('inputText:');
    console.log(inputText);

    var inputData = {mid: null, user: userName, body: inputText};

    sendMessage(inputData);
    });
  };


$(document).ready(function() {
  console.log('chatscript called');

  inputListener();
  updateChat();  
});
