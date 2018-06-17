var numOfRe = document.getElementById("numOps");
var seaBtn = document.getElementById("searchBtn");
var $linkForRevAndPop = 'https://gpodder.net/search.json?q=';
var $linkForGenre = 'https://gpodder.net/api/2/tag/';
//var $numofRes = 4;
var $searchRese = $('#searchReses');

$(function (){
	

	$("#searchBtn").on('click',function(event){
		var numOfRe = document.getElementById("numOps");
		var $searchTerm = document.getElementById("searchT").value;
		var $sortByTerm = document.getElementById("sortBy").value;
		if ($sortByTerm == "Sort by..."){
			document.getElementById("sortBy").value = "3";
			$sortByTerm = "Relevance";
		}
		//alert($sortByTerm);
		$numOfRes = parseInt(numOfRe.value);
		//$searchTerm = 'tech';
		$('#searchReses').empty();
		getAjax($numOfRes,$searchTerm,$sortByTerm);
	});

	$('#searchT').keypress(function(event){
		if (event.which === 13){
			$('#searchBtn').click();
		}
	});

	
	function getAjax($numOfRes,$searchTerm,$sortByTerm){
		//$searchReses = '<div id="searchReses" class="list-group"></div>'
		var numGate = $numOfRes;
		var $link = $linkForRevAndPop + $searchTerm;
		//alert($sortByTerm);
		if (isNaN(numGate)){
			numGate = 5;
			document.getElementById("numOps").value = "5";
		};
		if ($sortByTerm == "2") {
			var stringVal = document.getElementById("numOps").value;
			$link = $linkForGenre+ $searchTerm + '/' + stringVal + '.json'; 
		}

		//alert($link);


		$.ajax({
			type: 'GET',
			url: $link,
			success: function(searchReses) {
				if (searchReses.length == 0){
					alert("No results found");
				}
				if ($sortByTerm == "1"){
					searchReses = searchReses.sort(function(a,b){
						var keyA = a.subscribers;
						var keyB = b.subscribers;
						return(keyB-keyA);
					});
				}
				for (var i=0; i < numGate; i++){
					var res = searchReses[i];

					var l1 = '<a href='+ res.mygpo_link + ' class="list-group-item list-group-item-action flex-column align-items-start">';
					var l2 = '<div class="d-flex w-100 justify-content-between">';
					var l3 = '<h5 class="mb-1">' + res.title + '</h5>';
					// var l6 = '<small class="text-muted">3 days ago</small>';
					var l7 = '</div>';
					var l8 = '<p class="mb-1">' + res.description + '</p>';
					var l9 = '<small class="text-muted"> Subscribers: ' + res.subscribers  + '</small>';
					var l10 = '</a>';
					$searchRese.append(l1+l2+l3+l7+l8+l9+l10);
				};

			}
		});
	;}




});


