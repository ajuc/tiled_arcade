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

ajuc.stats.bullets = (function() {
	return [
		//firearms ammunition
		{	name : "5.56x45mm NATO bullet", 					//0
			description : "Standard NATO intermediate machine gun ammo. Can only penetrate soft targets. Useless againist armored ships, turrets, soldiers in bulletproof vests, etc.",
			no: 0,

			spriteNo: 152,
			workshopSpriteNo: 168,

			projectileDamage : 1700,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 60,

			onCollisionAdditionalAction : undefined,

			mass : 0.004, // mass of the part (in kilograms) - without ammunition
			volume : 0.002, // liters

			size : { x:2, y:2},

			averagePrice : 3,
			stdDevPrice : 2,

			maxAmmo: 4000,

			chanceToBuy : 0.6, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "7.62x51mm NATO bullet", 					//1
			description : "Standard NATO machine gun ammo. Works on infantry (even with bulletrpoof vests), unarmored ships and turrets. Useless againist armored targets.",
			no: 1,

			spriteNo: 153,
			workshopSpriteNo: 169,

			projectileDamage : 3500,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 80,
			onCollisionAdditionalAction : undefined,

			mass : 0.010, // mass of the part (in kilograms) - without ammunition
			volume : 0.004, // liters

			size : { x:5, y:5},

			averagePrice : 5,
			stdDevPrice : 2,

			maxAmmo: 2000,

			chanceToBuy : 0.8, // how often shops have it
			chanceToSell : 0.6 // how likely it is for shop to agree to buy it from player
		},
		{	name : "7.62x39mm russian bullet",					//2
			description : "Standard russian machine gun ammo, most famous thanks to Khalashnikov invention. Works on infantry (even with bulletrpoof vests), unarmored ships and some turrets. Useless againist armored targets. Slightly less energy than NATO equivalent, but cheaper and more reliable.",
			no: 2,

			spriteNo: 154,
			workshopSpriteNo: 170,

			projectileDamage : 2100,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 70,
			onCollisionAdditionalAction : undefined,

			mass : 0.008, // mass of the part (in kilograms) - without ammunition
			volume : 0.0035, // liters

			size : { x:4, y:4},

			averagePrice : 3,
			stdDevPrice : 1,

			maxAmmo: 2500,

			chanceToBuy : 0.9, // how often shops have it
			chanceToSell : 0.8 // how likely it is for shop to agree to buy it from player
		},
		{	name : "12.7x99mm NATO bullet (.50 BMG)",			//3
			description : "Standard NATO big machine gun ammo. Works on infantry, most armored ships and turrets, althought light armor can stop first few rounds. Useless againist only the heaviest armored targets.",
			no: 3,

			spriteNo: 153,
			workshopSpriteNo: 169,

			projectileDamage : 18000,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 90,
			onCollisionAdditionalAction : undefined,

			mass : 0.045, // mass of the part (in kilograms) - without ammunition
			volume : 0.015, // liters

			size : { x:7, y:7},

			averagePrice : 20,
			stdDevPrice : 5,

			maxAmmo: 200,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "14.5x114 russian bullet",					//4
			description : "Standard russian anti-tank carbine ammo. Works on everything except heaviest armored targets.",
			no: 4,

			spriteNo: 10,
			workshopSpriteNo: 10,

			projectileDamage : 32000,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.064, // mass of the part (in kilograms) - without ammunition
			volume : 0.02, // liters

			size : { x:8, y:8},

			averagePrice : 25,
			stdDevPrice : 10,

			maxAmmo: 160,

			chanceToBuy : 0.3, // how often shops have it
			chanceToSell : 0.6 // how likely it is for shop to agree to buy it from player
		},
		{	name : "30x173 NATO autocannon bullet AP",			//5
			description : "Popular NATO bullet for automatic cannons. Works on everything, but on the best protected turrets it will take time."+
							"Armor piercing version.",
			no: 5,

			spriteNo: 11,
			workshopSpriteNo: 11,

			projectileDamage : 200000,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.22, // mass of the part (in kilograms) - without ammunition
			volume : 0.1, // liters

			size : { x:10, y:10},

			averagePrice : 250,
			stdDevPrice : 100,

			maxAmmo: 50,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.7 // how likely it is for shop to agree to buy it from player
		},
		{	name : "30x173 NATO autocannon bullet HEI",			//6
			description : "Popular NATO bullet for automatic cannons. "+
							"High explosive - incendiary version.",
			no: 6,

			spriteNo: 14,
			workshopSpriteNo: 14,

			projectileDamage : 20000,
			cumulativeDamage : 0,
			explosiveDamage : 80000,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 60000,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.22, // mass of the part (in kilograms) - without ammunition
			volume : 0.1, // liters

			size : { x:10, y:10},

			averagePrice : 250,
			stdDevPrice : 100,

			maxAmmo: 50,

			chanceToBuy : 0.3, // how often shops have it
			chanceToSell : 0.8 // how likely it is for shop to agree to buy it from player
		},
		{	name : "30x165mm russian autocannon bullet AP",		//7
			description : "Popular russian ammunition for automatic cannons. Works on everything, but on the best protected turrets it will take time. Armor piercing version.",
			no: 7,

			spriteNo: 15,
			workshopSpriteNo: 15,

			projectileDamage : 150000,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.22, // mass of the part (in kilograms) - without ammunition
			volume : 0.1, // liters

			size : { x:10, y:10},

			averagePrice : 250,
			stdDevPrice : 100,

			maxAmmo: 50,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.7 // how likely it is for shop to agree to buy it from player
		},
		{	name : "30x165mm russian autocannon bullet HE",		//8
			description : "Popular russian ammunition for automatic cannons. High explosive version.",
			no: 8,

			spriteNo: 16,
			workshopSpriteNo: 16,

			projectileDamage : 30000,
			cumulativeDamage : 0,
			explosiveDamage : 120000,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 40000,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.22, // mass of the part (in kilograms) - without ammunition
			volume : 0.1, // liters

			size : { x:10, y:10},

			averagePrice : 250,
			stdDevPrice : 100,

			maxAmmo: 50,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.7 // how likely it is for shop to agree to buy it from player
		},
		{	name : "30x165mm russian autocannon bullet I",		//9
			description : "Popular russian ammunition for automatic cannons. Incidentary version.",
			no: 9,

			spriteNo: 17,
			workshopSpriteNo: 17,

			projectileDamage : 20000,
			cumulativeDamage : 0,
			explosiveDamage : 10000,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 150000,

			timeToLive : 100,
			onCollisionAdditionalAction : undefined,

			mass : 0.22, // mass of the part (in kilograms) - without ammunition
			volume : 0.1, // liters

			size : { x:10, y:10},

			averagePrice : 250,
			stdDevPrice : 100,

			maxAmmo: 50,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.7 // how likely it is for shop to agree to buy it from player
		},

		//laser rays //TODO details
		{	name : "Red laser ray",								//10
			description : "500 W red laser ray with 0.5 sec duration.",
			no:10,

			spriteNo : 66,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 5.0,
			electricalDamage : 0,
			thermalDamage : 1,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Blue laser ray",							//11
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:11,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Ultra violet laser ray",					//12
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:12,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Frequency modulated laser ray",				//13
			description : "500 W red laser ray with 0.5 sec duration.",
			no:13,

			spriteNo : 66,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 5.0,
			electricalDamage : 0,
			thermalDamage : 1,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Rentgen laser ray",							//14
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:14,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Hi power ultra violet laser ray",			//15
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:15,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Hi power rentgen laser ray",				//16
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:16,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},

		//mass drivers ammo //TODO details
		{	name : "Improvised +- 10g ammo",					//17
			description : "500 W red laser ray with 0.5 sec duration.",
			no:17,

			spriteNo : 66,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 5.0,
			electricalDamage : 0,
			thermalDamage : 1,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "9 inch nails",								//18
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:18,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Heavy 100 g round",							//19
			description : "5000 W blue laser ray with 0.5 sec duration.",
			no:19,

			spriteNo : 67,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 50.0,
			electricalDamage : 0,
			thermalDamage : 10,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Heavy 300 g round",							//20
			description : "500 W red laser ray with 0.5 sec duration.",
			no:20,

			spriteNo : 66,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 5.0,
			electricalDamage : 0,
			thermalDamage : 1,

			maxAmmo: undefined,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.001, // mass of the part (in kilograms) - without ammunition
			volume : 0.0001, // liters

			size : { x:2, y:2},

			averagePrice : 0,
			stdDevPrice : 0,

			chanceToBuy : 0.0, // how often shops have it
			chanceToSell : 0.0 // how likely it is for shop to agree to buy it from player
		},

		//tools //TODO
		{	name : "Insecticide gas can.", //21
			description : ".",
			no:21,

			spriteNo: 147,
			workshopSpriteNo: 161,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 60,
			onCollisionAdditionalAction : undefined,

			mass : 0.004, // mass of the part (in kilograms) - without ammunition
			volume : 0.002, // liters

			size : { x:2, y:2},

			averagePrice : 3,
			stdDevPrice : 2,

			maxAmmo: 4000,

			chanceToBuy : 0.6, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Harpoon bolt.", //22
			description : ".",
			no: 22,

			spriteNo: 148,
			workshopSpriteNo: 162,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 0,
			thermalDamage : 0,

			timeToLive : 60,
			onCollisionAdditionalAction : function (game, bullet, obstacles, wallCoordinates) {
				bullet.timeToLive = null;
				bullet.movable = false;
				ajuc.tiledArcade.updateRelationDataWhere(
						function(relation) { // where function (relation)
							var tmp = (
								relation.kind === "line" &&
								relation.fromTool === "Harpoon" &&
								relation.mode === "draw-only" &&
								($.inArray(bullet, relation.objects) >= 0)
							);

							return tmp;
						},
						function(relation) { // update function (relation)
							var d = Math.sqrt(
								(relation.objects[0].position.x-relation.objects[1].position.x)*
								(relation.objects[0].position.x-relation.objects[1].position.x) +
								(relation.objects[0].position.y-relation.objects[1].position.y)*
								(relation.objects[0].position.y-relation.objects[1].position.y)
							);
							relation.distance = d;
							relation.mode = "max-distance-elastic";
						}
				);
			},
			onEachFrameAdditionalAction : undefined,

			mass : 0.004, // mass of the part (in kilograms) - without ammunition
			volume : 0.002, // liters

			size : { x:4, y:4},

			averagePrice : 3,
			stdDevPrice : 2,

			maxAmmo: 4000,

			chanceToBuy : 0.6, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Electric cell.", //23
			description : "This ammunition powers many tools and weapons, and is in high demand.",
			no: 23,

			spriteNo: 149,
			workshopSpriteNo: 163,

			projectileDamage : 0,
			cumulativeDamage : 0,
			explosiveDamage : 0,
			laserDamage : 0,
			electricalDamage : 5000,
			thermalDamage : 1000,

			timeToLive : 60,

			mass : 0.008, // mass of the part (in kilograms) - without ammunition
			volume : 0.002, // liters

			size : { x:4, y:4},

			averagePrice : 500,
			stdDevPrice : 20,

			maxAmmo: 100,

			chanceToBuy : 0.1, // how often shops have it
			chanceToSell : 0.9 // how likely it is for shop to agree to buy it from player
		},
		//grenades //TODO

		//mines //TODO

		//dumb rockets //TODO

		//homing missiles //TODO

		//napalm //TODO


	];
})();
