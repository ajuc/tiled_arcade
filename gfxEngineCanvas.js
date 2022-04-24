"use strict";
if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}
if ((typeof(ajuc.gfx) === 'undefined')) {
	ajuc.gfx = {};
}
if ((typeof(ajuc.gfx.engine) === 'undefined')) {
	ajuc.gfx.engine = {};
}

ajuc.gfx.engine.canvas = (function(utils) {

	function version() {
		return 0.01;
	};
	
	function name() {
		return "canvas";
	};

	var sprites;
	var backgrounds;
	var tiles;
	
	var ctxLevel;
	var ctxSprites;
	var canvasObj;
	var spriteCanvasObj;
	
	var inited = false;
	
	function isInited() {
		return inited;
	};
	
	function init(callback) {
		sprites = new Array(512);

		var loadedTiles = 0;
		var maxLoadedTiles = 5;

		var sprite0;
		var sprite1;
		var sprite2;
		
		function hideLoadingScreenIfPossible() { // closures are so cool
			loadedTiles++;
			$("#ProgressBarInside").width(Math.round(95*loadedTiles/maxLoadedTiles)+"%");
			$("#ProgressBarInside").text(Math.round(100*loadedTiles/maxLoadedTiles)+" %");
			if (loadedTiles>=maxLoadedTiles) {
				
				callback();

				sprites[0] = sprite0[0];
				sprites[1] = sprite1[0];
				var k = 0;
				for (k=0; k<sprite2.length; k++) {
					sprites[2+k] = sprite2[k];
				};
				
				inited = true;
			};
		};

		sprite0 = utils.loadTiles("gfx/sprites/ship0.png", 1, 1, hideLoadingScreenIfPossible);
		sprite1 = utils.loadTiles("gfx/sprites/bullet0.png", 1, 1, hideLoadingScreenIfPossible);
		sprite2 = utils.loadTiles("gfx/sprites/sprites_1.png", 16, 16, hideLoadingScreenIfPossible);

		backgrounds = utils.loadTiles("gfx/others/clouds.jpeg", 1, 1, hideLoadingScreenIfPossible);
		tiles = utils.loadTiles("gfx/tiles/tiles_1.png", 16, 16, hideLoadingScreenIfPossible);
		
		canvasObj = $("#TiledArcadeCanvas").get(0);
		spriteCanvasObj = $("#TiledArcadeSpritesCanvas").get(0);
		
		ctxLevel = canvasObj.getContext('2d');
		ctxSprites = spriteCanvasObj.getContext('2d');
		
		return true;
	};
	
	function resize() {
		$("#TiledArcadeCanvas").css("display","block");
		$("#TiledArcadeBackgroundCanvas").css("display","block");
		$("#TiledArcadeSpritesCanvas").css("display","block");
		$("#TiledArcadeWebGLCanvas").css("display","none");
		
		var canvasObject = $("#TiledArcadeCanvas").get(0);
		canvasObject.width = Math.round(($(window).width()*7)/10);
		canvasObject.height = Math.round(($(window).height()*80)/100);
		
		var canvasObjectBackground = $("#TiledArcadeBackgroundCanvas").get(0);
		canvasObjectBackground.width = Math.round(($(window).width()*7)/10);
		canvasObjectBackground.height =  Math.round(($(window).height()*80)/100);
		
		var canvasObjectSprites = $("#TiledArcadeSpritesCanvas").get(0);
		canvasObjectSprites.width = Math.round(($(window).width()*7)/10);
		canvasObjectSprites.height =  Math.round(($(window).height()*80)/100);
		
		var ctx2 = $("#TiledArcadeBackgroundCanvas").get(0).getContext('2d');
		try {
			for (var x=0; x<canvasObject.width; x+= backgrounds[0].width) {
				for (var y=0; y<canvasObject.height; y+= backgrounds[0].height) {
					ctx2.drawImage(backgrounds[0], x, y);
				}
			}
		} catch (err) {

		};
		
		canvasObj = $("#TiledArcadeCanvas").get(0);
		spriteCanvasObj = $("#TiledArcadeSpritesCanvas").get(0);
		
		ctxLevel = canvasObj.getContext('2d');
		ctxSprites = spriteCanvasObj.getContext('2d');
		
	};
	
	function clear(camera) {
		//ctxLevel.clearRect(0, 0, camera.screen.width, camera.screen.height);
		ctxSprites.clearRect(0, 0, camera.screen.width, camera.screen.height);
	};
	
	function beforeRedraw(camera) {
//		var canvasObj = $("#TiledArcadeCanvas").get(0);
//		var spriteCanvasObj = $("#TiledArcadeSpritesCanvas").get(0);
//		
//		ctxLevel = canvasObj.getContext('2d');
//		ctxSprites = spriteCanvasObj.getContext('2d');
	};
	
	function afterRedraw(camera) {
		//var spriteCanvasObj = $("#TiledArcadeSpritesCanvas").get(0);
		//ctxLevel.globalCompositeOperation="copy";
		//ctxLevel.drawImage(spriteCanvasObj, 0, 0);
		//ctxLevel.globalCompositeOperation="source-in";
		//ctxLevel = undefined;
		//ctxSprites = undefined;
	};
	
	function drawBackground(camera) {
		; // do nothing (because background is drawn once at the start, (and after each resize)  
	};
	
	function drawTiles(level, camera, x0, y0, x1, y1, z) {
		
		if (x0<0) { x0=0; };
		if (x0>=level.columns) { x0=level.columns-1; };
		if (y0<0) { y0=0; };
		if (y0>=level.rows) { y0=level.rows-1; };
		if (x1<0) { x1=0; };
		if (x1>=level.columns) { x1=level.columns-1; };
		if (y1<0) { y1=0; };
		if (y1>=level.rows) { y1=level.rows-1; };

		if (level.layers && level.layers[z] && level.layers[z].enabled && tiles && tiles[level.layers[z].cells.valueAt([x0, y0])]) {
			for (var y=y1; y>=y0; --y) {
				var resultY = (0.5+(level.topLeft.y - camera.position.y + camera.screen.height / 2 + level.cellHeight + y * level.cellHeight-level.cellHeight))|0;
				for (var x=x1; x>=x0; --x) {
					var tileImageNo = level.layers[z].cells.valueAt([x, y])-1;
					if (tileImageNo==null || tileImageNo<=0) {
						//nothing
					} else {
						ctxSprites.drawImage(tiles[tileImageNo],
									  (0.5+(level.topLeft.x - camera.position.x + camera.screen.width / 2 + level.cellWidth + x * level.cellWidth- level.cellWidth))|0,
									  resultY
									);
					}
				}
			}
		}
	};
	
	function drawSprites(objects, camera, z) {
		for (var i=objects.length-1; i>=0; --i) {
			if (objects[i].z===z &&
				(objects[i].position.x + objects[i].size.x >= camera.position.x-camera.screen.width/2 &&
				objects[i].position.y + objects[i].size.y >= camera.position.y-camera.screen.width/2 &&
				objects[i].position.x - objects[i].size.x <= camera.position.x+camera.screen.width/2 &&
				objects[i].position.y - objects[i].size.y <= camera.position.y+camera.screen.height/2)
				||
				(objects[i].oldPosition.x + objects[i].size.x >= camera.oldPosition.x-camera.screen.width/2 &&
				objects[i].oldPosition.y + objects[i].size.y >= camera.oldPosition.y-camera.screen.width/2 &&
				objects[i].oldPosition.x - objects[i].size.x <= camera.oldPosition.x+camera.screen.width/2 &&
				objects[i].oldPosition.y - objects[i].size.y <= camera.oldPosition.y+camera.screen.height/2)
			) {
				var spriteImageNo = objects[i].spriteNo || 0;
				if (spriteImageNo===undefined || spriteImageNo===null) {
					//nic
				} else {
					ctxSprites.save();

					var tx = objects[i].position.x
							- camera.position.x
							+ camera.screen.width / 2
							//- (sprites[spriteImageNo].width/2)
							//- (sprites[spriteImageNo].width/2)
							;

					var ty = objects[i].position.y
							- camera.position.y
							+ camera.screen.height / 2;
							//-  (sprites[spriteImageNo].height/2)
							//-  (sprites[spriteImageNo].height/2);

					ctxSprites.translate(	(0.5 + (tx)) | 0,
									(0.5 + (ty)) | 0);

					if (objects[i].needsRotation()) {
						ctxSprites.rotate(objects[i].spriteRotation+0.5*3.14159265);
					}
					ctxSprites.translate( (0.5 - (sprites[spriteImageNo].width/2)) | 0,
								   (0.5 - (sprites[spriteImageNo].height/2)) | 0);

					ctxSprites.drawImage(   sprites[spriteImageNo],
									 0,
									 0
								 );
					ctxSprites.restore();
				}
			}
		}
	};
	
	function drawSprite() {
		// TODO
	};
	
	function drawGoal(camera, player, goal) {
		var cellWidth = 64;//TODO get from game obj
		var cellHeight = 64; //TODO get from game obj
		var t,t2;
		
		var minD;
		var midD;
		var maxD;
		
		var dx = goal.position[0]*cellWidth+32 - player.position.x;
		var dy = goal.position[1]*cellWidth+32 - player.position.y;
		var d = Math.sqrt(dx*dx+dy*dy);
		
		if (d>0.1) {
			dx = dx / d;
			dy = dy / d;
		} else {
			dx = 0;
			dy = 0;
		}
		t = Math.sin(0.01*(new Date().getTime()));
		t2 = Math.sin(0.003*(new Date().getTime()));
		
		ctxSprites.beginPath();
		ctxSprites.fillStyle = "rgba(195,195, 0, "+(0.75+0.2*t)+")";
		ctxSprites.strokeStyle = "rgba(0, 0, 0, 1)";
		ctxSprites.lineWidth = "1";

		if (d>64 && d < 16000) {
			minD = -25+(40/(d/10))*(t)+85;
			midD = -25+(40/(d/10))*(t)+100;
			maxD = -25+(40/(d/10))*(t)+117;
		} else if (d>64) {
			minD = -25+85;
			midD = -25+100;
			maxD = -25+117;
		} else {
			minD = 20;
			midD = 35;
			maxD = 52;
		}

		ctxSprites.moveTo(camera.screen.width/2 + dx*minD  - dy * 3, camera.screen.height/2 + dy*minD  + dx * 3);
		ctxSprites.lineTo(camera.screen.width/2 + dx*minD  + dy * 3, camera.screen.height/2 + dy*minD  - dx * 3);
		ctxSprites.lineTo(camera.screen.width/2 + dx*midD + dy * 3, camera.screen.height/2 + dy*midD - dx * 3);
		
		ctxSprites.lineTo(camera.screen.width/2 + dx*midD + dy * 10, camera.screen.height/2 + dy*midD - dx * 10);
		ctxSprites.lineTo(camera.screen.width/2 + dx*maxD, camera.screen.height/2 + dy*maxD);
		ctxSprites.lineTo(camera.screen.width/2 + dx*midD - dy * 10, camera.screen.height/2 + dy*midD + dx * 10);
		
		ctxSprites.lineTo(camera.screen.width/2 + dx*midD - dy * 3, camera.screen.height/2 + dy*midD + dx * 3);
		ctxSprites.lineTo(camera.screen.width/2 + dx*minD  - dy * 3, camera.screen.height/2 + dy*minD  + dx * 3);
		
		ctxSprites.fill();
		ctxSprites.stroke();
		ctxSprites.fillStyle = "rgba(0,0,0,1)";
		ctxSprites.strokeStyle = "rgba(0,0,0,1)";
	};
	
	function drawRelations(game, relations, objects, player, camera) {
		var relId = undefined;
		var relation = undefined;
		var tx = 0;
		var ty = 0;
		ctxSprites.beginPath();
		ctxSprites.strokeStyle = "rgba(0, 0, 0, 1)";
		ctxSprites.lineWidth = "1";
		
		for (relId in relations) {
			relation = relations[relId];
			if (relation.objects!=undefined && relation.objects.length!==undefined && relation.objects.length==2) {
				tx = relation.objects[0].position.x - camera.position.x + camera.screen.width / 2;
				ty = relation.objects[0].position.y - camera.position.y + camera.screen.height / 2;
				
				ctxSprites.moveTo( (0.5 + (tx)) | 0, (0.5 + (ty)) | 0 );

				tx = relation.objects[1].position.x - camera.position.x + camera.screen.width / 2;
				ty = relation.objects[1].position.y - camera.position.y + camera.screen.height / 2;
				
				ctxSprites.lineTo( tx, ty );
			} // else //TODO
		}
		
		ctxSprites.stroke();
		ctxSprites.strokeStyle = "rgba(0,0,0,1)";
	};
	
	function freeResources() {
		// TODO
	};

	function updateLevel(level, z) {
		// TODO
	}
	function getInfo() {
		if (canvasObj != undefined) {
			return "canvas["+canvasObj.width+"x"+canvasObj.height+"]";
		} else {
			return "canvas[uninitialized]";
		}
	}
	return {
		version : version,
		name : name,
		
	    init : init,
	    resize: resize,
	    
	    isInited : isInited,
	    
	    beforeRedraw: beforeRedraw,
	    afterRedraw: afterRedraw,
	    
	    clear : clear,
	    drawBackground : drawBackground,
	    drawTiles : drawTiles,
	    drawSprite : drawSprite, // maybe not needed, maybe not optimal
	    drawSprites : drawSprites,
	    drawGoal: drawGoal,
	    drawRelations : drawRelations,
	    
	    freeResources : freeResources,
	    
	    updateLevel : updateLevel,
	    getInfo : getInfo
	};
})(ajuc.utils);
