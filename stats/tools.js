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

ajuc.stats.tools = (function() {
	return [
		{	name : "Machine gun Beryl 7.62 mm",
			description : "Standard NATO infantry machine gun " +
					" Beryl 7.62mm " +
					" mounted as ship weapon." +
					" Will only harm targets completely" +
					" without armor.",
					no: 0,
					imgLeft : 1*64,
					imgTop : 8*64,

			delayBetweenShots : 24, // we can shoot once each 4 frames
			bulletsInShot : 1,
			bulletsInShotType : 0, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.0314, // = 180 degree / 100 = 1.8 degree
			velocity : 10, //

			shootAdditionalAction : undefined,


			fuelConsumption : 0.0, // liters per frame when enabled
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)
			healthConsumption : 0.0, // per shot
			bulletType : 0, // without bullets == undefined
			bulletConsumption : 1, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 8, // mass of the part (in kilograms) - without ammunition
			volume : 0, // liters

			averagePrice : 550,
			stdDevPrice : 220,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Machine gun Beryl 7.62 mm - quick fire",
			description : "Standard NATO infantry machine gun" +
					" Beryl 7.62mm mounted as ship weapon." +
					" But this gun has " +
					" its anti-quick fire protection removed." +
					" Much faster fire, but bullets still the same" +
					" So don't think you can damage any armored ship" +
					" with that.",
					imgLeft : 2*64,
					imgTop : 8*64,
					no: 1,

			delayBetweenShots : 14, // how many frames
			bulletsInShot : 1,
			bulletsInShotType : 0, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.0314, // = 180 degree / 100 = 1.8 degree
			velocity : 10, //

			shootAdditionalAction : undefined,


			fuelConsumption : 0.0, // liters per frame when enabled
			healthConsumption : 0, // per shot
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)
			bulletType : 0,
			bulletConsumption : 1, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 14, // mass of the part (in kilograms) - without ammunition
			volume : 0, // liters

			averagePrice : 780,
			stdDevPrice : 220,

			chanceToBuy : 0.45, // how often shops have it
			chanceToSell : 0.4 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Small red military laser 500 W",
			description : "Standard NATO infantry laser weapon" +
					" Quick fire, small damage," +
					" but eventually can cut throught any" +
					" armor (except special reflective " +
					" anti-laser shields).",
					imgLeft : 3*64,
					imgTop : 8*64,
					no: 2,

			delayBetweenShots : 4, // we can shoot once each 3 frames
			bulletsInShot : 1,
			bulletsInShotType : 1, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.0314, // = 180 degree / 100 = 1.8 degree
			velocity : 20, //

			shootAdditionalAction : undefined,

			fuelConsumption : 0.0, // liters per frame when enabled
			healthConsumption : 0, // per shot
			energyConsumption : 0.5, // electrical energy consumption per frame (in kWh)
			bulletType : undefined,
			bulletConsumption : 0, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 14, // mass of the part (in kilograms) - without ammunition
			volume : 0, // liters

			averagePrice : 1280,
			stdDevPrice : 220,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Blue military laser 5000 W",
			description : "Standard NATO gunship laser weapon" +
					" Slightly slower fire rate than infantry laser," +
					" but much bigger damage makes up for that." +
					" Can easily slice throught any" +
					" armor (except special reflective " +
					" anti-laser shields).",

					imgLeft : 4*64,
					imgTop : 8*64,
					no: 3,

			delayBetweenShots : 7, // we can shoot once each 3 frames
			bulletsInShot : 1,
			bulletsInShotType : 2, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.02, //
			velocity : 20, //speed of light :)

			shootAdditionalAction : undefined,

			fuelConsumption : 0.0, // liters per frame when enabled
			healthConsumption : 0, // per shot
			energyConsumption : 5.5, // electrical energy consumption per frame (in kWh)
			bulletType : undefined,
			bulletConsumption : 0, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 34, // mass of the part (in kilograms) - without ammunition
			volume : 0, // liters

			averagePrice : 6280,
			stdDevPrice : 1220,

			chanceToBuy : 0.3, // how often shops have it
			chanceToSell : 0.6 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Insecticide spray",
			description : "Farmers' favorite weapon in the war on insects. Works on other animals, too.",

			imgLeft : 5*64,
			imgTop : 8*64,
			no: 4,

			delayBetweenShots : 5, // we can shoot once each 3 frames
			bulletsInShot : 2,
			bulletsInShotType : 21, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.4, //
			velocity : 4,

			shootAdditionalAction : function (game, shootingObj, newBullets) {
				//add relation between the bullet and the shooting object
				//ajuc.tiledArcade.addRelation([], )
			},


			fuelConsumption : 0.0, // liters per frame when enabled
			healthConsumption : 0, // per shot
			energyConsumption : 0.5, // electrical energy consumption per frame (in kWh)
			bulletType : 21,
			bulletConsumption : 1, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 34, // mass of the part (in kilograms) - without ammunition
			volume : 20, // liters

			averagePrice : 200,
			stdDevPrice : 70,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Harpoon",
			description : "When you hunt for a big bird - these things are a must have.",

			imgLeft : 6*64,
			imgTop : 8*64,
			no: 5,

			delayBetweenShots : 20, // we can shoot once each 3 frames
			bulletsInShot : 1,
			bulletsInShotType : 22, // can be different from bullet type when we shot fire from fire conteiners for example
			bulletSpread : 0.05, //
			velocity : 8, //speed of light :)

			shootAdditionalAction : function (game, shootingObj, newBullets) {
				//remove possible previous relations of this kind
				ajuc.tiledArcade.removeRelationWhere(
						function(relation) {
							var tmp = (relation.kind === "line" && relation.fromTool === "Harpoon");
							if (!tmp) {
								alert(relation.kind + "  " + relation.fromTool);
							}
							return tmp;
						}
				);
				//add relation between the bullet and the shooting object
				ajuc.tiledArcade.addRelation(
						[shootingObj, newBullets[0]],
						{
							relationId : ajuc.tiledArcade.getNextRelationId(),
							kind: "line",
							fromTool: "Harpoon",
							someOtherProperty: "some value",
							distance: 0,
							mode: "draw-only",
							autoDeleteObjects: newBullets
						}
				);
			},
			alternateUsePossible: function(shootingObj, game, actions) {
				return true;
			},
			alternateUseAction: function(game, shootingObj) {
				ajuc.tiledArcade.removeRelationWhere(
						function(relation) {
							var tmp = (relation.kind === "line" && relation.fromTool === "Harpoon");
//							if (!tmp) {
//								alert(relation.kind + "  " + relation.fromTool);
//							}
							return tmp;
						}
				);

			},

			fuelConsumption : 0.0, // liters per frame when enabled
			healthConsumption : 0, // per shot
			energyConsumption : 1.0, // electrical energy consumption per frame (in kWh)
			bulletType : 22,
			bulletConsumption : 1, // per shot (can be fractional - for example for fuel containers for flamethrower)

			mass : 34, // mass of the part (in kilograms) - without ammunition
			volume : 0, // liters

			averagePrice : 400,
			stdDevPrice : 100,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.5 // how likely it is for shop to agree to buy it from player
		}



	];
})();
