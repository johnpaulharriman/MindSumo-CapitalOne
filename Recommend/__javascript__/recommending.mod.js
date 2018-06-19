	(function () {
		var math = {};
		var __name__ = '__main__';
		__nest__ (math, '', __init__ (__world__.math));
		var data = dict ({'Alan Perlis': dict ({'Artificial intelligence': 1.46, 'Systems programming': 5.0, 'Software engineering': 3.34, 'Databases': 2.32}), 'Marvin Minsky': dict ({'Artificial intelligence': 5.0, 'Systems programming': 2.54, 'Computation': 4.32, 'Algorithms': 2.76}), 'John McCarthy': dict ({'Artificial intelligence': 5.0, 'Programming language theory': 4.72, 'Systems programming': 3.25, 'Concurrency': 3.61, 'Formal methods': 3.58, 'Computation': 3.23, 'Algorithms': 3.03}), 'Edsger Dijkstra': dict ({'Programming language theory': 4.34, 'Systems programming': 4.52, 'Software engineering': 4.04, 'Concurrency': 3.97, 'Formal methods': 5.0, 'Algorithms': 4.92}), 'Donald Knuth': dict ({'Programming language theory': 4.33, 'Systems programming': 3.57, 'Computation': 4.39, 'Algorithms': 5.0}), 'John Backus': dict ({'Programming language theory': 4.58, 'Systems programming': 4.43, 'Software engineering': 4.38, 'Formal methods': 2.42, 'Databases': 2.8}), 'Robert Floyd': dict ({'Programming language theory': 4.24, 'Systems programming': 2.17, 'Concurrency': 2.92, 'Formal methods': 5.0, 'Computation': 3.18, 'Algorithms': 5.0}), 'Tony Hoare': dict ({'Programming language theory': 4.64, 'Systems programming': 4.38, 'Software engineering': 3.62, 'Concurrency': 4.88, 'Formal methods': 4.72, 'Algorithms': 4.38}), 'Edgar Codd': dict ({'Systems programming': 4.6, 'Software engineering': 3.54, 'Concurrency': 4.28, 'Formal methods': 1.53, 'Databases': 5.0}), 'Dennis Ritchie': dict ({'Programming language theory': 3.45, 'Systems programming': 5.0, 'Software engineering': 4.83}), 'Niklaus Wirth': dict ({'Programming language theory': 4.23, 'Systems programming': 4.22, 'Software engineering': 4.74, 'Formal methods': 3.83, 'Algorithms': 3.95}), 'Robin Milner': dict ({'Programming language theory': 5.0, 'Systems programming': 1.66, 'Concurrency': 4.62, 'Formal methods': 3.94}), 'Leslie Lamport': dict ({'Programming language theory': 1.5, 'Systems programming': 2.76, 'Software engineering': 3.76, 'Concurrency': 5.0, 'Formal methods': 4.93, 'Algorithms': 4.63}), 'Michael Stonebraker': dict ({'Systems programming': 4.67, 'Software engineering': 3.86, 'Concurrency': 4.14, 'Databases': 5.0})});
		var euclidean_similarity = function (person1, person2) {
			var common_ranked_items = (function () {
				var __accu0__ = [];
				var __iterable0__ = data [person1];
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var itm = __iterable0__ [__index0__];
					if (__in__ (itm, data [person2])) {
						__accu0__.append (itm);
					}
				}
				return __accu0__;
			}) ();
			var rankings = (function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var itm = __iterable0__ [__index0__];
					__accu0__.append (tuple ([data [person1] [itm], data [person2] [itm]]));
				}
				return __accu0__;
			}) ();
			var distance = (function () {
				var __accu0__ = [];
				var __iterable0__ = rankings;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var rank = __iterable0__ [__index0__];
					__accu0__.append (pow (rank [0] - rank [1], 2));
				}
				return __accu0__;
			}) ();
			return 1 / (1 + sum (distance));
		};
		var pearson_similarity = function (person1, person2) {
			var common_ranked_items = (function () {
				var __accu0__ = [];
				var __iterable0__ = data [person1];
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var itm = __iterable0__ [__index0__];
					if (__in__ (itm, data [person2])) {
						__accu0__.append (itm);
					}
				}
				return __accu0__;
			}) ();
			var n = len (common_ranked_items);
			var s1 = sum ((function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var item = __iterable0__ [__index0__];
					__accu0__.append (data [person1] [item]);
				}
				return __accu0__;
			}) ());
			var s2 = sum ((function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var item = __iterable0__ [__index0__];
					__accu0__.append (data [person2] [item]);
				}
				return __accu0__;
			}) ());
			var ss1 = sum ((function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var item = __iterable0__ [__index0__];
					__accu0__.append (pow (data [person1] [item], 2));
				}
				return __accu0__;
			}) ());
			var ss2 = sum ((function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var item = __iterable0__ [__index0__];
					__accu0__.append (pow (data [person2] [item], 2));
				}
				return __accu0__;
			}) ());
			var ps = sum ((function () {
				var __accu0__ = [];
				var __iterable0__ = common_ranked_items;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var item = __iterable0__ [__index0__];
					__accu0__.append (data [person1] [item] * data [person2] [item]);
				}
				return __accu0__;
			}) ());
			var num = n * ps - s1 * s2;
			var den = math.sqrt ((n * ss1 - math.pow (s1, 2)) * (n * ss2 - math.pow (s2, 2)));
			return (den != 0 ? num / den : 0);
		};
		var recommend = function (person, bound, similarity) {
			if (typeof similarity == 'undefined' || (similarity != null && similarity .hasOwnProperty ("__kwargtrans__"))) {;
				var similarity = pearson_similarity;
			};
			var scores = (function () {
				var __accu0__ = [];
				var __iterable0__ = data;
				for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
					var other = __iterable0__ [__index0__];
					if (other != person) {
						__accu0__.append (tuple ([similarity (person, other), other]));
					}
				}
				return __accu0__;
			}) ();
			scores.py_sort ();
			scores.reverse ();
			var scores = scores.__getslice__ (0, bound, 1);
			print (scores);
			var recomms = dict ({});
			var __iterable0__ = scores;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var __left0__ = __iterable0__ [__index0__];
				var sim = __left0__ [0];
				var other = __left0__ [1];
				var ranked = data [other];
				var __iterable1__ = ranked;
				for (var __index1__ = 0; __index1__ < len (__iterable1__); __index1__++) {
					var itm = __iterable1__ [__index1__];
					if (!__in__ (itm, data [person])) {
						var weight = sim * ranked [itm];
						if (__in__ (itm, recomms)) {
							var __left0__ = recomms [itm];
							var s = __left0__ [0];
							var weights = __left0__ [1];
							recomms [itm] = tuple ([s + sim, weights + list ([weight])]);
						}
						else {
							recomms [itm] = tuple ([sim, list ([weight])]);
						}
					}
				}
			}
			var __iterable0__ = recomms;
			for (var __index0__ = 0; __index0__ < len (__iterable0__); __index0__++) {
				var r = __iterable0__ [__index0__];
				var __left0__ = recomms [r];
				var sim = __left0__ [0];
				var item = __left0__ [1];
				recomms [r] = sum (item) / sim;
			}
			return recomms;
		};
		__pragma__ ('<use>' +
			'math' +
		'</use>')
		__pragma__ ('<all>')
			__all__.__name__ = __name__;
			__all__.data = data;
			__all__.euclidean_similarity = euclidean_similarity;
			__all__.pearson_similarity = pearson_similarity;
			__all__.recommend = recommend;
		__pragma__ ('</all>')
	}) ();
