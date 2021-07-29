//DeckKernal populates the inUsePieces array with the objects of all the pieces
class DeckKernel {
	//Setup the board
	constructor(){
		this.selectedPieces = [];
		this.inUseWhitePieces = [];
		this.inUseBlackPieces = [];
		this.validMoves = [];

		this.reset();
		
	}
	//Reset the board on game restart
	reset(){
		this.selectedPieces = [];
		this.inUseWhitePieces = [];
		this.inUseBlackPieces = [];
		this.validMoves = []
		
			for(let i = 0; i <= 7; i++){
				this.inUseWhitePieces.push(new Piece("Pawn",(i),[2,i+1],"White","./images/white_pawn.png"));
			}
			
			
			this.inUseWhitePieces.push(new Piece ("Knight",8,[1,7],"White","./images/white_knight.png"));
			this.inUseWhitePieces.push(new Piece ("Knight",9,[1,2],"White","./images/white_knight.png"));
			this.inUseWhitePieces.push(new Piece ("Bishop",10,[1,6],"White","./images/white_bishop.png"));
			this.inUseWhitePieces.push(new Piece ("Bishop",11,[1,3],"White","./images/white_bishop.png"));
			this.inUseWhitePieces.push(new Piece ("Rook",12,[1,8],"White","./images/white_rook.png"));
			this.inUseWhitePieces.push(new Piece ("Rook",13,[1,1],"White","./images/white_rook.png"));
			
			
			this.inUseWhitePieces.push(new Piece ("King",14,[1,5],"White","./images/white_king.png"));
			this.inUseWhitePieces.push(new Piece ("Queen",15,[1,4],"White","./images/white_queen.png"));
			//Create other type of pieces
			for(let i = 0; i <= 7; i++){
				this.inUseBlackPieces.push(new Piece("Pawn",(i),[7,i+1],"Black","./images/black_pawn.png"));
			}
			
			this.inUseBlackPieces.push(new Piece ("Knight",8,[8,7],"Black","./images/black_knight.png"));
			this.inUseBlackPieces.push(new Piece ("Knight",9,[8,2],"Black","./images/black_knight.png"));
			this.inUseBlackPieces.push(new Piece ("Bishop",10,[8,6],"Black","./images/black_bishop.png"));
			this.inUseBlackPieces.push(new Piece ("Bishop",11,[8,3],"Black","./images/black_bishop.png"));
			this.inUseBlackPieces.push(new Piece ("Rook",12,[8,8],"Black","./images/black_rook.png"));
			this.inUseBlackPieces.push(new Piece ("Rook",13,[8,1],"Black","./images/black_rook.png"));
			

			this.inUseBlackPieces.push(new Piece ("King",14,[8,5],"Black","./images/black_king.png"));
			this.inUseBlackPieces.push(new Piece ("Queen",15,[8,4],"Black","./images/black_queen.png"));
	}
	
	resetSelected(){
		this.selectedPieces = [];
	}
	findIfPosFilled(pos){
		var test = false;
		for(let i = 0; i<this.inUseBlackPieces.length; i++){
				if(pos[0] == this.inUseBlackPieces[i].get_pos[0] && pos[1] == this.inUseBlackPieces[i].get_pos[1]){
					test = true;
				}
		}
		for(let i = 0; i<this.inUseWhitePieces.length; i++){
			if(pos[0] == this.inUseWhitePieces[i].get_pos[0] && pos[1] == this.inUseWhitePieces[i].get_pos[1]){
				test = true;
			}
		}

		return test;
	}
	findByPos(pos){
		var temp;
		for(let i = 0; i<this.inUseBlackPieces.length; i++){
			if(pos[0] == this.inUseBlackPieces[i].get_pos[0] && pos[1] == this.inUseBlackPieces[i].get_pos[1]){
				
				return this.inUseBlackPieces[i];
			}
		}
		for(let i = 0; i<this.inUseWhitePieces.length; i++){
			if(pos[0] == this.inUseWhitePieces[i].get_pos[0] && pos[1] == this.inUseWhitePieces[i].get_pos[1]){

				
				return this.inUseWhitePieces[i];
		}
	}
	
		
	}

	findWhiteKing(){
		var piece;
		for(let i = 0; i<this.inUseWhitePieces.length; i++){
			if(this.inUseWhitePieces[i].get_type == "King"){
				piece = this.inUseWhitePieces[i];
				break;
			}
		}
		return piece.get_pos;
	}

	findBlackKing(){
		var piece;
		for(let i = 0; i<this.inUseBlackPieces.length; i++){
			if(this.inUseBlackPieces[i].get_type == "King"){
				piece = this.inUseBlackPieces[i];
				break;
			}
		}
		return piece.get_pos;
	}

	getBlackKing(){
		var piece;
		for(let i = 0; i<this.inUseBlackPieces.length; i++){
			if(this.inUseBlackPieces[i].get_type == "King"){
				piece = this.inUseBlackPieces[i];
				break;
			}
		}
		return piece;
	}

	getWhiteKing(){
		var piece;
		for(let i = 0; i<this.inUseWhitePieces.length; i++){
			if(this.inUseWhitePieces[i].get_type == "King"){
				piece = this.inUseWhitePieces[i];
				break;
			}
		}
		return piece;
	}

	findRook(color, ID){
		var rook;
		if(color == "White"){
			
			for(let i = 0; i < this.inUseWhitePieces.length; i++){
				if(this.inUseWhitePieces[i].get_id == ID){
					rook = this.inUseWhitePieces[i];
				
				}
			}
		}else{
			for(let i = 0; i < this.inUseBlackPieces.length; i++){
				if(this.inUseBlackPieces[i].get_id == ID){
					rook = this.inUseBlackPieces[i];
			
				}
			}
		}
		return rook;
	}

	



	checkPromotion(piece){
		//CHECK TO SEE IF QUEEN EXISTS BEFORE PROMOTING TO QUEEN
		if(piece.get_color == "White"){
			//promote if reaches row 8
			if(piece.get_pos[0] == 8){
				this.promotePawn(piece);
			}
		}else{
			//promote if reaches row 1
			if(piece.get_pos[0] == 1){
				this.promotePawn(piece);
			}
		}
		
	}

	



	promotePawn(piece){
		if(piece.get_color == "White"){
			
			for(let i = 0; i<this.inUseWhitePieces.length; i++){
				if(this.inUseWhitePieces[i].get_id == piece.get_id){
					this.inUseWhitePieces.splice(i,1);
					
				}
			}
			this.inUseWhitePieces.push(new Piece ("Queen",piece.get_id,piece.get_pos,"White","./images/white_queen.png"));
		}else{
			
			for(let i = 0; i<this.inUseBlackPieces.length; i++){
				if(this.inUseBlackPieces[i].get_id == piece.get_id){
					this.inUseBlackPieces.splice(i,1);
					
				}
			}
			this.inUseBlackPieces.push(new Piece ("Queen",piece.get_id,piece.get_pos,"Black","./images/black_queen.png"));
		}
	}
}
