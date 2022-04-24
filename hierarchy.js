(function() {
  'use strict';

  var _global = (0, eval)('this');

  if (!_global.ajuc) {
    _global.ajuc = {};
  }
})();

ajuc.hierarchy = (function(enums, utils, stats) {

	function version() {
		return 0.01;
	}

	var registerConstructor;
	var changePrototype;
	var prototypize;
	{
		var constructors = {}; // hidden register of all the constructors
		registerConstructor = function(fun) {
			constructors[new fun().type] = fun;
			// alert(constructors);
		};
		changePrototype = function(obj, newType) {
			return $.extend(true, new (constructors[newType])(), obj);
		};
		prototypize = function(obj) {
			return changePrototype(obj, obj.type);
		};
	}

	function createType(initFn, extended) {
		if (extended !== undefined) {
			initFn.prototype = new extended();
		}
		registerConstructor(initFn);

		return initFn;
	}

	function serializeArrayOfTypedObjects(arr) {
		return JSON.stringify(arr);
	}
	function deserializeToArrayOfTypedObjects(serialized) {
		var deserialized = JSON.parse(serialized);
		var i;
		var n = deserialized.length;

		for (i = 0; i < n; i++) {
			deserialized[i] = prototypize(deserialized[i]);
		}
		return deserialized;
	}

	function setIdAndType(into, id, type) {
		into.id = id;
		into.type = type;
		into.destroyMe = false;
		into.enabled = true;
	}
	function setPhysicalState(into) {
		into.oldPosition = {
			x : 0.0,
			y : 0.0
		};
		into.position = {
			x : 0.0,
			y : 0.0
		};
		into.z = 0;
		into.velocity = {
			x : 0.0,
			y : 0.0
		};
		into.size = {
			x : 36.0,
			y : 36.0
		};
		into.rotation = -3.14 * 0.5;
		into.spriteRotation = into.rotation;
		into.angularVelocity = 0.0;
		into.mass = 1.0;
		into.drag = 0.01;
		into.temperature = 20.0;
		into.voltage = 0.0;
		into.relations = []; // one relation { relationId: 999, relationKind: "kind", relationStrength: 100.0 }
	}
	function setToolUserState(into) {
		into.spriteNo = 0;

		into.rotationEngine = undefined;
		into.shield = undefined;
		into.powerGenerator = undefined;
		into.tools = [];
		into.currentTool = undefined;
		into.framesTillCurrentToolIsReady = 0;

		into.fuel = 100;
		into.maxFuel = 100;
		into.energy = 100;
		into.maxEnergy = 100;
		into.health = 100;
		into.maxHealth = 100;

		into.ammo = [ 0, 0, 0, 0, //3
		              0, 0, 0, 0,
		              0, 0, 0, 0,
		              0, 0, 0, 0, //15

		              0, 0, 0, 0, //19
		              0, 0, 0, 0, //23
		              0, 0, 0, 0, //27
		              0, 0, 0 ,0, //31

		              0, 0, 0, 0, //35
		              0, 0, 0, 0,
		              0, 0, 0, 0,
		              0, 0, 0, 0, //47

		              0, 0, 0, 0, //51
		              0, 0, 0, 0,
		              0, 0, 0, 0,
		              0, 0, 0, 0, //63

		              0, 0 ];
	}
	function setShipState(into) {
		into.mainEngine = undefined;
		into.mass = 20.0;
		into.money = 0;
	}
	function setEnemyShipState(into) {
		into.enemy = true;
		into.nextFrameToRun = 0;
	}
	function setTurretState(into) {
		// TODO
		into.mass = 100.0;
	}
	function setEnemyTurretState(into) {
		into.enemy = true;
		into.nextFrameToRun = 0;
	}
	function setVehicleState(into) {
		// TODO
	}
	function setEnemyVehicleState(into) {
		into.enemy = true;
		into.nextFrameToRun = 0;
	}
	function setPersonState(into) {
		// TODO
	}
	function setEnemyPersonState(into) {
		into.enemy = true;
		into.nextFrameToRun = 0;
	}
	var TypedObject = createType(function TypedObject(id) {
		setIdAndType(this, id, "TypedObject");
	});

	var Action = createType(function Action(id) {
		setIdAndType(this, id, "Action");
	});

	var TurnLeft = createType(function TurnLeft(id) {
		setIdAndType(this, id, "TurnLeft");
	}, Action);
	var TurnRight = createType(function TurnRight(id) {
		setIdAndType(this, id, "TurnRight");
	}, Action);
	var Thrust = createType(function Thrust(id) {
		setIdAndType(this, id, "Thrust");
	}, Action);
	var Use = createType(function Use(id) {
		setIdAndType(this, id, "Use");
	}, Action);
	var AlternateUse = createType(function AlternateUse(id) {
		setIdAndType(this, id, "AlternateUse");
	}, Action);
	var NextTool = createType(function NextTool(id) {
		setIdAndType(this, id, "NextTool");
	}, Action);
	var PreviousTool = createType(function PreviousTool(id) {
		setIdAndType(this, id, "PreviousTool");
	}, Action);

	var Entity = createType(function Entity(id) {
		setIdAndType(this, id, "Entity");
		setPhysicalState(this);
	}, TypedObject);

	// implementations for methods
	Entity.prototype.needsRotation = function() {
		return false;
	};
	Entity.prototype.move = function(game) {
		if (this.movable) {
			this.oldPosition.x = this.position.x;
			this.oldPosition.y = this.position.y;

			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;

			this.rotation += this.angularVelocity;

			this.velocity.x += this.drag * game.physicalConstants.air.gravity.x;
			this.velocity.y += this.drag * game.physicalConstants.air.gravity.y;

			this.angularVelocity *= (1.0 - this.drag
					* game.physicalConstants.air.drag);
			this.velocity.x *= (1.0 - this.drag * game.physicalConstants.air.drag);
			this.velocity.y *= (1.0 - this.drag * game.physicalConstants.air.drag);
		} else {

		}

		/*
		 * TODO TOTHINK - do we need this it could allow for a nice mechanic for
		 * cooling your ship after heavy shooting with going to the water and
		 * could be useful during collision reaction with laser of flamethrower
		 * but at what performance cost this.temperature = (
		 * this.temperature*this.mass +
		 * game.physicalConstants.air.temperature*game.physicalConstants.air.thermalConductivity ) /
		 * (2.0*this.mass); //TODO correct the equation
		 */
	};

	Entity.prototype.onCollisionWithObject = function(game, collider) {
		// TODO
		if (!(collider instanceof Exhaust)
				&& !(collider instanceof Bullet && this instanceof Bullet)) {
			this.destroyMe = true;
		}
	};
	Entity.prototype.onCollisionWithWall = function(game, tileCoordinatesArray) {
		// TODO
	};

	function removeFromRelations(game, object) {
		var i=0;
		if (object.relations !== undefined) {
			for (i in object.relations) {
				ajuc.tiledArcade.removeRelation(object.relations[i].relationId);
			}
		}
	}

	Entity.prototype.onDestroy = function(game) {
		// TODO
		removeFromRelations(game, this);
	};

	function calculateMomenta(game, o1, o2, dx, dy, d2, r1, r2) {
		var d = Math.sqrt(d2);
		var R = (r1+r2);
		var vx = o2.velocity.x-o1.velocity.x;
		var vy = o2.velocity.y-o1.velocity.y;
		var v = Math.sqrt(vx*vx+vy*vy);
		var Px=(o2.velocity.x-o1.velocity.x)*o2.mass;
		var Py=(o2.velocity.y-o1.velocity.y)*o1.mass;
		var p = Math.sqrt(Px*Px+Py*Py);
		var Dx = -dx;
		var Dy = -dy;
		var dR = R-d;
		var cosalpha = (Px*Dx+Py*Dy)/(d*p);
		var dp = p*2.0*cosalpha*o1.mass/(o1.mass+o2.mass);
		var dp_st = v*cosalpha;
		var DPx = dp*Dx/d;
		var DPy = dp*Dy/d;

		if (o2.movable) {
			if (o1.movable) {
				o2.velocity.x -= DPx/o2.mass;
				o2.velocity.y -= DPy/o2.mass;
				o1.velocity.x += DPx/o1.mass;
				o1.velocity.y += DPy/o1.mass;
			} else {
				o2.velocity.x -= dp_st * Dx/d;
				o2.velocity.y -= dp_st * Dy/d;
			}
		} else {
			if (o1.movable) {
				o1.velocity.x += dp_st * Dx/d;
				o1.velocity.y += dp_st * Dy/d;
			} else {
				//WTF?
				//do nothing
			}
		}
		// o1.velocity.x -= (dx / d) * o2.mass / o1.mass;
		// o1.velocity.y -= (dy / d) * o2.mass / o1.mass;
		// o2.velocity.x += (dx / d) * o1.mass / o2.mass;
		// o2.velocity.y += (dy / d) * o1.mass / o2.mass;
		o1.onCollisionWithObject(game, o2);
		o2.onCollisionWithObject(game, o1);

		var cx = (o1.position.x+o2.position.x)/2;
		var cy = (o1.position.y+o2.position.y)/2;

		if (o1.movable) {
			o1.position.x -= (cx-o1.position.x)*0.2;
			o1.position.y -= (cy-o1.position.y)*0.2;
		}
		if (o2.movable) {
			o2.position.x -= (cx-o2.position.x)*0.9;
			o2.position.y -= (cy-o2.position.y)*0.9;
		}
	}

	Entity.prototype.collideWithObjects = function(game) {
		var i, dx, dy, d2, r1, r2;
		for (i = game.objects.length - 1; i >= 0; i--) {
			if (game.objects[i] !== this) {
				if (game.objects[i].id === this.parentId
						|| game.objects[i].parentId === this.id
						|| (game.objects[i].parentId !== undefined && game.objects[i].parentId === this.parentId)) {
					continue;
				}
				// alert("1");
				dx = game.objects[i].position.x - this.position.x;
				dy = game.objects[i].position.y - this.position.y;
				d2 = dx * dx + dy * dy;

				r1 = (game.objects[i].size.x + game.objects[i].size.y) * 0.25;
				r2 = (this.size.x + this.size.y) * 0.25;

				if (d2 < (r1 + r2)*(r1 + r2)) {
					if (d2 > 0.000001) {
						// alert("AAA");
						calculateMomenta(game, this, game.objects[i], dx, dy, d2, r1, r2);
					}
					;
				}
				;
			} else {
				break; // to skip checking collisions both ways
			}
		}
	};

	Entity.prototype.collideWithLevelRelative = function(game, relativeX,
			relativeY, results) {
		var epsilon = 0.0000001;
		var level = game.level;

		var x = this.position.x + relativeX;
		var y = this.position.y + relativeY;
		var nx = this.position.x + this.velocity.x + relativeX;
		var ny = this.position.y + this.velocity.y + relativeY;

		var oldGridCoord = utils.gridCoordsFromPoint( {
			x : x,
			y : y
		}, level);
		var newGridCoord = utils.gridCoordsFromPoint( {
			x : nx,
			y : ny
		}, level);

		var oldTile = utils.tileAtGridCoord(oldGridCoord, level, -1);
		var newTile = utils.tileAtGridCoord(newGridCoord, level, -1);

		var oldGridSolid = utils.tileAtGridCoordSolid(game, oldGridCoord,
				level, -1);

		results.previousCollision = results.previousCollision || oldGridSolid;
		if (utils.tileAtGridCoordSolid(game, {
			x : newGridCoord.x,
			y : oldGridCoord.y
		}, level, -1) && !oldGridSolid) {
			results.newXCollision = true;
			results.collisionNow = true;
		}
		;
		if (utils.tileAtGridCoordSolid(game, {
			x : oldGridCoord.x,
			y : newGridCoord.y
		}, level, -1) && !oldGridSolid) {
			results.newYCollision = true;
			results.collisionNow = true;
		}
		;
		if (utils.tileAtGridCoordSolid(game, newGridCoord, level, -1)
				&& !oldGridSolid) {
			results.newCollision = true;
			results.collisionNow = true;
		}
		;
		if (results.collisionNow) {
			results.collisionCoords.push(newGridCoord);
		}
		return results;
	};

	Entity.prototype.collideWithLevel = function(game) {
		var epsilon = 0.0000001;
		var level = game.level;
		var oldGridCoord = utils.gridCoordsFromPoint(this.oldPosition, level);
		var oldGridIndex = utils.indexFromGridCoord(oldGridCoord, level);
		var newGridCoord = utils.gridCoordsFromPoint(this.position, level);

		var results = {
			collisionNow : false,
			newCollision : false,
			newXCollision : false,
			newYCollision : false,
			previousCollision : false,
			collisionCoords : []
		};

		// results = this.collideWithLevelRelative(game, 0, 0, results);

		results.collisionNow = false;
		var responseX = 0.0;
		var responseY = 0.0;

		var i = 0;
		var precision = 5;
		for (i = 0; i < precision; i++) {

			var alpha = i * 2.0 * 3.14 / precision;
			var relativeX = (this.size.x + this.size.y) * 0.25
					* Math.cos(alpha);
			var relativeY = (this.size.x + this.size.y) * 0.25
					* Math.sin(alpha);

			results = this.collideWithLevelRelative(game, relativeX, relativeY,
					results);

			// if (results.collisionNow) {
			// responseX -= (this.size.x + this.size.y) * 0.25 *
			// Math.cos(alpha);
			// responseY -= (this.size.x + this.size.y) * 0.25 *
			// Math.sin(alpha);
			// };
		}

		if (!results.previousCollision) {
			var someCollision = false;
			if (results.newXCollision) {
				this.velocity.x *= -0.2;
				this.velocity.y *= 0.9;
				someCollision = true;
			}
			;
			if (results.newYCollision) {
				this.velocity.x *= 0.9;
				this.velocity.y *= -0.2;
				someCollision = true;
			}
			;
			if (someCollision) {
				this.onCollisionWithWall(game, results.collisionCoords);
			}
		}
	};

	Entity.prototype.updateTimeToLive = function(game) {
		if (this.timeToLive !== undefined && this.timeToLive !== null) {
			if (this.timeToLive > 0) {
				this.timeToLive--;
			} else {
				this.destroyMe = true;
			}
		}
	};
	Entity.prototype.updateSpriteRotation = function(game) {
		this.spriteRotation = this.rotation;
	};

	Entity.prototype.update = function(game) {
		if (!this.enabled) {
			return;
		}

		this.updateTimeToLive();
		this.updateSpriteRotation(game);
		// alert("Entity.update");
	};

	var AmmoBox = createType(function AmmoBox(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "AmmoBox");
			setPhysicalState(this);
			this.spriteNo = 36;
			this.bulletType = undefined;
			this.quantity = undefined;
		}, Entity);

	var RepairBox = createType(function RepairBox(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "RepairBox");
			setPhysicalState(this);
			this.spriteNo = 35;
			this.quantity = undefined;
		}, Entity);

	var Money = createType(function Money(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "Money");
			setPhysicalState(this);
			this.spriteNo = 38;
			this.quantity = undefined;
		}, Entity);

	var FuelContainer = createType(function FuelContainer(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "FuelContainer");
			setPhysicalState(this);
			this.spriteNo = 39;
			this.quantity = undefined;
		}, Entity);

	var ToolUser = createType(function ToolUser(id) {
		setIdAndType(this, id, "ToolUser");
		setPhysicalState(this);
		setToolUserState(this);
	}, Entity);

	var Ship = createType(function Ship(id) {
		setIdAndType(this, id, "Ship");
		setPhysicalState(this);
		setToolUserState(this);
		setShipState(this);
	}, ToolUser);
	Ship.prototype.needsRotation = function() {
		return true;
	}

	Ship.prototype.onCollisionWithWall = function(game, tileCoordinatesArray) {
		// TODO
	};

	function calculateHealthCost(game, object, collider) {
		var cost = 0;
		var tmpDefence = 0;


		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].projectileDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].projectileDamage-tmpDefence, 0, 0, 10000000);

		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].cumulativeDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].cumulativeDamage-tmpDefence, 0, 0, 10000000);

		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].explosiveDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].explosiveDamage-tmpDefence, 0, 0, 10000000);

		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].laserDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].laserDamage-tmpDefence, 0, 0, 10000000);

		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].electricalDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].electricalDamage-tmpDefence, 0, 0, 10000000);

		tmpDefence = (object.shield !== undefined)?(stats.shields[object.shield].thermalDamageReduction):0;
		cost += utils.nvlMinMax(stats.bullets[collider.bulletType].thermalDamage-tmpDefence, 0, 0, 10000000);

		// alert(
			// "object.shield="+object.shield+
			// ", collider.bulletType="+collider.bulletType+
			// ", bullet name "+stats.bullets[collider.bulletType].name+
			// ", bullet projectileDamage "+stats.bullets[collider.bulletType].projectileDamage+
			// ", bullet cumulativeDamage "+stats.bullets[collider.bulletType].cumulativeDamage+
			// ", bullet explosiveDamage "+stats.bullets[collider.bulletType].explosiveDamage+
			// ", bullet laserDamage "+stats.bullets[collider.bulletType].laserDamage+
			// ", bullet electricalDamage "+stats.bullets[collider.bulletType].electricalDamage+
			// ", bullet thermalDamage "+stats.bullets[collider.bulletType].thermalDamage+
			// ", tmpDefence "+tmpDefence+

			// ", cost = "+(cost)
		// );

		return cost * 0.01;
	}

	ToolUser.prototype.onCollisionWithObject = function(game, collider) {
		// TODO
		var healthCost = 0;

		if (collider instanceof Bullet) {
			// alert(collider.bulletType);
			// alert(stats.bullets[collider.bulletType]);
			healthCost = calculateHealthCost(game, this, collider);
		}

		if (collider instanceof RepairBox) {
			// alert(collider.bulletType);
			// alert(stats.bullets[collider.bulletType]);
			healthCost = -collider.quantity;
		}

		if (collider instanceof AmmoBox) {
			// alert(collider.bulletType);
			// alert(stats.bullets[collider.bulletType]);
			this.ammo[collider.bulletType] += collider.quantity;
		}

		if (collider instanceof Money) {
			// alert(collider.bulletType);
			// alert(stats.bullets[collider.bulletType]);
			this.money += collider.quantity;
		}

		if (this.hasHealth(healthCost)) {
			this.useHealth(healthCost);
		} else {
			this.health = 0;
			this.destroyMe = true;
		}
	};

	ToolUser.prototype.onDestroy = function(game) {

		removeFromRelations(game, this);

		var delta = utils.velocityFromPolar(this.rotation
				+ (Math.random() - 0.5) * 6.28, 1);
		var item;
		var tmpRand = 10*Math.random();
		if (tmpRand < 2) {
			item= new AmmoBox(game.objects.length);
			item.bulletType = 0;
			item.quantity = Math.max.apply(null, this.ammo);
		} else if (tmpRand < 5) {
			item= new FuelContainer(game.objects.length);
			item.quantity = 10;
		} else if (tmpRand < 7) {
			item= new RepairBox(game.objects.length);
			item.quantity = 15;
		} else if (tmpRand < 10) {
			item= new Money(game.objects.length);
			item.quantity = Math.round(50+(Math.random())*200);
		}
		item.position = {
			x : this.position.x,
			y : this.position.y
		};
		item.velocity = {
			x : this.velocity.x + delta.x,
			y : this.velocity.y + delta.y
		};
		item.size.x = 32;
		item.size.y = 32;

		item.parentId = this.id;
		game.objects.push(item);
		// alert("onDestroy");

	};

	ToolUser.prototype.setFramesTillCurrentToolIsReady = function(value) {
		this.framesTillCurrentToolIsReady = value;
	};
	ToolUser.prototype.getFramesTillCurrentToolIsReady = function() {
		return this.framesTillCurrentToolIsReady;
	};

	ToolUser.prototype.updateFramesTillCurrentToolIsReady = function(game) {
		if (this.framesTillCurrentToolIsReady > 0) {
			this.framesTillCurrentToolIsReady--;
		}
	};

	ToolUser.prototype.updateQuantities = function(game) {
		if (this.powerGenerator !== undefined && this.powerGenerator>=0) {
			//kWPerVelocityPerFrame //kWPerFrame //fuelConsumption
			var speed = Math.sqrt(this.velocity.x*this.velocity.x + this.velocity.y*this.velocity.y);
			if (stats.powerGenerators[this.powerGenerator].kWPerVelocityPerFrame * speed <= 0.01) {
				speed = 0;
			}
			if ((stats.powerGenerators[this.powerGenerator].fuelConsumption === undefined) ||
				(stats.powerGenerators[this.powerGenerator].fuelConsumption <= 0) ||
				(this.fuel >= stats.powerGenerators[this.powerGenerator].fuelConsumption)) {

				this.fuel -= stats.powerGenerators[this.powerGenerator].fuelConsumption;
				this.energy += stats.powerGenerators[this.powerGenerator].kWPerVelocityPerFrame * speed;
				this.energy += stats.powerGenerators[this.powerGenerator].kWPerFrame;
			}
		}

		if (this.tools !== undefined &&
			this.tools.length>0 &&
			this.currentTool !== undefined &&
			this.tools[this.currentTool] !== undefined &&
			stats.tools[this.tools[this.currentTool]].bulletType !== undefined
		) {
			if (this.ammo[stats.tools[this.tools[this.currentTool]].bulletType] >
			stats.bullets[stats.tools[this.tools[this.currentTool]].bulletType].maxAmmo
			) {

				this.ammo[stats.tools[this.tools[this.currentTool]].bulletType] =
					stats.bullets[stats.tools[this.tools[this.currentTool]].bulletType].maxAmmo;
			}
		}

		if (this.health > this.maxHealth) {
			this.health=this.maxHealth;
		}
		if (this.energy > this.maxEnergy) {
			this.energy=this.maxEnergy;
		}
		if (this.fuel > this.maxFuel) {
			this.fuel=this.maxFuel;
		}
	};

	ToolUser.prototype.update = function(game) {
		if (!this.enabled) {
			return;
		}

		this.updateTimeToLive(game);
		this.updateFramesTillCurrentToolIsReady(game);
		this.updateSpriteRotation(game);
		this.updateQuantities(game);
		// alert("Ship.update");
	};

	ToolUser.prototype.hasFuel = function(howMuch) {
		return this.fuel >= howMuch;
	};

	ToolUser.prototype.hasMoney = function(howMuch) {
		return this.money >= howMuch;
	};

	ToolUser.prototype.hasEnergy = function(howMuch) {
		return this.energy >= howMuch;
	};

	ToolUser.prototype.hasHealth = function(howMuch) {
		// alert("hasHealth - health = " + this.health + ", howMuch = " +
		// howMuch);
		return this.health >= howMuch;
	};

	ToolUser.prototype.hasAmmo = function(howMuch, bulletType) {
		return bulletType === undefined
				|| howMuch === undefined
				|| (this.ammo && this.ammo[bulletType] && this.ammo[bulletType] >= howMuch);
	};

	ToolUser.prototype.useFuel = function(howMuch) {
		this.fuel -= howMuch;
	};

	ToolUser.prototype.useMoney = function(howMuch) {
		this.money -= howMuch;
	};

	ToolUser.prototype.useEnergy = function(howMuch) {
		this.energy -= howMuch;
	};

	ToolUser.prototype.useHealth = function(howMuch) {
		this.health -= howMuch;
	};

	ToolUser.prototype.useAmmo = function(howMuch, bulletType) {
		if (bulletType !== undefined && howMuch !== undefined) {
			if (this.ammo && this.ammo[bulletType]) {
				this.ammo[bulletType] -= howMuch;
			}
		}
	};

	Ship.prototype.thrust = function(game, actions) {
		if (this.mainEngine !== undefined && this.mainEngine > -1) {

			var fuelConsumption = stats.engines[this.mainEngine].fuelConsumption;
			var energyConsumption = stats.engines[this.mainEngine].energyConsumption;

			if (this.hasFuel(fuelConsumption) && this.hasEnergy(energyConsumption)) {

				this.useFuel(fuelConsumption);
				this.useEnergy(energyConsumption);

				var delta = utils.velocityFromPolar(this.rotation,
						stats.engines[this.mainEngine].power);

				this.velocity.x += delta.x;
				this.velocity.y += delta.y;

				if ((this.id+game.currentFrame)%5==0) {
					var exhaust = new Exhaust(game.objects.length);
					exhaust.position = {
						x : this.position.x - Math.cos(this.rotation)*(this.size.x+this.size.y)*0.4,
						y : this.position.y - Math.sin(this.rotation)*(this.size.x+this.size.y)*0.4
					};
					exhaust.velocity = {
						x : this.velocity.x - delta.x,
						y : this.velocity.y - delta.y
					};
					exhaust.size.x = 16;
					exhaust.size.y = 16;
					exhaust.timeToLive = 4;

					exhaust.parentId = this.id;
					game.objects.push(exhaust);
				}
			}
		}
	};


	ToolUser.prototype.alternateUse = function(game, actions) {
		if (this.tools != undefined
				&& this.tools.length > 0
				&& this.currentTool != undefined
				&& this.currentTool >= 0
				&& this.currentTool < this.tools.length
				&& stats.tools[this.tools[this.currentTool]].alternateUseAction !== undefined
				&& stats.tools[this.tools[this.currentTool]].alternateUsePossible !== undefined
				&& stats.tools[this.tools[this.currentTool]].alternateUsePossible(this, game, actions)
		) {

			var tool = stats.tools[this.tools[this.currentTool]];

			if (stats.tools[this.tools[this.currentTool]].alternateUseAction !== undefined) {
				// function (game, shootingObj)
				stats.tools[this.tools[this.currentTool]].alternateUseAction(game, this);
			}
		}
	};

	ToolUser.prototype.use = function(game, actions) {
		if (this.tools != undefined
				&& this.tools.length > 0
				&& this.currentTool != undefined
				&& this.currentTool >= 0
				&& this.currentTool < this.tools.length
				&& this.getFramesTillCurrentToolIsReady() <= 0 // really it
																// shouldn't be
																// less than 0,
																// but who knows

				&& this
						.hasFuel(stats.tools[this.tools[this.currentTool]].fuelConsumption)
				&& this
						.hasEnergy(stats.tools[this.tools[this.currentTool]].energyConsumption)
				&& this
						.hasHealth(stats.tools[this.tools[this.currentTool]].healthConsumption)
				&& this
						.hasAmmo(
								stats.tools[this.tools[this.currentTool]].bulletConsumption,
								stats.tools[this.tools[this.currentTool]].bulletType)) {

			var tool = stats.tools[this.tools[this.currentTool]];
			var newBullets = [];

			if (tool.bulletsInShotType != undefined && tool.bulletsInShot > 0) {
				var i = 0;
				for (i = 0; i < tool.bulletsInShot; i++) {
					var delta = utils.velocityFromPolar(this.rotation
							+ (Math.random() - 0.5) * tool.bulletSpread,
							tool.velocity);
					var bullet = new Bullet(game.objects.length);
					bullet.bulletType = tool.bulletType | 0;
					bullet.position = {
						x : this.position.x,
						y : this.position.y
					};
					bullet.velocity = {
						x : this.velocity.x + delta.x,
						y : this.velocity.y + delta.y
					};

					bullet.movable = true; //always ?

					bullet.size.x = stats.bullets[tool.bulletsInShotType].size.x;
					bullet.size.y = stats.bullets[tool.bulletsInShotType].size.y;
					bullet.timeToLive = stats.bullets[tool.bulletsInShotType].timeToLive | 0;
					bullet.mass = stats.bullets[tool.bulletsInShotType].mass;
					bullet.rotation = this.rotation;

					bullet.spriteNo = stats.bullets[tool.bulletsInShotType].spriteNo | 0;
					bullet.parentId = this.id | 0;
					game.objects.push(bullet);
					newBullets.push(bullet);
				}
			}

			this
					.useFuel(stats.tools[this.tools[this.currentTool]].fuelConsumption);
			this
					.useEnergy(stats.tools[this.tools[this.currentTool]].energyConsumption);
			this
					.useHealth(stats.tools[this.tools[this.currentTool]].healthConsumption);
			this
					.useAmmo(
							stats.tools[this.tools[this.currentTool]].bulletConsumption,
							stats.tools[this.tools[this.currentTool]].bulletType);

			this.setFramesTillCurrentToolIsReady(tool.delayBetweenShots);

			if (stats.tools[this.tools[this.currentTool]].shootAdditionalAction !== undefined) {
				// function (game, shootingObj, newBullets)
				stats.tools[this.tools[this.currentTool]].shootAdditionalAction(game, this, newBullets);
			}
		}
	};
	ToolUser.prototype.nextTool = function(game, actions) {
		if (this.tools != undefined && this.tools.length > 0) {
			if (this.currentTool == undefined) {
				this.currentTool = 0;
			} else {
				this.currentTool = this.currentTool + 1;
				if (this.currentTool >= this.tools.length) {
					this.currentTool = 0;
				}
			}
		} else {
			this.currentTool = undefined;
		}
	};
	ToolUser.prototype.previousTool = function(game, actions) {
		if (this.tools != undefined && this.tools.length > 0) {
			if (this.currentTool == undefined) {
				this.currentTool = 0;
			} else {
				this.currentTool = this.currentTool - 1;
				if (this.currentTool < 0) {
					this.currentTool = this.tools.length - 1;
				}
			}
		} else {
			this.currentTool = undefined;
		}
	};
	ToolUser.prototype.turnLeft = function(game, actions) {
		if (this.rotationEngine !== undefined && this.rotationEngine > -1) {

			var fuelConsumption = stats.engines[this.rotationEngine].fuelConsumption;
			var energyConsumption = stats.engines[this.rotationEngine].energyConsumption;

			if (this.hasFuel(fuelConsumption) && this.hasEnergy(energyConsumption)) {

				this.useFuel(fuelConsumption);
				this.useEnergy(energyConsumption);

				var delta = utils.velocityFromPolar(this.rotation-Math.PI/2,
						stats.engines[this.mainEngine].power);

				this.rotation -= stats.engines[this.rotationEngine].power / 2;
				if (!(this instanceof Turret)) {
					if ((this.id+game.currentFrame)%5==0) {
					var exhaust = new Exhaust(game.objects.length);
						exhaust.position = {
							x : this.position.x - Math.cos(this.rotation-Math.PI/2)*(this.size.x+this.size.y)*0.1
												- Math.cos(this.rotation)*(this.size.x+this.size.y)*0.4,
							y : this.position.y - Math.sin(this.rotation-Math.PI/2)*(this.size.x+this.size.y)*0.1
												- Math.sin(this.rotation)*(this.size.x+this.size.y)*0.4
						};
						exhaust.velocity = {
							x : this.velocity.x - delta.x,
							y : this.velocity.y - delta.y
						};
						exhaust.size.x = 8;
						exhaust.size.y = 8;
						exhaust.timeToLive = 3;

						exhaust.parentId = this.id;
						game.objects.push(exhaust);
					}
				}
			}
		}
	};
	ToolUser.prototype.turnRight = function(game, actions) {
		if (this.rotationEngine !== undefined && this.rotationEngine > -1) {

			var fuelConsumption = stats.engines[this.rotationEngine].fuelConsumption;
			var energyConsumption = stats.engines[this.rotationEngine].energyConsumption;

			if (this.hasFuel(fuelConsumption) && this.hasEnergy(energyConsumption)) {

				this.useFuel(fuelConsumption);
				this.useEnergy(energyConsumption);

				var delta = utils.velocityFromPolar(this.rotation+Math.PI/2,
						stats.engines[this.mainEngine].power);

				this.rotation += stats.engines[this.rotationEngine].power / 2;
				if (!(this instanceof Turret)) {
					if ((this.id+game.currentFrame)%5==0) {
						var exhaust = new Exhaust(game.objects.length);
						exhaust.position = {
							x : this.position.x - Math.cos(this.rotation+Math.PI/2)*(this.size.x+this.size.y)*0.1
												- Math.cos(this.rotation)*(this.size.x+this.size.y)*0.4,
							y : this.position.y - Math.sin(this.rotation+Math.PI/2)*(this.size.x+this.size.y)*0.1
												- Math.sin(this.rotation)*(this.size.x+this.size.y)*0.4
						};
						exhaust.velocity = {
							x : this.velocity.x - delta.x,
							y : this.velocity.y - delta.y
						};
						exhaust.size.x = 8;
						exhaust.size.y = 8;
						exhaust.timeToLive = 3;

						exhaust.parentId = this.id;
						game.objects.push(exhaust);
					}
				}
			}
		}
	};

	ToolUser.prototype.rotateTowards = function(game, targetRotation) {

		var minAngle = targetRotation - this.rotation;
		while (minAngle < -Math.PI) {
			minAngle += 2 * Math.PI;
		}
		while (minAngle > Math.PI) {
			minAngle -= 2 * Math.PI;
		}
		if (minAngle > 8 * Math.PI / 180 && minAngle < Math.PI) {
			this.turnRight(game);
		} else if (minAngle < -8 * Math.PI / 180 || minAngle > Math.PI) {
			this.turnLeft(game);
		} else {
			return true; // direction is +- good
		}
		return false; // not good direction yet
	};

	var EnemyShip = createType(function EnemyShip(id) {
		setIdAndType(this, id, "EnemyShip");
		setPhysicalState(this);
		setToolUserState(this);
		setShipState(this);
		setEnemyShipState(this);
	}, Ship);

	EnemyShip.prototype.aiScript = function(game) {

		// TODO - maybe more clever target aquisition
		var target = game.players[game.currentPlayer];

		var d2 = utils.distance2(this.position, target.position);

		this.rotation = (this.rotation + 2 * Math.PI) % (2 * Math.PI);

		if (d2 > 700 * 700) {
			// sleep
			this.rotateTowards(game, -Math.PI * 0.5);
			if (this.velocity.y > 0) {
				this.thrust(game, []);
			}
		} else {
			var dx = target.position.x - this.position.x;
			var dy = target.position.y - this.position.y;

			var velocity = Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y);

			var thrustVector = utils.velocityFromPolar(this.rotation,
					stats.engines[this.mainEngine].power);
			var nx = this.velocity.x+thrustVector.x;
			var ny = this.velocity.x+thrustVector.x;
			var velocityAfter = Math.sqrt(nx*nx+ny*ny);

			if (this.rotateTowards(game, Math.atan2(dy, dx))) {
				if (d2 > 120 * 120 && !(velocityAfter>velocity && velocity>1)) {
					this.thrust(game, []);
				}
				this.use(game, []);
			}
		}

		return game.currentFrame + 1;
	};

	var Turret = createType(function Turret(id) {
		setIdAndType(this, id, "Turret");
		setPhysicalState(this);
		setToolUserState(this);
		setTurretState(this);
		this.spriteNo = 21;
	}, ToolUser);
	Turret.prototype.updateSpriteRotation = function(game) {
	}
	var EnemyTurret = createType(function EnemyTurret(id) {
		setIdAndType(this, id, "EnemyTurret");
		setPhysicalState(this);
		setToolUserState(this);
		setTurretState(this);
		setEnemyTurretState(this);
		this.spriteNo = 21;
	}, Turret);
	EnemyTurret.prototype.aiScript = function(game) {
		var target = game.players[game.currentPlayer];

		var d2 = utils.distance2(this.position, target.position);

		this.rotation = (this.rotation + 2 * Math.PI) % (2 * Math.PI);

		if (d2 > 600 * 600) {
			// sleep
			this.rotateTowards(game, -Math.PI * 0.5);
		} else {
			var dx = target.position.x - this.position.x;
			var dy = target.position.y - this.position.y;

			if (this.rotateTowards(game, Math.atan2(dy, dx))) {
				this.use(game, []);
			}
		}

		return game.currentFrame + 1;
	};
	var Vehicle = createType(function Vehicle(id) {
		setIdAndType(this, id, "Person");
		setPhysicalState(this);
	}, Entity);
	var EnemyVehicle = createType(function EnemyVehicle(id) {
		setIdAndType(this, id, "Person");
		setPhysicalState(this);
	}, Vehicle);
	var Person = createType(function Person(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "Person");
			setPhysicalState(this);
		}, Entity);
	var EnemyPerson = createType(function EnemyPerson(id) {
		// $.extend(true, this, new Entity(id));
			setIdAndType(this, id, "Person");
			setPhysicalState(this);
		}, Person);

	var Player = createType(function Player(id) {
		setIdAndType(this, id, "Player");
		setPhysicalState(this);
		setToolUserState(this);
		setShipState(this);
		this.playerNo = 0;
		this.keyboardScheme = {
			Thrust : enums.keys.up,
			TurnLeft : enums.keys.left,
			TurnRight : enums.keys.right,
			NextTool : enums.keys.down,
			PreviousTool : undefined,
			Use : enums.keys.ctrl
		};
	}, Ship);

	function personsDescription(game, personNos) {
		var description="";

		for (var i=0;i<personNos.length;i++) {
			var tmp = game.persons[personNos[i]].nick;
			if (i===0) {
				description = tmp;
			} else if (i<personNos.length-1) {
				description += ", " + tmp;
			} else {
				description += " and " + tmp;
			}
		}

		return description;
	}

		Player.prototype.onCollisionWithWall = function(game, tileCoordinatesArray) {
		// TODO
		var i = 0;
		for (i in tileCoordinatesArray) {
			var coords = tileCoordinatesArray[i];
			var tile = utils.tileAtGridCoord(coords, game.level, -1);
			//
			if (utils.isWorkshop(game, tile)) {

				var tileIndex = utils.indexFromGridCoord(coords, game.level);
				var dialogs = game.personsForCells[tileIndex];
				if (dialogs!==undefined) {
					if (dialogs.length>1) {
						var dialogOptions = [];
						var dialogCallbacks = [];
						var optionsClasses = [];
						for (var i=0; i<dialogs.length; i++) {
							dialogOptions.push(personsDescription(game, dialogs[i].others));
							dialogCallbacks.push(function (game, choosenOptionNo) {

								var others = dialogs[choosenOptionNo].others;
								var team = [];

								if (dialog_data.graphs[dialogs[choosenOptionNo].graph]!==undefined) {
									if (ajuc.tiledArcade.dialog.prepare(
											game.persons[0],
											team,
											others,
											dialog_data.graphs[dialogs[choosenOptionNo].graph]
									)) {
										utils.pushUiScreen(game, "Dialog");
									}
								} else {
									//TODO
									alert("dialogs[choosenOptionNo].graph == undefined");
								}
								//alert("choosenOptionNo="+choosenOptionNo);
							});
							optionsClasses.push("");
						}

						dialogOptions.push("nobody");
						dialogCallbacks.push(function (game, choosenOptionNo) {
							game.running.game = true;
						});
						optionsClasses.push("ESC");

						ajuc.tiledArcade.choose.prepare(
							"There are many persons here. Who do you wish to speak with?",
							dialogOptions,
							dialogCallbacks,
							optionsClasses
						); //TODO
					} else {
						var team = [];
						var others = dialogs[0].others;
						if (dialog_data.graphs[dialogs[0].graph]!==undefined) {
							if (ajuc.tiledArcade.dialog.prepare(game.persons[0], team, others, dialog_data.graphs[dialogs[0].graph])) {
								utils.pushUiScreen(game, "Dialog");
							}
						} else {
							alert("dialog_data.graphs[dialogs[0].graph] == undefined");
						}

					}
				} else {
					ajuc.tiledArcade.shop.prepare();
					utils.pushUiScreen(game, "Shop");
				}
				break;
			} else if (utils.isInn(game, tile)) {
				var tileIndex = utils.indexFromGridCoord(coords, game.level);

				var dialogs = game.personsForCells[tileIndex];
				if (dialogs!==undefined) {
					if (dialogs.length>1) {
						var dialogOptions = [];
						var dialogCallbacks = [];
						var optionsClasses = [];
						for (var i=0; i<dialogs.length; i++) {
							dialogOptions.push(personsDescription(game, dialogs[i].others));
							dialogCallbacks.push(function (game, choosenOptionNo) {

								var others = dialogs[choosenOptionNo].others;
								var team = [];

								//alert("choosenOptionNo="+choosenOptionNo);

								if (ajuc.tiledArcade.dialog.prepare(
										game.persons[0],
										team,
										others,
										dialog_data.graphs[dialogs[choosenOptionNo].graph]
								)) {
									utils.pushUiScreen(game, "Dialog");
								}
							});
							optionsClasses.push("");
						}


						dialogOptions.push("nobody");
						dialogCallbacks.push(function (game, choosenOptionNo) {
							game.running.game = true;
						});
						optionsClasses.push("ESC");

						ajuc.tiledArcade.choose.prepare(
							"There are many persons here. Who do you wish to speak with?",
							dialogOptions,
							dialogCallbacks,
							optionsClasses
						);

					} else {
						var team = [];
						var others = dialogs[0].others;
						if (ajuc.tiledArcade.dialog.prepare(game.persons[0], team, others, dialog_data.graphs[dialogs[0].graph])) {
							utils.pushUiScreen(game, "Dialog");
						}
					}

				}
				break;
			} else if (utils.isFuelStation(game, tile)) {

				var tileIndex = utils.indexFromGridCoord(coords, game.level);
				var dialogs = game.personsForCells[tileIndex];
				if (dialogs!==undefined) {
					if (dialogs.length>1) {
						var dialogOptions = [];
						var dialogCallbacks = [];
						var optionsClasses = [];
						for (var i=0; i<dialogs.length; i++) {
							dialogOptions.push(personsDescription(game, dialogs[i].others));
							dialogCallbacks.push(function (game, choosenOptionNo) {

								var others = dialogs[choosenOptionNo].others;
								var team = [];

								//alert("choosenOptionNo="+choosenOptionNo);

								if (ajuc.tiledArcade.dialog.prepare(
										game.persons[0],
										team,
										others,
										dialog_data.graphs[dialogs[choosenOptionNo].graph]
								)) {
									utils.pushUiScreen(game, "Dialog");
								}
							});
							optionsClasses.push("");
						}

						ajuc.tiledArcade.choose.prepare(
							"There are many persons here. Who do you wish to speak with?",
							dialogOptions,
							dialogCallbacks,
							optionsClasses
						);//TODO
					} else {
						var team = [];
						var others = dialogs[0].others;
						if (ajuc.tiledArcade.dialog.prepare(game.persons[0], team, others, dialog_data.graphs[dialogs[0].graph])) {
							utils.pushUiScreen(game, "Dialog");
						}
					}
				} else {
					utils.pushUiScreen(game, "FuelStation");
				}
				break;
			} else if (utils.isServerStation(game, tile)) {
				break;
			} else if (utils.isHarmful(game, tile)) {
				var healthCost = ((this.velocity.x*this.velocity.x)+(this.velocity.y*this.velocity.y))/4;
				healthCost = Math.sqrt(healthCost);

				if (healthCost>1.0) {
					var i=0;
					var n = Math.round(3*healthCost);
					for (i=0;i<n;i++) {
						var exhaust = new Exhaust(game.objects.length);
						exhaust.position = {
							x : this.position.x - Math.cos(this.rotation+i*2*Math.PI/n)*(this.size.x+this.size.y)*0.4*Math.random(),
							y : this.position.y - Math.sin(this.rotation+i*2*Math.PI/n)*(this.size.x+this.size.y)*0.4*Math.random()
						};
						exhaust.velocity = {
							x : this.velocity.x - Math.cos(this.rotation+i*2*Math.PI/n)*(this.size.x+this.size.y)*0.04,
							y : this.velocity.y - Math.sin(this.rotation+i*2*Math.PI/n)*(this.size.x+this.size.y)*0.04
						};
						exhaust.size.x = 24;
						exhaust.size.y = 24;
						exhaust.timeToLive = 3;

						exhaust.parentId = this.id;
						game.objects.push(exhaust);
					}
					if (this.hasHealth(healthCost)) {
						this.useHealth(healthCost);
					} else {
						this.health = 0;
						this.destroyMe = true;
					}
					;
				}
			}
			;
		}
		;
	};

	function setBarWidth(name, value) {
		//$(name+" > .BarInterior").width(value);
		$(name+" > .BarInterior").width(value);//animate({width: value}, 200);

	}

	Player.prototype.updateStatusInfoIfCurrentPlayer = function(game) {
		if (this.playerNo === game.currentPlayer && ((game.currentFrame % 9) === 0)) {



			// update info
			setBarWidth("#ShipInfoEnergy", (98*(this.energy/this.maxEnergy))+"%");
			setBarWidth("#ShipInfoHealth", (98*(this.health/this.maxHealth))+"%");
			setBarWidth("#ShipInfoFuel", (98*(this.fuel/this.maxFuel))+"%");


			if (   this.currentTool != undefined
					&& this.currentTool >= 0
					&& this.currentTool < this.tools.length
					&& stats.tools[this.tools[this.currentTool]].bulletType != undefined
					&& stats.tools[this.tools[this.currentTool]].bulletConsumption > 0
			) {
			}
			if (   this.tools !== undefined
				&& this.tools.length>0
				&& this.currentTool != undefined
				&& this.currentTool>=0
				&& this.currentTool<this.tools.length
			) {
				setBarWidth("#ShipInfoAmmo",(
						98*(
								this.ammo[
								          stats.tools[this.tools[this.currentTool]].bulletType
								]
								/
								stats.bullets[
								          stats.tools[
								                this.tools[
								                     this.currentTool
								                ]
								           ].bulletType
								].maxAmmo
							)
						)+"%"
				);
			} else {
				$("#ShipInfoAmmo > .BarInterior").width("0px");
			}
			if (this.money) {
				$("#ShipInfoMoney").text("$ " + Math.round(100*this.money)*0.01);
			}
			if (this.changedPartsOrCurrentWeapon != undefined) {
				this.changedPartsOrCurrentWeapon = undefined;

				var tmpPart = undefined;
				if (this.mainEngine !== undefined && stats.engines[this.mainEngine]!=undefined) {
					$("#ShipInfoEngine > *").remove();
					tmpPart = stats.engines[this.mainEngine];
					$(		"<div class=\"StatusDiv\">Main<div>"+
							"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: gray; border-width: 1px;"+"\"/>"
						 ).appendTo($("#ShipInfoEngine"));
					//$().text("" + .name);
				}
				if (this.rotationEngine !== undefined && stats.engines[this.rotationEngine]!=undefined) {
					$("#ShipInfoRotationEngine > *").remove();
					tmpPart = stats.engines[this.rotationEngine];
					$(		"<div class=\"StatusDiv\">Rotat.<div>"+
							"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: gray; border-width: 1px;"+"\"/>"
						 ).appendTo($("#ShipInfoRotationEngine"));
					//$("#ShipInfoRotationEngine").text("" + stats.engines[this.rotationEngine].name);
				}
				if (this.shield !== undefined && stats.shields[this.shield]!=undefined) {
					$("#ShipInfoShield > *").remove();
					tmpPart = stats.shields[this.shield];
					$(		"<div class=\"StatusDiv\">Shield<div>"+
							"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: gray; border-width: 1px;"+"\"/>"
						 ).appendTo($("#ShipInfoShield"));
					//$("#ShipInfoShield").text("" + stats.shields[this.shield].name);
				}
				if (this.powerGenerator !== undefined && stats.powerGenerators[this.powerGenerator]!=undefined) {
					$("#ShipInfoPowerGenerator > *").remove();
					tmpPart = stats.powerGenerators[this.powerGenerator];
					$(		"<div class=\"StatusDiv\">Gener.<div>"+
							"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: gray; border-width: 1px;"+"\"/>"
						 ).appendTo($("#ShipInfoPowerGenerator"));
					//$("#ShipInfoPowerGenerator").text("" + stats.powerGenerators[this.powerGenerator].name);
				}

				$("#ShipInfoTools > *").remove();

				if (this.tools !== undefined &&
					this.tools.length>0
				) {
					var tmpI = 0;
					var tmpPart = undefined;
					for (tmpI=0; tmpI<this.tools.length; tmpI++) {
						if (
							this.tools[tmpI] != undefined &&
							stats.tools[this.tools[tmpI]] !== undefined
						) {
							tmpPart = stats.tools[this.tools[tmpI]];
						} else {
							tmpPart = undefined;
						}

						if (this.currentTool === tmpI) {
							$(
									"<li class=\"StatusList\">"+
									"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: red; border-width: 1px;"+"\"/>" +
									"</li>"
								 ).appendTo($("#ShipInfoTools"));
						 } else {
							$(
									"<li class=\"StatusList\">"+
									"<div class=\"StatusPartImg\" style=\""+"background-position: -"+tmpPart.imgLeft+"px -"+tmpPart.imgTop+"px; border-style: solid; border-color: gray; border-width: 1px;"+"\"/>" +
									"</li>"
								 ).appendTo($("#ShipInfoTools"));
						 }
					}
				}


			}
		};
	};

	Player.prototype.update = function(game) {
		if (!this.enabled) {
			return;
		}

		this.updateTimeToLive(game);
		this.updateFramesTillCurrentToolIsReady(game);
		this.updateStatusInfoIfCurrentPlayer(game);
		this.updateSpriteRotation(game);
		this.updateQuantities(game);
		// alert("Player.update");
	};

	Player.prototype.interpreteInputs = function(inputs) {
		var actions = new Array();
		if (this.keyboardScheme.Thrust != undefined
				&& ((this.keyboardScheme.Thrust[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.Thrust[0]]) || (this.keyboardScheme.Thrust[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.Thrust[0]]))) {
			actions.push(new Thrust(-1));
		}
		;
		if (this.keyboardScheme.Use != undefined
				&& ((this.keyboardScheme.Use[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.Use[0]]) || (this.keyboardScheme.Use[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.Use[0]]))) {
			actions.push(new Use(-1));
		}
		;
		if (this.keyboardScheme.AlternateUse != undefined
				&& ((this.keyboardScheme.AlternateUse[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.AlternateUse[0]]) || (this.keyboardScheme.AlternateUse[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.AlternateUse[0]]))) {
			actions.push(new AlternateUse(-1));
		}
		;
		if (this.keyboardScheme.NextTool != undefined
				&& ((this.keyboardScheme.NextTool[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.NextTool[0]]) || (this.keyboardScheme.NextTool[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.NextTool[0]]))) {
			actions.push(new NextTool(-1));
		}
		;
		if (this.keyboardScheme.PreviousTool != undefined
				&& ((this.keyboardScheme.PreviousTool[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.PreviousTool[0]]) || (this.keyboardScheme.PreviousTool[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.PreviousTool[0]]))) {
			actions.push(new PreviousTool(-1));
		}
		;
		if (this.keyboardScheme.TurnLeft != undefined
				&& ((this.keyboardScheme.TurnLeft[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.TurnLeft[0]]) || (this.keyboardScheme.TurnLeft[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.TurnLeft[0]]))) {
			actions.push(new TurnLeft(-1));
		}
		;
		if (this.keyboardScheme.TurnRight != undefined
				&& ((this.keyboardScheme.TurnRight[1] == "down" && inputs.keyCodesDown[this.keyboardScheme.TurnRight[0]]) || (this.keyboardScheme.TurnRight[1] == "pressed" && inputs.keyCodesPressed[this.keyboardScheme.TurnRight[0]]))) {
			actions.push(new TurnRight(-1));
		}
		;

		this.actionsPerformed = {};
		var actionNo=0;
		for (actionNo in actions) {
			this.actionsPerformed[actions[actionNo].type] = true;
		}

		return actions;
	};

	Player.prototype.performActions = function(game, actions) {
		var actionsCount = actions.length;
		for ( var i = 0; i < actionsCount; i++) {
			// TODO
			actions[i].perform(this, game); //
		}
	};

	var Exhaust = createType(function Exhaust(id) {
		setIdAndType(this, id, "Exhaust");
		setPhysicalState(this);

		this.spriteNo = 84;
	}, Entity);

	var Bullet = createType(function Bullet(id) {
		setIdAndType(this, id, "Bullet");
		setPhysicalState(this);
		this.timeToLive = 10;
		this.bulletType = 0;
	}, Entity);

	Bullet.prototype.onCollisionWithWall = function(game, tileCoordinatesArray) {
		// this.destroyMe = true;
		this.rotation += -1+2*Math.random();

		if (ajuc.stats.bullets[this.bulletType].onCollisionAdditionalAction !== undefined) {
			//function(game, bullet, obstacles, wallCoordinates)
			ajuc.stats.bullets[this.bulletType].onCollisionAdditionalAction(game, this, [], tileCoordinatesArray);
		}
	};
	Bullet.prototype.needsRotation = function() {
		return true;//(stats.bullets[this.bulletType].needsRotation===true);
	};

	Bullet.prototype.update = function(game) {
		if (!this.enabled) {
			return;
		}

		this.updateTimeToLive();
		this.updateSpriteRotation(game);

		if (ajuc.stats.bullets[this.bulletType].onEachFrameAdditionalAction !== undefined) {
			ajuc.stats.bullets[this.bulletType].onEachFrameAdditionalAction(game, this);
		}
	};

	Thrust.prototype.perform = function(ship, game, action) {
		ship.thrust(game, action);
	};
	Use.prototype.perform = function(ship, game, action) {
		ship.use(game, action);
	};
	AlternateUse.prototype.perform = function(ship, game, action) {
		ship.alternateUse(game, action);
	};
	TurnLeft.prototype.perform = function(ship, game, action) {
		ship.turnLeft(game, action);
	};
	TurnRight.prototype.perform = function(ship, game, action) {
		ship.turnRight(game, action);
	};
	NextTool.prototype.perform = function(ship, game, action) {
		ship.nextTool(game, action);
		ship.changedPartsOrCurrentWeapon = true;
	};
	PreviousTool.prototype.perform = function(ship, game, action) {
		ship.previousTool(game, action);
		ship.changedPartsOrCurrentWeapon = true;
	};

	return {
		version : version,

		registerConstructor : registerConstructor,
		changePrototype : changePrototype,
		prototypize : prototypize,
		createType : createType,

		setPhysicalState : setPhysicalState,

		serializeArrayOfTypedObjects : serializeArrayOfTypedObjects,
		deserializeToArrayOfTypedObjects : deserializeToArrayOfTypedObjects,

		TypedObject : TypedObject,
		Entity : Entity,
		Ship : Ship,
		Player : Player,
		EnemyShip : EnemyShip,
		Turret : Turret,
		EnemyTurret : EnemyTurret,
		Vehicle : Vehicle,
		EnemyVehicle : EnemyVehicle,
		Person : Person,
		EnemyPerson : EnemyPerson,
		Bullet : Bullet,
		Exhaust : Exhaust,

		Action : Action,
		TurnLeft : TurnLeft,
		TurnRight : TurnRight,
		Thrust : Thrust,
		Use : Use,

		NextTool : NextTool,
		PreviousTool : NextTool

	};
})(ajuc.enums, ajuc.utils, ajuc.stats);