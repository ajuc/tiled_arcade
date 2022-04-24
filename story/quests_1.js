
var quest = ajuc.quests.quest;
var node = ajuc.quests.node;
var transition = ajuc.quests.transition;
var transitionIfSpokenToXAboutY = ajuc.quests.transitionIfSpokenToXAboutY;
var transitionIfQuestFinished = ajuc.quests.transitionIfQuestFinished;

var quests_data = {
	winter_comes : quest(
		"Winter Comes",
		"Village needs energy to survive winter, " +
		"and the only source of power has broken. " +
		"Find a way for the village to survive the winter.",
		{ // nodes
			start : node (
				function (game) { // function returning name for a quest phase (quest graph node)
					return "Brainstorming";
				},
				function (game) { // function returning description for a quest phase
					return "Talk to villagers, maybe someone can think of a good solution.";
				},
				[ // possible transitions to another quest phase with conditions to take the transition
					transitionIfSpokenToXAboutY(
						["Artur", "Kashia"], "storing_energy_for_winter", "start",
						function(game) {
							ajuc.tiledArcade.activateQuest(game, "storing_energy_for_winter");
						}
					),
					transitionIfSpokenToXAboutY(
						["Grandpa"], "building_new_3d_printer", "start",
						function(game) {
							ajuc.tiledArcade.activateQuest(game, "building_new_3d_printer");
						}
					),
					transitionIfSpokenToXAboutY(
						["Valdeck", "Tadeush"], "gathering_fuel_and_flying_to_nearest_village","start",
						function(game) {
							ajuc.tiledArcade.activateQuest(game, "gathering_fuel_and_flying_to_nearest_village");
						}
					),

					transitionIfQuestFinished("gathering_fuel_and_flying_to_nearest_village","success",
						function(game) {
							ajuc.tiledArcade.activateQuest(game, "become_fighter_pilot");
						}
					),
					transitionIfQuestFinished("building_new_3d_printer","success",
						function(game) {
							ajuc.tiledArcade.activateQuest(game, "become_hacker");
						}
					),
					transitionIfQuestFinished("storing_energy_for_winter","success",
						function(game) { // TODO - maybe add some quest only possible after this path
						}
					),
					
					transition( //
						function(game) {
							return ( game.facts.uniqueFact("winter_came") && 
								!game.tiledArcade.questFinished(game, "gathering_fuel_and_flying_to_nearest_village") &&
								!game.tiledArcade.questFinished(game, "storing_energy_for_winter") &&
								!game.tiledArcade.questFinished(game, "building_new_3d_printer"))
								||
								(game.tiledArcade.questFailed(game, "gathering_fuel_and_flying_to_nearest_village") &&
								 game.tiledArcade.questFailed(game, "storing_energy_for_winter") &&
								 game.tiledArcade.questFailed(game, "building_new_3d_printer"));
						},
						function(game) {
							//TODO - game over ? maybe not, but player character will have to live with the knwoledge,
							//that the village had frozen, and all inhabitants are probably dead
						},
						"failure"
					),
					
				]
			),
			success : node (
				
			),
			failure : node (
				
			)
		}
	),
	
	storing_energy_for_winter : quest(
		"Store Energy For Winter",
		"If we can find a way to store surplus energy generated now, "+
		"it should suffice to heat the village during winter.",
		{
			start : node(
				function(game) { return "Find right ship for the job."; },
				function(game) { return "It should be light, and small, "+
							"but sould have relatively big fuel tank."; },
				[
					transition(
					),
					transition(
					)
				]
			),
			
			success : node (
				
			),
			failure : node (
				
			)
		}
	),

	building_new_3d_printer : quest(
		"Build a new 3d Printer",
		"If we could build a new 3d printer, we'll be able to print missing parts of " +
		" the wind turbines, and fix them before the winter",
		{
			start : node(
				
			),
			success : node (
				
			),
			failure : node (
				
			)
		}
	),

	gathering_fuel_and_flying_to_nearest_village : quest(
		"Find enough fuel to fly to the nearest village",
		"If we can gather unused fuel from all the ships in the village, mayb it'll be enough " +
		"for a small light ship to fly to nearest village. Then someone can fly there, and buy " +
		"missing parts for wind turbine, a new 3d printer, or enough fuel to heat village " +
		"during winter.",
		{
			start : node(
				
			),
			success : node (
				
			),
			failure : node (
				
			)
		}
	),
	
	find_parents : quest(
		"Find Parents",
		"Parents flew month ago to fix the 3d printer, and trade. "+
		"They had not returned. I must find them.",
		{
			start : node(
				
			),
			ask_about_parents_in_the_nearest_village : node(
				
			),
			success : node (
				
			),
			failure : node (
				
			)
		}
	)


};