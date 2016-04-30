var DOMEventTrackerInstance = new DOMEventTracker().initialize();

var handler = function () {
	console.log('@handler:%json', this.getEventListeners());
};

document.querySelector('.exampleElement').addEventListener('click', handler);
//document.querySelector('.exampleElement').removeEventListener('click', handler);
