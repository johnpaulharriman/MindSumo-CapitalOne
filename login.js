

$(function (){

	var $username = "jpharriman"
	var $password = "2muchSwag"

	$.ajax({

		type: "GET",
		url: "",
		dataType: 'json',
		async: false,
		headers: {
			"Authorization": "Basic " + btoa($username + ":" + $password)
		},
		data: '{comment}',
		success: function (){
			alert("thanks");
		},
		error: function (){
			alert("no thanks");
		}


	});


	$('#submitBtn').on("click",function(event){
		event.preventDefault();
		//alert("working");
	});




});

