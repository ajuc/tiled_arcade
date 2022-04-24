"use strict";
if ((typeof(ajuc) === 'undefined')) {
	ajuc = {};
}

ajuc.facts = (function() {

	function version() {
		return 0.01;
	};

	var database = {
		personKnowsPerson : {
			// (personId/personId) : true/false  
		},
		personMetTodayPerson : {
			// (personId/personId) : true/false
		},
		personlAreadySpokeAboutXWithPerson : {
			
		},
		personlAreadySpokeAboutXWithPersonToday : {
			
		},
		uniqueFact : {
		},
		uniqueFactToday : {
		},

		questStarted: {
		},
		questPhaseEntered: {
		},
		questFinished: {
		},
		
		entityDamagedEntityGroupAt: {
			
		},

		entityDamagedEntityWithBulletAt: {
			
		},
		entityDamagedEntityWithBullet: {
			
		},
		entityDamagedEntity: {
		}
	};
	
	// functions to be run by engine on database
	// mostly used for xxxTodayXxx facts, that should be cleared every morning
	var jobs = {
		everyMorning : [
		    function clearTodayFacts() {
		    	database.personMetTodayPerson = {};
		    	database.personlAreadySpokeAboutXWithPersonToday = {};
		    	database.uniqueFactToday = {};
		    	//TODO more ?
		    }
		]
	};

	// Create key string from fields
	function key() {
		var a = new Array(arguments.length);
		for (var i=0; i<arguments.length; i++) {
			a[i] = arguments[i];
		}
		return a.join("/");
	}
	
	function get(table, key) {
		if (database[table] === undefined) {
			return undefined;
		}
		return database[table][key];
	}
	
	function set(table, key, value) {
		if (database[table] === undefined) {
			return;
		}
		database[table][key] = value;
	}

	function unset(table, key) {
		if (database[table] === undefined) {
			return;
		}
		database[table][key] = undefined;
	}
	
	function exists(table, key) {
		if (database[table] === undefined) {
			return false;
		}
		return (database[table][key] !== undefined);
	}
	//
	
	
	// shortcurts (USE THESE)
	
	function met(person1, person2) {
		return get("personKnowsPerson", key(person1, person2));
	}
	function setMet(person1, person2, value) {
		set("personKnowsPerson", key(person1, person2), value);
		set("personMetTodayPerson", key(person1, person2), value);
	}
	function metToday(person1, person2) {
		return get("personMetTodayPerson", key(person1, person2));
	}
	
	function alreadySpokeAbout(person1, person2, subject) {
		return get("personlAreadySpokeAboutXWithPerson", key(person1, person2, subject));
	}
	function setAlreadySpokeAbout(person1, person2, subject, value) {
		set("personlAreadySpokeAboutXWithPerson", key(person1, person2, subject), value);
		set("personlAreadySpokeAboutXWithPersonToday", key(person1, person2, subject), value);
	}
	
	function alreadySpokeAboutToday(person1, person2, subject) {
		return get("personlAreadySpokeAboutXWithPersonToday", key(person1, person2, subject));
	}
	
	function unique(name) {
		return get("uniqueFact", key(name));
	}
	function setUnique(name, value) {
		set("uniqueFact", key(name), value);
		set("uniqueFactToday", key(name), value);
	}
	
	function uniqueToday(name) {
		return get("uniqueFactToday", key(name));
	}


	function questStarted(name) {
		return get("questStarted", key(name));
	}
	function setQuestStarted(name, value) {
		set("questStarted", key(name), value);
	}
	function questPhaseEntered(questname, phasename) {
		return get("questPhaseEntered", key(questname, phasename));
	}
	function setQuestPhaseEntered(questname, phasename, value) {
		set("questPhaseEntered", key(questname, phasename), value);
	}
	function questFinished(name) {
		return get("questFinished", key(name));
	}
	function setQuestFinished(name, value) {
		set("questFinished", key(name), value);
	}
	function questFailed(name) {
		return get("questFailed", key(name));
	}
	function setQuestFailed(name, value) {
		set("questFailed", key(name), value);
	}

	
	function entityDamagedEntityWithBulletAt(shooter, victim, bullet, at) {
		return get("entityDamagedEntityWithBulletAt", key(shooter, victim, bullet, at));
	}
	function setEntityDamagedEntityWithBulletAt(shooter, victim, bullet, at, value) {
		set("entityDamagedEntityWithBulletAt", key(shooter, victim, bullet, at), value);
		set("entityDamagedEntityWithBullet", key(shooter, victim, bullet), value);
		set("entityDamagedEntity", key(shooter, victim), value);
	}

	function entityDamagedEntityWithBullet(shooter, victim, bullet) {
		return get("entityDamagedEntityWithBulletAt", key(shooter, victim, bullet));
	}
	function setEntityDamagedEntityWithBullet(shooter, victim, bullet, value) {
		set("entityDamagedEntityWithBullet", key(shooter, victim, bullet), value);
		set("entityDamagedEntity", key(shooter, victim), value);
	}

	function entityDamagedEntity(shooter, victim) {
		return get("entityDamagedEntity", key(shooter, victim));
	}
	function setEntityDamagedEntity(shooter, victim, value) {
		set("entityDamagedEntity", key(shooter, victim), value);
	}

	// triggers
	
	function onMorning() {
		jobs.everyMorning();
	}
	
	return {
		version : version,

		database : database, // published, because tiledArcade needs to save and load this to/from localStorage //TODO - facts module should know how to do this by itself
		
		met : met,
		setMet: setMet,
		metToday : metToday,
		
		alreadySpokeAbout : alreadySpokeAbout,
		setAlreadySpokeAbout : setAlreadySpokeAbout,
		
		alreadySpokeAboutToday : alreadySpokeAboutToday,
		
		questStarted : questStarted,
		setQuestStarted : setQuestStarted,
		questPhaseEntered : questPhaseEntered,
		setQuestPhaseEntered : setQuestPhaseEntered,
		questFinished : questFinished,
		setQuestFinished : setQuestFinished,
		questFailed : questFailed,
		setQuestFailed : setQuestFailed,

		unique : unique,
		setUnique : setUnique,
		
		uniqueToday : uniqueToday,
		
		onMorning : onMorning
		
	};
})();