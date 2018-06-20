var numOfRe = document.getElementById("numOps");
var seaBtn = document.getElementById("searchBtn");
var $linkForRevAndPop = 'https://gpodder.net/search.json?q=';
var $linkForGenre = 'https://gpodder.net/api/2/tag/';
var $searchRese = $('#searchReses');

$(function (){
	

	$("#searchBtn").on('click',function(event){
		var numOfRe = document.getElementById("numOps");
		var $searchTerm = document.getElementById("searchT").value;
		var $sortByTerm = document.getElementById("sortBy").value;
		// Default search is by relevance.
		if ($sortByTerm == "Sort by..."){
			document.getElementById("sortBy").value = "3";
			$sortByTerm = "Relevance";
		}
		$numOfRes = parseInt(numOfRe.value);
		$('#searchReses').empty();
		getAjax($numOfRes,$searchTerm,$sortByTerm);
	});

	$('#searchT').keypress(function(event){
		if (event.which === 13){
			$('#searchBtn').click();
		}
	});

	// This function takes all input from the user and retrieves
	// the data based on the gpodder api using the number of 
	// results, the search term from the user input, and how
	// it should be sorted.

	
	function getAjax($numOfRes,$searchTerm,$sortByTerm){

		var numGate = $numOfRes;
		var $link = $linkForRevAndPop + $searchTerm;

		// Default number of searches is 5

		if (isNaN(numGate)){
			numGate = 5;
			document.getElementById("numOps").value = "5";
		};

		// Searching by Genre

		if ($sortByTerm == "2") {
			var stringVal = document.getElementById("numOps").value;
			$link = $linkForGenre+ $searchTerm + '/' + stringVal + '.json'; 
		}

		$.ajax({
			type: 'GET',
			url: $link,
			success: function(searchReses) {
				if (searchReses.length == 0){
					alert("No results found");
				}

				// Searching by popularity, sort by number of subscribers

				if ($sortByTerm == "1"){
					searchReses = searchReses.sort(function(a,b){
						var keyA = a.subscribers;
						var keyB = b.subscribers;
						return(keyB-keyA);
					});
				}

				// Adding content based on results to the HTML

				for (var i=0; i < numGate; i++){
					var res = searchReses[i];

					var l1 = '<a href='+ res.mygpo_link + ' class="list-group-item list-group-item-action flex-column align-items-start">';
					var l2 = '<div class="d-flex w-100 justify-content-between">';
					var l3 = '<h5 class="mb-1">' + res.title + '</h5>';
					var l4 = '</div>';
					var l5 = '<p class="mb-1">' + res.description + '</p>';
					var l6 = '<small class="text-muted"> Subscribers: ' + res.subscribers  + '</small>';
					var l7 = '</a>';
					$searchRese.append(l1+l2+l3+l4+l5+l6+l7);
				};

			}
		});
	;}




});


