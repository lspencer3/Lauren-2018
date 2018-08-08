function(){

	document.on("click", function(event){
			console.log('hello')
		$.ajax("/add_user", {
	      type: "POST",
	      data: newUser
	    }).then(
	      function() {
	        console.log("created new user");
	    });
	});