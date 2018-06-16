// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";


$(function (){
	var $link = "https://gpodder.net";
	var $flag = false;

	//Gather username and password from login page
	var $username = localStorage.getItem('usrnm');
	var $password = localStorage.getItem('pswrd');
	var $deviceid = localStorage.getItem('dvid');

	if ($username !== undefined && $password !== undefined){
		$.ajax({
				type: "GET",
				url: proxyurl+"https://gpodder.net/subscriptions/"+$username+"/"+$deviceid+".json",
				dataType: 'json',
				withCredentials: true,
				username: $username,
				deviceid: $deviceid,
				format: 'json',
				beforeSend: function(req) {
			        req.setRequestHeader('Authorization', 'Basic ' + btoa($username+":"+$password));
			    },
			    success: function(data, textStatus, request) {
					//console.log(data);
				}
			});
		$.ajax({
			type: "GET",
			url: proxyurl+"http://feeds.gpodder.net/parse",
			data: {url:"http://leo.am/podcasts/floss"},
			//dataType: 'json',
			headers: {Accept: 'application/json'},
			contentType: 'application/x-www-form-urlencoded',

			success: function(data, textStatus, request) {
				console.log(data);
				saveToFirebase(data);
			},
			error: function(e) {
				console.log(e);
			}
		});
		
	} 
	else {
		alert("Please log in!");
		window.location.href = "main.html";
	}
});

function saveToFirebase(websiteInfo) {
	var websiteObj = websiteInfo[0];
	var url = websiteObj.urls[0];
	var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
	var ref = firebase.database().ref('cached-entries/'+urlfixed);
	var websiteObject = JSON.stringify({
		url: url,
		info: websiteObj
	});
	console.log(url);
	ref.set(websiteObject)
		.then(function(snapshot){
			alert("working!");
		}, function(error) {
			alert("not working");
		});

	ref.once('value').then(function(snapshot){
		console.log(snapshot.val());
		alert("works");
	});


}






