
var chooseRandom = ajuc.utils.chooseRandom;
var insertTransition = ajuc.dialog.insertTransition;
var insertESCTransition = ajuc.dialog.insertESCTransition;
var insertTransitionIf = ajuc.dialog.insertTransitionIf;
var insertTransitionIfNotTaken = ajuc.dialog.insertTransitionIfNotTaken;
var insertTransitionIfNotTakenToday = ajuc.dialog.insertTransitionIfNotTakenToday;

var dialog_data = {
	graphs : { // all graphs of dialog
	
	
		grandpa : { // one graph of dialog, named "grandpa"
			//nodes in format name : content
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true); //setMet sets both met and metToday; then metToday is cleared at midnight
						return [
							["player", chooseRandom("Hello", "Greetings", "Morning")+", grandpa."], // player
							[0, chooseRandom("Hi.", "Hello, indeed.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [
							[0, chooseRandom("Yes?", "So?")]
						];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "internet", "Tell me about the Plague.", undefined);
					insertTransitionIfNotTakenToday(game, facts, player, team, others, tmp, "parents", "When will parents return?", undefined);
					insertTransition(game, facts, player, team, others, tmp, "dinner", "Will you come to diner?", undefined);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
							ajuc.utils.popUiScreen(game.uiStack);
							game.running.game = true;
						});
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
						[0, chooseRandom("Surprisingly well, thank you.", "Not bad today.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Good.", undefined);
					return tmp;
				}
			},
			internet : { // 
				messages : function (game, facts, player, team, others) { 
					return [
					    [0, "Ok, so I'll tell you the story. You should know, and pass this to your kids. I'm old, can die any day now."],
					    ["player", "Grandpa!"],
						[0, "It was interesting time to live. Once in the known history "+
						 	"regular people had such power. I mean - to kill the whole Earth population on a whim."],						
						[0, "People weren't really thinking about it that way. At least at first. "+
							"It was all about the freedom of speech, "+
							"the right to communicate, and the ultimate humanitarian right - to copy and tinker."],
						[0, "Gray, long-bearded prophets of free software and nerdy teenagers - "+
						 	"nobody thought about them as a serious political force. Until 2012, that is. "+
						 	"Yet somehow they became one. And they won their war againist copyright. "+
						 	"Information really wants to be free, I guess."],
						[0, "By the time hackers won, everybody was on their side. "+
						 	"World was preparing for the incoming age of prosperity, "+
						 	"that the free information will bring. I thought so, too. We were all so naive. "+
						 	"3d printers, independent manufacturing, that was just the begining. "],
						["player", "Then the plague happened?"],
						[0, "Yes. It was inevitable. We just couldn't see that then."],
						["player", "Why? Hackers created the plague? Harold told me you were a hacker, so it's also your fault.."],
						[0, "Harold is stupid. Almost everybody were hacker then. Hacker meant you had Rogue Computing Device. "+
						 	"And I don't know who created this particular plague. "],
						["player", "There were more plagues?"],
						[0, "Yeah, tousands, if not millions. This one was just the most effective attempt. "+
							"It doesn't really matter, who created it. When molecular assemblers were invented, "+
							"and then available as schema for your desk 3d printer, it was only a matter of time. "+
							"People started doing anything with them. Governments wanted to stop that. People printed bombs, "+
							"plastic guns, rogue computing devices."],
						[0, "Do you know that 2 years after this invention we had like 10 working drugs for cancer? "+
						 	"People tested drugs on themselves, when regular therapy didn't worked. And surprise, surprise - " +
						 	"out of milions	of attempts some drugs actually worked. It was the greatest moment in the mankind history."],
						["player", "This cancer - was it worse than plague?"],
						[0, "It was different - cancer killed mostly old people, and it took few years to do so. "+
						 	"But it was often fatal, and people thought then, that we can make everybody live forever. "+
						 	"So it seemed like important thing to do. The drugs for cancer was the greatest human "+
						 	"inventions, it took decades of work of millions people all around the world. "],
						[0, "The drug for plague was piece of cake compared to drugs for cancer."],
						["player", "If the plagues was so easy to cure, why nobody did it!? Why so many people had to die?"],
						[0, "The problem with plague was - it gave no warnings, no signs that something is wrong. "+
						 	"Everybody was infected for a few weeks, and nobody even knew it's there. So nobody worked on the cure. "+
						 	"And then someone pushed the button, plague activated, and 90% of people were dead during the first hour. "+
						 	"The cure was ready next day. But in the meantime nukes started raining. And here we are."]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Ok, that was a long story.", undefined);
					return tmp;
				}
			},
			parents : { // 
				messages : function (game, facts, player, team, others) {
					return [
						[0, chooseRandom("When they'll buy fuel and fix the printer.", "When they'll fix the printer and buy everything we need.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Ok.", undefined);
					return tmp;
				}
			},
			dinner : { // 
				messages : function (game, facts, player, team, others) {
					var tmpOldAsked = ajuc.utils.nvlMinMax(facts.uniqueToday("askedGrandpaForDinner"), 0, 0, 2);
					var tmpNewAsked = ajuc.utils.nvlMinMax(tmpOldAsked+1, 0, 0, 2);
					facts.setUnique("askedGrandpaForDinner", tmpNewAsked);
					return [
						[0, ["No thanks, I've made soup already.",
						     "No thanks. I already said no.",
						     "What's wrong with you? No means NO."
						    ][tmpOldAsked]
						]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Ok.", undefined);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
		},
		
		
		sister : {
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true);
						return [
							["player", chooseRandom("Hello", "Greetings", "Morning")+", Viola."], // player
							[0, chooseRandom("Hi.", "Hello.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [
							[0, chooseRandom("Yes?")]
						];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "working on the farm", "Whose turn it is to work on the farm today?", undefined);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
							ajuc.utils.popUiScreen(game.uiStack);
							game.running.game = true;
						});
					return tmp;
				}
			},
			"working on the farm": {
				messages : function (game, facts, player, team, others) {
					//addQuest
					return [
						[0, chooseRandom("Your turn, brother. Fly to the farm, spray the plants with insecticide, and come back for dinner.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Ok, fine.", undefined);
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
					        [0, chooseRandom("Something's wrong? Since when are you caring for me, brother :). I'm fine, anyway.", "I'm fine.")],
					        [0, chooseRandom("And you?")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Me too.", undefined);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
			
		},
		
		
		tadeush_workshop : {
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true);
						return [
							["player", chooseRandom("Hi", "Greetings", "Morning")+", Tadeush."], // player
							[0, chooseRandom("Hi.", "Hello.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [
							[0, chooseRandom("Yes?", "So?")]
						];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertTransition(game, facts, player, team, others, tmp, "start", chooseRandom("Shall we go to the workshop?", "Workshop is open?"), function () {
						//ajuc.utils.popUiScreen(game.uiStack);
						var workshopDefinitionNo = 0;
						ajuc.tiledArcade.shop.prepare(workshopDefinitionNo); 
						ajuc.utils.pushUiScreen(game, "Shop");
					}, false);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
						ajuc.utils.popUiScreen(game.uiStack);
						game.running.game = true;
					});
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
						[0, chooseRandom("I'm fine, thank you.", "Great.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Ok.", undefined, false);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
		},
		
		tadeush : {
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true);
						return [
							["player", chooseRandom("Hello", "Greetings", "Morning")+", Tadeush."], // player
							[0, chooseRandom("Hi.", "Hello.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [
							[0, chooseRandom("Yes?", "So?")]
						];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
							ajuc.utils.popUiScreen(game.uiStack);
							game.running.game = true;
						});
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
						[0, chooseRandom("I'm fine, thanks", "Thank you, I'm fine.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Good.", undefined);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
			
		},

		malina : {
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true);
						return [
							["player", chooseRandom("Hello", "Greetings", "Morning")+", Malina."], // player
							[0, chooseRandom("Hi.", "Hello.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [
							[0, chooseRandom("Yes?", "So?")]
						];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
							ajuc.utils.popUiScreen(game.uiStack);
							game.running.game = true;
						});
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
						[0, chooseRandom("I'm fine.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Good.", undefined);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
			
		},
		
		
		harold : {
			start : { // start node is required
				messages : function (game, facts, player, team, others) { // function that returns map of person : what this person say 
					if (!facts.metToday("player", others[0])) {
						facts.setMet("player", others[0], true);
						return [
							["player", chooseRandom("Hello", "Greetings", "Morning")+", Harold."], // player
							[0, chooseRandom("Hi.", "Hello.", "Nice to see you")]	// index of person in others array
						];
					} else {
						return [];
					}
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransitionIfNotTaken(game, facts, player, team, others, tmp, "feel", "How do you do?", undefined);
					insertESCTransition(game, facts, player, team, others, tmp, "seeya", chooseRandom("See you.", "Goodbye", "So long."), function () {
							ajuc.utils.popUiScreen(game.uiStack);
							game.running.game = true;
						});
					return tmp;
				}
			},
			feel : { // 
				messages : function (game, facts, player, team, others) { 
					return [
						[0, chooseRandom("I'm fine.")]
					];
				},
				options : function (game, facts, player, team, others) {
					var tmp = [];
					insertTransition(game, facts, player, team, others, tmp, "start", "Good.", undefined);
					return tmp;
				}
			},
			seeya : {
				messages : function (game, facts, player, team, others) {
					return [];
				},
				options : function (game, facts, player, team, others) {
					return [];
				}
			}
			
		}
	}
};