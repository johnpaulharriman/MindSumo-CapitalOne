// must use this proxy url in order to get around the CORS protocol

const proxyurl = "https://capitalone-proxy-jph.herokuapp.com/";
var $topRes = document.getElementById("topResults");
var $othRes = document.getElementById("otherResults");

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

	$("#logoutBtn").on('click',function(event){
		localStorage.clear();
		window.location.href = "index.html";
	});

	$('#recBtn').on('click',function(event)
	{
		window.location.href = "recommend.html"
	});
	
	// checks if user is logged in, if so, start loading information

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

/*
	retrieveSubs will send a request to the gpodder api
	and retrieve all subscriptions the user is subscribed to.
*/

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
	})
}

/*
	subInfo takes all subscription names from retrieveSubs and
	makes individual request to the gpodder api and adds the information
	to an array. Two promises are needed in this function. One waits for 
	each individual request to finish, and the other is waiting for the
	entire subscription information to load. The subcription information
	is then sorted based on subscribers within the last week.
*/

async function subInfo(resp) {

	let totalpromise = new Promise(
		(resolve,reject) =>{
		var subInfo = [];
		var length = resp.length;
		var count = 0;
		for (var i=0; i < (length); i++){

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

/*
	subDisplay will edit the html to display the top 5 subscriptions
	within the last week. After that, it displays 5 random subscriptions
	that the user is subscribed to.
*/

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

	// Creates array of 5 unique array accesses

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


/*
	highFreqSubs will display the top three frequent podcasters
	based on episode uploads within the last month and the then 
	the frequency in which the podcast has uploaded in its lifetime
	(e.g.) a podcast that has uploaded once a week for five years will
	show up higher a podcast that has upload twice a week for years.
*/


async function highFreqSubs(subs) {

	var subAdvanced = JSON.parse(localStorage.getItem('detailedSub'));
	var subBasic = subs;
	var length = subBasic.length;
	var alreadyLoaded = false;

	//if user has not used website before, saves detailed information
	//about each subscription onto the firebase database

	for (var i = 0; i < length; i++){

		var url = subBasic[i].url;
		var urlfixed = url.replace(/[^a-zA-Z ]/g, "");
		
		//upd is for progress bar

		var upd = (100*((1)/length));

		if (subAdvanced === null || (!subAdvanced[urlfixed])) {
			prepareForFirebase(url,upd);	
		}
		else { 
			alreadyLoaded = true; 

		}
		
	}

	if (alreadyLoaded) { removeProgressBar() }

	// frequency weights are placed in an array and then are sorted

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


