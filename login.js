

$(function (){

	var $username = "jpharriman";
	var $password = "2muchSwag";
	var authBasic = $.base64.btoa($username + ":" + $password);

	$.ajax({

		type: "POST",
		url: "https:gpodder.net/api/2/auth/jpharriman/login.json",
		data: {username: $username, password: $password, grant_type: 'password'},
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		xhrFields: {
			withCredentials: true
		},
		headers: {
			"Authorization": "Basic " + authBasic
		},
		success: function (res){
			alert("thanks");
		},
		error: function (req, status, error){
			alert(error);
		}


	});


	$('#submitBtn').on("click",function(event){
		event.preventDefault();
		//alert("working");
	});




});

