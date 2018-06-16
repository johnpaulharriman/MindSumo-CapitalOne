const proxyurl = "https://cors-anywhere.herokuapp.com/";
var $url1 = "https://gpodder.net/api/2/auth/" + document.getElementById("inputUsername").value + "/login.json"; // site that doesn’t send Access-Control-*
var $url = proxyurl+$url1;

var $username = document.getElementById("inputUsername");
var $password = document.getElementById("inputPassword");



$(function (){
	$("#submitBtn").on('click',function(event){
		$.ajax({
		    type: 'POST',
		    url: proxyurl+"https://gpodder.net/api/2/auth/" + $username.value + "/login.json",
		    dataType: 'text',
		    username: $username.value,
		    password: $password.value,
		    withCredentials: true,
		 
		    // This the only way I can find that works to do Basic Auth with jQuery Ajax
		    beforeSend: function(req) {
		        req.setRequestHeader('Authorization', 'Basic ' + btoa($username.value+":"+$password.value));
		    },
		    success: function(data, textStatus, request) {
				localStorage.setItem('usrnm', $username.value);
				localStorage.setItem('pswrd', $password.value);
				window.location.href = "main.html";
			},
			error: function() {
				alert("Username or Password is incorrect");
			}
		  
		});
	});

	



});