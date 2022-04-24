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

ajuc.stats.shields = (function() {
	return [
		{	name : "Iron armor 10mm",
			description : "Protects from the smallest caliber guns, and from minor collisions with walls, etc. Neutral vs termal damage.",
			no: 0,
			imgLeft : 1*64,
			imgTop : 3*64,

			projectileDamageReduction : 1600,
			cumulativeDamageReduction : 100,
			explosiveDamageReduction : 200,
			laserDamageReduction : 400,
			electricalDamageReduction : 0,
			thermalDamageReduction : 100,

			fuelConsumption : 0.0, // liters per frame when enabled
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)

			mass : 100, // mass of the part (in kilograms)
			volume : 0, // liters

			averagePrice : 4050,
			stdDevPrice : 520,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		},
		{	name : "Composite armor 20mm",
			description : "Protects from the smallest caliber guns, and from minor collisions with walls, etc. Weak vs termal damage (melts easily).",
			no: 1,
			imgLeft : 2*64,
			imgTop : 3*64,

			projectileDamageReduction : 1800,
			cumulativeDamageReduction : 0,
			explosiveDamageReduction : 200,
			laserDamageReduction : 100,
			electricalDamageReduction : 0,
			thermalDamageReduction : 0,

			fuelConsumption : 0.0, // liters per frame when enabled
			energyConsumption : 0.0, // electrical energy consumption per frame (in kWh)

			mass : 100, // mass of the part (in kilograms)
			volume : 0, // liters

			averagePrice : 4050,
			stdDevPrice : 520,

			chanceToBuy : 0.5, // how often shops have it
			chanceToSell : 0.3 // how likely it is for shop to agree to buy it from player
		}

	];
})();
