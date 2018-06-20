// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topResults");
var $othRes = document.getElementById("otherResults");
var $detailedSUBS = [];
var $progData = 0;
var $username = localStorage.getItem('usrnm');
var $password = localStorage.getItem('pswrd');
var $deviceid = localStorage.getItem('dvid');


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
	

	//$('#carouselExampleControls').removeClass("onload-off");
	//console.log($username);

	$("#logoutBtn").on('click',function(event){
		localStorage.clear();
		window.location.href = "index.html";
		
	});

	$('#recBtn').on('click',function(event)
	{
		//saveToFirebase(getUserInfo(changeToRec));
		window.location.href = "recommend.html"

		

	});
	

	if (loggedInUnd&&loggedInNull){



		let myfirstPromise = new Promise(
			(resolve,reject) => {
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
						resolve(data);
					}
				});
			}
		)
		myfirstPromise.then(
			function(val) {
				subInfo(val);
			}).catch(
			(reason)=> {
				(console.log(reason));
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
			var tags = $parsed.tags;
			//console.log($parsed);

			var data = {
				url: url,
				author: author,
				description: description,
				episodeLength: episodelength,
				weightedFreq: weightedFreq,
				logo: logo,
				title: title,
				tags: tags,
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

function addHTML(sub,extension) {

	var logourl = sub.logo_url
	if (logourl.includes("gif")) {
		logourl = "Images/Podcast-placeholder.jpg";
	}
	var l1 = '<div class="subscrip container-fluid center">';
	var l1p5 = '<a href='+sub.url+'>'
    var l2 = '<img src=' + logourl + ' class="thumbies rounded img-fluid center carPic" alt="Responsive image">';
    var l2p5 = '</a>'
    var l3 = '<div class="card content">';
    var l4 = '<div class="card-header text-center">' + sub.title + '</div>';
    var l4p5 = '<div class="card-body">'
    var l5 = '<p class="desc text-center">' + sub.description + '</p>';
    var l6 = '<p style="padding-bottom:10px" class="text-center viewsAndDate"> Subscribers last week: ' + sub.subscribers_last_week + '</p>';
	            
    var l8 = '</div></div></div>';
    extension.innerHTML = extension.innerHTML + (l1+l1p5+l2+l2p5+l3+l4+l4p5+l5+l6+l8);
	
}

async function userSubscriptions() {

	
	
	
	

}



async function subInfo(resp) {

	let totalpromise = new Promise(
		(resolve,reject) =>{
		var subInfo = [];
		var length = resp.length;
		var count = 0;
		for (var i=0; i < (length); i++){
			console.log(i);
			let promiseurl = new Promise(
				(resolve,reject) => {
					
					$.ajax({
						type: "GET",
						url: proxyurl+"https://gpodder.net/api/2/data/podcast.json",
						data: {url:resp[i]},
						dataType: 'json',
						format: 'json',
						success: function(data, textStatus, request) {
							resolve(data);
							// subInfo.push(data);
						}
					});
				}
			)
			promiseurl.then(
				function(val) {
					count++;
					subInfo.push(val);
					if (count == length)
					{
						resolve(subInfo);
					}
				}

			);
		}
		
	}
	)
	totalpromise.then(
		function(val) {
			val = val.sort(function(a,b){
				var keyA = a.subscribers_last_week;
				var keyB = b.subscribers_last_week;
				return(keyB-keyA);
			});
			subDisplay(val);

		})
		
}

async function subDisplay(subs) {
	var remSubs = (subs.slice(5))
	var remSubLength = remSubs.length;
	var listOfSubs = [];
	var maxTries = 30;
	var tryCount = 0; 


	for (var j=0; j < 5; j++){
		var sub = subs[j];
		if(sub !== undefined) { addHTML(sub,$topRes);}	
	}

	while(listOfSubs.length < 5){

		tryCount++;
	    if (tryCount > maxTries) break;
	    var randomnumber = Math.floor(Math.random()*remSubLength);
	    if(listOfSubs.indexOf(randomnumber) > -1) continue;

	    listOfSubs[listOfSubs.length] = randomnumber;
	    
	}

	for (var i=0; i < 5; i++){

		var sub = remSubs[listOfSubs[i]];
		if(sub !== undefined) { addHTML(sub,$othRes); }
    	
	}
	saveValues(subs);
}



async function saveValues(subs){
	
	localStorage.setItem('basicSub',JSON.stringify(subs));
	
	var length = subs.length;
	var subDetailedInfo = new Array(1);
	var reff = firebase.database().ref('cached-entries/');
	let promiseDetail = new Promise(
		(resolve,reject) => {
	reff.on('value', function(snapshot){

		if (snapshot.val() !== null){
			subDetailedInfo[0] = snapshot.val();
			localStorage.setItem('detailedSub', JSON.stringify(subDetailedInfo[0]));
			resolve("success");
		}
	})})
	promiseDetail.then(function(val) {
		highFreqSubs(subs);
	})
	
}

async function highFreqSubs(subs) {
	// //var subBasic = subsobj[0];
			//console.log($onem);
			var subAdvanced = JSON.parse(localStorage.getItem('detailedSub'));
			var subBasic = subs;
			var length = subBasic.length;
			var alreadyLoaded = false;
			console.log(subAdvanced);
			for (var i = 0; i < length; i++){

				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				var upd = (100*((1)/length));

				if (subAdvanced === null || (!subAdvanced[urlfixed])) {
					prepareForFirebase(url,upd);	
				}
				else { ;
					alreadyLoaded = true; 

				}
				
			}

			if (alreadyLoaded) { removeProgressBar() }
	
			var highFreq = [];
			for (i = 0; i < length; i++) {
				var url = subBasic[i].url;
				var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
				if (subAdvanced[urlfixed] !== undefined){
					highFreq.push(JSON.parse(subAdvanced[urlfixed]));
				}
			}

			highFreq = highFreq.sort(function(a,b){

						var keyA = a.info.weightedFreq;
						var keyB = b.info.weightedFreq;
						return(keyB-keyA);
					});

			slideChange(highFreq);
}


async function slideChange(highFreq) {

			changeSlides(highFreq);
			changeHeaders(highFreq);
			changeParagraphs(highFreq);
			changeRefs(highFreq);

		
			
			//thirdSlide.alt = "Responsive Image";
			//$("#prog").addClass("onload-off");


		}

function removeProgressBar() {
	$("#remProg").remove();
	$("#message").remove();
	$("#message2").remove();
	$("#carouselExampleControls").removeClass("onload-off");
	
			
}

function changeSlides(data) {
	var firstSlide = document.getElementById('firstSlide');
	var secSlide = document.getElementById('secSlide');
	var thirdSlide = document.getElementById('thirdSlide');

	firstSlide.src = data["0"].info.logo;
	firstSlide.class = "carPic";

	secSlide.src = data["1"].info.logo;
	secSlide.class = "carPic";

	thirdSlide.src = data["2"].info.logo;
	thirdSlide.class = "carPic";
}

function changeHeaders(data) {
	var head1 = document.getElementById('head1');
	var head2 = document.getElementById('head2');
	var head3 = document.getElementById('head3');

	
	head1.innerHTML = data["0"].info.title;
	head2.innerHTML = data["1"].info.title;
	head3.innerHTML = data["2"].info.title;

}

function changeParagraphs(data) {
	var par1 = document.getElementById('par1');
	var par2 = document.getElementById('par2');
	var par3 = document.getElementById('par3');
	var parsedDate1 =  (data["0"].info.episodeRelease).substr(0,10);
	var parsedDate2 =  (data["1"].info.episodeRelease).substr(0,10);
	var parsedDate3 =  (data["2"].info.episodeRelease).substr(0,10);


	par1.innerHTML = "<b>Newest Episode</b>: "+data["0"].info.episodeTitle+"<br/> <b>Released</b>: "+ parsedDate1;
	par2.innerHTML = "<b>Newest Episode</b>: "+data["1"].info.episodeTitle+"<br/> <b>Released</b>: "+ parsedDate2;
	par3.innerHTML = "<b>Newest Episode</b>: "+data["2"].info.episodeTitle+"<br/> <b>Released</b>: "+ parsedDate3;
			
}

function changeRefs(data) {
	var link1 = document.getElementById('firstlink');
	var link2 = document.getElementById('secondlink');
	var link3 = document.getElementById('thirdlink');

	link1.href = data["0"].info.url;
	link2.href = data["1"].info.url;
	link3.href = data["2"].info.url;
			

}