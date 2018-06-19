const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $username = localStorage.getItem('usrnm');
var $password = localStorage.getItem('pswrd');
var $deviceid = localStorage.getItem('dvid');
var $basic = JSON.parse(localStorage.getItem('basicSub'));
var $detailed = JSON.parse(localStorage.getItem('detailedSub'));
var $topRes = document.getElementById("recReses");

function popular(count,tag){
	$(function (){
		$.ajax({
					type: "GET",
					url: proxyurl+"https://gpodder.net/api/2/tag/"+tag+"/"+count+".json",
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
				for (var j=0; j < 10; j++){
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
				return subs;

			});
	});
}

function saveToFirebase() {
	var ref = firebase.database().ref('cached-userInfo/'+$username);
	var websiteObject = getInfo();
	ref.set(websiteObject)
		.then(function(snapshot){
		}, function(error) {
			console.log("not working - sorry :(");
		});
	
	
}

function getInfo(){
	var inf = {};
	//var map = {};
	for (var item in $detailed){
		var tags = (JSON.parse($detailed[item]).info.tags);
		tags.forEach(function(tag){
			newTag = tag.replace(/[^a-zA-Z ]/g, "");
			//map[newTag] = tag;
			if (inf[newTag] === undefined){
				inf[newTag] = 1;
			}
			else {
				inf[newTag] += 1;
			}
		});
	}
	//localStorage.setItem('mappedTags',map);
	return inf;
}

function getUserInfo(){
	var subDetailedInfo = new Array(1);
	var reff = firebase.database().ref('cached-userInfo/');
	reff.on('value', function(snapshot){
		if (snapshot.val() !== null){
			subDetailedInfo[0] = snapshot.val();
			localStorage.setItem('useInfo', JSON.stringify(subDetailedInfo[0]));
		}
	});


}

function run(){
	saveToFirebase();
	getUserInfo();
	var data = (localStorage.getItem('useInfo'));
	var rec = recommend($username,JSON.parse(data));
	if ($.isEmptyObject(rec)){
		popular(10,'Society & Culture');
	}
	else{
		popular(10,'Arts');
	}
	
}
//based on collaborative-filtering by ai-society



	function pearsonSimilarity(p1,p2,data) {

		var itemsForp1 = data[p1];
		var itemsForp2 = data[p2];

		var p1keys = (Object.keys(itemsForp1));
		var p1length = (Object.keys(itemsForp1).length);
		var p2keys = (Object.keys(itemsForp2));
		var p2length = (Object.keys(itemsForp2).length);

		var commonlyRanked = [];

		for (var i = 0; i < p1length; i++) {
			if (itemsForp2[p1keys[i]] !== undefined) {
				var rank1 = itemsForp1[p1keys[i]];
				var rank2 = itemsForp2[p1keys[i]]
				commonlyRanked.push([rank1,rank2]);
			}
		}

		var len = commonlyRanked.length;
		var s1 = 0;
		var s2 = 0;
		var ss1 = 0;
		var ss2 = 0;
		var ps = 0;


		for (var j = 0; j < len; j++) {
			var rankval1 = (commonlyRanked[j][0]);
			var rankval2 = (commonlyRanked[j][1]);
			s1 += rankval1;
			s2 += rankval2;
			ss1 += Math.pow(rankval1,2);
			ss2 += Math.pow(rankval2,2);
			ps += (rankval1 * rankval2);
		}

		var num = len * ps - (s1 * s2);
		var den = Math.sqrt((len * ss1 - Math.pow(s1, 2)) * (len * ss2 - Math.pow(s2, 2)));

		if (den === 0) {
			//console.log(0);
			return 0;
		}
		else {
			//console.log(num/den)
			return (num/den);
		}
	}


	function recommend(person,data) {

		

		var datalength = (Object.keys(data).length)
		var datakeys = (Object.keys(data));
		//console.log(datakeys);
		var scores = [];

		var itemsForperson = data[person];
		//console.log(itemsForperson);
		var personkeys = (Object.keys(itemsForperson));
		var personlength = (Object.keys(itemsForperson).length);

		for (var i = 0; i < datalength; i++) {
			if (person !== datakeys[i]){
				var sim = pearsonSimilarity(person,datakeys[i],data);
				
				scores.push([sim,datakeys[i]])
			}
		}

		scores = scores.sort(function(a,b){return b[0]-a[0]});


		recomms = {};

		scores.forEach(function([sim,other]){
			var ranked = data[other];
			//console.log(ranked);
			for (var item in ranked){
				if (data[person][item] === undefined){
					weight = sim * (ranked[item]);

					if (recomms[item] !== undefined) {
						var s = (recomms[item][0]);
						var weightss = (recomms[item][1]);
						console.log(weight);
						var weightsNew = weightss+weight;
						var sNew = s+sim;
						recomms[item] = [sNew, weightsNew];
						//console.log(recomms[item]);
					}
					else {
						recomms[item] = [sim, weight];
						//console.log(recomms[item]);

					}
				}
			}
		});

		for (var r in recomms){
			[sim, item] = recomms[r];
			recomms[r] = (item/sim);
		}



		return recomms;
	}


run();