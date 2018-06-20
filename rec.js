// must use this proxy url in order to get around the CORS protocol
const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topResults");
var $detailedSUBS = [];
var $progData = 0;
var $username = localStorage.getItem('usrnm');
var $topRes = document.getElementById("recReses");

var $subs = null;
var $onlyLink = links();

$(function (){
	var $link = "https://gpodder.net";
	var $flag = false; 
	//getTags();



	//Gather username and password from login page
	var $username = localStorage.getItem('usrnm');
	var $password = localStorage.getItem('pswrd');
	var $deviceid = localStorage.getItem('dvid');
	var $subscriptionList;
	var loggedInUnd = ($username !== undefined && $password !== undefined);
	var loggedInNull = ($username !== null && $password !== null);
	//localStorage.setItem('needReload',true);
	var $detailed = JSON.parse(localStorage.getItem('detailedSub'));
	var inf = {};

	for (var item in $detailed){
		var tags = (JSON.parse($detailed[item])["info"]["tags"])
		tags.forEach(function(tag){
		 	newTag = tag.replace(/[^a-zA-Z ]/g, "");
		// 	//map[newTag] = tag;
		 	if (inf[newTag] === undefined){
		 		inf[newTag] = 1;
		 	}
		 	else {
		 		inf[newTag] += 1;
		 	}
		 });

		
	}


	console.log(inf);

	var ref = firebase.database().ref('cached-userInfo/'+$username);
	var websiteObject = inf;
	ref.set(websiteObject)
		.then(function(snapshot){
		}, function(error) {
			console.log("not working - sorry :(");
		});

	

	let results = asyncCall();
	results.then(function(data) {

		var rec = recommend($username,data);
		console.log(Object.keys(rec).length)
		var len = Object.keys(rec).length;
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
			console.log(sortedTop);
			for (var item in rec) {
				popular(4,item);
			}
			for (var i = 0; i < (10-len); i++) {
				console.log(sortedTop[i][0]);
				popular(2,sortedTop[i][0]);
			}
		}
		else {
			for (var item in rec) {
				popular(3,item);
			}
		}

	});


		


	

	if (loggedInUnd&&loggedInNull){
		// $.ajax({
				
		// });
	}
});



async function asyncCall() {
	var ref = firebase.database().ref('cached-userInfo/');
	try {
		var snap = await ref.once('value');
		return (snap.val());
	} catch (e) {
		console.log("failed");
	}
}































function popular(count,tag){
	tag = tag.toLowerCase().replace(" ","-");
	$(function (){
		$.ajax({
					type: "GET",
					url: proxyurl+"https://gpodder.net/api/2/tag/"+tag+"/"+count.toString()+".json",
					dataType: 'json',
					//tag: 'tech',
					count: '10',
					//withCredentials: true,
					//username: $username,
					format: 'json',
					//number: '10',
					// beforeSend: function(req) {
				 //        req.setRequestHeader('Authorization', 'Basic ' + btoa($username+":"+$password));
				 //    },
				    success: function(data, textStatus, request) {
						//$progData += 10;
						//updateProg();
						console.log(data);
						return data;
					}			
			}).then(function(subs){
				//console.log(subs);
				var length = subs.length;
				//console.log(length);
				if (length > 0){
					for (var j=0; j < length; j++){
						var sub = subs[j];
						if(sub !== undefined)
						
						{
							if (!($onlyLink[sub.url])){
								var logourl = (sub.logo_url);

								var l1 = '<div class="subscrip container-fluid">';
								var l1p5 = '<a class="center im" href='+sub.mygpo_link+'>'
					            var l2 = '<img src=' + logourl + ' class="rounded img-fluid">';
					            var l2p5 = '</a>'
					            var l3 = '<div class="card content">';
					            var l4 = '<div class="card-header text-center">' + sub.title + '</div>';
					            var l4p5 = '<div class="card-body">'
					            var l5 = '<p class="desc text-center">' + sub.description + '</p>';
					            var l6 = '<p style="padding-bottom:10px" class="text-center viewsAndDate"> Subscribers last week: ' + sub.subscribers_last_week + '</p>';
					            
					            var l7 = '</div></div>';
						        var l8 = '</div>';
						        $topRes.innerHTML = $topRes.innerHTML + (l1+l1p5+l2+l2p5+l3+l4+l4p5+l5+l6+l7+l8);
				    	}	}
					}
				}

			});
	});
}

function links() {
	var subs = (JSON.parse(localStorage.getItem('basicSub')))
	var subUrl = {}
	console.log(subs.length);
	for (var i = 0; i < subs.length; i++) {
		console.log(subs[i]["url"]);
		subUrl[subs[i]["url"]] = true;
	}
	return (subUrl);
}