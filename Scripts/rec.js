// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";

var $topRes = document.getElementById("topResults");
var $username = localStorage.getItem('usrnm');
var $topRes = document.getElementById("recReses");
var $onlyLink;

$(function (){

	var $username = localStorage.getItem('usrnm');
	var $password = localStorage.getItem('pswrd');
	var $deviceid = localStorage.getItem('dvid');
	
	var loggedInUnd = ($username !== undefined && $password !== undefined);
	var loggedInNull = ($username !== null && $password !== null);
	
	if (!(loggedInUnd&&loggedInNull)){
		alert("Please log in!");
		window.location.href = "index.html";
	}
	var $link = "https://gpodder.net";
	var $flag = false; 
	$onlyLink = links()

	var $detailed = JSON.parse(localStorage.getItem('detailedSub'));
	var inf = {};

	//strips tags to become url-encoded. Counts number of tags from
	//each subscription.

	for (var item in $detailed){
		var tags = (JSON.parse($detailed[item])["info"]["tags"])
		tags.forEach(function(tag){
		 	newTag = tag.replace(/[^a-zA-Z ]/g, "");
		 	if (inf[newTag] === undefined){
		 		inf[newTag] = 1;
		 	}
		 	else {
		 		inf[newTag] += 1;
		 	}
		 });

		
	}

	//Saving user info from the firebase database to prepare for
	//recommendation function

	var ref = firebase.database().ref('cached-userInfo/'+$username);
	var websiteObject = inf;
	ref.set(websiteObject)
		.then(function(snapshot){
		}, function(error) {
			console.log("not working - sorry :(");
		});

	

	let results = databaseCall();
	results.then(function(data) {

		var rec = recommend($username,data);
		var len = Object.keys(rec).length;

		/*
			Once the recommendation function runs,
			if there aren't enough results, then
			this will still display results based
			on your most occuring tags.
		*/

		if (len <= 10) {
			var sortedTop = [];
			for (var topic in inf) {
				if (!(rec[topic])){
					sortedTop.push([topic,inf[topic]]);
				}
			}
			sortedTop.sort(function(a,b){
				return b[1] - a[1];
			});

			for (var item in rec) {
				popular(4,item);
			}
			for (var i = 0; i < (10-len); i++) {
				popular(2,sortedTop[i][0]);
			}
		}
		else {
			for (var item in rec) {
				popular(3,item);
			}
		}

	});
});

// databaseCall retrieves all user info for better
// similarity results

async function databaseCall() {
	var ref = firebase.database().ref('cached-userInfo/');
	try {
		var snap = await ref.once('value');
		return (snap.val());
	} catch (e) {
		console.log("failed");
	}
}

/*
	popular makes a request to the gpodder api, then if a subsciptions returns a valid array,
	then it will loop through all unique podcasts that the user isn't already subscribed to and
	adds it to the appropirate html.
*/


function popular(count,tag){
	tag = tag.toLowerCase().replace(" ","-");
	$(function (){
		$.ajax({
					type: "GET",
					url: proxyurl+"https://gpodder.net/api/2/tag/"+tag+"/"+count.toString()+".json",
					dataType: 'json',
					count: '10',
					format: 'json',
				    success: function(data, textStatus, request) {
						return data;
					}		

			}).then(function(subs){
				var length = subs.length;

				if (length > 0){
					for (var j=0; j < length; j++){
						var sub = subs[j];
						if(sub !== undefined)
						
						{
							if (!($onlyLink[sub.url])){
								var logourl = (sub.logo_url);

								var l1 = '<div class="subscrip container-fluid">';
								var l2 = '<a class="center im" href='+sub.mygpo_link+'>'
					            var l3 = '<img src=' + logourl + ' class="rounded img-fluid">';
					            var l4 = '</a>'
					            var l5 = '<div class="card content">';
					            var l6 = '<div class="card-header text-center">' + sub.title + '</div>';
					            var l7 = '<div class="card-body">'
					            var l8 = '<p class="desc text-center">' + sub.description + '</p>';
					            var l9 = '<p style="padding-bottom:10px" class="text-center viewsAndDate"> Subscribers last week: ' + sub.subscribers_last_week + '</p>';
					            
					            var l10 = '</div></div>';
						        var l11 = '</div>';
						        $topRes.innerHTML = $topRes.innerHTML + (l1+l2+l3+l4+l5+l6+l7+l8+l9+l10+l11);
				    	}	}
					}
				}

			});
	});
}

// links returns the links from subscriptions to prevent duplicates in recommendations

function links() {
	var subs = (JSON.parse(localStorage.getItem('basicSub')))
	var subUrl = {}

	for (var i = 0; i < subs.length; i++) {

		subUrl[subs[i]["url"]] = true;
	}
	return (subUrl);
}









