var puts = require('util').puts,
	tests = [],
	serverTests = require('./server-test');
	 
function run(callback, test) {
	callback(
		function() {
			puts(test + ' \033[32m[Success]\033[m');
			if (tests.length == 0) {
			    puts(' \033[32mAll tests finished.\033[m');
			    process.exit();
			}
			
			var nextTest = tests.shift();
			nextTest();
			
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
tests.shift()();
setTimeout(function() {}, 30000);