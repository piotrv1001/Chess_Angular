import { Piece } from './../../app/types/piece';
import { Component, Output, EventEmitter, Input } from "@angular/core";
import { MatDialogRef } from '@angular/material/dialog';

export interface PieceInfo {
  name: string
  piece: Piece,
  imgUrl: string,
}

@Component({
  selector: 'app-pawn-promotion',
  templateUrl: './pawn-promotion-dialog.component.html',
  styleUrls: ['./pawn-promotion-dialog.componen.scss']
})
export class PawnPromotionDialogComponent {

  pieces: PieceInfo[] = [];

  @Input() isWhite?: boolean;
  @Output() pieceSelect: EventEmitter<Piece> = new EventEmitter<Piece>();

  constructor(public dialogRef: MatDialogRef<PawnPromotionDialogComponent>) {
    this.pieces = [
      { name: 'Queen', piece: Piece.QUEEN, imgUrl: this.isWhite ? '/assets/images/white-queen.png' : '/assets/images/black-queen.png' },
      { name: 'Rook', piece: Piece.ROOK, imgUrl: this.isWhite ? '/assets/images/white-rook.png' : '/assets/images/black-rook.png' },
      { name: 'Bishop', piece: Piece.BISHOP, imgUrl: this.isWhite ? '/assets/images/white-bishop.png' : '/assets/images/black-rook.png' },
      { name: 'Knight', piece: Piece.KNIGHT, imgUrl: this.isWhite ? '/assets/images/white-knight.png' : '/assets/images/black-knight.png' },
    ];
  }

  pieceSelected(piece: Piece): void {
    this.dialogRef.close(piece);
  }
}
