

$(function (){

	var $username = "jpharriman"
	var $password = "2muchSwag"

	$.ajax({

		type: "POST",
		url: "https:gpodder.net/api/2/auth/jpharriman/login.json",
		dataType: 'json',
		async: true,
		headers: {
			"Authorization": "Basic " + btoa($username + ":" + $password)
		},
		data: '{comment}',
		success: function (){
			alert("thanks");
		},
		error: function (){
			alert("no thanks 2");
		}


	});


	$('#submitBtn').on("click",function(event){
		event.preventDefault();
		//alert("working");
	});




});

