

$(function (){

	var $username = "jpharriman"
	var $password = "2muchSwag"

	//$.ajax({
		// type: 'POST',
		// url: 'https://gpodder.net/api/2/auth/jpharriman/login.json',
		// // beforeSend: function (xhr){
		// // 	xhr.setRequestHeader('Authorization','Basic ')
		// // }
		// dataType: 'jsonp',
		// data: {
		// 	username: 'jpharriman',
		// 	password: '2muchSwag'
		// },
		// crossDomain: true,
		// xhrFields: {
		// 	withCredentials: true
		// },
		// success : function(data) {
		// 	alert("logged in");
		// },
		// error: function (xhr, ajaxOptions, throwError){
		// 	alert("wrong");
		// }
		// datatype: 'jsonp',

		// xhrFields: {
		// 	withCredentials: true
		// },
		// headers: {
		// 	'Authorization': 'Basic ' + btoa('jpharriman:2muchSwag')
		// },
		// url: 'https://gpodder.net/api/2/auth/jpharriman/login.json',
		// success : function(data) {
		// 	alert("logged in");
		// },
		// error: function (xhr, ajaxOptions, throwError){
		// 	alert("wrong");
		// }
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https//:gpodder.net/api/2/auth/jpharriman/login.json", true);
		xhr.withCredentials = true;
		xhr.setRequestHeader("Authorization", 'Basic ' + btoa('jpharriman:2muchSwag'));
		xhr.onload = function () {
		    console.log(xhr.responseText);
		};
		xhr.send();



	//})


	$('#submitBtn').on("click",function(event){
		event.preventDefault();
		//alert("working");
	});




});

// $(function (){
// 	var $username = $('#inputUsername');
// 	var $password = $('#inputPassword');

// 	alert("con");

// 	$('#submitBtn').on("submit",function(event){
// 		event.preventDefault();
// 		alert("yes");

// 		var req = {
// 				username = $username.val(),
// 				password = '2muchSwag',
// 			};

// 		$.ajax({
// 			type: 'POST',
// 			url: 'https://gpodder.net/api/2/auth/jpharriman/login.json',
// 			data: req,
// 			success: function(resp) {
// 				alert("yes");

// 			},
// 			error: function(){
// 				alert("no");
// 			}

// 		});

// 	});
	
// });