"use strict";
if ((typeof (ajuc) === 'undefined')) {
       ajuc = {};
}

ajuc.quests = (function(enums, utils, facts, stats) {

       function version() {
               return 0.01;
       }


       // QUEST UTILS

       function transition(condition, action, destination) {
               return {
                       condition : condition,
                       action : action,
                       destination : destination
               };
       }

       function node(name, description, action, transitions) {
               return {
			name : name,
			description : description,
			action : action,
			transitions : transitions
               };
       }

       function quest(name, description, nodes) {
               return {
                       name: name,
                       description : description,
                       nodes : nodes
               };
       }

	//COMMONLY USED TRANSITION SHORTCUTS
	function transitionIfSpokenToXAboutY(persons, subject, destination, additionalAction) {
		return transition(
			function (game) {
				var result = true;
				for (var no in persons) {
					result = result &&
						game.facts.alreadySpokeAbout(
							"player",
							ajuc.tiledArcade.personNo(persons[no]),
							subject
						)
				}
				return result;
			},
			function (game) {
				if (additionalAction) {
					additionalAction(game);
				}
				// TODO
			},
			destination
		);
	}

	function transitionIfQuestFinished(quest, destination, additionalAction) {
		return transition(
			function (game) {
				var result = true;

				result = result &&
					ajuc.tiledArcade.questFinished(quest);
			
				return result;
			},
			function (game) {
				if (additionalAction) {
					additionalAction(game);
				}
				// TODO
			},
			destination
		);
	}
       // END OF QUEST UTILS



       return {
		version : version,

		quest : quest,
		node : node,
		transition : transition,

		transitionIfSpokenToXAboutY : transitionIfSpokenToXAboutY,
		transitionIfQuestFinished : transitionIfQuestFinished
       };
})(ajuc.enums, ajuc.utils, ajuc.facts ,ajuc.stats);
