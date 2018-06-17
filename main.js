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
	var $subscriptionList;
	var loggedInUnd = ($username !== undefined && $password !== undefined);
	var loggedInNull = ($username !== null && $password !== null);
	var d = Date();
	console.log(Date.parse(d));

	//console.log($username);

	$("#logoutBtn").on('click',function(event){
		localStorage.clear();
		window.location.href = "index.html";
		
	});



	if (loggedInUnd&&loggedInNull){
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
						
						subInfo.push(data);
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
			//console.log(subs);
			for (var j=0; j < 5; j++){
				var sub = subs[j];
				//console.log(j);
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
			return subs;
		}).then(function(subs){
			//console.log(subs);
			
			localStorage.setItem('basicSub',JSON.stringify(subs));
			
			var length = subs.length;
			alert(length);
			var subDetailedInfo = new Array(1);
			var reff = firebase.database().ref('cached-entries/');
			reff.on('value', function(snapshot){
				if (snapshot.val() !== null){
					subDetailedInfo[0] = snapshot.val();
					localStorage.setItem('detailedSub', JSON.stringify(subDetailedInfo[0]));
				}
			});


			


			//checkFirebase();
			//console.log($subscriptionList === undefined);
		}).then(function(subsobj){
			// //var subBasic = subsobj[0];
			var subAdvanced = JSON.parse(localStorage.getItem('detailedSub'));
			var subBasic = JSON.parse(localStorage.getItem('basicSub'));
			console.log(subAdvanced);
			console.log(subBasic);
			var length = subBasic.length;
			for (var i = 0; i < length; i++){
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				if (subAdvanced[urlfixed]) {
					console.log(i);
				}
				else  {
					prepareForFirebase(url);
				}
			}
			alert("all ready to go!");

		});

			
			// console.log(subInfo);

			


		
		
	
}
	else 
	{
		alert("Please log in!");
		window.location.href = "index.html";
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




function checkFirebase(url) {
	
	var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
	var ref = firebase.database().ref('cached-entries/'+urlfixed);
	//console.log(urlfixed);
	var $fixedVal = null;
	ref.once('value').then(function(snapshot){
		$fixedVal = snapshot.val();
		if (snapshot.val() !== null){
			alert("TURE");
			return true;
		}
		
	});
	return false;
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
			//alert("working!");
		}, function(error) {
			alert("not working");
		});
}

function prepareForFirebase(link) {
	$.ajax({
		type: "GET",
		url: proxyurl+"http://feeds.gpodder.net/parse",
		data: {url:link},
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






