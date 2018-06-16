// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";


$(function (){
	var $link = "https://gpodder.net";

	//Gather username and password from login page
	var $username = localStorage.getItem('usrnm');
	var $password = localStorage.getItem('pswrd');
	if ($username !== undefined && $password !== undefined){
		// alert($username);
		// alert($password);
		console.log(window.location.hostname);
	} 
	else {
		alert("Please log in!");
		window.location.href = "main.html";
	}

	$.ajax({

	    
	    type: 'GET',
	    //API Link for Login
	    url: proxyurl+"https://gpodder.net/api/2/devices/" + $username + ".json",
	    dataType: 'json',
	    withCredentials: true,
	    // headers: {
	    // 	'Authorization': 'Basic ' + btoa($username+":"+$password)
	    // },
	    username: $username,
	
	    beforeSend: function(req) {
	        req.setRequestHeader('Authorization', 'Basic ' + btoa($username+":"+$password));
	    },
	    //success function will pass values to next page for subscription
	    success: function(data, textStatus, request) {
			console.log(data);
		},
		//verification
		error: function(xhr,options,error) {
			console.log(error);
		}
		  
	  
	});



});




