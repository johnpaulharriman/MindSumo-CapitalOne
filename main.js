$(function (){
	var $link = "https://gpodder.net";
	var $username = localStorage.getItem('usrnm');
	var $password = localStorage.getItem('pswrd');
	if ($username !== undefined && $password !== undefined){
		// alert($username);
		// alert($password);
	}

	var $topResults = $('#topResults');
	$.ajax({
		type: 'GET',
		url: 'https://gpodder.net/toplist/3.json',
		success: function(topResults) {
			$.each(topResults, function(i, topRes) {
				$topResults.append('<li> Title: '+ topRes.title + '</li>');
			});
		}
	});


});