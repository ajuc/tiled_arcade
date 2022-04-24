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

ajuc.stats.powerGenerators = (function() {
	return [
		{	name : "Small Wind Turbine ",
			description : "Small turbine connected to dynamo - makes electric current only when the ship is moving relative to the air, the more power the faster the ship is going.",
			imgLeft : 1*64,
			imgTop : 6*64,
			no: 0,

			kWPerVelocityPerFrame : 0.001, // for generators only working when moving
			kWPerFrame : 0, // for all the others

			fuelConsumption : 0.0, // liters per frame when enabled

			mass : 10, // mass of the part (in kilograms)
			volume : 0, // liters

			averagePrice : 450,
			stdDevPrice : 120,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Small Solar Cell",
			description : "Small solar cell - makes electric current during day. ",
			no: 1,

			imgLeft : 2*64,
			imgTop : 6*64,

			kWPerVelocityPerFrame : 0, // for generators only working when moving
			kWPerFrame : 0.75, // for all the others

			fuelConsumption : 0.0, // liters per frame when enabled

			mass : 10, // mass of the part (in kilograms)
			volume : 0, // liters

			averagePrice : 950,
			stdDevPrice : 120,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		},
		{	name : "CombustionEngineGenerator ",
			description : "Traditional fuel powered power generator. Uses fuel to make electric current.",
			no: 2,

			imgLeft : 3*64,
			imgTop : 6*64,

			kWPerVelocityPerFrame : 0, // for generators only working when moving
			kWPerFrame : 3, // for all the others

			fuelConsumption : 0.5, // liters per frame when enabled

			mass : 20, // mass of the part (in kilograms)
			volume : 0, // liters

			averagePrice : 450,
			stdDevPrice : 80,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		}
	];
})();
