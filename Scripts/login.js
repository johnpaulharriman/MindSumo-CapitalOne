
// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";

var $username = document.getElementById("inputUsername");
var $password = document.getElementById("inputPassword");



$(function (){
	//If the user hits enter for username or password
	$('#inputPassword').keypress(function(event){
		if (event.which === 13){
			$('#submitBtn').click();
		}
	});
	$('#inputUsername').keypress(function(event){
		if (event.which === 13){
			$('#submitBtn').click();
		}
	});
	$("#submitBtn").on('click',function(event){
		$.ajax({
		    type: 'POST',
		    //API Link for Login
		    url: proxyurl+"https://gpodder.net/api/2/auth/" + $username.value + "/login.json",
		    dataType: 'text',
		    username: $username.value,
		    password: $password.value,
		    withCredentials: true,
		
		    beforeSend: function(req) {
		        req.setRequestHeader('Authorization', 'Basic ' + btoa($username.value+":"+$password.value));
		    },
		    //success function will pass values to next page for subscription
		    success: function(data, textStatus, request) {
				localStorage.setItem('usrnm', $username.value);
				localStorage.setItem('pswrd', $password.value);
			},
			//verification
			error: function() {
				alert("Username or Password is incorrect");
			}
		  
		}).done(function(resp){
			$.ajax({
			    type: 'GET',
			    //API Link for Login
			    url: proxyurl+"https://gpodder.net/api/2/devices/" + $username.value + ".json",
			    dataType: 'json',
			    withCredentials: true,
			    username: $username.value,
			
			    beforeSend: function(req) {
			        req.setRequestHeader('Authorization', 'Basic ' + btoa($username.value+":"+$password.value));
			    },
			    //success function sorts most subscribed device and uses that as
			    //device id
			    success: function(data, textStatus, request) {
					
					data = data.sort(function(a,b){
							var keyA = a.subscriptions;
							var keyB = b.subscriptions;
							return(keyB-keyA);
						});
					//console.log(data[0]["id"]);
					localStorage.setItem('dvid', data[0]["id"]);
					window.location.href = "main.html"
				},
				//verification
				error: function(xhr,options,error) {
					console.log(error);
				}

		});
	});
});
});