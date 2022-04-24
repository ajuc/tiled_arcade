if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}

ajuc.mainMenu = function(action) {
	if (action==='New Game') {
		$("#MainMenu").css('display', 'none');
		$("#LoadingScreen").hide();
		$("#TiledArcadeBackgroundCanvas").css('z-index:', '2');
		$("#TiledArcadeCanvas").css('z-index:', '1');
		$("#TiledArcadeCanvas").css('display', 'inline');
		$("#TiledArcadeBackgroundCanvas").css('display', 'inline');
		resizeCanvas();

		ajuc.running.game = true;
		ajuc.running.continue = false;
	} else if (action==='Continue Game') {
		$("#MainMenu").css('display', 'none');
		$("#LoadingScreen").hide();
		$("#TiledArcadeBackgroundCanvas").css('z-index:', '2');
		$("#TiledArcadeCanvas").css('z-index:', '1');
		$("#TiledArcadeCanvas").css('display', 'inline');
		$("#TiledArcadeBackgroundCanvas").css('display', 'inline');
		resizeCanvas();

		ajuc.running.game = true;
		ajuc.running.continue = true;
	} else {
	};
};