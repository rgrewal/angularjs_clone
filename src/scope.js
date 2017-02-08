'use strict';

var _ = require('lodash');

function initWatchVal(){}

function Scope(){
    this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    var watcher = {
	watchFn: watchFn,
	listenerFn: listenerFn || function() {},
	last: initWatchVal
    };
    this.$$watchers.push(watcher);
};

Scope.prototype.$digest = function() {
    var newValue, oldValue;
    _.forEach(this.$$watchers, function(watcher) {
	newValue = watcher.watchFn(this);
	oldValue = watcher.last;
	if (newValue !== oldValue) {
	    watcher.last = newValue;
	    watcher.listenerFn(newValue,
			       (oldValue === initWatchVal ? newValue : oldValue),
			       this);
	}
    }.bind(this));
};

module.exports = Scope;
