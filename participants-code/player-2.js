showdown.participants.push({
	name: 'Juan',
	code: `/*\n\*  This is your player's code.\n\*  Below there is an example of a player moving either 'east' 50% of the time or 'south' the other 50%, based on a random number generated.\n\*  We suggest you do not use that code, as you'll want something a lot more reactive to survive longer.\n\*  Think about running away from the chaser and checking you're not stepping into water or any other players!\n\*/\nvar fiftyFifty = ((Math.random() * 100) > 50);\n\if (fiftyFifty){\n\  me.move('west');\n\} else {\n\  me.move('south');\n\}`
});