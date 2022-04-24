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

ajuc.stats.engines = (function() {
	return [
		{	name : "Small combustion lawnmover engine",
			description : "Only the smallest ships can fly using this.",
			no: 0,

			imgLeft : 1*64,
			imgTop : 4*64,

			power : 0.15,
			latency : 1, //how many game frames it takes to start or stop this engine

			fuelConsumption : 0.010, // liters per frame when enabled
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)

			mass : 10, // mass of empty engine (in kilograms)
			volume : 15, // liters

			angleOfImpulse : 0.0, // in radians, 0.0 = engine mounted in the front makes ship go forward
					      // 3.14 == engine mounted in the back makes ship go forward

			averagePrice : 250,
			stdDevPrice : 60,

			chanceToBuy : 0.3, // how often shops have it
			chanceToSell : 0.2 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Big combustion lawnmover engine",
			description : "Only the smallest ships can fly using this.",
			no: 1,

			imgLeft : 2*64,
			imgTop : 4*64,

			power : 0.24,
			latency : 1, //how many game frames it takes to start or stop this engine

			fuelConsumption : 0.022, // liters per frame when enabled
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)

			mass : 20, // mass of empty engine (in kilograms)
			volume : 25, // liters

			angleOfImpulse : 0.0, // in radians, 0.0 = engine mounted in the front makes ship go forward
					      // 3.14 == engine mounted in the back makes ship go forward

			averagePrice : 750,
			stdDevPrice : 100,

			chanceToBuy : 0.4, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		}
	];
})();
