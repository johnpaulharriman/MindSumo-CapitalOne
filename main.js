// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topResults");
var $detailedSUBS = [];
var $progData = 0;

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
	//localStorage.setItem('needReload',true);
	var d = Date();
	console.log(Date.parse(d));

	//$('#carouselExampleControls').removeClass("onload-off");
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
					//$progData += 10;
					//updateProg();
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
			//$progData += 20;
			//updateProg();
			return subInfo;

		}).then(function(subs){
			//console.log(subs);
			for (var j=0; j < 5; j++){
				var sub = subs[j];
				if(sub !== undefined)
				{
					var l1 = '<div class="subscrip container-fluid center">';
					var l1p5 = '<a href='+sub.url+'>'
		            var l2 = '<img src=' + sub.logo_url + ' class="thumbies rounded img-fluid center carPic" alt="Responsive image">';
		            var l2p5 = '</a>'
		            var l3 = '<div class="content">';
		            var l4 = '<h5 class="text-center">' + sub.title + '</h5>';
		            var l5 = '<p class="desc">' + sub.description + '</p>';
		            var l6 = '<p style="padding-bottom:10px" class="text-center viewsAndDate"> Subscribers last week: ' + sub.subscribers_last_week + '</p>';
		            var l7 = '</div>';
			        var l8 = '</div>';
			        $topRes.innerHTML = $topRes.innerHTML + (l1+l1p5+l2+l2p5+l3+l4+l5+l6+l7+l8);
		    	}
			}
			//$progData += 10;
			//updateProg();
			return subs;
		}).then(function(subs){
			//console.log(subs);
			
			localStorage.setItem('basicSub',JSON.stringify(subs));
			
			var length = subs.length;
			if (length === undefined){
				localStorage.setItem('basicSub',JSON.stringify(subs));;
			}
			var subDetailedInfo = new Array(1);
			var reff = firebase.database().ref('cached-entries/');
			reff.on('value', function(snapshot){
				//console.log("IMPORTANT");
				//console.log(snapshot.val());
				if (snapshot.val() !== null){
					subDetailedInfo[0] = snapshot.val();
					//$onem.push(subDetailedInfo[0]);
					localStorage.setItem('detailedSub', JSON.stringify(subDetailedInfo[0]));
				}
			});
			//$progData += 10;
			//updateProg();

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
			var flag = false;
			for (var i = 0; i < length; i++){
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				var upd = (100*((1)/length));
				//alert(subAdvanced["httpleoampodcastssn"])
				//console.log(i);
				if (subAdvanced === null) {
					prepareForFirebase(url,upd);
					//$("#prog").css("width", (100*((i+1)/length)).toString()+"%");
					
				}
				else if (!subAdvanced[urlfixed]) {
					prepareForFirebase(url,upd);
					//$("#prog").css("width", (100*((i+1)/length)).toString()+"%");
				}
				else {
					flag = true;
				}
				
				
			}

			if (flag) {
				console.log("success!");
				$("#remProg").remove();
				$("#message").remove();
				$("#message2").remove();
				$("#carouselExampleControls").removeClass("onload-off");
				
			}
			var highFreq = [];
			for (i = 0; i < length; i++) {
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				if (subAdvanced[urlfixed] !== undefined){
					highFreq.push(JSON.parse(subAdvanced[urlfixed]));
				}
				//console.log(highFreq);
			}

			//highFreq = JSON.parse(JSON.stringify(highFreq));

			highFreq = highFreq.sort(function(a,b){
						//alert(a["info"]["weightedFreq"]);
						var keyA = a.info.weightedFreq;
						var keyB = b.info.weightedFreq;
						return(keyB-keyA);
					});

			console.log(highFreq);
			//$progData += 40;
			//updateProg();
			return highFreq;


		}).done(function(param) {
			//$progData += 10;
			//updateProg();
			//console.log($progData === 100);
			console.log(param);
			var firstSlide = document.getElementById('firstSlide');
			firstSlide.src = param["0"].info.logo;
			firstSlide.class = "carPic";
			firstSlide.href = param["0"].info.url;
			var head1 = document.getElementById('head1');
			head1.innerHTML = param["0"].info.title;
			var head2 = document.getElementById('head2');
			head2.innerHTML = param["1"].info.title;
			var head3 = document.getElementById('head3');
			head3.innerHTML = param["2"].info.title;
			var par1 = document.getElementById('par1');
			var par2 = document.getElementById('par2');
			var par3 = document.getElementById('par3');
			var parsedDate =  (param["0"].info.episodeRelease).substr(0,10)
			par1.innerHTML = "<b>Newest Episode</b>: "+param["0"].info.episodeTitle+"<br/> <b>Released</b>: "+ parsedDate;
			par2.innerHTML = "<b>Newest Episode</b>: "+param["1"].info.episodeTitle+"<br/> <b>Released</b>: "+ param["1"].info.episodeRelease;
			par3.innerHTML = "<b>Newest Episode</b>: "+param["2"].info.episodeTitle+"<br/> <b>Released</b>: "+ param["2"].info.episodeRelease;
			var link1 = document.getElementById('firstlink');
			var link2 = document.getElementById('secondlink');
			var link3 = document.getElementById('thirdlink');

			link1.href = param["0"].info.url;
			link2.href = param["1"].info.url;
			link3.href = param["2"].info.url;

			//firstSlide.alt = "Responsive Image";
			var secSlide = document.getElementById('secSlide');
			secSlide.src = param["1"].info.logo;
			secSlide.class = "carPic";
			//secSlide.alt = "Responsive Image";
			var thirdSlide = document.getElementById('thirdSlide');
			thirdSlide.src = param["2"].info.logo;
			thirdSlide.class = "carPic";
			//thirdSlide.alt = "Responsive Image";
			//$("#prog").addClass("onload-off");


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






function saveToFirebase(websiteObj,upd) {
	var url = websiteObj.url;
	var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
	var ref = firebase.database().ref('cached-entries/'+urlfixed);
	var websiteObject = JSON.stringify({
		url: url,
		info: websiteObj
	});
	console.log(url);
	console.log(upd);
	$progData += upd;
	updateProg();

	ref.set(websiteObject)
		.then(function(snapshot){
			//$progData += upd;
			//updateProg();
			//alert("working!");
		}, function(error) {
			console.log("not working - sorry :(");
		});
	
	
}

function prepareForFirebase(link,upd) {
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
		try
		{
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
			var episodeTitle = episodes["0"]["title"];
			var episodeRelease = new Date(episodes["0"]["released"] * 1000);
			var title = $parsed.title;
			//console.log($parsed);

			var data = {
				url: url,
				author: author,
				description: description,
				episodeLength: episodelength,
				weightedFreq: weightedFreq,
				logo: logo,
				title: title,
				episodeTitle: episodeTitle,
				episodeRelease: episodeRelease
			}
			saveToFirebase(data,upd);
		}
		catch(e)
		{
			$progData += upd;
			updateProg();
		}
		finally {
			if ($progData === 100){
				$("#remProg").fadeOut(800);
				location.reload();
				
			}
		}


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


function updateProg() {
	$("#prog").css("width", ($progData).toString()+"%");
}

