
/*
	saveToFirebase will take a unique entry of a subscription and upload
	it to the cached entries. It updates the progress bar after the entry
	is uploaded. 
*/

function saveToFirebase(websiteObj,upd) {
	var url = websiteObj.url;
	var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
	var ref = firebase.database().ref('cached-entries/'+urlfixed);
	var websiteObject = JSON.stringify({
		url: url,
		info: websiteObj
	});

	$progData += upd;
	updateProg();

	ref.set(websiteObject)
		.then(function(snapshot){
		}, function(error) {
			console.log("not working - sorry :(");
		});
	
	
}

/*
	prepareForFirebase accesses the feed gpodder api in order to
	retrieve detailed information about each podcast. It creates an
	object based on necessary information listed below, including the
	frequency weights. It checks the progress bar and will refresh
	if it has new data to upload to the database.
*/

function prepareForFirebase(link,upd) {


	$.ajax({
		type: "GET",
		url: proxyurl+"http://feeds.gpodder.net/parse",
		data: {url:link},
		headers: {Accept: 'application/json'},
		contentType: 'application/x-www-form-urlencoded',

		success: function(data, textStatus, request) {
			return JSON.parse(JSON.stringify(data));
			
		},
		error: function(e) {
			console.log(e);
		}
	}).done(function(param) {
		//need author, description, link, logo, url, episode data, weights
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

/*
	saveValues retrieves the detailed subscription info and sets it
	into the local storage web cache. After the promise is returned,
	the function can call highFreqSubs to display the highest weighted
	subscriptions.
*/

async function saveValues(subs) {
	
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
