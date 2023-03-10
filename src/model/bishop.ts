import { Move } from './move';
import { Position } from 'src/app/types/position';
import { ChessEntity } from './chess-entity';
import { Square } from './square';
import { King } from './king';
import { Board } from './board';
import { Pinned } from 'src/app/types/pinned';

export class Bishop extends ChessEntity {
  constructor(
    isWhite: boolean,
    currentPosition: Position
  ) {
    super(isWhite, currentPosition);
    if(isWhite) {
      this.imgUrl = '/assets/images/white-bishop.png';
    } else {
      this.imgUrl = '/assets/images/black-bishop.png';
    }
  }
  override checkLegalMoves(board: Board, enemyMoves: boolean = false): Move[] {
    const squares = board.squares;
    const currSquare = squares.find(square => square.occupiedBy === this);
    if(currSquare) {
      return [...this.addMove(currSquare, board, false, false, enemyMoves),
        ...this.addMove(currSquare, board, false, true, enemyMoves),
        ...this.addMove(currSquare, board, true, false, enemyMoves),
        ...this.addMove(currSquare, board, true, true, enemyMoves)
      ]
    }
    return [];
  }
  addMove(currSquare: Square, board: Board, rowIncrement: boolean, colIncrement: boolean, enemyMoves: boolean): Move[] {
    const squares = board.squares;
    const moves: Move[] = [];
    let row = currSquare.position.row;
    let col = currSquare.position.column;
    const rowMultiplier = (rowIncrement) ? 1 : -1;
    const colMultiplier = (colIncrement) ? 1 : -1;
    const pathToCheck: Square[] = [];
    const pinPath: Square[] = [];
    let encounteredPieces = 0;
    let pinnedPiece: ChessEntity | null = null;
    let kingFound = false;
    while(col >= 1 && col <= 8 && row >= 1 && row <= 8) {
      row += rowMultiplier;
      col += colMultiplier;
      const foundSquare = squares.find(square => square.position.row === row && square.position.column === col);
      const occupiedByEnemy = (foundSquare?.occupiedBy?.isWhite !== currSquare.occupiedBy?.isWhite);
      if(foundSquare && (foundSquare.occupiedBy == null || occupiedByEnemy)) {
        if(currSquare.occupiedBy) {
          if(encounteredPieces === 0) {
            const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
            moves.push(move);
            pathToCheck.push(foundSquare);
          }
          pinPath.push(foundSquare);
          if(foundSquare.occupiedBy != null && occupiedByEnemy) {
            if(foundSquare.occupiedBy instanceof King) {
              kingFound = true;
              if(encounteredPieces === 0) {
                board.pathToCheck = [currSquare, ...pathToCheck]; // enemy king is in check -> return path to check
              }
              if(!enemyMoves) {
                break;
              }
            } else {
              encounteredPieces++;
              pinnedPiece = foundSquare.occupiedBy;
              if(encounteredPieces > 1) {
                break;
              }
            }
          }
        }
      } else { // we encountered our own piece
        if(enemyMoves && foundSquare && currSquare.occupiedBy) {
          const move = new Move(currSquare, foundSquare, currSquare.occupiedBy);
          moves.push(move);
        }
        break;
      }
    }
    if(kingFound && encounteredPieces === 1 && pinnedPiece) {
      const pinned: Pinned = { pinnedPath: [currSquare, ...pinPath], pinnedPiece: pinnedPiece };
      board.pinned.push(pinned);
    }
    return moves;
  }
}
