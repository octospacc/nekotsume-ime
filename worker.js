(function(){

var dicfiles = ['char.category', 'code2category', 'word2id', 'word.dat', 'word.ary.idx', 'word.inf', 'matrix.bin'];
var tagger;

function loadTagger (dicdir) {
	var files = new Array();
	for (var i=0; i<dicfiles.length; ++i) {
		files[dicfiles[i]] = loadFile(dicdir, dicfiles[i]);
	}
	var category = new igo.CharCategory(files['code2category'], files['char.category']);
	var wdc = new igo.WordDic(files['word2id'], files['word.dat'], files['word.ary.idx'], files['word.inf']);
	var unk = new igo.Unknown(category);
	var mtx = new igo.Matrix(files['matrix.bin']);
	return new igo.Tagger(wdc, null, mtx);
}

function igo_request (data) {
	var method = data.method;
	var text = data.text;
	var best = data.best;
	var morpheme = null;

	if (method === 'setdic') {
		tagger = loadTagger(data.dic);
		return {event: 'load'};
	}

	try {
		if (method === 'parse' || method === 'wakati') {
			morpheme = tagger[method](text);
		} else if (method === 'parseNBest') {
			morpheme = tagger.parseNBest(text, best);
		} else if (method === 'all') {
			morpheme = [];
			var nodelist = tagger.parseImpl(text);
			for (var i=0; i<nodelist.length; ++i) {
				if (typeof nodelist[i] === 'undefined') continue;
				for (var j=0; j<nodelist[i].length; ++j) {
					var vn = nodelist[i][j];
					if (vn.wordId == 0) continue;
					morpheme.push({
						surface: text.substring(vn.start, vn.start + vn.length),
						feature: tagger.wdc.wordData(vn.wordId).join(''),
						start: vn.start,
						length: vn.length,
						cost: vn.cost,
					});
				}
			}
		}
	} catch (err) {
		console.error(err);
		return {
			method: method,
			event: "result",
			text: text,
			morpheme: [],
		};
	}

	if (morpheme) {
		return {
			method: method,
			event: "result",
			text: text,
			morpheme: morpheme,
		};
	} else {
		return null;
	}
}

importScripts('lib/igo.min.js', 'lib/zip.min.js');

var loadFile = function(dicdir, name) {
	return dicdir.files[name].inflate();
};

addEventListener('message', function(event){
	var dataclass = function(){};
	dataclass.prototype = event.data;

	var data = new dataclass();
	if (data.dic) {
		var reader = new FileReaderSync();
		data.dic = Zip.inflate(new Uint8Array(reader.readAsArrayBuffer(data.dic)));
	}

	var res = igo_request(data);
	if (res) {
		postMessage(res);
	}
});

})();
