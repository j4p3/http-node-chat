var userName = "myUsername";
var chatLog = [];

function msgAppender(msg) {
	//	record newly received data
	console.log('msgAppender called');
	console.log('received data: '+msg);
	console.log('user: '+msg.user);
	console.log('body: '+msg.body);

	chatLog.push(msg);	//	add new message to chat log
	var newLine = '<li id="'+msg.user+'">'+msg.user+': '+msg.body+'</li>'	//	format new line
	$('ul#chat').append(newLine);	//	append new line of chat

	$('div#chatbox').each(function(){	//	maintain scroll at bottom
    	$(this).scrollTop($(this).prop('scrollHeight'));
  	});
};


function sendMsg(msg) {
	console.log('sendMsg called');

	$.ajax({
		url: "http://localhost:1995/add",
		dataType: "json",
		data: msg,
		success: function(data) {
			msgAppender(data);
		}
	});

};

function updateChat() {
	console.log('updateChat called');

	function poll() {
		setTimeout(function() {
	       $.ajax({ url: "http://localhost:1995/update", success: function(data) {
	            msgAppender(data);
	       }, dataType: "json", complete: poll() });
	    }, 3000);
	};

	poll();

};


function msgListener() {
	console.log('msgListener called');

  $('form#messagebox').submit(function() {	//	listen for form submission
	    var inputText = $('input#inputText').val(); //  get input value
	    $('input#inputText').val(''); //  clear input field
	    event.preventDefault(); //  stop page refresh

	    console.log('inputText:');
	    console.log(inputText);

	    var msg = {user: userName, body: inputText};
	    sendMsg(msg);
   });
};


$(document).ready(function() {
  console.log('chat_client called');
  updateChat();
  msgListener();
});