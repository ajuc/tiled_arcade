(function() {
  'use strict';

  var _global = (0, eval)('this');

  if (!_global.ajuc) {
    _global.ajuc = {};
  }
  if (!_global.ajuc.stats) {
    _global.ajuc.stats = {};
  }
})();

ajuc.tiledArcade = (function(utils, lzw, makeClass, enums, hierarchy) {

	function version() {
		return 0.045; /*Version of the whole game is here.*/
	};

	var game = null;

	var highlightedItem = 0;

	var nextRelationId = 0;

	function getMaxHighlightedItem() {
		try {
			var container = game.uiStack[game.uiStack.length-1];
			return $("#"+container+" .HighlightableItem").length-1;
		} catch (e) {
			return 0;
		}
	}
	function setHighlightedItem(obj) {

		var container = game.uiStack[game.uiStack.length-1];
		//alert("container="+container);

		var i = $("#"+container+" .HighlightableItem").index(obj);
		i = utils.nvlMinMax(i, 0, 0, getMaxHighlightedItem());
		//alert(i + " " + obj);

		highlightedItem = i;

		if (container === "Dialog") {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem > *").css("color","black");

			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem.Blue > *").css("color","blue");

			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+") > *").css("color","red");
		} else {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem > *").css("color","black");

			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem.Blue > *").css("color","blue");

			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+") > *").css("color","red");
		}
	}
	function setNextHighlightedItem() {

		var container = game.uiStack[game.uiStack.length-1];

		highlightedItem = utils.nvlMinMax(highlightedItem+1, 0, 0, getMaxHighlightedItem());

		if (container === "Dialog") {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
		} else {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
		}
	}
	function setLastHighlightedItem() {

		var container = game.uiStack[game.uiStack.length-1];


		highlightedItem = utils.nvlMinMax(highlightedItem-1, 0, 0, getMaxHighlightedItem());

		if (container === "Dialog") {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
		} else {
			$("#"+container+" .HighlightableItem").css("color","black");
			$("#"+container+" .HighlightableItem.Blue").css("color","blue");
			$("#"+container+" .HighlightableItem:eq("+highlightedItem+")").css("color","red");
		}
	}
	function getHighlightedItem() {
		return highlightedItem;
	}
	function clickOnHighlightedItem() {
		try {
			var container = game.uiStack[game.uiStack.length-1];
			eval($("#"+container+" .HighlightableItem:eq("+highlightedItem+")").attr("onClick"));
		} catch (e) {
			alert("e="+e+ " highlightedItem=="+highlightedItem);
		}
	}
	function clickOnESCItemIfExists() {
		try {
			var container = game.uiStack[game.uiStack.length-1];
			eval($("#"+container+" .HighlightableItem.ESC").attr("onClick"));
		} catch (e) {
		}
	}

	window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ) {
                window.setTimeout(callback, 1000 / 30);
              };
    })();

	function velocityFromPolar(angle, speed) {
		return {
			x : Math.cos(angle) * speed,
			y : Math.sin(angle) * speed
		};
	};

	function loadDialog(number, running) {
		return dialog_data;
	}

	function loadLevel(number, running) {
		// mozna uzywac game

		var level = {
			topLeft : {
				x : 0.0,
				y : 0.0
			},
			cellWidth : 64,
			cellHeight : 64,
			columns : 4096,
			rows : 4096,
			layers : {
				"-1" : {
					enabled : true,
					visible : true,
					cells : [],
					effects : []
				},
				"1" : {
					enabled : false,
					visible : false,
					cells : [],
					effects : []
				}
			}
		};

		level.objects = [];

		var pointQuad = false;
		var bounds = {
					x:0,
					y:0,
					width: level.cellWidth*level.columns,
					height: level.cellHeight*level.rows
		}

		level.places = new QuadTree(bounds, pointQuad);

		// a place is
		// { "coordinates" : [x0, y0, x1, y1],
		//   "placeId" : "Name of place, not neccesarily unique, because sometimes we need a few rectangles to bound a place",
		//   "placeType" : "Village"/"Farm"/"Wind Power Plant"/other
		//   other attributes are possible
		// }
		//
		// places are mostly used to check in quest conditions if object is in given place
		// in future we should keep places in some space partitioning index, right now linear lookup will suffice (hopefully)

		var layerNo=0;
		var tmpXXX1;
		var tmpXXX2;

		for(layerNo in levelData.layers) {
			var layer = levelData.layers[layerNo];
			if (layer.type=="tilelayer") {
				level.layers["-1"].enabled = true;
				level.layers["-1"].visible = level.visible;
				level.topLeft.x=layer.x;
				level.topLeft.y=layer.y;
				level.rows=layer.height;
				level.columns=layer.width;
				level.layers["-1"].effects = [];
				level.layers["-1"].cells = new ajuc.jsPointQuadtree.Quadtree([level.topLeft.x, level.topLeft.y, level.columns, level.rows], {});
				tmpXXX1 = Iuppiter.Base64.decode(Iuppiter.toByteArray(layer.data));
				//alert(tmpXXX1.length);
				tmpXXX2 = Iuppiter.decompress(tmpXXX1);
				tmpXXX2 = tmpXXX2.replace(/\u0000/g,"");
				//alert(tmpXXX2.length + " " + tmpXXX2[0]+" " + tmpXXX2[tmpXXX2.length-3] + tmpXXX2[tmpXXX2.length-2] + tmpXXX2[tmpXXX2.length-1]);
				level.layers["-1"].cells.fromString(tmpXXX2);
				//alert("wczytano");
			} else if (layer.type==="objectgroup") {
				var objNo=0;
				for (objNo in layer.objects) {
					var objDefinition = layer.objects[objNo];
					var properties = {};

					properties.type = objDefinition.type;

					if (properties.type !== "NPC" && properties.type !== "Place") { //Entity
						hierarchy.setPhysicalState(properties);
						properties.movable = true;//TODO
						properties.position = {x:objDefinition.x+layer.x, y:objDefinition.y+layer.y};
						properties.oldPosition = {x:objDefinition.x+layer.x, y:objDefinition.y+layer.y};
						var field;
						for (field in objDefinition.properties) {
							properties[field] = JSON.parse(objDefinition.properties[field]);
						}
						var obj = hierarchy.prototypize(properties);
						if (obj instanceof ajuc.hierarchy.Turret) {
							obj.movable = false; //
						}

						if (obj.playerNo !== undefined && obj.playerNo===0) {
							obj.keyboardScheme = {
								Thrust : [enums.keys.up, "down"],
								TurnLeft : [enums.keys.left, "down"],
								TurnRight : [enums.keys.right, "down"],
								NextTool : [enums.keys.down, "pressed"],
								PreviousTool : undefined,
								Use : [enums.keys.ctrl, "down"],
								AlternateUse : [enums.keys.alt, "down"]
							};
						};
						//if (obj.id<=2) {
							level.objects.push(obj);
						//}
					} else if (properties.type === "Place") { //Place
						//TODO read place description and save it somewhere in game
						// mostly used in fact.isObjectAtPlace conditions in dialogs and quest graph
						var tmpPlace = {
								x: objDefinition.x+layer.x,
								y: objDefinition.y+layer.y,
								width: objDefinition.width,
								height: objDefinition.height,

						};
						var field;
						for (field in objDefinition.properties) {
							//if (objDefinition.ownProperty(field)) {
							tmpPlace[field] = objDefinition.properties[field];
							//}
						}
						level.places.insert(tmpPlace);

						// and retrieving goes as follows
						// game.level.retrieve({x:, y:20, height:10, width:20});
						// there's also shortcut - ajuc.tiledArcade.playerInPlace(game, "PlaceId") -> true/false

					} else { // NPC

						var tileIndex;
						// NPCs are entry points for dialogs, not physical entities.
						// it works like that - you can put many NPCs on object layer roughly in some grid cell,
						// then, when player flies there, he can choose to speak with any of the NPCs

						var NPCPos0 = utils.gridCoordsFromPoint(
								{	x:objDefinition.x+layer.x,
									y:objDefinition.y+layer.y},
								level
						);
						var NPCPos1 = utils.gridCoordsFromPoint(
								{	x:objDefinition.x+layer.x+objDefinition.width,
									y:objDefinition.y+layer.y+objDefinition.height },
								level
						);

						var field;
						for (field in objDefinition.properties) {
							properties[field] = JSON.parse(objDefinition.properties[field]);
						}

						for (var npcx=NPCPos0.x; npcx<=NPCPos1.x; npcx++) {
							for (var npcy=NPCPos0.y; npcy<=NPCPos1.y; npcy++) {
								tileIndex = utils.indexFromGridCoord({x:npcx, y:npcy}, level);
								if (game.personsForCells[tileIndex] === undefined) {
									game.personsForCells[tileIndex] = [properties];
								} else {
									game.personsForCells[tileIndex].push(properties);
								}
							}
						}

					}
				};
			};
		};

		var i=0;
		var n = (levelData.tilesets[0].imagewidth/levelData.tilesets[0].tilewidth)*(levelData.tilesets[0].imageheight/levelData.tilesets[0].tileheight);
		game.tileProperties = new Array(n+levelData.tilesets[0].firstgid);
		for (i=0; i<levelData.tilesets[0].firstgid; i++) {
			game.tileProperties[i] = {
				solid : false,
				harmful : false,
				workshop : false,
				inn : false,
				serverstation : false,
				fuelstation : false
			};
		}
		for (i=0; i<n; i++) {
			var j = i+levelData.tilesets[0].firstgid;
			game.tileProperties[j] = {
				solid : false,
				harmful : false,
				workshop : false,
				inn : false,
				serverstation : false,
				fuelstation : false
			};
			if (levelData.tilesets[0].tileproperties[i]!==undefined) {
				game.tileProperties[j].solid = (levelData.tilesets[0].tileproperties[i].solid!==undefined);
				game.tileProperties[j].harmful = (levelData.tilesets[0].tileproperties[i].harmful!==undefined);
				game.tileProperties[j].workshop = (levelData.tilesets[0].tileproperties[i].workshop!==undefined);
				game.tileProperties[j].inn = (levelData.tilesets[0].tileproperties[i].inn!==undefined);
				game.tileProperties[j].serverstation = (levelData.tilesets[0].tileproperties[i].serverstation!==undefined);
				game.tileProperties[j].fuelstation = (levelData.tilesets[0].tileproperties[i].fuelstation!==undefined);
			}
		}
		//game.tileProperties = levelData.tilesets[0].tileproperties;

		return level; // TODO
	};

	function loadObjects(level, running) {
		// mozna uzywac game

		var objects;
		if (running.continue_ && localStorage && localStorage.getItem('ajuc.tiledArcade.objects')) {
			// load game
			objects = [];
			var deserializedObjects = JSON.parse(localStorage.getItem('ajuc.tiledArcade.objects'));
			var i;
			var n = deserializedObjects.length;

			for (i=0; i<n; i++) {
				objects[i] = hierarchy.prototypize(deserializedObjects[i]);
				if (objects[i].nextFrameToRun !== undefined) {
					objects[i].nextFrameToRun = 0;
				}
			}

			if (localStorage.getItem('ajuc.tiledArcade.facts')!==undefined) {
				var AAA = JSON.parse(localStorage.getItem('ajuc.tiledArcade.facts'));
				for (i in AAA) {
					ajuc.facts.database[i] = AAA[i];
				}

			} else {
				alert("Could not load facts");
			}

			if (localStorage.getItem('ajuc.tiledArcade.questProcessInstance.tokens')!==undefined) {
				var BBB = JSON.parse(localStorage.getItem('ajuc.tiledArcade.questProcessInstance.tokens'));
				for (i in BBB) {
					game.questProcessInstance.tokens[i] = BBB[i];
				}

			} else {
				alert("Could not load tokens");
			}

			if (localStorage.getItem('ajuc.tiledArcade.questGoals')!==undefined) {
				var CCC = JSON.parse(localStorage.getItem('ajuc.tiledArcade.questGoals'));
				for (i in CCC) {
					game.questGoals[i] = CCC[i];
				}
			} else {
				alert("Could not load questGoals");
			}


			if (localStorage.getItem('ajuc.tiledArcade.messages')!==undefined) {
				var DDD = JSON.parse(localStorage.getItem('ajuc.tiledArcade.messages'));
				$("#Messages").text(DDD);
			} else {
				alert("Could not load messages");
			}


			if (localStorage.getItem('ajuc.tiledArcade.dialoguesArchive')!==undefined) {
				var EEE = JSON.parse(localStorage.getItem('ajuc.tiledArcade.dialoguesArchive'));
				for (i in EEE) {
					game.dialoguesArchive[i] = EEE[i];
				}
			} else {
				alert("Could not load dialoguesArchive");
			}

			if (localStorage.getItem('ajuc.tiledArcade.nextRelationId')!==undefined) {
				nextRelationId = JSON.parse(localStorage.getItem('ajuc.tiledArcade.nextRelationId'));
			} else {
				alert("Could not load nextRelationId");
			}


		} else {
			objects = level.objects;
		}

		return objects;
	};

	function getNextRelationId() {
		return (nextRelationId++);
	};

	function addRelation(objectsParticipating, data) {
		var relationId = data.relationId;

		for (var i=0; i<objectsParticipating.length; i++) {
			objectsParticipating[i].relations.push(data);
		}

		game.relations[relationId] = data; // data is repeated in all participating objects and in relation, but this is as designed
											// because we don't save relations, we only save participating objects
											// and relations are only cache in runtime to make it easy to iterate throught all the relations

		game.relations[relationId].objects = []; // references to the real objects
		for (var ii in objectsParticipating) {
			game.relations[relationId].objects.push(objectsParticipating[ii]);
		}
	}
	function removeRelation(relationId) {

		var objectsTmp;
		var tmp;
		if (game.relations[relationId] !== undefined) {

			// mark objects that should be deleted when relation is removed to deletion
			for (var objToDeleteId in game.relations[relationId].autoDeleteObjects) {
				game.relations[relationId].autoDeleteObjects[objToDeleteId].destroyMe = true;
			}

			objectsTmp = game.relations[relationId].objects;

			for (var objId in objectsTmp) {
				if (objectsTmp[objId].relations!==undefined) {
					tmp = [];
					for (var relInObjId in objectsTmp[objId].relations) {
						if (objectsTmp[objId].relations[relInObjId]!==undefined &&
								objectsTmp[objId].relations[relInObjId].relationId !== relationId
						) {
							tmp.push(objectsTmp[objId].relations[relInObjId]);
						} // else we skip this relation
					}
					objectsTmp[objId].relations = tmp; //and overwrite the relations for this object
				}
			}

			game.relations[relationId] = undefined;
			delete game.relations[relationId];
		}
	}
	function removeRelationWhere(whereFn) {
		var toRemove = [];
		for (var relationId in game.relations) {
			if (whereFn(game.relations[relationId])) {
				toRemove.push(relationId);
			}
		}

		for (var relationId2 in toRemove) {
			removeRelation(toRemove[relationId2]);
		}
	}
	function updateRelationDataWhere(whereFn, updateFn) {
		for (var relationId in game.relations) {
			if (whereFn(game.relations[relationId])) {
				for (var objInRelId in game.relations[relationId].objects) {
					for (var relInObjInRelId in (game.relations[relationId].objects[objInRelId]).relations) {
						if (whereFn((game.relations[relationId].objects[objInRelId]).relations[relInObjInRelId])) {
							updateFn((game.relations[relationId].objects[objInRelId]).relations[relInObjInRelId]);
						}
					}
				}
				updateFn(game.relations[relationId]);
			}
		}
	}
	function countRelationsWhere(whereFn) {
		var number=0;
		for (var relationId in game.relations) {
			if (whereFn(game.relations[relationId])) {
				number++;
			}
		}

		return number;
	}

	function loadRelations(level, running) {
		// mozna uzywac game
		// { relationId: 999, relationKind: "kind", relationStrength: 100.0 }
		var objects = game.objects;

		var i, j;
		var n=objects.length;
		var m;
		var result = {};

		for (i=0; i<n; i++) {
			if (objects[i].relations !== undefined && objects[i].relations.length > 0) {
				m = objects[i].relations.length;
				for (j=0; j<m; j++) {
					if (result[objects[i].relations[j].relationId] === undefined) {

						result[objects[i].relations[j].relationId] = $.extend(true, {}, objects[i].relations[j]);

						result[objects[i].relations[j].relationId].objects = [objects[i]]; // we put reference to itself there
					} else {
						result[objects[i].relations[j].relationId].objects.push(objects[i]); //we put reference to itself there
					}
				}
			}
		}
		result=result;
		return result;
	};

	function loadPlayers(objects) {
		// mozna uzywac game

		var i;
		var n=objects.length;
		var result = [];
		for (i=0; i<n; i++) {
			if (objects[i].playerNo !== undefined) {
				result[objects[i].playerNo] = objects[i];
			}
		}
		return result;
	};

	function cameraFromObject(object, canvasObj) {
		// mozna uzywac game

		return {
			position : object.position,
			oldPosition : object.oldPosition,
			velocity : object.velocity,
			scale    : {
				x: 1.0,
				y: 1.0
			},
			screen : {
				width : canvasObj.width,
				height: canvasObj.height
			},
			rotation : 0.0
		};
	}



	function drawUI(ctx, camera, levell, objects) {
		// mozna uzywac game

		//TODO
	}

	function draw(canvasObj, spriteCanvasObj, camera, level, objects) {
		var quest = undefined;
		var goal = undefined;

		// mozna uzywac game
		ajuc.gfx.iface.beforeRedraw(camera);

		ajuc.gfx.iface.clear(camera);
		ajuc.gfx.iface.drawBackground(camera);

		var x0 = Math.floor(-0.5+(level.topLeft.x + camera.position.x - camera.screen.width/2) / level.cellWidth);
		var y0 = Math.floor(-0.5+(level.topLeft.y + camera.position.y - camera.screen.height/2) / level.cellHeight);
		var x1 = Math.floor( 0.5+(level.topLeft.x + camera.position.x + camera.screen.width/2) / level.cellWidth);
		var y1 = Math.floor( 0.5+(level.topLeft.y + camera.position.y + camera.screen.height/2) / level.cellHeight);

		ajuc.gfx.iface.drawTiles(level, camera, x0, y0, x1, y1, -1);

		ajuc.gfx.iface.drawSprites(objects, camera, 0);

		ajuc.gfx.iface.drawRelations(game, game.relations, objects, game.players[game.currentPlayer], camera);


		if (game.questGoals != undefined) {
			for (quest in game.questGoals) {
				for (goal in game.questGoals[quest]) {
					ajuc.gfx.iface.drawGoal(
						camera,
						game.players[game.currentPlayer],
						game.questGoals[quest][goal]
					);
				}
			}
		}

		ajuc.gfx.iface.afterRedraw(camera);
	};


	function clearInputs() {
		var x=0;
		for (x in game.inputs.keysPressed) {
			game.inputs.keysPressed[x] = false;
		};
		x=0;
		for (x in game.inputs.keyCodesPressed) {
			game.inputs.keyCodesPressed[x] = false;
		};
	};

	function updateSound(game) {
		if (game.newSound !== undefined && game.newSound !== game.oldSound) {
			game.oldSound = game.newSound;

			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', game.newSound);
			audioElement.load();
			audioElement.addEventListener("load", function() {
				alert("loaded");
			  audioElement.play();
			  //$(".duration span").html(audioElement.duration);
			  //$(".filename span").html(audioElement.src);
			}, true);
			//audioElement.loop = true;
		}
	}

	function checkGameSituation(game) {
		//TODO

//		for (var questName in game.activeQuests) {
////TODO
//			var questPhaseName = game.allQuests[questName].currentPhaseName;
//			var phase = game.allQuests[questName].nodes[questPhaseName];
//
//			for (var transitionNo=0; transitionNo<phase.transitions.length; transitioinNo++) {
//				var transition = phase.transitions[transitionNo];
//				if (transition) {
//
//				}
//			}
//		}
		if ((Math.round(game.currentFrame) % 20) === 19) {
			ajuc.pefjs.destructivelyPropagateTokens(game.questProcessInstance, game.questProcessInstance.definition, game, true);
		}


		if (game.players===undefined
			|| game.players.length < 1
			|| game.currentPlayer ===undefined
			|| game.players[game.currentPlayer] === undefined
			|| game.players[game.currentPlayer].destroyMe
		)
		{

			game.running.game = false;
			game.over = true;

			$("#InfoOKContent").text("Game Over.");
			pushUiScreen("InfoOK");
			infoOK.callback = function(game) {
				infoOK.callback = undefined;
				window.location.reload();
			};
			setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));

		}
	}

	function updateRelations(game) {

		var roi = 0;
		var ron, ronInv;

		var avgX = 0;
		var avgY = 0;

		var dx, dy;
		var d, dInv;

		var ri;
		var force = 0;

		for (ri in game.relations) {
			if (game.relations[ri] !== undefined && game.relations[ri].objects !== undefined) {
				ron = game.relations[ri].objects.length;

				if (ron>0) {
					avgX = 0;
					avgY = 0;

					//calculate center point of the group of all objects conneted by this relation
					ronInv = 1.0/ron;
					for(roi=0; roi<ron; roi++) {
						avgX += game.relations[ri].objects[roi].position.x;
						avgY += game.relations[ri].objects[roi].position.y;
					}
					avgX *= ronInv;
					avgY *= ronInv;

					//move all the objects that are movable in the direction of the center of the group
					for(roi=0; roi<ron; roi++) {
						dx = avgX - game.relations[ri].objects[roi].position.x;
						dy = avgY - game.relations[ri].objects[roi].position.y;
						d = Math.sqrt(dx*dx+dy*dy);

						if (game.relations[ri].mode === "max-distance-elastic" && 2*d>game.relations[ri].distance) {
							dInv = 0.5/d;
							force = (2*d-game.relations[ri].distance+0.5)*(2*d-game.relations[ri].distance+0.5);
							game.relations[ri].objects[roi].velocity.x += dx*force*0.0001;
							game.relations[ri].objects[roi].velocity.y += dy*force*0.0001;
						}
					}
				}

			}
		}
	}

	function update() {
		// mozna uzywac game
		var currentTime = new Date().getTime();

		if (game.currentTime!==undefined && game.running.game) {
			var durationOutside = currentTime-game.currentTime;
			if (game.debug.minFrameDurationOutsideThisSecond == undefined ||
				game.debug.minFrameDurationOutsideThisSecond > durationOutside
			) {
				game.debug.minFrameDurationOutsideThisSecond = durationOutside;
			}
			if (game.debug.maxFrameDurationOutsideThisSecond == undefined ||
				game.debug.maxFrameDurationOutsideThisSecond < durationOutside
			) {
				game.debug.maxFrameDurationOutsideThisSecond = durationOutside;
			}
		}

		game.debug.framesThisSecond++;
		game.currentTime = currentTime;
		if (currentTime - game.debug.thisSecondStartedAt > 1000) {
			game.debug.framesLastSecond = game.debug.framesThisSecond;
			game.debug.framesThisSecond = 0;
			game.debug.thisSecondStartedAt = currentTime;
			game.debug.minFrameDurationLastSecond = game.debug.minFrameDurationThisSecond;
			game.debug.maxFrameDurationLastSecond = game.debug.maxFrameDurationThisSecond;
			game.debug.minFrameDurationThisSecond = undefined;
			game.debug.maxFrameDurationThisSecond = undefined;
			game.debug.minFrameDurationOutsideLastSecond = game.debug.minFrameDurationOutsideThisSecond;
			game.debug.maxFrameDurationOutsideLastSecond = game.debug.maxFrameDurationOutsideThisSecond;
			game.debug.minFrameDurationOutsideThisSecond = undefined;
			game.debug.maxFrameDurationOutsideThisSecond = undefined;

			$("#FPS").text( game.debug.framesLastSecond + " fps in("
							+ game.debug.minFrameDurationLastSecond + "-" +
							+ game.debug.maxFrameDurationLastSecond + " ms)" +
							" out("+game.debug.minFrameDurationOutsideLastSecond+
							"-"+game.debug.maxFrameDurationOutsideLastSecond+") "+ajuc.gfx.iface.getInfo() + " ver " + ajuc.tiledArcade.version()
						  );


		}

		if (game.inputs.keyCodesPressed[enums.keys["escape"]] && game.running.game === true) {
			game.running.game = false;
			pushUiScreen("InGameMenu");
			clearInputs(game.inputs);
		}
		if (game.inputs.keyCodesPressed[enums.keys["f12"]]) {
			alert(game.debug.framesLastSecond + " fps in("
					+ game.debug.minFrameDurationLastSecond + "-" +
					+ game.debug.maxFrameDurationLastSecond + " ms)" +
					" out("+game.debug.minFrameDurationOutsideLastSecond+
					"-"+game.debug.maxFrameDurationOutsideLastSecond+") "+ajuc.gfx.iface.getInfo() + " ver " + ajuc.tiledArcade.version()
			);
			clearInputs(game.inputs);
		}

		if (!game.running.game) {
			if (game.inputs.keyCodesPressed[enums.keys["down"]]) {
				setNextHighlightedItem();
			}
			if (game.inputs.keyCodesPressed[enums.keys["up"]]) {
				setLastHighlightedItem();
			}
			if (game.inputs.keyCodesPressed[enums.keys["enter"]]) {
				clickOnHighlightedItem();
				clearInputs(game.inputs);
			} else if (game.inputs.keyCodesPressed[enums.keys["escape"]]) {
				clickOnESCItemIfExists();
				clearInputs(game.inputs);
			}
			clearInputs(game.inputs);
		}

		if (game.running.game) {
			game.currentFrame = game.currentFrame + 1;

			checkGameSituation(game);
			updateSound(game);

			// get inputs - current input values are always in game.inputs
			// we just have to interprete them into actions
			var playerNo;
			var playersNumber = game.players.length;
			for (playerNo=0; playerNo<playersNumber; playerNo++) {
				var actions = game.players[playerNo].interpreteInputs(game.inputs);
				game.players[playerNo].performActions(game, actions);
				//TODO
			}

			updateRelations(game);

			clearInputs(game.inputs);

			var n = game.objects.length;
			var i;
			var object;
			var toRemove = [];
			for (i=0; i<n; i++) {

				object = game.objects[i];

				if (!object.destroyMe) {
					// TODO - allowing them to run their ai function
					if (object.aiScript != undefined && object.enabled && game.currentFrame >= object.nextFrameToRun) {
						object.nextFrameToRun = object.aiScript(game);
					}

					var distFromPlayer = utils.distance2(
							game.players[game.currentPlayer].position,
							object.position
					);


					if (distFromPlayer < 1400*1400) {
						//TODO maybe optimize - for example by using 2dimensional constan size array filled each turn
						// by objects, and only calculating collision between objects in the same or nearby cell of that array
						object.collideWithObjects(game);

						object.collideWithLevel(game);

						// move objects
						object.move(game);

						if (object.update) {
							object.update(game);
						};
					}

				} else {
					toRemove.push(i);
					object.onDestroy(game);
				}
			}

			draw(game.canvasObj, game.spriteCanvasObj, cameraFromObject(game.players[game.currentPlayer], game.canvasObj), game.level, game.objects);

			//delete dead objects
			//TODO - look at references to dead objects from other objects and set them to undefined?
			//I'll think about that
			var j;
			for (j=toRemove.length-1; j>=0; j--) {
				game.objects.splice(toRemove[j], 1);
			}

			game.currentFrame = game.currentFrame + 1;
		}


		window.requestAnimFrame(update);

		var currentTimeAtEnd = new Date().getTime();
		var duration = currentTimeAtEnd - currentTime;
		if (game.running.game) {
			if (game.debug.minFrameDurationThisSecond == undefined ||
				game.debug.minFrameDurationThisSecond > duration
			) {
				game.debug.minFrameDurationThisSecond = duration;
			}
			if (game.debug.maxFrameDurationThisSecond == undefined ||
				game.debug.maxFrameDurationThisSecond < duration
			) {
				game.debug.maxFrameDurationThisSecond = duration;
			}
		}

	}


	/** get key code */
    function getKeyCode(key) {
		// mozna uzywac game
		return (key == null) ? event.keyCode : key.keyCode;
    }

    /** get key character */
    function getKey(key)
    {
		// mozna uzywac game
        return String.fromCharCode(getKeyCode(key)).toLowerCase();
    }


	function replacer(key, value) {
		if (key === "objects") { // in relation data objects is array referencjing objects, and this makes circular references, that can't be serialized
								 // fortunately we designed loadRelations in such way, that this information isn't needed
								 // so we can safely substitute empty array here
								 // and it will be filled in loadRelations basing on which objects have references to which relations
			return [];
		}
		return value;
	}

    function saveGame() {
		if (localStorage && game.objects && game.objects.length>0 && (game.over===undefined || !game.over)) {



			localStorage.setItem('ajuc.tiledArcade.objects', JSON.stringify(game.objects, replacer));

			localStorage.setItem('ajuc.tiledArcade.questProcessInstance.tokens', JSON.stringify(game.questProcessInstance.tokens));
			localStorage.setItem('ajuc.tiledArcade.questGoals', JSON.stringify(game.questGoals));
			localStorage.setItem('ajuc.tiledArcade.dialoguesArchive', JSON.stringify(game.dialoguesArchive));

			localStorage.setItem('ajuc.tiledArcade.messages', JSON.stringify($("#Messages").text()));

			localStorage.setItem('ajuc.tiledArcade.facts', JSON.stringify(ajuc.facts.database));
			localStorage.setItem('ajuc.tiledArcade.nextRelationId', JSON.stringify(nextRelationId));
			alert("Game saved");
//			$("#InfoOKContent").text("Game was saved to disk");
//			pushUiScreen("InfoOK");
//			infoOK.callback = function(game) {
//			};
//			$("#InfoOK").css("z-index", 0);
//			infoOK.callback = function(game){$("#InfoOK").css("z-index", 10);};
//			pushUiScreen("InfoOK");

		};
    }

	function onUnload() {
		//saveGame();
	};

	function pushUiScreen(screenName) {
		utils.pushUiScreen(game, screenName);
		//alert("pushUiScreen("+screenName+") - po " + game.uiStack);
	};

	function popUiScreen() {
		utils.popUiScreen(game.uiStack);
	};

	function init(canvasObj, spriteCanvasObj, sidebarObj, running) {
		// mozna uzywac game

		//gfx
		ajuc.gfx.iface.init(
			function() { // callback after loading finished
				popUiScreen();
				$(window).resize(function(){
					ajuc.gfx.iface.resize();
				});
				ajuc.gfx.iface.resize();
			}
		);


		//sounds
		//TODO

		//level data is loaded or initialized in mainMenu after choosing new game or continue game.

		var currentFrame = 0;

		var dataForPd = $("#quest_graph_0").text();
		var pd = ajuc.pefjs.loadProcessDefinition(dataForPd, true, true, true, {"message":"message"});
		var pi = ajuc.pefjs.startProcessInstance(pd, {});

		game = {
			mode: "", //TODO - tutorial/campaign - chooesn at start

			uiStack : ["MainMenu", "LoadingScreen"],

			options : {
				hidePlayerAnswers : false
			},

			debug: {
				framesLastSecond : 0,
				thisSecondStartedAt: 0,
				framesThisSecond : 0,

				minFrameDurationLastSecond : undefined,
				maxFrameDurationLastSecond : undefined,
				minFrameDurationThisSecond : undefined,
				maxFrameDurationThisSecond : undefined
			},

			prices : {
				fuel : 5.30,
				health : 20.0 // repairing 1 point of health
			},
			level : undefined,//level,
			objects : undefined,//objects,
			personsForCells : [], //non player characters (entry points for dialogues) loaded from level objects with typ="NPC"

			relations : undefined,//relations, //TODO
			players : undefined,//players,

			activeQuests : {}, // map quest : phase //obsolete
			finishedQuests : {}, // map quest : phase //obsolete
			failedQuests : {}, // map quest : phase //obsolete

			questProcessInstance : pi,

			questGoals : {}, // for GTA-like quest arrow

			dialoguesArchive: [], // in chronological order, each entry is { "person": number of person or "player", "content": "content", "additional": additional info }

			persons : [
			    {	nick: "I, the Player",
			    	name: "Yacek Kovalski",
				age: 19,
				sex: "male",
				description: "",
			    	portrait: 0,
			    	player: 0
			    },
			    {	nick: "Grandpa",
			    	name: "Vladyslav Kovalski",
			    	portrait: 1,
			    	player:  undefined
			    },
			    {	nick: "Sister",
			    	name: "Viola Kovalska",
			    	portrait: 3,
			    	player:  undefined
			    },
			    {	nick: "Mechanic Tadeush",
			    	name: "Tadeush Haller",
			    	portrait: 2,
			    	player:  undefined
			    },
			    {	nick: "Malina",
			    	name: "Malina Haller",
			    	portrait: 4,
			    	player:  undefined
			    },
			    {	nick: "Stupid Harold",
			    	name: "Harold Milosh",
			    	portrait: 5,
			    	player:  undefined
			    },
			    {	nick: "Valdeck",
			    	name: "Valdeck de Siolo",
			    	portrait: 6,
			    	player:  undefined
			    },
			    {	nick: "Kashia",
			    	name: "Kashia de Siolo",
			    	portrait: 7,
			    	player:  undefined
			    },
			    {	nick: "Artur",
			    	name: "Artur Gorub",
			    	portrait: 8,
			    	player:  undefined
			    },
			    {	nick: "Jane",
			    	name: "Jane Gorub",
			    	portrait: 9,
			    	player:  undefined
			    }
			],
			currentPlayer : undefined,

			canvasObj : canvasObj,
			spriteCanvasObj : spriteCanvasObj,
			currentFrame : currentFrame,
			physicalConstants : {
				air : {
					temperature : 20.0,
					humidity : 60.0,
					drag : 0.01,
					voltageConductivity : 0.01,
					temperatureConductivity : 0.03,
					gravity: { x: 0.0, y: 3.5 }
				},
				water : {
					temperature : 10.0,
					humidity : 100.0,
					drag : 0.05,
					voltageConductivity : 0.75,
					temperatureConductivity : 0.9,
					gravity: { x: 0.0, y: -0.1 }
				}
			},
			inputs : {
				keysDown: [],
				keysPressed: [],
				keysDepressed: [],
				keyCodesDown: [],
				keyCodesPressed: [],
				keyCodesDepressed: [],
				mouse: {
					position : {
						x: 0,
						y: 0
					},
					velocity : {
						x: 0,
						y: 0
					},
					buttons : {
						left : false,
						right : false,
						middle : false,
						middleUp : false,
						middleDown : false
					}
				}
			},
			running : running,
			over : false
		};

		// start update loop
		update();

		//listen for key events
		$(document).keydown(function (eventObj) {
			game.inputs.keysDown[getKey(eventObj)] = true;
			game.inputs.keyCodesDown[getKeyCode(eventObj)] = true;
			game.inputs.keysPressed[getKey(eventObj)] = false;
			game.inputs.keyCodesPressed[getKeyCode(eventObj)] = false;
		});
		$(document).keyup(function (eventObj) {
			game.inputs.keysDown[getKey(eventObj)] = false;
			game.inputs.keyCodesDown[getKeyCode(eventObj)] = false;
			game.inputs.keysPressed[getKey(eventObj)] = true;
			game.inputs.keyCodesPressed[getKeyCode(eventObj)] = true;
		});

		$(window).unload( onUnload );
	};

	function getGame() {
		return game;
	};

	function help(action) {
		if (action==="Return") {
			popUiScreen();
		} else {
			//TODO
		};
	};

	function debug(action) {
		if (action==="Return") {
			popUiScreen();
		} else if (action==="TestShop") {
			pushUiScreen("Shop");
		} else if (action==="TestDialog") {

			dialog.prepare(game.persons[0], [game.persons[2]], [game.persons[1]], dialog_data.graphs["grandpa"]);

			pushUiScreen("Dialog");

		} else {
			//TODO
		};
	};

	function partField(tabName) {
		var tmp = undefined;
		if (tabName==="Engines") {
			tmp = "mainEngine";
		} else if (tabName==="RotationEngines") {
			tmp = "rotationEngine";
		} else if (tabName==="PowerGenerators") {
			tmp = "powerGenerator";
		} else if (tabName==="Shields") {
			tmp = "shield";
		} else if (tabName==="Tools") {
			tmp = "tools";
		} else if (tabName==="Ammo") {
			tmp = "ammo";
		}
		return tmp;
	}
	function partFieldInStats(tabName) {
		var tmp = undefined;
		if (tabName==="Engines" || tabName==="RotationEngines") {
			tmp = "engines";
		} else if (tabName==="PowerGenerators") {
			tmp = "powerGenerators";
		} else if (tabName==="Shields") {
			tmp = "shields";
		} else if (tabName==="Tools") {
			tmp = "tools";
		} else if (tabName==="Ammo") {
			tmp = "bullets";
		}
		return tmp;
	}
	function partClassForDisplay(tabName) {
		var tmp = undefined;
		if (tabName==="Engines") {
			tmp = "main engine";
		} else if (tabName==="RotationEngines") {
			tmp = "rotation engine";
		} else if (tabName==="PowerGenerators") {
			tmp = "power generator";
		} else if (tabName==="Shields") {
			tmp = "shield";
		} else if (tabName==="Tools") {
			tmp = "tools";
		} else if (tabName==="Ammo") {
			tmp = "ammo";
		}
		return tmp;
	}

	function shopBuy(action, tab, partNo, part, priceForThis, tabName, indexOnTab) {
		var old, proposed, diff;
		var player = game.players[game.currentPlayer];
		if (tabName==="Tools") {
			$("#InfoOKContent").text("You've bought "+part.name+" for $ "+priceForThis+".");
			infoOK.callback=function(game) {
				game.players[game.currentPlayer].useMoney(priceForThis);
				player[partField(tabName)].push(partNo);
				player["currentTool"] = (player[partField(tabName)].length-1);
				shop.refreshItems();
			};
			pushUiScreen("InfoOK");
			setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
		} else if (tabName==="Ammo") {
			$("#NumberInputField").get(0).value = "0";
			numberInput.callback=function(game) {
				old = utils.nvlMinMax(player[partField(tabName)][part.no], 0, 0, part.maxAmmo);
				var s = $("#NumberInputField").get(0).value;
				while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,9999); }
				diff = parseInt(s);
				proposed = utils.nvlMinMax(old+diff, 1, 1, part.maxAmmo);
				diff = proposed - old;
				if (game.players[game.currentPlayer].money - priceForThis*diff >= 0) {
					game.players[game.currentPlayer].useMoney(priceForThis*diff);
					player[partField(tabName)][part.no] = proposed;
					shop.refreshItems();
					popUiScreen();
				} else {
					$("#InfoOKContent").text("You can't afford that much bullets.");
					infoOK.callback=function(game) {};
					pushUiScreen("InfoOK");
					setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
				}

			};
			numberInput.refresh = function(obj, e) {
				var key = "";
				if (e) {
					if (window.event)
						key = String.fromCharCode(window.event.keyCode);
					else if (e)
						key = String.fromCharCode(e.which);
				}
				var maxMoney = game.players[game.currentPlayer].money;//priceForThis;
				var s = $("#NumberInputField").get(0).value + key;
				while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,9999); }
				diff = parseInt(s);
				if (diff>=0 &&(maxMoney - priceForThis*diff)>=0) {
					$("#NumberInputQuestion").text( "How many "+part.name+" for $ "+priceForThis+" each do you want to buy? " +
													"You have " + maxMoney + " $. If you buy " + diff + " bullets, you'd have " +
													(maxMoney - priceForThis*diff ) + " $ left.");
				} else if (diff>=0) {
					$("#NumberInputQuestion").text( "You can't afford that many bullets!");
				} else if (diff<0) {
					$("#NumberInputQuestion").text( "We don't sell negative quantities of things here.");
				} else {
					$("#NumberInputQuestion").text( "Wrong quantity.");
				}
			};
			pushUiScreen("NumberInput");
			numberInput.refresh($("#NumberInputField").get(0));

			setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
			$("#NumberInputField").focus();

		} else {
			if (player[partField(tabName)]===undefined || player[partField(tabName)]===-1) {
				$("#InfoOKContent").text("You've bought "+part.name+" for $ "+priceForThis+".");
				infoOK.callback=function(game) {
					game.players[game.currentPlayer].useMoney(priceForThis);
					player[partField(tabName)] = partNo;
					shop.refreshItems();
				};
				pushUiScreen("InfoOK");
				setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
			} else {
				var oldPartPrice=0;//TODO

				$("#QuestionContent").text(
						"You're about to buy "+part.name+" for $ "+priceForThis+", "+
						"but you already have an "+partClassForDisplay(tabName)+". "+
						"Do you want to sell your old "+partClassForDisplay(tabName)+" for $"+oldPartPrice+" "+
						"in order to mount a new one?");
				question.callbackYes=function(game) {
					game.players[game.currentPlayer].useMoney(priceForThis-oldPartPrice);
					player[partField(tabName)] = partNo;
					shop.refreshItems();
				};
				question.callbackNo=function(game) {
				};

				pushUiScreen("Question");
			}
		}
	}
	function shopSell(action, tab, partNo, part, priceForThis, tabName, indexOnTab) {
		var player = game.players[game.currentPlayer];
		if (tabName==="Tools") {
			if (player[partField(tabName)].length<=indexOnTab ||
				player[partField(tabName)][indexOnTab]===undefined ||
				player[partField(tabName)][indexOnTab]===-1
			) {

			} else {
				var oldPartPrice=priceForThis;

				$("#QuestionContent").text(
						"You're about to sell your old "+partClassForDisplay(tabName)+" "+part.name+" for $ "+priceForThis+". " +
						"Are your sure?");
				question.callbackYes=function(game) {
					game.players[game.currentPlayer].useMoney(-oldPartPrice);
					player[partField(tabName)].splice(indexOnTab, 1);
					player["currentTool"] = (player[partField(tabName)].length)-1;
					shop.refreshItems();
				};
				question.callbackNo=function(game) {
				};

				pushUiScreen("Question");
			}
		} else if (tabName==="Ammo") {
			//TODO


			$("#NumberInputField").get(0).value = "0";
			numberInput.callback=function(game) {
				var old = utils.nvlMinMax(player[partField(tabName)][part.no], 0, 0, part.maxAmmo);
				var s = $("#NumberInputField").get(0).value;
				while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,9999); }
				var diff = (-parseInt(s));
				var proposed = utils.nvlMinMax(old+diff, 1, 1, part.maxAmmo);
				diff = proposed - old;
				if (game.players[game.currentPlayer].money - priceForThis*diff >= 0) {
					game.players[game.currentPlayer].useMoney(priceForThis*diff);
					player[partField(tabName)][part.no] = proposed;
					shop.refreshItems();
					popUiScreen();
				} else {
					$("#InfoOKContent").text("You don't have that much bullets.");
					infoOK.callback=function(game) {};
					pushUiScreen("InfoOK");
					setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
				}

			};
			numberInput.refresh = function(obj, e) {
				var key = "";
				if (e) {
					if (window.event)
						key = String.fromCharCode(window.event.keyCode);
					else if (e)
						key = String.fromCharCode(e.which);
				}
				var maxMoney = game.players[game.currentPlayer].money;//priceForThis;
				var s = $("#NumberInputField").get(0).value + key;
				while (s.substr(0,1) == '0' && s.length>1) { s = s.substr(1,9999); }
				var diff = (-parseInt(s));
				var old = (utils.nvlMinMax(player[partField(tabName)][part.no], 0, 0, part.maxAmmo));
				var proposed = utils.nvlMinMax(old+diff, 1, 1, part.maxAmmo);

				if (proposed>=0 && diff <=0) {
					$("#NumberInputQuestion").text( "How many "+part.name+" for $ "+priceForThis+" each do you want to sell? " +
													"You have " + old + " rounds of these bullets. If you sell " + (-diff) + " bullets, "+
													"you'd have $" + (maxMoney - priceForThis*diff ) + ", and " + proposed + " bullets left.");
				} else if (proposed<0) {
					$("#NumberInputQuestion").text( "You don't have that many bullets!");
				} else {
					$("#NumberInputQuestion").text( "Wrong quantity.");
				}
			};
			pushUiScreen("NumberInput");
			numberInput.refresh($("#NumberInputField").get(0));

			setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
			$("#NumberInputField").focus();

			//alert("SELLING AMMO");
		} else {
			if (player[partField(tabName)]===undefined || player[partField(tabName)]===-1) {

			} else {
				var oldPartPrice=priceForThis;

				$("#QuestionContent").text(
						"You're about to sell your old "+partClassForDisplay(tabName)+" "+part.name+" for $ "+priceForThis+". " +
						"Are your sure?");
				question.callbackYes=function(game) {
					game.players[game.currentPlayer].useMoney(-oldPartPrice);
					player[partField(tabName)] = undefined;
					shop.refreshItems();
				};
				question.callbackNo=function(game) {
				};

				pushUiScreen("Question");
			}
		}
	}

	function checkPlayerCanExitWorkshop() {
		var player = game.players[game.currentPlayer];
		var warning = "";
		if (player.mainEngine === undefined || player.mainEngine < 0) {
			warning += "Your ship don't have main engine mounted. You won't be able to fly!!! ";
		}
		if (player.rotationEngine === undefined || player.rotationEngine < 0) {
			warning += "Your ship don't have rotation engine mounted. You won't be able to turn!!! ";
		}
		if (player.powerGenerator === undefined || player.powerGenerator < 0) {
			warning += "Your ship don't have power generator mounted. You won't be able to use systems that require energy!!! ";
		}
		if (warning !== "") {
			$("#QuestionContent").text("WARNING!" + warning + " Are you sure you want to exit the workshop? ");
			question.callbackYes=function(game) {
				popUiScreen();
				game.running.game = true;
			};
			question.callbackNo=function(game) {
			};
			pushUiScreen("Question");
		} else {
			popUiScreen();
			game.running.game = true;
		}
	}

	function shop(action, tab, partNo, priceForThis, tabName, indexOnTab) { // WORKSHOP workshop workShop WorkShop HERE !!!
		var part;
		var player = game.players[game.currentPlayer];

		if (action==="Return") {
			checkPlayerCanExitWorkshop();
		} else if (action === "ShopItemsTabs" || action === "ShipItemsTabs") {
			shop.refreshItems(action, tab);
		} else if (action ==="Buy") {
			if (game !== undefined && game.currentPlayer !== undefined || game.players != undefined && game.players.length > 0) {
				part = ajuc.stats[partFieldInStats(tabName)][partNo];
				if ((part ===null) ||  (!game.players[game.currentPlayer].hasMoney(priceForThis))) {
					return;
				}
				game.players[game.currentPlayer].changedPartsOrCurrentWeapon = true;
				if (tab==="Tool") {
					$("#InfoOKContent").text("You've bought "+part.name+" for $ "+priceForThis+".");
					infoOK.callback=function(game) {
						game.players[game.currentPlayer].useMoney(priceForThis);
						player.tools.push(partNo);
						shop.refreshItems();
					};
					pushUiScreen("InfoOK");
					setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
				} else {
					shopBuy(action, tab, partNo, part, priceForThis, tabName, indexOnTab);
				}
			} else {
				// TODO inform about error
			}
		} else if (action ==="Sell") {
			if (game !== undefined && game.currentPlayer !== undefined || game.players != undefined && game.players.length > 0) {
				if (tabName==="Tools") {
					part = ajuc.stats[partFieldInStats(tabName)][ player[partField(tabName)][indexOnTab] ];
				} else if (tabName==="Ammo") {
					part = ajuc.stats[partFieldInStats(tabName)][partNo];
				} else {
					part = ajuc.stats[partFieldInStats(tabName)][ player[partField(tabName)] ];
				}
				if (part === null) {
					return;
				}
				game.players[game.currentPlayer].changedPartsOrCurrentWeapon = true;
				shopSell(action, tab, partNo, part, priceForThis, tabName, indexOnTab);
			}
		} else {
			//TODO
		};
	};

	shop.prepare = function(workshopDefinitionNo) {
		if (workshopDefinitionNo === undefined) {
			workshopDefinitionNo = 0;
		};
		shop.workshopDefinition = ajuc.stats.workshops[workshopDefinitionNo];
		shop.refreshItems("ShopItemsTabs", "Engines");
		shop.refreshItems("ShipItemsTabs", "Engines");
	};

	shop.refreshItems = function(action, tab) {
		var tab1;
		var tab2;
		var i;
		var n;
		var playerObj;
		var part;

		playerObj = game.players[game.currentPlayer];

		if (action != undefined) {
			$("#"+action+" > ul").toggleClass("ChoosenTab", false);
			$("#"+action+" > ul.Tab"+tab+"").toggleClass("ChoosenTab", true);
		}

		tab1 = $("#ShopItemsTabs > ul.ChoosenTab").text().replace(/\s*/g, "");
		tab2 = $("#ShipItemsTabs > ul.ChoosenTab").text().replace(/\s*/g, "");

		if (action === "ShopItemsTabs" || action==undefined) {
			if (action==undefined) {
				tab = tab1;
			}
			$("#ShopItems > *").remove();
			if (tab==="Engines" || tab==="RotationEngines" || tab==="Shields" || tab==="PowerGenerators" || tab==="Tools" || tab==="Ammo") {
				i=0;
				n=shop.workshopDefinition[partFieldInStats(tab)].length;
				for (i=0;i<n;i++) {
					part = ajuc.stats[partFieldInStats(tab)][shop.workshopDefinition[partFieldInStats(tab)][i].no];
					part.price = part.averagePrice + part.stdDevPrice*shop.workshopDefinition[partFieldInStats(tab)][i].priceDeviation;
					insertPartInfo("#ShopItems", part, "", tab, true, false, true, tab, i);
				}
			}
		}

		if (action === "ShipItemsTabs" || action == undefined) {
			if (action==undefined) {
				tab = tab2;
			}

			$("#ShipItems > *").remove();
			if (tab==="Engines" || tab==="RotationEngines" || tab==="Shields" || tab==="PowerGenerators") {
				i=0;
				n=1;
				for (i=0;i<n;i++) {
					part = ajuc.stats[partFieldInStats(tab)][ playerObj[partField(tab)] ];
					if (part) {
						part.price = part.averagePrice; //TODO + part.stdDevPrice*shop.workshopDefinition.engines[i].priceDeviation;
						insertPartInfo("#ShipItems", part, "", tab, false, true, true, tab, i);
					}
				}
			} else if (tab==="Tools") {
				i=0;
				n=playerObj[partField(tab)].length;
				for (i=0;i<n;i++) {
					part = ajuc.stats[partFieldInStats(tab)][playerObj.tools[i]];
					if (part) {
						part.price = part.averagePrice; //TODO + part.stdDevPrice*shop.workshopDefinition.tools[i].priceDeviation;
						insertPartInfo("#ShipItems", part, "", tab, false, true, true, tab, i);
					}
				}
			} else if (tab==="Ammo") {
				i=0;
				n=playerObj[partField(tab)].length;
				for (i=0;i<n;i++) {
					if (playerObj.ammo[i] !== undefined && playerObj.ammo[i] > 0) {
						part = ajuc.stats[partFieldInStats(tab)][i];
					} else {
						part = undefined;
					}
					if (part) {
						part.price = part.averagePrice; //TODO + part.stdDevPrice*shop.workshopDefinition.tools[i].priceDeviation;
						insertPartInfo("#ShipItems", part, "", tab, false, true, true, tab, i, playerObj.ammo[i]);
					}
				}
			}
		}

		if (game !== undefined && game.players!==undefined && game.currentPlayer!=undefined) {
			$("#ShipInfoInShopMoney").text("$ "+game.players[game.currentPlayer].money);
		}
	};

	function insertPartInfo(into, part, partClass, tab, buy, sell, details, tabName, indexOnTab, quantity) {
		if (quantity === undefined) {
			quantity = 1;
		}
		var tmp = "<li class=\"Part "+partClass+"\">" +
					"<h3>" + part.name + "</h3>" +
					"<p>" + part.description + "</p>" +
					((quantity===1)?(""):("<div>" + quantity + " rounds</div>")) +
					"<div>$" + part.averagePrice;

		var maxHighlightableItemIndexSoFar = getMaxHighlightedItem();

		if (buy) {
			tmp += " <a class=\"HighlightableItem Blue\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\" "+
					" onMouseOut=\"style.color='blue';\""+
					" onClick=\"ajuc.tiledArcade.shop('Buy', '"+partClass+"','"+part.no+"','"+part.price+"','"+tabName+"',"+indexOnTab+");\">Buy</a> ";
		}
		if (sell) {
			tmp += " <a class=\"HighlightableItem Blue\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\" "+
					" onMouseOut=\"style.color='blue';\""+
					" onClick=\"ajuc.tiledArcade.shop('Sell', '"+partClass+"','"+part.no+"','"+part.price+"','"+tabName+"',"+indexOnTab+");\">Sell</a> ";
		}
		if (details) {
			tmp += " <a class=\"HighlightableItem Blue\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\" "+
					" onMouseOut=\"style.color='blue';\""+
					" onClick=\"ajuc.tiledArcade.shop('Details', '"+partClass+"','"+part.no+"','"+part.price+"','"+tabName+"',"+indexOnTab+");\">Details</a> ";
		}

		tmp += 	"</div>" +
				"<div class=\"PartImg\" style=\""+"background-position: -"+part.imgLeft+"px -"+part.imgTop+"px;"+"\"/>"+

				"</li>";

		$(tmp).appendTo(into);
	}
	/*function insertEngineInfo(into, part, tab, buy, sell, details, tabName, indexOnTab) {
		insertPartInfo(into, part, "Engine", tab, buy, sell, details, tabName, indexOnTab);
	}
	function insertPowerGeneratorInfo(into, part, tab, buy, sell, details, tabName, indexOnTab) {
		insertPartInfo(into, part, "PowerGenerator", tab, buy, sell, details, tabName, indexOnTab);
	}
	function insertShieldInfo(into, part, tab, buy, sell, details, tabName, indexOnTab) {
		insertPartInfo(into, part, "Shield", tab, buy, sell, details, tabName, indexOnTab);
	}
	function insertToolInfo(into, part, tab, buy, sell, details, tabName, indexOnTab) {
		insertPartInfo(into, part, "Tool", tab, buy, sell, details, tabName, indexOnTab);
	}*/

	function fuelStation(action) {
		if (action==="Return") {
			popUiScreen();
			game.running.game = true;
		} else if (action === "Refuel") {
			var player = game.players[game.currentPlayer];
			var diff = player.maxFuel-player.fuel;

			var cost = diff*game.prices.fuel;

			if (game.players[game.currentPlayer].hasMoney(cost)) {
				game.players[game.currentPlayer].useMoney(cost);
			}

			game.players[game.currentPlayer].fuel += diff;
		} else {

			//TODO
		};
	};

	function infoOK(action) {
		if (action==="OK") {
			if (infoOK.callback!==undefined) {
				infoOK.callback(game);
			}
			popUiScreen();
		} else {

			//TODO
		};
	};

	function question(action) {
		if (action==="Yes") {
			if (question.callbackYes!==undefined) {
				question.callbackYes(game);
			}
			popUiScreen();
		} else if (action==="No") {
			if (question.callbackNo!==undefined) {
				question.callbackNo(game);
			}
			popUiScreen();
		} else {
			//TODO
		};
	};


	function choose(action, no) {
		if (no!==undefined && choose.callbacks !== undefined) {
			//alert("action="+action+" no="+no+" choose.callbacks.length="+choose.callbacks.length);
			popUiScreen();
			if (no>=0 && no<choose.callbacks.length) {
				//alert("BEFORE"+choose.callbacks[no]);

				(choose.callbacks[no])(game, no);

				//alert("AFTER");
			} else {
				//WTF ?
				//TODO WTF? handle this somehow
			}
		}
		//
	};
	choose.prepare = function(content, options, callbacks, optionsClasses) {
		var tmp;

		game.running.game = false;
		game.players[game.currentPlayer].velocity.x = 0;
		game.players[game.currentPlayer].velocity.y = 0;

		game.players[game.currentPlayer].position.y = game.players[game.currentPlayer].position.y - 24;

		$("#ChooseContent").text(content);
		$("#ChooseOptions > *").remove();

		for (var i=0; i<options.length; i++) {
			if (optionsClasses != undefined) {
				tmp = " " + optionsClasses[i];
			} else {
				tmp = "";
			}
			$(	"<li>" +
					"<a class=\"HighlightableItem"+tmp+"\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\"" +
					" onClick=\"ajuc.tiledArcade.choose('Choose', "+i+");\">"+options[i]+"</a>" +
				"</li>"
			).appendTo("#ChooseOptions");
		}

		choose.callbacks = callbacks;
		utils.pushUiScreen(game, "Choose");
		setHighlightedItem($("#InfoOK > .HighlightableItem:eq(0)").get(0));
	};

	function numberInput(obj) {
		//TODO
		numberInput.callback(game);
	};

	numberInput.refresh = function(obj) {};
	numberInput.callback = function(obj) {};


