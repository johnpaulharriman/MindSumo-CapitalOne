
/*
	allTimeFreq takes the unix timestamp of the first time
	the podcast uploaded and the latest time. Then counts the number
	of episodes and creates a ratio of # of episodes/ range
*/

function allTimeFreq(episodeData) {
	var length = episodeData.length;

	//transition from unix to readable times

	var minutes = 1000 * 60;
	var hours = minutes * 60;
	var days = hours * 24;
	var years = days * 365;


	var range = (episodeData[0]["released"]-episodeData[length-1]["released"]);
	var yearForRange = (range/years);
	return Math.round((length/yearForRange)/10000);

}

/*
	monthTimeFreq goes through each episode and sees if it
	has been uploaded in the last month and returns the total.
*/

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