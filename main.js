// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topresults");

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
					return data;
				}
			// });
		}).then(function(resp){

			var subInfo = [];
			var length = resp.length;

			for (var i=0; i < (length); i++){
				$.ajax({
					type: "GET",
					url: proxyurl+"https://gpodder.net/api/2/data/podcast.json",
					data: {url:resp[i]},
					dataType: 'json',
					format: 'json',
					success: function(data, textStatus, request) {
						// console.log(data);
						// console.log(resp);
						subInfo.push(data);
						//console.log(subInfo.length);
						//console.log(subInfo[0]);
					}
				});
			}

			subInfo = subInfo.sort(function(a,b){
						var keyA = a.subscribers_last_week;
						var keyB = b.subscribers_last_week;
						return(keyB-keyA);
					});
			return subInfo;

		}).then(function(subs){
			for (var j=0; j < 5; j++){
				var sub = subs[j];
				console.log(sub);
				//alert(sub);
				var l1 = '<div class="subscrip container center">';
				var l1p5 = '<a href='+sub.mygpo_link+'>'
	            var l2 = '<img src=' + sub.logo_url + ' class="thumbies rounded img-fluid center" alt="Responsive image">';
	            var l2p5 = '</a>'
	            var l3 = '<div class="content">';
	            var l4 = '<h5 class="text-center">' + sub.title + '</h5>';
	            var l5 = '<p class="desc">' + sub.description + '</p>';
	            var l6 = '<p class="text-center viewsAndDate"> Subscribers last week: ' + sub.subscribers_last_week + '</p>';
	            var l7 = '</div>';
		        var l8 = '</div>';
		        $topRes.innerHTML = $topRes.innerHTML + (l1+l1p5+l2+l2p5+l3+l4+l5+l6+l7+l8);

			}
		});

			
			// console.log(subInfo);

			


		// $.ajax({
		// 	type: "GET",
		// 	url: proxyurl+"http://feeds.gpodder.net/parse",
		// 	data: {url:"http://leo.am/podcasts/floss"},
		// 	//dataType: 'json',
		// 	headers: {Accept: 'application/json'},
		// 	contentType: 'application/x-www-form-urlencoded',

		// 	success: function(data, textStatus, request) {
		// 		console.log(data);
		// 		saveToFirebase(data);
		// 	},
		// 	error: function(e) {
		// 		console.log(e);
		// 	}
		// });
		
	
}
	else 
	{
		alert("Please log in!");
		window.location.href = "main.html";
	}
});










function retrieveSubs(username,deviceid) {
	$.ajax({
		type: "GET",
		url: proxyurl+"https://gpodder.net/subscriptions/"+$username+"/"+$deviceid+".json",
		dataType: 'json',
		withCredentials: true,
		username: username,
		deviceid: deviceid,
		format: 'json',
		beforeSend: function(req) {
	        req.setRequestHeader('Authorization', 'Basic ' + btoa($username+":"+$password));
	    },
	    success: function(data, textStatus, request) {
			return data;
		}
	// });
	})
}








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






