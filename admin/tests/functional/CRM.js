
define([
	'intern!object',
	'intern/chai!assert',
	'require'
], function (registerSuite, assert, require) {
	//var url = '../../dist/index.html';
	var url = 'http://google.com/';

	registerSuite({
		name: 'Todo (functional)',

		'submit form': function () {
			return this.remote
				.get(require.toUrl(url))
				.setFindTimeout(10000)
				.findById('lst-ib')
				.click()
				.type('hugomineiro')
				.getProperty('value')
				.then(function (val) {
					assert.ok(val == 'hugomineiro', 'got hugomineiro');
				});
				/*.click()
				.keys('Task 1')
				.keys('\n')
				.keys('Task 2')
				.keys('\n')
				.keys('Task 3')
				.getProperty('value')
				.then(function (val) {
					assert.ok(val.indexOf('Task 3') > -1, 'Task 3 should remain in the new toldo');
				});*/
		}
	});
});
