var players = require.context('./', true, /.js$/g).keys()
				.filter(player=>!(player.match("players.")||player.match("./humanPlayer.js")))
				.map(player=>require(`${player}`).default)

export default players