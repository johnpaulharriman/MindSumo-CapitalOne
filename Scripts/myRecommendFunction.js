//based on collaborative-filtering by ai-society


/*
	This is the algorithm for the pearson correlation coefficient

	It allows the function to find similarity between two users,
	applying this amongst all users in the database provides closer
	and more meaningful similarities.
*/


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
		return 0;
	}
	else {
		return (num/den);
	}
}

/*
	This recommendation system is based on the similarity of tags of each podcast
	that the user is subscribed to. This is based on multiple users and their 
	experience with gpodder. The more subscribers there are that use this website,
	then the better the recommendation should be.
*/

function recommend(person,data) {

	var datalength = (Object.keys(data).length)
	var datakeys = (Object.keys(data));
	var scores = [];

	var itemsForperson = data[person];

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

		for (var item in ranked){


			if (data[person][item] === undefined){

				weight = sim * (ranked[item]);

				if (recomms[item] !== undefined) {
					var s = (recomms[item][0]);
					var weightss = (recomms[item][1]);
					var weightsNew = weightss+weight;
					var sNew = s+sim;
					recomms[item] = [sNew, weightsNew];
				}
				else {
					recomms[item] = [sim, weight];

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






















