var imeEnabled = [];

function callOnCurrentTab (callback) {
	browser.tabs.query({ currentWindow: true, active: true }).then(function(tabs){
		callback(tabs[0].id);
	});
}

function sendMessageToForeground (data) {
	callOnCurrentTab(function(tabId){
		browser.tabs.sendMessage(tabId, data);
	});
}

function setBadgeText (text) {
	callOnCurrentTab(function(tabId){
		browser.browserAction.setBadgeText({ text: text, tabId: tabId });
	});
}

function setBadgeBackgroundColor (color) {
	callOnCurrentTab(function(tabId){
		browser.browserAction.setBadgeBackgroundColor({ color: color, tabId: tabId });
	});
}

function refreshBadge () {
	callOnCurrentTab(function(tabId){
		if (imeEnabled[tabId]) {
			setBadgeBackgroundColor('blue');
			setBadgeText('あ');
		} else {
			setBadgeBackgroundColor('gray');
			setBadgeText('A');
		}
	});
}

browser.browserAction.onClicked.addListener(function(){
	callOnCurrentTab(function(tabId){
		sendMessageToForeground({ browserAction: "ImeChangeMode" });
		imeEnabled[tabId] = !imeEnabled[tabId];
		refreshBadge();
	});
});

browser.tabs.onUpdated.addListener(function(){
	callOnCurrentTab(function(tabId){
		if (imeEnabled[tabId]) {
			sendMessageToForeground({ browserAction: "ImeSetEnabled" });
		}
		refreshBadge();
	});
}, { properties: ["status"]});
