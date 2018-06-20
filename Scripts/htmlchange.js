
//changes progress bar

function updateProg() {
	$("#prog").css("width", ($progData).toString()+"%");
}

/*
	addHTML takes the subscription information retrieved from
	other functions and changes the HTML code to display each result.
*/

function addHTML(sub,extension) {

	var logourl = sub.logo_url
	if (logourl === null) {
		logourl = "Images/Podcast-placeholder.jpg";
	}
	else if (logourl.includes("gif")) {
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

// Changes slide information

async function slideChange(highFreq) {

			changeSlides(highFreq);
			changeHeaders(highFreq);
			changeParagraphs(highFreq);
			changeRefs(highFreq);
		}

// removes Progress bar

function removeProgressBar() {
	$("#remProg").remove();
	$("#message").remove();
	$("#message2").remove();
	$("#carouselExampleControls").removeClass("onload-off");
	
			
}

// changes each unique slide

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

// changes each unique header

function changeHeaders(data) {
	var head1 = document.getElementById('head1');
	var head2 = document.getElementById('head2');
	var head3 = document.getElementById('head3');

	
	head1.innerHTML = data["0"].info.title;
	head2.innerHTML = data["1"].info.title;
	head3.innerHTML = data["2"].info.title;

}

// changes each unique paragraph

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

// changes each unique reference link

function changeRefs(data) {
	var link1 = document.getElementById('firstlink');
	var link2 = document.getElementById('secondlink');
	var link3 = document.getElementById('thirdlink');

	link1.href = data["0"].info.url;
	link2.href = data["1"].info.url;
	link3.href = data["2"].info.url;
			

}