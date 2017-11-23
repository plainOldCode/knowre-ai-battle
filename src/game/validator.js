export default function determineValidMove(board, player, move) {
	const fromTile = board.tiles[move.from.x][move.from.y];
	const toTile = board.tiles[move.to.x][move.to.y];
	
	const fromCoords = `(${move.from.x},${move.from.y})`;
	// Check if tile is owned by the player that is moving
	if (fromTile.player !== player) {
		return {
			valid: false,
			message: `It seems that player "${player.name}" doesn\'t occupy tile ${fromCoords}`,
			move,
		}
	}
	
	// Check for unitCount > 0
	if (move.unitCount <= 0) {
		return {
			valid: false,
			message: 'You should move at least 1 unit',
			move,
		}
	}

	// Check for 자연수
	if (move.unitCount % 1 !== 0) {
		return {
			valid: false,
			message: '자연수 갯수만큼만 이동시켜주세요!',
			move,
		}
	}
	
	// Check if the tiles are adjacent
	if (Math.abs(move.from.x - move.to.x) > 1 + Math.abs(move.from.y - move.to.y) > 1) {
		return {
			valid: false,
			message: `가로세로로 한칸씩만 이동할 수 있습니다!`,
			move,
		};
	}

	// Check if the from tile has enough units
	if (fromTile.unitCount < move.unitCount) {
		return {
			valid: false,
			message: `Cannot move ${move.unitCount} units from ${fromCoords}, since you only have ${fromTile.unitCount} units available there`,
			move,
		}
	}

	// Check if tiles are of the same type
	if (fromTile.player === toTile.player && toTile.unitCount > 0 && toTile.unitType !== fromTile.unitType) {
		return {
			valid: false,
			message: 'Cannot merge armies of unequal types',
			move,
		}
	}
	
	return { valid: true };
}