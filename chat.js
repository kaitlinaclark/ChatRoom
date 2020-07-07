      var username = "";

    if(username === ""){
        $("#navbar").attr("style", "display:none;") //hide navigation bar
        $("#new_room").attr("style", "display:none;") // hide for to create chat
        $("#avail-chats").attr("style", "display:none;") // hide avail chats
        $("#user_panel").attr("style", "display:none;") // hide current users
        $("#chat_window").attr("style", "display:none;") // hide chat log
    }

	 //////////////////////
	 /////enter username///
	 //////////////////////
    //Regsiter that the enter username button has been pressed
    $('#user').on('submit', function(event){
        event.preventDefault();
        
        //Get the text that the user inputted as their name
        username =  $('#name').val();
        if(username ===''){
            $("#username_error").text("Please enter a valid username")
            console.log('please enter a valid username');
        }
        else{
            //Send the username that the client entered to the server side
         //   socket.emit('user_joined', {username: username});
            //Get all the chats that the user is currently in
            console.log('username sent to server');
            
            $('#user').attr('style', 'display:none'); //hide username input form
            
            $("#navbar").attr('style', 'display: inherit'); //show navbar
            $("#avail-chats").attr('style', 'display: inherit'); // show available chats
            $('#new_room').attr('style', 'display: inherit'); //show create room form

        }
    });
    ///////////////////////////
	
