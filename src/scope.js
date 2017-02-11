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

Scope.prototype.$$digestOnce = function() {
    var newValue, oldValue, dirty;
    _.forEach(this.$$watchers, function(watcher) {
	newValue = watcher.watchFn(this);
	oldValue = watcher.last;
	if (newValue !== oldValue) {
	    watcher.last = newValue;
	    watcher.listenerFn(newValue,
			       (oldValue === initWatchVal ? newValue : oldValue),
			       this);
	    dirty = true;
	}
    }.bind(this));
    return dirty;
};

Scope.prototype.$digest = function(){
    var ttl = 10;
    var dirty;
    do {
	dirty = this.$$digestOnce();
	if (dirty && !(ttl--)){
	    throw "10 digest interations reached";
	}
    } while (dirty);
};

module.exports = Scope;