//	function messages(content) {
//		if (action==='NextHint') {
//			if (game.tutorialStep === undefined) {
//				game.tutorialStep = 1;
//			}
//			$("#Messages > .page"+game.tutorialStep).css("display", "none");
//			game.tutorialStep += 1;
//			$("#Messages > .page"+game.tutorialStep).css("display", "block");
//		} else if (action==='PrevHint') {
//				if (game.tutorialStep === undefined ) {
//					game.tutorialStep = 1;
//				}
//				if (game.tutorialStep > 1)  {
//					$("#Messages > .page"+game.tutorialStep).css("display", "none");
//					game.tutorialStep -= 1;
//					$("#Messages > .page"+game.tutorialStep).css("display", "block");
//				}
//		} else if (action==='SkipTutorial') {
//			if (game.tutorialStep === undefined) {
//				game.tutorialStep = 1;
//			}
//			$("#Messages > .page"+game.tutorialStep).css("display", "none");
//			game.tutorialStep = undefined;
//			$("#Messages").text("");
//		} else {
//			//TODO
//		}
//	};

	function mainMenu(action) {
		if (action==='New Game' || action==='Tutorial') {
			pushUiScreen("GameScreen");

			ajuc.gfx.iface.resize();

			game.running.continue_ = false;
			game.level = loadLevel(0, game.running);
			game.objects = loadObjects(game.level, game.running);
			game.relations = loadRelations(game.level, game.running);
			game.players = loadPlayers(game.objects);
			game.currentPlayer = 0; // TODO

			game.players[game.currentPlayer].changedPartsOrCurrentWeapon = true;

			if (action==="Tutorial") {
				game.mode="tutorial";
			} else {
				game.mode="campaign";
			}
			ajuc.gfx.iface.updateLevel(game.level, -1);

			game.running.game = true;
		} else if (action==='Continue Game') {
			pushUiScreen("GameScreen");

			ajuc.gfx.iface.resize();

			game.running.continue_ = true;
			game.level = loadLevel(0, game.running);
			game.objects = loadObjects(game.level, game.running);
			game.relations = loadRelations(game.level, game.running);
			game.players = loadPlayers(game.objects);
			game.currentPlayer = 0; // TODO

			game.players[game.currentPlayer].changedPartsOrCurrentWeapon = true;

			ajuc.gfx.iface.updateLevel(game.level, -1);

			game.running.game = true;
		} else if (action==='Help') {
			pushUiScreen("Help");
		} else if (action==='Debug') {
			if (localStorage) {
				if (localStorage.getItem('ajuc.tiledArcade.objects')) {
					$("#SavedContent").text(localStorage.getItem('ajuc.tiledArcade.objects'));
				} else {
					$("#SavedContent").text("Couldn't read saved content - localStorage supported, but no content was saved yet.");
				};
			} else {
				$("#SavedContent").text("Couldn't read saved content - localStorage not supported.");
			}
			$("#Debug").css('display', 'inline');
			pushUiScreen("Debug");
		} else if (action==='Exit') {
			window.location.reload();
		}
	};

	function inGameMenu(action) {
		if (action==='Continue') {
			clearInputs();
			game.running.game = true;
			popUiScreen();
		} else if (action==='Load') {

		} else if (action==='Save') {
			saveGame();
		} else if (action==='Options') {

		} else if (action==='Abort') {
			window.location.reload();
		};
	};

	function dialog(action) {
	};

	dialog.onExit = function() {
		game.running.game = false;
	};
	dialog.prepare = function (player, team, others, graph, node, messageNo) {
		dialog.player = player;
		dialog.team = team;
		dialog.others = others;
		dialog.graph = graph;
		if (dialog.graph == undefined) {
			return false;
		}


		game.running.game = false;
		game.players[game.currentPlayer].velocity.x = 0;
		game.players[game.currentPlayer].velocity.y = 0;

		game.players[game.currentPlayer].position.y = game.players[game.currentPlayer].position.y - 24;

		if (node!==undefined) {
			dialog.node = node;
		} else {
			dialog.node = "start";
		}

		if (messageNo!==undefined && dialog.messages!==undefined && messageNo<dialog.messages.length) {
			dialog.messageNo = messageNo;
		} else {
			dialog.messages = dialog.graph[dialog.node].messages(game, ajuc.facts, player, team, others);
			dialog.messageNo = 0;
		}

		dialog.options = dialog.graph[dialog.node].options(game, ajuc.facts, player, team, others);
		dialog.selectedOption = 0;

		dialog.refresh();
		return true;
	};
	dialog.transitionClassIfExists = function (transition) {
		if (transition["transitionClass"] != undefined) {
			return " " + transition["transitionClass"];
		} else {
			return "";
		}
	};
	dialog.refresh = function () {

		var anyMessages = (dialog.messages != undefined && dialog.messages.length>0);

		if (anyMessages) {
			$("#DialogContent").text(dialog.messages[dialog.messageNo][1]);
		} else {
			$("#DialogContent").text("");
		}

		var xx;
		var yy;

		// TODO fetch proper portrait
		// TODO fetch proper portrait

		if ( (!anyMessages) || dialog.messages[dialog.messageNo][0]!=="player") {
			yy = 0;
		} else {
			yy = 64;
		}
		xx = 0;

		$("#DialogPortraitLeft").css("background-position", "-"+xx+"px -"+yy+"px");

		xx = dialog.others[0]*64; // TODO fetch proper portrait
		if ((!anyMessages) || dialog.messages[dialog.messageNo][0]==="player") {
			yy = 0;
		} else {
			yy = 64;
		}
		$("#DialogPortraitRight").css("background-position", "-"+xx+"px -"+yy+"px");

		// dialog.options[i].text
		// dialog.options[i].action
		// dialog.options[i].transitionTo

		$("#DialogOptions > *").remove();

		if ((!anyMessages) || dialog.messageNo===dialog.messages.length-1) {
			for (var i=0; i<dialog.options.length; i++) {
				$(	"<li>"+
						"<a class=\"HighlightableItem"+dialog.transitionClassIfExists(dialog.options[i])+"\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\""+
						" onClick=\"ajuc.tiledArcade.dialog.signal("+i+");\">"+dialog.options[i].text+"</a>"+
						"</li>"
					).appendTo("#DialogOptions");
			}
		} else {
			$(	"<li>"+
					"<a class=\"HighlightableItem\" onMouseOver=\"ajuc.tiledArcade.setHighlightedItem(this);\""+
					" onClick=\"ajuc.tiledArcade.dialog.nextMessage();\"> [continue] </a>"+
				"</li>"
			).appendTo("#DialogOptions");
		}

		setHighlightedItem($("#DialogOptions > .HighlightableItem :eq(0)").get(0));
	};
	dialog.nextMessage = function () {
		if (dialog.messages!==undefined && dialog.messageNo<dialog.messages.length-1) {
			dialog.messageNo = dialog.messageNo + 1;
			dialog.refresh();
		} else {
			dialog.signal();
		}
		setHighlightedItem(0);
	};
	dialog.signal = function (optionNo) {
		//optionNo
		dialog.selectedOption = optionNo;

		var transition = dialog.options[dialog.selectedOption];
		transition.action();

		dialog.node = transition.transitionTo;

		if ((!game.options.hidePlayerAnswers) && transition.showAnswer) {
			dialog.messages = [["player", transition.text]].concat(dialog.graph[dialog.node].messages(game, ajuc.facts, dialog.player, dialog.team, dialog.others));
		} else {
			dialog.messages = dialog.graph[dialog.node].messages(game, ajuc.facts, dialog.player, dialog.team, dialog.others);
		}
		dialog.messageNo = 0;

		dialog.options = dialog.graph[dialog.node].options(game, ajuc.facts, dialog.player, dialog.team, dialog.others);
		dialog.selectedOption = 0;

		dialog.refresh();
		setHighlightedItem($("#DialogOptions:eq(0)"));
	};



	function activateQuest(game, questName) {
		//TODO
		// instantiate new quest
		var quest = {};//TODO
		//add to active quests
		game.activeQuests[questName] = quest;
	}
	function finishQuest(game, questName) {
		//TODO
		var q = game.activeQuests[questName];
		if (q) {
			delete game.activeQuests[questName];
			game.finishedQuests[questName] = q;
		};
	}
	function failQuest(game, questName) {
		//TODO
	}
	function questActive(game, questName) {
		return game.activeQuests[questName] !== undefined;
	}
	function questFinished(game, questName) {
		return game.finishedQuests[questName] === "success";
	}
	function questFailed(game, questName) {
		return game.failedQuests[questName] === "failure";
	}
	function questInPhase(game, questName, phase) {
		return game.activeQuests[questName] === phase;
	}

	function messages(content) {
		$("#Messages > div").fadeOut("fast", function() {
			$("#Messages > div").empty();
			$("#Messages > div").append(content);
			$("#Messages > div").fadeIn("slow", function() {

			});
		});
	};

	function messagesToSelf(content, important) {
		$("#Messages > div").fadeOut("fast", function() {
			$("#Messages > div").empty();

			$("#Messages > div").append("<div id=\"DialogPortraitMessages\" class=\"PortraitImg Left\"></div>");
			$("#DialogPortraitMessages").css("background-position", "-"+0+"px -"+0+"px");

			$("#Messages > div").append("<div id=\"MessageToSelfContent\" >"+content+"</div>");

			$("#MessageToSelfContent").css("display", "inline-block").css("position", "relative").css("left", "66px").css("color", "black");

			$("#Messages > div").fadeIn("slow", function() {
				if (important) {
					$("#MessageToSelfContent").css("text-decoration", "underline").css("color", "yellow");
				}
			});
		});
	};

	function setQuestGoal(questName, goalName, position, additional ) {
		if (game.questGoals[questName]===undefined) {
			game.questGoals[questName] = {};
		}
		game.questGoals[questName][goalName] = { position: position, additional: additional };
	}
	function removeQuestGoal(questName, goalName) {
		if (game.questGoals[questName]!=undefined) {
			game.questGoals[questName][goalName] = undefined;
			delete game.questGoals[questName][goalName];
		}
	}
	function removeAllQuestGoals(questName) {
		if (game.questGoals[questName]!=undefined) {
			game.questGoals[questName] = undefined;
			delete game.questGoals[questName];
		}
	}
	function removeAllGoals() {
		game.questGoals = {};
	}




	/**
	 *  Returns true if player touches region of map defined as palce with name placeId.
	 */
	function playerInPlace(game, placeId) {
		var playerObj = game.players[game.currentPlayer];
		var placesInBounds = game.level.places.retrieve({
			x: playerObj.position.x-playerObj.size.x/2,
			y: playerObj.position.y-playerObj.size.y/2,
			width: playerObj.size.x,
			height: playerObj.size.y
		});

		var i;
		for (i=0; i<placesInBounds.length; i++) {
			if ((	(playerObj.position.x+playerObj.size.x/2 >= placesInBounds[i].x)&&
					(playerObj.position.y+playerObj.size.y/2 >= placesInBounds[i].y)&&
					(playerObj.position.x-playerObj.size.x/2 <= placesInBounds[i].x+placesInBounds[i].width)&&
					(playerObj.position.y-playerObj.size.y/2 <= placesInBounds[i].y+placesInBounds[i].height)
				) &&
				(placeId === placesInBounds[i].placeId)) {
				//alert("playerInPlace: " + placeId);
				return true;
			}
		}
		return false;
	}

	/**
	 * Iterate throught all objects, call action(object) for each object for which condition(object) returns true.
	 *
	 * Additional arguments pass in closure (for example if game is in scope where you create the functions for condition and action -
	 * you can use game from these functions, without passing it as additional parameters).
	 *
	 *
	 */
	function updateObjectsWhere(game, condition, action) {
		var i = 0;
		var len = game.objects.length;
		var obj = undefined;
		for (i=0; i<len; i++) {
			obj = game.objects[i];
			if (obj && condition(obj)) {
				action(obj);
			}
		}
	}

	/**
	 *
	 *
	 */
	function countObjectsWhere(game, condition) {
		var i = 0;
		var len = game.objects.length;
		var obj = undefined;
		var counter = 0;
		for (i=0; i<len; i++) {
			obj = game.objects[i];
			if (obj && condition(obj)) {
				counter ++;
			}
		}

		return counter;
	}

	//TODO more functions to add

	return {
		version : version,
		init : init,
		getGame : getGame,

		cameraFromObject : cameraFromObject,

		setHighlightedItem : setHighlightedItem,
		getHighlightedItem : getHighlightedItem,

		getNextRelationId : getNextRelationId,
		addRelation : addRelation,
		removeRelation : removeRelation,
		removeRelationWhere : removeRelationWhere,
		updateRelationDataWhere : updateRelationDataWhere,
		countRelationsWhere : countRelationsWhere,

		mainMenu : mainMenu,
		help : help,
		debug : debug,

		messages : messages,
		messagesToSelf : messagesToSelf,

		setQuestGoal : setQuestGoal,
		removeQuestGoal : removeQuestGoal,
		removeAllQuestGoals : removeAllQuestGoals,


		inGameMenu : inGameMenu,

		playerInPlace : playerInPlace,

		updateObjectsWhere : updateObjectsWhere,
		countObjectsWhere : countObjectsWhere,

/*		insertEngineInfo : insertEngineInfo,
		insertPowerGeneratorInfo : insertPowerGeneratorInfo,
		insertShieldInfo : insertShieldInfo,
		insertToolInfo : insertToolInfo,*/

		shop : shop,
		fuelStation : fuelStation,

		dialog : dialog,

		infoOK : infoOK,
		question : question,
		choose : choose,
		numberInput : numberInput,

		activateQuest : activateQuest,
		finishQuest : finishQuest,
		failQuest : failQuest,
		questActive : questActive,
		questFinished : questFinished,
		questFailed : questFailed,
		questInPhase : questInPhase


	};
})(ajuc.utils, ajuc.lzw, ajuc.makeClass, ajuc.enums, ajuc.hierarchy);