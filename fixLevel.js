#!/usr/bin/env node

var fs = require('fs');
var jsPointQuadtree = require('./jsPointQuadtree');
var lzw = require('./lzw');
var base64 = require('./base64');
var I = require('./iuppiter');

var levelFileName = process.argv[2];
var header = fs.readFileSync("levelHeader.txt", "utf8");
var footer = fs.readFileSync("levelFooter.txt", "utf8");

var level = JSON.parse(fs.readFileSync(levelFileName, "utf8"));
var level2 = JSON.parse(fs.readFileSync(levelFileName, "utf8"));
var level3 = JSON.parse(fs.readFileSync(levelFileName, "utf8"));

var layerId;
var x, y, i;
var qt;
var strQt;

for (layerId = 0; layerId<level.layers.length; layerId++) {
	if ("tilelayer" === level.layers[layerId].type) {
		//TODO processing
		
		qt = new jsPointQuadtree.jsPointQuadtree.Quadtree([0, 0, level.width-1, level.height-1], {});
		i = 0;
		for (y=level.layers[layerId].y; y<level.layers[layerId].y+level.layers[layerId].height; y++) {
			for (x=level.layers[layerId].x; x<level.layers[layerId].x+level.layers[layerId].width; x++) {
				qt.add([x,y], level.layers[layerId].data[i]);
				i++;
			}
			qt.rejoin(); // important - we need to rejoin every row, because if we only rejoin at the end, we may run out of memory
			// and if we rejoin every cell it takes too much time
			
			console.log("y="+y+"/"+(level.layers[layerId].y+level.layers[layerId].height));
		}
		qt.rejoin();
		strQt = qt.toString();
		
		
		
		//lzwStrQt = lzw.lzw.encode(strQt); // compression
		lzwStrQt = I.Iuppiter.compress(strQt);
		
		// we also need to escape (because it will e imported as a json file).
		//base64lzwStrQt = lzwStrQt;//base64.base64.encode(lzwStrQt);
		base64lzwStrQt = I.Iuppiter.Base64.encode(lzwStrQt);
		
		var decoded = I.Iuppiter.Base64.decode(I.Iuppiter.toByteArray(base64lzwStrQt));
		var decompressed = I.Iuppiter.decompress(decoded);
		decompressed = decompressed.replace("\u0000","");
		
		
		level.layers[layerId].data = base64lzwStrQt;
		level2.layers[layerId].data = decompressed;
		level3.layers[layerId].data = strQt;
	}
}

fs.writeFileSync(levelFileName+"_before_processing", header + JSON.stringify(level3) + footer, 'utf8');
fs.writeFileSync(levelFileName+"_processed", header + JSON.stringify(level) + footer, 'utf8');
fs.writeFileSync(levelFileName+"_in_processing", header + JSON.stringify(level2) + footer, 'utf8');