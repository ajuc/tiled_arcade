"use strict";
if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}
if ((typeof(ajuc.gfx) === 'undefined')) {
	ajuc.gfx = {};
}


ajuc.gfx.iface = (function() {

	

	function version() {
		return 0.01;
	};
	function name() {
		return currentEngine.name();
	};
	
	function cutTileFrom(image, x0, y0, width, height) {
		var imgCanvas = document.createElement('canvas');
		var ctx = imgCanvas.getContext('2d');

		imgCanvas.setAttribute('width', width); //set tile source canvas size
		imgCanvas.setAttribute('height', height);
		ctx.drawImage(image, x0, y0, width, height, 0, 0, width, height); //draw image to tile source canvas

		return imgCanvas;
	};

	function loadTiles(filename, rows, columns, callback) {
		var tiles = new Array(rows*columns);
		var sourceImage = new Image();
		var tileWidth;
		var tileHeight;

		sourceImage.onload = function(){
			tileWidth = Math.floor(sourceImage.width/columns);
			tileHeight = Math.floor(sourceImage.height/rows);

			for (var y=0; y<rows; y++) {
				for (var x=0; x<columns; x++) {
					tiles[x+y*columns] = cutTileFrom(sourceImage, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
				}
			}

			sourceImage.loadedFully = true;
			if (callback!==undefined) {
				callback();
			}
		};
		sourceImage.src = filename;

		return tiles;

	};

	//TODO
	
	var currentEngine = undefined;
	var currentBackupEngine = undefined;
	
	function setEngine(newEngine, backupEngine) {
		if (currentEngine!==undefined) {
			if (currentEngine.isInited()) {
				currentEngine.freeResources();
			}
			currentEngine = undefined;
		};
		currentEngine = newEngine;
		currentBackupEngine = backupEngine; 
	};
	
	function isInited() {
		return currentEngine.isInited();
	};
	
	function init(callback) {
		var initCompleted = currentEngine.init(callback);
		if (!initCompleted && currentBackupEngine !== undefined) {
			setEngine(currentBackupEngine, undefined);
			initCompleted = currentEngine.init(callback);
		} 
		return initCompleted;
	};
	
	function resize() {
		currentEngine.resize();
	};
	
	function beforeRedraw(camera) {
		currentEngine.beforeRedraw(camera);
	};

	function afterRedraw(camera) {
		currentEngine.afterRedraw(camera);
	};
	
	function clear(camera) {
		currentEngine.clear(camera);
	};
	
	function drawBackground(camera) {
		currentEngine.drawBackground(camera);
	};
	
	function drawTiles(level, camera, x0, y0, x1, y1, z) {
		currentEngine.drawTiles(level, camera, x0, y0, x1, y1, z);
	};
	
	function drawSprite(spriteNo, tx, ty, wx, wy, camera) {
		currentEngine.drawSprite(spriteNo, tx, ty, wx, wy, camera);
	};
	
	function drawSprites(objects, camera, z) {
		currentEngine.drawSprites(objects, camera, z);
	};

	function drawRelations(game, relations, objects, player, camera) {
		currentEngine.drawRelations(game, relations, objects, player, camera);
	};
	
	function drawGoal(camera, player, goal) {
		currentEngine.drawGoal(camera, player, goal);
	}
	
	function freeResources(callback) {
		currentEngine.freeResources(callback);
	};

	function updateLevel(level, z) {
		currentEngine.updateLevel(level, z);
	};
	
	function getInfo() {
		return currentEngine.getInfo();
	}

	return {
		version : version,
		name : name,
		
		setEngine : setEngine,
		
	    init : init,
	    isInited : isInited,
	    resize: resize,
	    clear : clear,
	    
	    beforeRedraw : beforeRedraw,
	    afterRedraw : afterRedraw,
	    
	    drawBackground : drawBackground,
	    drawTiles : drawTiles,
	    drawSprite : drawSprite, // maybe not needed, maybe not optimal
	    drawSprites : drawSprites,
	    drawRelations : drawRelations,
	    
	    drawGoal: drawGoal,
	    
	    freeResources : freeResources,
	    
	    updateLevel : updateLevel,
	    
	    getInfo : getInfo
	};
})();
