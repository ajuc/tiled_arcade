
quest = ajuc.quests.quest;
node = ajuc.quests.node;
transition = ajuc.quests.transition;
transitionIfSpokenToXAboutY = ajuc.quests.transitionIfSpokenToXAboutY;
transitionIfQuestFinished = ajuc.quests.transitionIfQuestFinished;

quests_data =
	winter_comes :
		name: "Winter Comes",
		description : "Village needs energy to survive winter, " +
						"and the only source of power has broken. " +
						"Find a way for the village to survive the winter."
		nodes:
			start :
				name: (game) -> "Brainstorming"
				description: (game) -> "Talk to villagers, maybe someone can think of a good solution."
				action: undefined
				transitions: [
					transitionIfSpokenToXAboutY(
						["Artur", "Kashia"], "storing_energy_for_winter", "start",
						(game) -> ajuc.tiledArcade.activateQuest(game, "storing_energy_for_winter")
					)
					transitionIfSpokenToXAboutY(
						["Grandpa"], "building_new_3d_printer", "start",
						(game) -> ajuc.tiledArcade.activateQuest(game, "building_new_3d_printer")
					)
					transitionIfSpokenToXAboutY(
						["Valdeck", "Tadeush"], "gathering_fuel_and_flying_to_nearest_village","start",
						(game) -> ajuc.tiledArcade.activateQuest(game, "gathering_fuel_and_flying_to_nearest_village")
					)
					transitionIfQuestFinished("gathering_fuel_and_flying_to_nearest_village","success",
						(game) -> ajuc.tiledArcade.activateQuest(game, "become_fighter_pilot")
					)
					transitionIfQuestFinished("building_new_3d_printer","success",
						(game) -> ajuc.tiledArcade.activateQuest(game, "become_hacker")
					)
					transitionIfQuestFinished("storing_energy_for_winter","success",
						(game) -> undefined // TODO - maybe add some quest only possible after this path
					)
					transition( //
						(game)->(game.facts.uniqueFact("winter_came") && 
								!game.tiledArcade.questFinished(game, "gathering_fuel_and_flying_to_nearest_village") &&
								!game.tiledArcade.questFinished(game, "storing_energy_for_winter") &&
								!game.tiledArcade.questFinished(game, "building_new_3d_printer"))
								||
								(game.tiledArcade.questFailed(game, "gathering_fuel_and_flying_to_nearest_village") &&
								 game.tiledArcade.questFailed(game, "storing_energy_for_winter") &&
								 game.tiledArcade.questFailed(game, "building_new_3d_printer")),
						(game) -> undefined 
							//TODO - game over ? maybe not, but player character will have to live with the knwoledge,
							//that the village had frozen, and all inhabitants are probably dead
						,
						"failure"
					)
				]
			success :
				name: (game) -> "Brainstorming"
				description: (game) -> "Talk to villagers, maybe someone can think of a good solution."
			
			failure :
				name: (game) -> "Brainstorming"
				description: (game) -> "Talk to villagers, maybe someone can think of a good solution."
			
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