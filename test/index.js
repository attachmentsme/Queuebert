var puts = require('util').puts,
	tests = [],
	serverTests = require('./server-test'),
	clientTests = require('./client-test');
	 
function run(callback, test) {
	callback(
		function() {
			puts(test + ' \033[32m[Success]\033[m');
			if (tests.length == 0) {
				setTimeout(function() {
			  	puts(' \033[32mAll tests finished.\033[m');
					process.exit();
				}, 500);
			}
			
			var nextTest = tests.shift();
			if (nextTest) {
				nextTest();
			}
			
		},
		test + ': '
	);
}

function addTests(testsObject) {
	for (var test in testsObject) {
		(function(func, name) {
			tests.push(function() {
				run(func, name);
			});
		})(testsObject[test], test);
	}
}

addTests(serverTests.tests);
addTests(clientTests.tests);
tests.shift()();
setTimeout(function() {}, 30000);