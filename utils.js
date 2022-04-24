"use strict";
if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}

ajuc.utils = (function() {

	function version() {
		return 0.01;
	};

	//TODO

	function trueAfter(seconds) {
	  var start_ = undefined; //new Date().getTime();
	  return function() {
		if (start_ === undefined) {
			start_ = new Date().getTime();
			return false;
		} else {
			return start_ + seconds * 1000 < new Date().getTime();
		}
	  };
	};
	
	function nvlMinMax(value, ifNull, min, max) {
		if (value===undefined) {
			value = ifNull;
		}
		if (value<min) {
			value = min;
		}
		if (value>max) {
			value = max;
		}
		return value;
	}
	
	function chooseRandom() {
		if (arguments.length==0) {
			return undefined;
		} else if (arguments.length==1) {
			return arguments[0];
		}
		var indice = Math.round(Math.random()*(arguments.length-1));
		return arguments[indice];
	}
	
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

	function isWorkshop(game, tile) {
		return game.tileProperties[tile].workshop;
	};
	function isInn(game, tile) {
		return game.tileProperties[tile].inn;
	};
	function isFuelStation(game, tile) {
		return game.tileProperties[tile].fuelstation;
	};
	function isServerStation(game, tile) {
		return game.tileProperties[tile].serverstation;
	};
	function isHarmful(game, tile) {
		return game.tileProperties[tile].harmful;
	};
	function isSolid(game, tile) {
		return game.tileProperties[tile].solid;
	};

	function velocityFromPolar(angle, speed) {
		return {
			x : Math.cos(angle) * speed,
			y : Math.sin(angle) * speed
		};
	};

	function gridCoordsFromPoint(point, level) {
		return {
			x : Math.floor((point.x - level.topLeft.x) / level.cellWidth),
			y : Math.floor((point.y - level.topLeft.y) / level.cellHeight)
		};
	};

	function distance2(pointA, pointB) {
		return (pointA.x-pointB.x)*(pointA.x-pointB.x)+(pointA.y-pointB.y)*(pointA.y-pointB.y);
	};

	function averagePoint() {
		var result = {
			x: 0.0,
			y: 0.0
		};
		var i;
		for (i=0;i<arguments.length; i++) {
			result.x = result.x + arguments[i].x;
			result.y = result.y + arguments[i].y;
		};

		if (i>0) {
			result.x = result.x / i;
			result.y = result.y / i;
		};

		return result;
	};

	function indexFromGridCoord(gridCoord, level) {
		return gridCoord.x + gridCoord.y*level.columns;
	};


	function tileAtGridCoord(gridCoord, level, z) {
		if (gridCoord.x>=0 && gridCoord.y>=0 && gridCoord.x<level.columns && gridCoord.y<level.rows) {
			return level.layers[z].cells.valueAt([gridCoord.x,gridCoord.y]);
		} else {
			return 0;
		};
	};

	function tileAtGridCoordSolid(game, gridCoord, level, z) {
		return isSolid(game, tileAtGridCoord(gridCoord, level, z));
	};


	function tileAtPoint(point, level, z) {
		return tileAtGridCoord(gridCoordsFromPoint(point,level), level,z);
	};

	function minIgnoreUnknown() {
		var minValue;
		for (var i=arguments.length-1; i>=0; i--) {
			if (arguments[i]!==undefined && (minValue === undefined || minValue>=arguments[i])) {
				minValue = arguments[i];
			};
		};
		return minValue;
	};

	function rayWithHorizontalSegmentCollisionTime(x, y, vx, vy, rx0, rx1, ry) {
		var epsilon = 0.0000001;
		if (Math.abs(vy)>epsilon) {
			var t;
			t = (ry-y)/vy;
			var xt;
			xt = x + vx*t;

			if (t>-epsilon && xt>rx0-epsilon && xt<rx1+epsilon) {
				return t; //can be > 1, when ray will intersect with segment, but not during first length of the [vx, vy] vector
			} else {
				return undefined; // intersects before start of ray, or outside of segment
			};
		} else {
			if ( Math.abs(y-ry)<epsilon
				&& x > rx0 - epsilon
				&& x < rx1 + epsilon
			) {
				return 0; // intersects right from the start of the ray
			} else {
				return undefined; // no intersection now or in the future
			};
		};
	};

	function rayWithVerticalSegmentCollisionTime(x, y, vx, vy, ry0, ry1, rx) {
		var epsilon = 0.0000001;
		if (Math.abs(vx)>epsilon) {
			var t;
			t = (rx-x)/vx;
			var yt;
			yt = y + vy*t;

			if (t>-epsilon && yt>ry0-epsilon && yt<ry1+epsilon) {
				return t; //can be > 1, when ray will intersect with segment, but not during first length of the [vx, vy] vector
			} else {
				return undefined; // intersects before start of ray, or outside of segment
			};
		} else {
			if ( Math.abs(x-rx)<epsilon
				&& y > ry0 - epsilon
				&& y < ry1 + epsilon
			) {
				return 0; // intersects right from the start of the ray
			} else {
				return undefined; // no intersection now or in the future
			};
		};
	};


	function renderToCanvas(width, height, renderFunction) {
		var buffer = document.createElement('canvas');
		buffer.width = width;
		buffer.height = height;
		renderFunction(buffer.getContext('2d'));
		return buffer;
	};

	function pushUiScreen(game, screenName) {
		//alert("pushUiScreen("+screenName+") - przed " + game.uiStack);
		var oldScreenName;
		if (game.uiStack.length>=1) {
			oldScreenName = game.uiStack[game.uiStack.length-1];
		};
		if (oldScreenName !== screenName) {
			game.uiStack.push(screenName);
			$("#"+screenName).css('display', 'block');
			if (oldScreenName !== undefined) {
				$("#"+oldScreenName).css('display', 'none');
			};
		}
		ajuc.tiledArcade.setHighlightedItem(0);
		//alert("pushUiScreen("+screenName+") - po " + game.uiStack);
	};

	function popUiScreen(uiStack) {
		
		if (uiStack.length>=2) {
			var oldScreenName = uiStack[uiStack.length-1];
			uiStack.pop();
			var newScreenName = uiStack[uiStack.length-1];
			$("#"+newScreenName).css('display', 'block');
			$("#"+oldScreenName).css('display', 'none');
		};
		ajuc.tiledArcade.setHighlightedItem(0);
	};

	return {
		version : version,
		
		trueAfter : trueAfter,
		
		nvlMinMax : nvlMinMax,
		chooseRandom : chooseRandom,
		
		renderToCanvas: renderToCanvas,

		minIgnoreUnknown : minIgnoreUnknown,

		rayWithHorizontalSegmentCollisionTime : rayWithHorizontalSegmentCollisionTime,
		rayWithVerticalSegmentCollisionTime : rayWithVerticalSegmentCollisionTime,

		distance2 : distance2,
		averagePoint : averagePoint,

		velocityFromPolar : velocityFromPolar,
		gridCoordsFromPoint : gridCoordsFromPoint,
		indexFromGridCoord : indexFromGridCoord,
		tileAtGridCoord : tileAtGridCoord,
		tileAtGridCoordSolid : tileAtGridCoordSolid,
		tileAtPoint : tileAtPoint,

		isSolid : isSolid,
		isHarmful : isHarmful,
		isWorkshop : isWorkshop,
		isFuelStation : isFuelStation,
		isInn : isInn,
		isServerStation : isServerStation,

		pushUiScreen : pushUiScreen,
		popUiScreen : popUiScreen,

		loadTiles : loadTiles
	};
})();
