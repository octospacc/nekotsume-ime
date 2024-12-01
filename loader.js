(function(){

function postToForeground (results, source) {
	sendMessageToForeground({ result: results, source: source });
}

function $(query) {
	return document.querySelector(query) || {};
}

function initRuntime () {
	function event (data) {
		var i, j, results, tmp;
		if (data.event === 'downloaded') {
			$('#loading').textContent = ('辞書を展開中・・・');
		} else if (data.event === 'load') {
			$('#loading').hidden = (true);
			$('#inputform').hidden = (false);
		} else if (data.event === 'result' && data.method === 'parseNBest') {
			results = [];
			for (i=0;i<data.morpheme.length;i++) {
				tmp = [];
				for (j=0;j<data.morpheme[i].length;j++) {
					tmp.push(data.morpheme[i][j].feature);
				}
				results.push(tmp.join(''));
			}
			(typeof ImeRequestCallback !== 'undefined' ? ImeRequestCallback : postToForeground)(results, data.text);
		}
	}

	var worker = new Worker('worker.js');
	igo.getServerFileToArrayBufffer("skkdic.zip", function(buffer){
		event({event: 'downloaded'});
		var blob = new Blob([new Uint8Array(buffer)]);
		worker.postMessage({method: 'setdic', dic: blob});
	});

	worker.addEventListener('message', function(e){
		event(e.data);
	});
	worker.addEventListener('error', function(){
		event({event:"error"});
	});

	postToWorker = function(data) {
		worker.postMessage(data);
	}
	browser.runtime.onMessage.addListener(postToWorker);
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initRuntime);
} else {
	initRuntime();
}

})();