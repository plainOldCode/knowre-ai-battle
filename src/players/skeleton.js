// import { 
//     move //move(player, from, to, unitCount)
// } from '../game/gameActions';
// import { 
//     getAllTilesWithArmyForPlayer, //getAllTilesWithArmyForPlayer(board, player)
//     getAdjacentTiles, //getAdjacentTiles(board, tile)
//     getSpawnsForPlayer, //getSpawnsForPlayer(board, player)
//     getTilesByType, //getTilesByType(board, type) types:: 'MINOR_SPAWN', 'MAJOR_SPAWN', 'CAPTURE_POINT', 'NEUTRAL'
//     getDeltas, //getDeltas(source, target)
//     moveTowards, //moveTowards(source, target)
//     getDistance, //getDistance(source, target)
//     getClosest //getClosest(source, targets) 
// } from '../game/boardUtilities';

export default class Player {
	static getName() { return 'skeleton' };

	constructor(color) {
		this.name = Player.getName();
		this.color = color;
	}

	play(board) {
		return [];
	}
}