// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topresults");
var $detailedSUBS = [];

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
				//console.log(snapshot.val());
				if (snapshot.val() !== null){
					subDetailedInfo[0] = snapshot.val();
					//$onem.push(subDetailedInfo[0]);
					localStorage.setItem('detailedSub', JSON.stringify(subDetailedInfo[0]));
				}
			});

			//checkFirebase();
			//console.log($subscriptionList === undefined);
		}).then(function(){
			// //var subBasic = subsobj[0];
			//console.log($onem);
			var subAdvanced = JSON.parse(localStorage.getItem('detailedSub'));
			var subBasic = JSON.parse(localStorage.getItem('basicSub'));
			//console.log(subAdvanced);
			//console.log(subBasic);
			var length = subBasic.length;
			for (var i = 0; i < length; i++){
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				//alert(subAdvanced["httpleoampodcastssn"])
				if (subAdvanced === null) {
					prepareForFirebase(url);
				}
				else if (!subAdvanced[urlfixed]) {
					//console.log("jmm");
					prepareForFirebase(url);
				}
			}

			var highFreq = [];
			for (i = 0; i < length; i++) {
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				highFreq.push(subAdvanced[urlfixed]);
				//console.log(highFreq);
			}

			console.log(highFreq);

			//highFreq = JSON.parse(JSON.stringify(highFreq));

			highFreq = highFreq.sort(function(a,b){
						//alert(a["weightedFreq"]);
						var keyA = a.weightedFreq;
						var keyB = b.weightedFreq;
						return(keyB-keyA);
					});
			return highFreq;


		}).done(function(param) {
			console.log(param);
			//console.log(param[0].logo);
			var heee = param["0"];
			var hopelo = heee["logo"];
			console.log(heee);
			console.log(hopelo);
			document.getElementById('firstSlide').src = param["0"]["logo"];
		});





}
	else 
	{
		alert("Please log in!");
		window.location.href = "index.html";
	}
});



function refData(param) {
	console.log(param);

	$detailedSUBS.push(param);
	console.log($detailedSUBS);
	runAnalysis();
}

function checkthis() {
	alert($detailedSUBS);
}






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






function saveToFirebase(websiteObj) {
	var url = websiteObj.url;
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
			console.log("not working - sorry :(");
		});
}

function prepareForFirebase(link) {
	//console.log(link);
	$.ajax({
		type: "GET",
		url: proxyurl+"http://feeds.gpodder.net/parse",
		data: {url:link},
		//dataType: 'json',
		headers: {Accept: 'application/json'},
		contentType: 'application/x-www-form-urlencoded',

		success: function(data, textStatus, request) {
			return JSON.parse(JSON.stringify(data));
			
		},
		error: function(e) {
			//console.log(e);
		}
	}).done(function(param) {
		//need author, description, link, logo, url, episode data

		var $parsed = (param["0"]);
		var episodes = $parsed.episodes;
		var episodelength = episodes.length;
		var frequencyGeneral = allTimeFreq(episodes);
		var frequencyLastMonth = monthTimeFreq(episodes);
		var weightedFreq = (7*frequencyLastMonth)+(3*frequencyGeneral);
		var author = $parsed.author;
		var description = $parsed.description;
		var url = link;
		var logo = $parsed.logo;

		var data = {
			url: url,
			author: author,
			description: description,
			episodeLength: episodelength,
			weightedFreq: weightedFreq,
			logo: logo
		}

		saveToFirebase(data);

	});
}


function allTimeFreq(episodeData) {
	var length = episodeData.length;
	var minutes = 1000 * 60;
	var hours = minutes * 60;
	var days = hours * 24;
	var years = days * 365;
	var range = (episodeData[0]["released"]-episodeData[length-1]["released"]);
	var yearForRange = (range/years);
	return Math.round((length/yearForRange)/10000);

}

function monthTimeFreq(episodeData) {
	var length = episodeData.length;
	var today = Date.parse(Date());
	
	var minutes = 1000 * 60;
	var hours = minutes * 60;
	var days = hours * 24;
	var oneMonthAgo = today-(30*days);


	var log = 0;

	for (var i = 0; i <length; i++){
		if (episodeData[i]["released"]*1000 > oneMonthAgo){
			log++;
		}
	}
	return log;
	
}


