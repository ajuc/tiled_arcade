if ((typeof(ajuc) === 'undefined')) {
        ajuc = {};
}
if ((typeof(ajuc.stats) === 'undefined')) {
        ajuc.stats = {};
}

ajuc.stats.workshops = (function() {
	return [
		{
				repair: { price: 20 },
				reloadAmmo : { price: 10 },
				engines : [
				           { no: 0, priceDeviation: 0},
				           { no: 1, priceDeviation: 0}
				],
				shields : [
				           { no: 0, priceDeviation: 0}
				],
				powerGenerators : [
				           { no: 0, priceDeviation: 0},
				           { no: 1, priceDeviation: 0}
				],
				tools : [
				           { no: 0, priceDeviation: 0},
				           { no: 1, priceDeviation: 0},
				           { no: 4, priceDeviation: -0.2},
				           { no: 5, priceDeviation: -0.2}
				],
				bullets : [
				           { no: 0, priceDeviation: 0.1},
				           { no: 2, priceDeviation: 0.2},
				           { no: 21, priceDeviation: -0.1},
				           { no: 22, priceDeviation: -0.2},
				           { no: 23, priceDeviation: 0.8}
				]
		},
		{
			repair: { price: 8 },
			reloadAmmo : { price: 8 },
			engines : [
			           { no: 1, priceDeviation: -0.1},
			           { no: 2, priceDeviation: -0.1},
			           { no: 3, priceDeviation: -0.1}
			],
			shields : [
			           { no: 0, priceDeviation: -0.2},
			           { no: 1, priceDeviation: -0.1}
			],
			powerGenerators : [
			           { no: 0, priceDeviation: 0},
			           { no: 1, priceDeviation: 0},
			           { no: 2, priceDeviation: 0}
			],
			tools : [
			           { no: 0, priceDeviation: 0},
			           { no: 1, priceDeviation: 0},
			           { no: 2, priceDeviation: 0},
			           { no: 3, priceDeviation: 0}
			],
			bullets : [
			           { no: 0, priceDeviation: 0.1},
			           { no: 1, priceDeviation: 0.1},
			           { no: 2, priceDeviation: 0.2},
			           { no: 3, priceDeviation: 0.2},
			           { no: 21, priceDeviation: -0.1},
			           { no: 22, priceDeviation: -0.2},
			           { no: 23, priceDeviation: 0.8}
			]
	}

	];
})();
