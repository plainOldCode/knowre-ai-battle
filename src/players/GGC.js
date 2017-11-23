import { tileTypes, unitTypes } from '../constants';
import { 
    move //move(player, from, to, unitCount)
} from '../game/gameActions';
import { 
     getAllTilesWithArmyForPlayer, //getAllTilesWithArmyForPlayer(board, player)
     getAdjacentTiles, //getAdjacentTiles(board, tile)
     getSpawnsForPlayer, //getSpawnsForPlayer(board, player)
     getTilesByType, //getTilesByType(board, type) types:: 'MINOR_SPAWN', 'MAJOR_SPAWN', 'CAPTURE_POINT', 'NEUTRAL'
     getDeltas, //getDeltas(source, target)
     moveTowards, //moveTowards(source, target)
     getDistance, //getDistance(source, target)
     getClosest //getClosest(source, targets) 
} from '../game/boardUtilities';

export default class GGPlayerC {
	static getName() { return 'GGC' };

	constructor(color) {
		this.name = GGPlayerC.getName();
		this.color = color;

		this.moveCommand = [];
		this.moveHistory = [];
		this.playTurn = {
			'ALL' : 0,
			'LOCK' : 0
		}
	}

	turn(state) {
		this.playTurn.ALL++;
		if (this.playTurn.hasOwnProperty(state))
			this.playTurn[state]++;
		//console.log(state);
	}

	getStrategy() {
		if (this.playTurn.LOCK > 5){
			this.playTurn.LOCK = 0;
			return 'MAJOR';
		}
		if (this.playTurn.LOCK > 4){
			return 'MAJOR';
		}
		return 'NORMAL';
	}
		
	play(board) {
		let playState = 'NORMAL';
		const allTiles = getAllTilesWithArmyForPlayer(board, this);

		// Determine which armies we want to move
		const moving = allTiles.filter(tile => {
			if (tile.type === tileTypes.NEUTRAL) return true;
			if (tile.type === tileTypes.CAPTURE_POINT) return tile.unitCount > 1;
			if ([tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN].includes(tile.type))
				return tile.unitCount > 0;
			return false;
		});

		// Now move each army towards the closest capture point which is not occupied by us
		const targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player !== this);
		const all_targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player);
		if (all_targets.length >=4) {
			playState = 'LOCK';
		}
		const major_targets = getTilesByType(board, tileTypes.MAJOR_SPAWN).filter(target => target.player!==this );
		if (major_targets.length<=0) {
			playState = 'MAJOR';
		}

		this.turn(playState);

		let s = this.getStrategy();

		if (s==='MAJOR') {
			return moving.map(source => {
				const target = getClosest(source, major_targets);
				const movingUnitCount = {
					[tileTypes.CAPTURE_POINT]: source.unitCount - 1,
					[tileTypes.MINOR_SPAWN]: source.unitCount,
					[tileTypes.MAJOR_SPAWN]: source.unitCount,
					[tileTypes.NEUTRAL]: source.unitCount,
					/*
					[tileTypes.CAPTURE_POINT]: source.unitCount > 0 ? 1 : 0 ,
					[tileTypes.MINOR_SPAWN]: source.unitCount > 0 ? 1 : 0,
					[tileTypes.MAJOR_SPAWN]: source.unitCount > 0 ? 1 : 0,
					[tileTypes.NEUTRAL]: source.unitCount > 0 ? 1 : 0,
					*/
				}[source.type];
				return move(this, source, moveTowards(source, target), movingUnitCount);
			});
		} else {
			return moving.map(source => {
				const target = getClosest(source, targets);
				const movingUnitCount = {
					[tileTypes.CAPTURE_POINT]: source.unitCount - 1,
					[tileTypes.MINOR_SPAWN]: source.unitCount,
					[tileTypes.MAJOR_SPAWN]: source.unitCount,
					[tileTypes.NEUTRAL]: source.unitCount,
				}[source.type];
				return move(this, source, moveTowards(source, target), movingUnitCount);
			});
		}
		
	}

	moveFlush() {
		let that = this;
		const previous = that.moveCommand;
		this.moveHistory.push(previous);
		this.moveCommand = [];
	}

	
}
