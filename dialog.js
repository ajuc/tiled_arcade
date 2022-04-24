"use strict";
if ((typeof (ajuc) === 'undefined')) {
	ajuc = {};
}

ajuc.dialog = (function(enums, utils, facts, stats) {

	function version() {
		return 0.01;
	}

	
	// DIALOG UTILS

	function insertTransition(game, facts, player, team, others, acc, transitionTo, text, additionalAction, showAnswer) {
		acc.push({
			text : text,
			showAnswer : showAnswer!==undefined?showAnswer:true,
			action : function () {
				//TODO
				if (additionalAction!==undefined) {
					additionalAction();
				}
			},
			transitionTo : transitionTo
		});
	}
	
	function insertESCTransition(game, facts, player, team, others, acc, transitionTo, text, additionalAction, showAnswer) {
		acc.push({
			text : text,
			showAnswer : showAnswer!==undefined?showAnswer:true,
			action : function () {
				//TODO
				if (additionalAction!==undefined) {
					additionalAction();
				}
			},
			transitionTo : transitionTo,
			transitionClass: "ESC"
		});
	}


	function insertTransitionIf(acc, pred, text, action, transitionTo, showAnswer) {
		if (pred()) {
			acc.push({
				text : text,
				action : action,
				showAnswer : showAnswer!==undefined?showAnswer:true,
				transitionTo : transitionTo
			});
		}
	}

	function insertTransitionIfNotTaken(game, facts, player, team, others, acc, transitionTo, text, additionalAction, showAnswer) {
		insertTransitionIf(acc, function() {
			return !facts.alreadySpokeAbout("player", others[0], transitionTo);
		}, text, function () {
			if (additionalAction !== undefined) {
				additionalAction();
			}
			facts.setAlreadySpokeAbout("player", others[0], transitionTo, true);
		}, transitionTo, showAnswer );
	}

	function insertTransitionIfNotTakenToday(game, facts, player, team, others, acc, transitionTo, text, additionalAction, showAnswer) {
		insertTransitionIf(acc, function() {
			return !facts.alreadySpokeAboutToday("player", others[0], transitionTo);
		}, text, function () {
			if (additionalAction !== undefined) {
				additionalAction();
			}
			facts.setAlreadySpokeAbout("player", others[0], transitionTo, true);
		}, transitionTo, showAnswer );
	}

	
	
	// END OF DIALOG UTILS
	
	return {
		version : version,
		
		insertTransition : insertTransition,
		insertTransitionIf : insertTransitionIf,
		insertTransitionIfNotTaken : insertTransitionIfNotTaken,
		insertTransitionIfNotTakenToday : insertTransitionIfNotTakenToday,
		insertESCTransition : insertESCTransition
		
	};
})(ajuc.enums, ajuc.utils, ajuc.facts ,ajuc.stats);