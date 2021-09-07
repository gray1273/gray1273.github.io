class ChessBoard {
    constructor() {
        //Board creates a new deck, deck creates and holds all the pieces
        this.deck = new DeckKernel();
        this.prepareBoard();
        this.turn = "White";
        this.whiteKingCheck = false;
        this.blackKingCheck = false;
        this.checkingBlackKing = [];
        this.checkingWhiteKing = [];

    }
    set_turn(turn){
        this.turn = turn;
    }
    get get_turn(){
        return this.turn;
    }
    set_whiteKingCheck(value){
        this.whiteKingCheck = value;
    }
    set_blackKingCheck(value){
        this.blackKingCheck = value;
    }



    //-------------BOARD MAINTENENCE---------------------------------


    prepareBoard() {
        //Create the HTML chess board squares
        var strDiv = "<table class = \"center\">";
        var temp = 0;
        var color = "";

        for(let i = 8; i>=1; i--){
            strDiv += "<tr>";
            for(let k = 1; k<=8; k++){
                if(((k+i)%2)== 1){
                    color = "white";
                }else{
                    color = "black";
                }
                //Create each column for each row with a class, an embedded image, and onlick method
                strDiv += "<td class = \""+color+"\"onclick=\"space(["+i+","+k+"])\"id=\""+i+""+k+"\"></td>";
            }
            strDiv += "</tr>";
        }
    strDiv += "</table>"


    //Add the rows and columns to the html body.
    document.getElementById("theBoard").innerHTML = strDiv;
    //Update the board with the pieces
    this.updateBoard();

    }


    //Update board resets all spots on the board and then adds the correct pieces to the correct spot.
    updateBoard(){
        for(let i = 1; i <=8; i++){
            for(let k = 1; k <=8; k++){



                var squareID = i+""+k;
                //console.log(squareID);
                document.getElementById(squareID).innerHTML = "";
            }
        }
        //Adds the black pieces to the spot they belong
        for(let i = 0; i < this.deck.inUseBlackPieces.length; i++){
            //Set pieces on board
            var temp = this.deck.inUseBlackPieces[i].get_pos;

            var squareID =  temp[0] +""+ temp[1];
            document.getElementById(squareID).innerHTML = "<img id = \"i"+temp[0]+""+temp[1]+"\" class = \"centerPiece\" src = \"" +this.deck.inUseBlackPieces[i].get_source +"\"</img>";
        }
        //Adds the white pieces to the spot that they belong
        for(let i = 0; i < this.deck.inUseWhitePieces.length; i++){
            var temp = this.deck.inUseWhitePieces[i].get_pos;

            var squareID =  temp[0] +""+ temp[1];
            //console.log(squareID);
            document.getElementById(squareID).innerHTML = "<img id = \"i"+temp[0]+""+temp[1]+"\" class = \"centerPiece\" src = \"" +this.deck.inUseWhitePieces[i].get_source+"\"</img>";
        }



    }




    //-----------------PROCESSING CLICKS--------------------------------

    processClick(position){
        if((this.turn == "White" && !this.whiteKingCheck) || (this.turn == "Black" && !this.blackKingCheck)){
            this.nonCheckClick(position);
        }else{
            this.checkClick(position);
        }
    }





    checkClick(position){

        console.log("---------CHECK CLICK--------------")
        var piece;
        var color;
        var type;
        var pos1;
        var pos2;
        var isUsable = false;
        var moves = [];
        var usable = [];
        if(this.checkIfMate(this.turn)){
            if(this.turn == "White"){
                alert("Game over, Black won!");
            }else{
                alert("Game over, White won!");
            }
        }
        //console.log("Checking White King " + this.checkingWhiteKing);
        //console.log("Checking Black King " + this.checkingBlackKing);
        //Process alternative movement, only can select the king of the turned color or piece to free said king.
        //Call validWhite/BlackKingMovements to find a list of king moves
        //
        this.deck.selectedPieces.push(position);
        if(this.deck.selectedPieces.length == 1){
            if(this.deck.findIfPosFilled(position)){

                piece = this.deck.findByPos(position);
                color = piece.get_color;

                type = piece.get_type;
                //Check if you can block
                this.deck.validMoves = this.deck.validMoves.concat(this.canBlock(piece));
                if(this.deck.validMoves.length != 0){
                    usable.push(piece);
                    isUsable = true;
                }
                if(color == "White" && this.checkingWhiteKing.length == 1){

                    usable = this.findWhiteMovesInCheck(this.checkingWhiteKing[0]);


                    for(let k = 0; k<usable.length; k++){
                        if(usable[k].get_id == piece.get_id){
                            isUsable = true;
                        }
                    }


                }else if(color == "Black" && this.checkingBlackKing.length == 1){

                    usable = this.findBlackMovesInCheck(this.checkingBlackKing[0]);


                    for(let k = 0; k< usable.length; k++){
                        if(usable[k].get_id == piece.get_id){
                            isUsable = true;
                        }
                    }
                }
                if(color == this.get_turn && type == "King"){

                    var squareID = position[0] + "" + position[1];
	                var nameClass = document.getElementById(squareID).className;
                    nameClass = nameClass + " selected"
                    document.getElementById(squareID).className = nameClass;
                    //swap turn color
                    //Calculat moves
                    //Call function that adds green class to each available spot
                    if(this.turn == "White"){
                        this.deck.validMoves = this.validWhiteKingMoves(piece);
                    }else{
                        this.deck.validMoves = this.validBlackKingMoves(piece);
                    }
                    this.turnGreen();
                }else if(color == this.get_turn && isUsable){
                    var squareID = position[0] + "" + position[1];
	                var nameClass = document.getElementById(squareID).className;
                    nameClass = nameClass + " selected"
                    document.getElementById(squareID).className = nameClass;
                    switch(piece.get_type){
                        case "King":
                            //dealt with elsewhere
                            break;
                        case "Queen":
                            moves = this.movementQueen(piece);
                            break;
                        case "Rook":
                            moves = this.movementRook(piece);
                            break;
                        case "Bishop":
                            moves = this.movementBishop(piece);
                            break;
                        case "Pawn":
                            moves = this.movementPawn(piece);
                            break;
                        case "Knight":
                            moves = this.movementKnight(piece);
                            break;
                    }

         
                       




                    if(this.turn == "White"){
                        for(let i = 0; i < this.checkingWhiteKing.length; i++){
                            //NEED TO CROSS CHECK WITH THE PIECES ACTUAL MOVES
                            for(let k = 0; k<moves.length; k++){
                                if(arrayEquals(moves[k], this.checkingWhiteKing[i].get_pos))
                                    this.deck.validMoves.push(this.checkingWhiteKing[i].get_pos);
                            }
                        }
                    }else{
                        for(let i = 0; i < this.checkingBlackKing.length; i++){
                            for(let k = 0; k<moves.length; k++){
                                if(arrayEquals(moves[k], this.checkingBlackKing[i].get_pos))
                                    this.deck.validMoves.push(this.checkingBlackKing[i].get_pos);
                            }
                    }

                 





                }
                    this.turnGreen();
                }
                //Check to see if the piece is valid and has future moves that can take the checking piece.
                else{
                    this.deck.selectedPieces = [];
                    this.deck.validMoves = [];
                    this.removeGreen();
                }
            }else{
                this.deck.selectedPieces= [];
            }

        }else if(this.deck.selectedPieces.length == 2){
            var validSpot = false;
            for(let i =0; i<this.deck.validMoves.length; i++){
                if(arrayEquals(this.deck.validMoves[i], this.deck.selectedPieces[1])){
                    validSpot = true;
                }
            }
            if(arrayEquals(this.deck.selectedPieces[0],this.deck.selectedPieces[1])){
                this.deck.selectedPieces = [];
                this.deck.validMoves = [];
                this.removeGreen();
                this.removeSelected();
            }else if(!validSpot){
                this.deck.selectedPieces.splice(1,1);
            }
            else{


                for(let i = 0; i<this.deck.validMoves.length; i++){
                    if(arrayEquals(this.deck.selectedPieces[1],this.deck.validMoves[i])){

                        pos1 = this.deck.selectedPieces[0];
                        pos2 = this.deck.selectedPieces[1];
                        this.deck.selectedPieces = [];
                        this.removeSelected();
                        this.removeGreen();
                        this.movePiece(pos1,pos2);
                    }
                }

             }

        }
        //Update the function to get out of check


    }





    nonCheckClick(position){

        console.log("==============NONCHECK CLICK================")
        var piece;
        var color;
        var type;
        var pos1;
        var pos2;
        this.checkingWhiteKing = [];
        this.checkingBlackKing = [];
        this.deck.selectedPieces.push(position);


        if(this.deck.selectedPieces.length == 1){
            if(this.deck.findIfPosFilled(position)){

                piece = this.deck.findByPos(position);
                color = piece.get_color;
                type = piece.get_type;
                if(color == this.get_turn){
                    var squareID = position[0] + "" + position[1];
	                var nameClass = document.getElementById(squareID).className;
                    nameClass = nameClass + " selected"
                    document.getElementById(squareID).className = nameClass;
                    //swap turn color
                    //Calculat moves
                    //Call function that adds green class to each available spot
                    switch(type){
                        case "King":
                            if(color == "White"){
                                this.deck.validMoves = this.validWhiteKingMoves();
                            }else{
                                this.deck.validMoves = this.validBlackKingMoves();
                            }
                            break;
                        case "Queen":
                            this.deck.validMoves = this.movementQueen(piece);
                            break;
                        case "Rook":
                            this.deck.validMoves = this.movementRook(piece);
                            break;
                        case "Bishop":
                            this.deck.validMoves = this.movementBishop(piece);
                            break;
                        case "Pawn":
                            this.deck.validMoves = this.movementPawn(piece);
                            break;
                        case "Knight":
                            this.deck.validMoves = this.movementKnight(piece);
                            break;
                    }
                    var tempMoves = [];
                    tempMoves = this.deck.validMoves;
                    this.deck.validMoves = [];
                    var originalPos = piece.get_pos;
                    var doesCheck = false;
                    var whiteMoves;
                    var blackMoves;
                    var whiteKingPos;
                    var blackKingPos;
                    for(let i = 0; i<tempMoves.length; i++){
                        piece.set_pos(tempMoves[i]);
                        if(piece.get_color == "White"){
                            whiteKingPos = this.deck.findWhiteKing();
                            blackMoves = this.findBlackMoves();
                            for(let k = 0; k<blackMoves.length;k++){
                                if(arrayEquals(blackMoves[k], whiteKingPos)){
                                    doesCheck = true;
                                }
                            }
                        }else{
                            blackKingPos = this.deck.findBlackKing();
                            whiteMoves = this.findWhiteMoves();
                            for(let k = 0; k<whiteMoves.length;k++){
                                if(arrayEquals(whiteMoves[k], blackKingPos)){
                                    doesCheck = true;
                                }
                            }
                        }
                        if(!doesCheck){
                            this.deck.validMoves.push(tempMoves[i]);
                        }
                        piece.set_pos(originalPos);
                        doesCheck = false;
                    }



                    this.turnGreen();
                }else{
                    this.deck.selectedPieces = [];
                    this.deck.validMoves = [];
                    this.removeGreen();
                }
            }else{
                this.deck.selectedPieces = [];
            }
        }else if(this.deck.selectedPieces.length == 2){
            var validSpot = false;
            for(let i =0; i<this.deck.validMoves.length; i++){
                if(arrayEquals(this.deck.validMoves[i], this.deck.selectedPieces[1])){
                    validSpot = true;
                }
            }
            //Check to see if moving the piece would cause check
           /*  if(this.deck.findIfPosFilled(this.deck.selectedPieces[0])){
                var tempPiece = this.deck.findByPos(this.deck.selectedPieces[0]);
                tempPiece.set_pos(this.deck.selectedPieces[1]);
                if(this.checkIfCheck(tempPiece.get_color)){
                    validSpot = false;
                }
                tempPiece.set_pos(this.deck.selectedPieces[0]); 
            } */


            if(arrayEquals(this.deck.selectedPieces[0],this.deck.selectedPieces[1])){
                this.deck.selectedPieces = [];
                this.deck.validMoves = [];
                this.removeGreen();
                this.removeSelected();
            }else if(!validSpot){
                this.deck.selectedPieces.splice(1,1);
            }
            else{
                for(let i = 0; i<this.deck.validMoves.length; i++){
                    if(arrayEquals(this.deck.selectedPieces[1],this.deck.validMoves[i])){
                        pos1 = this.deck.selectedPieces[0];
                        pos2 = this.deck.selectedPieces[1];
                        this.deck.selectedPieces = [];
                        this.removeSelected();
                        this.removeGreen();

                        this.movePiece(pos1,pos2);
                    }
                }
             }

        }
    }

    //Valid Move that the white king can make when he is in check
    validWhiteKingMoves(){
		var kingPiece = this.deck.getWhiteKing();
		var blackMoves = this.findBlackMoves();
		var kingMovesOriginal = this.movementKing(kingPiece);
		var kingMoves = [];
		var canKingMoveHere = true;
        var finalMoves= [];
        var doesMoveWork = true;
        var returnMoves = [];
		for(let i = 0; i < kingMovesOriginal.length; i++){
			for(let k = 0; k<blackMoves.length; k++){
				if(arrayEquals(blackMoves[k],kingMovesOriginal[i])){
					canKingMoveHere = false;
				}
			}
			if(canKingMoveHere){
				kingMoves.push(kingMovesOriginal[i]);
			}
			canKingMoveHere = true;
		}

        //See if king can safely move to spots
        for(let i = 0; i < kingMoves.length; i++){
            doesMoveWork = true;
			if(this.deck.findIfPosFilled(kingMoves[i])){
                var piece = this.deck.findByPos(kingMoves[i]);
                //Delete piece, check if king moving there is an issue, replace piece.
                for(let k= 0; k<this.deck.inUseBlackPieces.length; k++){
                    if(this.deck.inUseBlackPieces[k].get_id == piece.get_id){
                        this.deck.inUseBlackPieces.splice(k,1);
                    }
                }

                blackMoves = this.findBlackMoves();
                //Check if king being there would be a problem
                for(let k =0; k<blackMoves.length; k++){
                    for(let j = 0; j < kingMoves.length; j++){
                        if(arrayEquals(blackMoves[k],kingMoves[j])){
                            //kingMoves.splice(j,1);
                            doesMoveWork = false;
                        }
                    }
                }
                if(doesMoveWork){
                    finalMoves.push(kingMoves[i]);
                }
                this.deck.inUseBlackPieces.push(piece);

            }else{
                //Temp remove king piece for calculations
                for(let w = 0; w<this.deck.inUseWhitePieces.length; w++){
                    if(this.deck.inUseWhitePieces[w].get_type == "King"){
                        this.deck.inUseWhitePieces.splice(w,1);
                    }
                }
                blackMoves = this.findBlackMoves();
                //Check if king being there would be a problem
                for(let k =0; k<blackMoves.length; k++){

                        if(arrayEquals(blackMoves[k],kingMoves[i])){
                           doesMoveWork = false;
                        }

                }
                this.deck.inUseWhitePieces.push(kingPiece);
                if(doesMoveWork){
                    finalMoves.push(kingMoves[i]);
                }
            }
		}



        for(let i = 0; i < finalMoves.length; i++){
            doesMoveWork = true;
            for(let k = 0; k < this.deck.inUseBlackPieces.length; k++){
                if(this.deck.inUseBlackPieces[k].get_type == "Pawn"){
                    var pos = this.deck.inUseBlackPieces[k].get_pos;

                    //console.log("Original Pawn Position: " + pos);


                    //console.log("New position (Unchanged) " + this.deck.inUseWhitePieces[k].get_pos);
                    var temp = finalMoves[i];
                    if(temp[0] == (pos[0]-1) && temp[1] == (pos[1]+1)){
                        doesMoveWork = false;
                    }else if(temp[0] == (pos[0]-1) && temp[1] == (pos[1]-1)){
                        doesMoveWork = false;
                    }
                    //console.log("New position (Unchanged) " + this.deck.inUsePieces[k].get_pos);
                }
            }
            if(doesMoveWork){
                returnMoves.push(finalMoves[i]);
            }
        }

        //console.log("Ending " + returnMoves);
		return returnMoves;

	}




    //Valid Moves that the Black King can make when he is in check
	validBlackKingMoves(){
		var kingPiece = this.deck.getBlackKing();
		var whiteMoves = this.findWhiteMoves();
		var kingMovesOriginal = this.movementKing(kingPiece);
		var kingMoves = [];
        var finalMoves = [];
        var returnMoves = [];
		var canKingMoveHere = true;
        var doesMoveWork = true;

		for(let i = 0; i < kingMovesOriginal.length; i++){
			for(let k = 0; k<whiteMoves.length; k++){
				if(arrayEquals(whiteMoves[k],kingMovesOriginal[i])){
					canKingMoveHere = false;
				}
			}
			if(canKingMoveHere){
				kingMoves.push(kingMovesOriginal[i]);
			}
			canKingMoveHere = true;
		}



        //check to see if next move is safe

       for(let i = 0; i < kingMoves.length; i++){
           doesMoveWork = true;

			if(this.deck.findIfPosFilled(kingMoves[i])){

                var piece = this.deck.findByPos(kingMoves[i]);

                //Dont have to check if the piece is the same color, it is guaranteed to not be
                //Delete piece, check if king moving there is an issue, replace piece.

                for(let k= 0; k<this.deck.inUseWhitePieces.length; k++){
                    if(this.deck.inUseWhitePieces[k].get_id == piece.get_id){
                        //console.log("Removing "+ piece +" from white pieces");
                        this.deck.inUseWhitePieces.splice(k,1);


                    }
                }

                whiteMoves = this.findWhiteMoves();


                //Check if king being there would be a problem
                for(let j =0; j<whiteMoves.length; j++){
                        if(arrayEquals(whiteMoves[j],kingMoves[i])){
                            //console.log("Removing "+ kingMoves[i]+" from black king moves");
                            //kingMoves.splice(i,1);
                            doesMoveWork = false;
                        }
                }
                if(doesMoveWork){
                    finalMoves.push(kingMoves[i]);
                }
                this.deck.inUseWhitePieces.push(piece);

            }else{


                for(let w = 0; w<this.deck.inUseBlackPieces.length; w++){
                    if(this.deck.inUseBlackPieces[w].get_type == "King"){
                        this.deck.inUseBlackPieces.splice(w,1);
                    }
                }
                whiteMoves = this.findWhiteMoves();
                //Check if king being there would be a problem
                for(let k =0; k<whiteMoves.length; k++){

                        if(arrayEquals(whiteMoves[k],kingMoves[i])){
                            //Do not add
                            //console.log("Removing "+ kingMoves[i]+" from black king moves");
                            //kingMoves.splice(i,1);
                            doesMoveWork = false;
                        }else{

                        }

                }
                if(doesMoveWork){
                    finalMoves.push(kingMoves[i]);
                }
                this.deck.inUseBlackPieces.push(kingPiece);
            }
		}

        //Remove pieces that are diagonal to pawn checking
        for(let i = 0; i < finalMoves.length; i++){
            doesMoveWork = true;
            for(let k = 0; k < this.deck.inUseWhitePieces.length; k++){
                if(this.deck.inUseWhitePieces[k].get_type == "Pawn"){
                    var pos = this.deck.inUseWhitePieces[k].get_pos;

                    //console.log("Original Pawn Position: " + pos);


                    //console.log("New position (Unchanged) " + this.deck.inUseWhitePieces[k].get_pos);
                    var temp = finalMoves[i];
                    if(temp[0] == (pos[0]+1) && temp[1] == (pos[1]+1)){
                        doesMoveWork = false;
                    }else if(temp[0] == (pos[0]+1) && temp[1] == (pos[1]-1)){
                        doesMoveWork = false;
                    }
                    //console.log("New position (Unchanged) " + this.deck.inUseWhitePieces[k].get_pos);
                }
            }
            if(doesMoveWork){
                returnMoves.push(finalMoves[i]);
            }
        }

        //console.log("Ending " + returnMoves);
		return returnMoves;
        //return finalMoves;
	}





	findBlackMoves(){
		var outcome = [];
		var type;
		var piece;
		for(let i = 0; i<this.deck.inUseBlackPieces.length; i++){
			type = this.deck.inUseBlackPieces[i].get_type;
			piece = this.deck.inUseBlackPieces[i];
			switch(type){
                case "King":
                    outcome = outcome.concat(this.movementKing(piece));
                    break;
                case "Queen":
                    outcome = outcome.concat(this.movementQueen(piece));
                    break;
                case "Rook":
                    outcome = outcome.concat(this.movementRook(piece));
                    break;
                case "Bishop":
                    outcome = outcome.concat(this.movementBishop(piece));
                    break;
                case "Pawn":
                    //outcome = outcome.concat(this.movementPawn(piece));
                    break;
                case "Knight":
                    outcome = outcome.concat(this.movementKnight(piece));
                    break;
            }
		}
		return outcome;
	}


    findWhiteMoves(){
		var outcome = [];
		var type;
		var piece;
		for(let i = 0; i<this.deck.inUseWhitePieces.length; i++){
			type = this.deck.inUseWhitePieces[i].get_type;
			piece = this.deck.inUseWhitePieces[i];
			switch(type){
                case "King":
                    outcome = outcome.concat(this.movementKing(piece));
                    break;
                case "Queen":
                    outcome = outcome.concat(this.movementQueen(piece));
                    break;
                case "Rook":
                    outcome = outcome.concat(this.movementRook(piece));
                    break;
                case "Bishop":
                    outcome = outcome.concat(this.movementBishop(piece));
                    break;
                case "Pawn":
                    //outcome = outcome.concat(this.movementPawn(piece));
                    break;
                case "Knight":
                    outcome = outcome.concat(this.movementKnight(piece));
                    break;
            }
		}
		return outcome;
	}







    findBlackMovesInCheck(checkingPiece){
        //Outcome is a usable piece during black check
		var outcome = [];
		var type;
		var piece;
        var usable = [];
		for(let i = 0; i<this.deck.inUseBlackPieces.length; i++){
			type = this.deck.inUseBlackPieces[i].get_type;
			piece = this.deck.inUseBlackPieces[i];
			switch(type){
                case "King":
                    //King movement done separately
                    break;
                case "Queen":
                    outcome = this.movementQueen(piece);
                    break;
                case "Rook":
                    outcome = this.movementRook(piece);
                    break;
                case "Bishop":
                    outcome = this.movementBishop(piece);
                    break;
                case "Pawn":
                    outcome = this.movementPawn(piece);
                    break;
                case "Knight":
                    outcome = this.movementKnight(piece);
                    break;
            }
            for(let k = 0; k<outcome.length; k++){
                if(arrayEquals(checkingPiece.get_pos, outcome[k]) && piece.get_type != "King"){
                    usable.push(piece);
                }
            }
		}
		return usable;
	}


    findWhiteMovesInCheck(checkingPiece){
		//Outcome is a usable piece during black check
		var outcome = [];
		var type;
		var piece;
        var usable = [];
		for(let i = 0; i<this.deck.inUseWhitePieces.length; i++){
			type = this.deck.inUseWhitePieces[i].get_type;
			piece = this.deck.inUseWhitePieces[i];
			switch(type){
                case "King":
                    //Do nothing king is addressed elsewhere
                    break;
                case "Queen":
                    outcome = this.movementQueen(piece);
                    break;
                case "Rook":
                    outcome = this.movementRook(piece);
                    break;
                case "Bishop":
                    outcome = this.movementBishop(piece);
                    break;
                case "Pawn":
                    outcome = this.movementPawn(piece);
                    break;
                case "Knight":
                    outcome = this.movementKnight(piece);
                    break;
            }
            for(let k = 0; k<outcome.length; k++){
                if(arrayEquals(checkingPiece.get_pos, outcome[k]) && piece.get_type != "King"){
                    usable.push(piece);
                }
            }
		}
		return usable;
	}

    movePiece(position1, position2){

        console.log("Piece moved:     Start: "+ position1 + " Ending: " + position2);

        var letter = ["","A","B","C","D","E","F","G","H"];

        var temp = [];
        var validMoveBool = false;
        var deletePiece;
        var pieceID;

        if(this.deck.findIfPosFilled(position1)){
            var piece = this.deck.findByPos(position1);
            var type = piece.get_type;
            var enPassPiece;
            if(type == "Pawn"){


                //Check en passant removal
                if(position1[1] != position2[1]){
                    //Pawn moved diagonally
                    if(this.deck.findIfPosFilled(position2)){
                        //Moved normally
                    }else{
                        //Moved with en passant so we have to delete other piece
                        if(piece.get_color == "White"){
                            if(this.deck.findIfPosFilled([5,position2[1]])){
                                enPassPiece = this.deck.findByPos([5,position2[1]]);
                                for(let i = 0; i < this.deck.inUseBlackPieces.length; i++){
                                    if(this.deck.inUseBlackPieces[i].get_id == enPassPiece.get_id){
                                        this.deck.inUseBlackPieces.splice(i,1);
                                    }
                                }
                            }

                        }else{
                            if(this.deck.findIfPosFilled([4,position2[1]])){
                                enPassPiece = this.deck.findByPos([4,position2[1]]);
                                for(let i = 0; i < this.deck.inUseWhitePieces.length; i++){
                                    if(this.deck.inUseWhitePieces[i].get_id == enPassPiece.get_id){
                                        this.deck.inUseWhitePieces.splice(i,1);
                                    }
                                }
                            }

                        }


                    }
                }
            }




            for(let i = 0; i<this.deck.validMoves.length; i++){
                temp = this.deck.validMoves[i];

                if(position2[0] == temp[0] && position2[1] == temp[1]){
                    //update position, refresh board
                    validMoveBool = true;
                    //check to see if piece is already there
                    if(this.deck.findIfPosFilled(position2)){
                        deletePiece = this.deck.findByPos(position2);
                        pieceID = deletePiece.get_id;
                        if(deletePiece.get_color == "White"){
                            //delete from inUseWhitePieces
                            for(let i = 0; i<this.deck.inUseWhitePieces.length; i++){
                                if(this.deck.inUseWhitePieces[i].get_id == pieceID){
                                    this.deck.inUseWhitePieces.splice(i,1);
                                }
                            }
                            for(let i = 0; i<this.checkingBlackKing.length; i++){
                                if(this.checkingBlackKing[i].get_id == pieceID){
                                    this.checkingBlackKing.splice(i,1);
                                }
                            }
                        }else{
                            //delete from inUseBlackPieces
                            for(let i = 0; i<this.deck.inUseBlackPieces.length; i++){
                                if(this.deck.inUseBlackPieces[i].get_id == pieceID){
                                    this.deck.inUseBlackPieces.splice(i,1);
                                }
                            }
                            for(let i = 0; i<this.checkingWhiteKing.length; i++){
                                if(this.checkingWhiteKing[i].get_id == pieceID){
                                    this.checkingWhiteKing.splice(i,1);
                                }
                            }
                        }
                    }
                    //delete piece if it is there
                    break;

                }
            }


            if(validMoveBool){
                piece.set_pos(position2);
                piece.add_moves(position1 + " moved to " + position2);

                var tempStr;
                var str = document.getElementById("lastMoves");
                tempStr = str.textContent;

                str.textContent = piece.get_color+" "+piece.get_type + " at "+letter[position1[1]] + "" + position1[0]+" moved to " + letter[position2[1]] + "" + position2[0]+ " \r\n";
                str.textContent += tempStr;

                //console.log(piece.get_moves);
                //Check if the new position puts the other king in check

                //Check to see if pawn promotes, remove it and call promoteQueen with it.
                if(type == "Pawn"){

                    this.deck.checkPromotion(piece);
                }

                //Check to see if king castled and move rook
                if(piece.get_type == "King" && piece.get_moves.length == 1){
                    var string = piece.get_moves[0];
                    var rook;
                    if(string.charAt(2) - string.charAt(15) == 2){
                        //Moved left
                        if(piece.get_color == "White"){
                            //Find and set white rook with ID of 13 to [1,4]
                            rook = this.deck.findRook("White", "13");
                            rook.set_pos([1,4]);
                        }else{
                            //Find and set white rook with ID of 13 to [8,4]
                            rook = this.deck.findRook("Black", "13");
                            rook.set_pos([8,4]);
                        }
                    }else if(string.charAt(2) - string.charAt(15) == -2){
                        //Moved Right
                        if(piece.get_color == "White"){
                            //Find and set white rook with ID of 12 to [1,6]
                            rook = this.deck.findRook("White", "12");

                            rook.set_pos([1,6]);
                        }else{
                            //Find and set black rook with ID of 12 to [8,6]
                            rook = this.deck.findRook("Black", "12");
                            rook.set_pos([8,6]);
                        }
                    }
                }

                this.updateBoard();

                this.flipTurn();
                this.checkIfCheck("White");
                this.checkIfCheck("Black");

                //this.didLastPieceCheck(piece);

            }else{
                alert("Invalid Move");
                //Restore turn
                this.flipTurn();
            }
            this.deck.validMoves = [];

    }
    }

    canWhiteKingCastle(){
        var piece = this.deck.getWhiteKing();
        var leftRook;
        var rightRook;
        var canLeft = true;
        var canRight = true;
        var leftRookExists = false;
        var rightRookExists = false;

        //output refers to spots that the king can move to, not the rook spots
        var output = [];
        //Has to be first move from king
        if(piece.get_moves.length == 0 && this.whiteKingCheck == false){
           //Assign left and Right rook
           for(let i = 0; i < this.deck.inUseWhitePieces.length; i++){
               if(this.deck.inUseWhitePieces[i].get_id == "13"){
                    leftRook = this.deck.inUseWhitePieces[i];
                    leftRookExists = true;
               }else if(this.deck.inUseWhitePieces[i].get_id == "12"){
                    rightRook = this.deck.inUseWhitePieces[i];
                    rightRookExists = true;
               }
           }
           //Check left rook and the intermediate pieces

           if(leftRookExists){
                if(leftRook.get_moves.length == 0){
                        for(let i = 2; i <= 4; i++){
                            if(this.deck.findIfPosFilled([1,i])){
                                canLeft = false;
                            }
                        }
                        if(canLeft){
                            output.push([1,3]);
                        }
                }
           }
           if(rightRookExists){
                if(rightRook.get_moves.length == 0){
                    for(let i = 6; i <= 7; i++){
                        if(this.deck.findIfPosFilled([1,i])){
                            canRight = false;
                        }
                    }
                    if(canRight){
                        output.push([1,7]);
                    }
                }
           }

        }
        return output;
    }
    canBlackKingCastle(){

        var piece = this.deck.getBlackKing();
        var leftRook;
        var rightRook;
        var canLeft = true;
        var canRight = true;
        var leftRookExists = false;
        var rightRookExists = false;

        //output refers to spots that the king can move to, not the rook spots
        var output = [];
        //Has to be first move from king
        if(piece.get_moves.length == 0 && this.blackKingCheck == false){
           //Assign left and Right rook
           for(let i = 0; i < this.deck.inUseBlackPieces.length; i++){
               if(this.deck.inUseBlackPieces[i].get_id == "13"){
                    leftRook = this.deck.inUseBlackPieces[i];
                    leftRookExists = true;
               }else if(this.deck.inUseBlackPieces[i].get_id == "12"){
                    rightRook = this.deck.inUseBlackPieces[i];
                    rightRookExists = true;
               }
           }
           //Check left rook and the intermediate pieces
           if(leftRookExists){
                if(leftRook.get_moves.length == 0){
                        for(let i = 2; i <= 4; i++){
                            if(this.deck.findIfPosFilled([8,i])){
                                canLeft = false;
                            }
                        }
                        if(canLeft){
                            output.push([8,3]);
                        }
                }
            }
            if(rightRookExists){
                if(rightRook.get_moves.length == 0){
                    for(let i = 6; i <= 7; i++){
                        if(this.deck.findIfPosFilled([8,i])){
                            canRight = false;
                        }
                    }
                    if(canRight){
                        output.push([8,7]);
                    }
                }
            }

        }
        return output;
    }

    turnGreen(){
        var temp;
        for(let i = 0; i < this.deck.validMoves.length; i++){
            temp = this.deck.validMoves[i];
            var nameClass = document.getElementById(temp[0] + "" + temp[1]).className;
            nameClass = nameClass + " available";
            document.getElementById(temp[0] + "" + temp[1]).className = nameClass;
        }
    }
    removeGreen(){
        var squareID;
        for(let i = 1; i<=8; i++){
			for(let k = 1; k<= 8; k++){
				squareID = i + "" + k;
				var nameClass = document.getElementById(squareID).className;
				if(nameClass.includes("available")){
					nameClass = nameClass.substring(0,5);
					document.getElementById(squareID).className = nameClass;
				}
			}
		}
    }
    removeSelected(){
        var squareID;
        for(let i = 1; i<=8; i++){
			for(let k = 1; k<= 8; k++){
				squareID = i + "" + k;
				var nameClass = document.getElementById(squareID).className;
				if(nameClass.includes("selected")){
					nameClass = nameClass.substring(0,5);
					document.getElementById(squareID).className = nameClass;
				}
			}
		}
    }




    flipTurn(){
        var color = this.get_turn;
        if(color == "White"){
            this.set_turn("Black");
        }else{
            this.set_turn("White");
        }
    }







    //takes in string with the color of king you want to check if is in check
    checkIfCheck(color){
        var posKing;
        var outcome = [];
        var check = false;
        var piece;
        if(color == "White"){
            posKing = this.deck.findWhiteKing();
            //outcome = this.findBlackMoves();
            for(let k = 0; k < this.deck.inUseBlackPieces.length; k++){
                piece = this.deck.inUseBlackPieces[k];
                outcome = this.getMoves(piece);
                for(let i = 0; i<outcome.length; i++){
                    if(arrayEquals(outcome[i],posKing)){
                        check = true;
                        this.set_whiteKingCheck(true);
                        this.checkingWhiteKing.push(piece);
                        alert("White King is in Check");
                    }
                }
            }
            if(!check){
                this.checkingWhiteKing = [];
                this.set_whiteKingCheck(false);
            }
        }else{
            posKing = this.deck.findBlackKing();
            //outcome = this.findWhiteMoves();
            for(let k = 0; k < this.deck.inUseWhitePieces.length; k++){
                piece = this.deck.inUseWhitePieces[k];
                outcome = this.getMoves(piece);
                for(let i = 0; i<outcome.length; i++){
                    if(arrayEquals(outcome[i],posKing)){
                        check = true;
                        this.set_blackKingCheck(true);
                        this.checkingBlackKing.push(piece);
                        alert("Black King is in Check");
                    }
                }
            }
            if(!check){
                this.checkingBlackKing = [];
                this.set_blackKingCheck(false);
            }
        }
        return check;
    }




    //Check positions king can move, as well as if the pieces holding him in check are in the available movement spots for the friendly pieces
    checkIfMate(color){
        var availableKingMoves = [];
        var canKingMove = true;
        var isMate = false;
        var blocking = [];
        
        var outcome = [];
        if(color == "White"){
           availableKingMoves = this.validWhiteKingMoves();
           for(let i = 0; i <this.deck.inUseWhitePieces.length; i++){
                var piece = this.deck.inUseWhitePieces[i];
               if(piece.get_type != "King" || piece.get_type != "Pawn"){
                    blocking = blocking.concat(this.canBlock(piece));
               }
           }
        }else{
            availableKingMoves = this.validBlackKingMoves();
            console.log("Length: " + this.deck.inUseBlackPieces.length);
            for(let i = 0; i <this.deck.inUseBlackPieces.length; i++){
                var piece = this.deck.inUseBlackPieces[i];
                if(piece.get_type != "King" || piece.get_type != "Pawn" ){
                    blocking = blocking.concat(this.canBlock(piece));
                }
           }
        }

        if(availableKingMoves.length == 0){
            canKingMove = false;
        }


        if(!canKingMove){
            if(color == "White"){
                for(let i = 0; i < this.checkingWhiteKing.length; i++){
                    outcome = outcome.concat(this.findWhiteMovesInCheck(this.checkingWhiteKing[i]));
                }
            }else{
                for(let i = 0; i < this.checkingBlackKing.length; i++){
                    outcome = outcome.concat(this.findBlackMovesInCheck(this.checkingBlackKing[i]));
                }
            }
        if(outcome.length == 0){
            isMate = true;
        }else{
            isMate = false;
        }
        //If availableKingMoves is 0 then the king cannot get out of check by moving.
        //Proceed to check if the king can get out of the check by using other pieces
        //Find a list of pieces that have the king in check, then find all the spots your pieces can move.
        //If the pieces that have the king in check overlap with spots you can move then maybe the king is not mated
        //Deal with edge case, a piece that is not checking the king but would be if your piece takes one in check.
        }


        //Check to see if block can be performed
        if(blocking.length == 0){
            isMate = true;
        }else{
            isMate = false;
        }






        return isMate;
    }

    //Pos needs to be checked if its in the board.
    addValidSpot(pos,piece){
        var outcome = [];
        var hold;
        if(pos[0] >=1 && pos[0] <=8 && pos[1]<=8 && pos[1] >= 1){
            if(this.deck.findIfPosFilled([pos[0],pos[1]])){
                hold = this.deck.findByPos([pos[0],pos[1]]);
                if(hold.get_color != piece.get_color){
                    outcome.push([pos[0],pos[1]]);
                 }
            }else {
                outcome.push([pos[0],pos[1]]);
            }
        }
        return outcome;

    }

    getMoves(piece){
        var type;
        var validMoves = [];
        type = piece.get_type;

        switch(type){
            case "King":
                validMoves = this.movementKing(piece);
                break;
            case "Queen":
                validMoves = this.movementQueen(piece);
                break;
            case "Rook":
                validMoves = this.movementRook(piece);
                break;
            case "Bishop":
                validMoves = this.movementBishop(piece);
                break;
            case "Pawn":
                validMoves = this.movementPawn(piece);
                break;
            case "Knight":
                validMoves = this.movementKnight(piece);
                break;
        }
        return validMoves;
    }



    
    canBlock(piece){
        var outcome = [];
        var originalPos = piece.get_pos;
        var doesCheck = false;
        var whiteMoves = [];
        var blackMoves = [];
        var whiteKingPos;
        var blackKingPos;
        var moves = [];
    
                moves = this.getMoves(piece);
                for(let i = 0; i<moves.length; i++){
                    console.log("Moves: " + moves[i]);
                    piece.set_pos(moves[i]);
        
        
                    if(piece.get_color == "White"){
                        whiteKingPos = this.deck.findWhiteKing();
                        blackMoves = this.findBlackMoves();
                        for(let k = 0; k<blackMoves.length;k++){
                            if(arrayEquals(blackMoves[k], whiteKingPos)){
                                doesCheck = true;
                            }
                        }
                        
                    }else{
                        blackKingPos = this.deck.findBlackKing();
                        whiteMoves = this.findWhiteMoves();
                        for(let k = 0; k<whiteMoves.length;k++){
                            if(arrayEquals(whiteMoves[k], blackKingPos)){
                                doesCheck = true;
                            }
                        }
                       
                    }
                    if(!doesCheck){
                        console.log("Adding Move: " + moves[i]);
                        outcome.push(moves[i]);
                    }
                    piece.set_pos(originalPos);
                    doesCheck = false;
                }
        

        

        return outcome;
}


    //======================================================================================================================

    /* if(piece.get_type == "Queen" || piece.get_type == "Rook" || piece.get_type == "Bishop"){
        var originalPos = piece.get_pos;
        var doesCheck = false;
        var whiteMoves;
        var blackMoves;
        var whiteKingPos;
        var blackKingPos;
        for(let i = 0; i<moves.length; i++){
            console.log("Moves: " + moves[i]);
            piece.set_pos(moves[i]);


            if(piece.get_color == "White"){
                whiteKingPos = this.deck.findWhiteKing();
                blackMoves = this.findBlackMoves();
                for(let k = 0; k<blackMoves.length;k++){
                    if(arrayEquals(blackMoves[k], whiteKingPos)){
                        doesCheck = true;
                    }
                }
                
            }else{
                blackKingPos = this.deck.findBlackKing();
                whiteMoves = this.findWhiteMoves();
                for(let k = 0; k<whiteMoves.length;k++){
                    if(arrayEquals(whiteMoves[k], blackKingPos)){
                        doesCheck = true;
                    }
                }
               
            }
            if(!doesCheck){
                console.log("Adding Move: " + moves[i]);
                this.deck.validMoves.push(moves[i]);
            }
            piece.set_pos(originalPos);
            doesCheck = false;
        }
    }  */  


    //======================================================================================================================
    //Movement logic
    movementRook(piece){

        var outcome = [];
        //outcome to be filled with all legal moves
        //Rooks can move vertically or horizontally
        var startingPos = piece.get_pos;
        var temp;
        //Check Column
        //check up
        for(let i = startingPos[0]+1; i<= 8; i++){

                if(this.deck.findIfPosFilled([i,startingPos[1]])){

                        //Check to see if position filled by same or other piece
                        temp = this.deck.findByPos([i,startingPos[1]]);
                        if(temp.get_color != piece.get_color){
                            outcome.push([i,startingPos[1]]);

                        }
                        break;

                }else{
                    outcome.push([i,startingPos[1]]);

                }

        }
        //check down
        for(let i = startingPos[0]-1; i>= 1; i--){

            if(this.deck.findIfPosFilled([i,startingPos[1]])){

                    //Check to see if position filled by same or other piece
                    temp = this.deck.findByPos([i,startingPos[1]]);
                    if(temp.get_color != piece.get_color){
                        outcome.push([i,startingPos[1]]);

                    }
                    break;

            }else{
                outcome.push([i,startingPos[1]]);

            }

    }
        //Check Right
        for(let i = startingPos[1]+1; i<= 8; i++){
            if(this.deck.findIfPosFilled([startingPos[0],i])){

                    //Check to see if position filled by same or other piece
                    temp = this.deck.findByPos([startingPos[0],i]);
                    if(temp.get_color != piece.get_color){
                        outcome.push([startingPos[0],i]);

                    }
                    break;

             }else{
                outcome.push([startingPos[0],i]);
            }

        }
        //Check Left
        for(let i = startingPos[1]-1; i>=1; i--){
            if(this.deck.findIfPosFilled([startingPos[0],i])){

                    //Check to see if position filled by same or other piece
                    temp = this.deck.findByPos([startingPos[0],i]);
                    if(temp.get_color != piece.get_color){
                        outcome.push([startingPos[0],i]);

                    }
                    break;
             }else{
                outcome.push([startingPos[0],i]);
            }

        }
        //console.log(outcome);
       
        return outcome;
    }







    movementPawn(piece){
        var outcome = [];
        var startingPos = piece.get_pos;
        var color = piece.get_color == "White";
        var temp = piece.get_pos[0];
        var col = piece.get_pos[1];
        var hold;
        //Black pawn can move -1, White can move +1. Can take diagonally
        if((temp+1) != 9 && (temp-1) != 0){
            if(color){
                if(this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]])){
                    //Pawn is stuck
                }else{
                    outcome.push([startingPos[0]+1,startingPos[1]]);
                }
                //Check to see if can take diagonally to the right if its in col 1
                if(col == 1){

                    if(this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]+1])){
                         hold = this.deck.findByPos([startingPos[0]+1,startingPos[1]+1]);

                        if(hold.get_color == "Black"){
                            outcome.push([startingPos[0]+1,startingPos[1]+1]);

                        }
                    }
                    //Check diagonally to the left if its in col 8.
                }else if(col == 8){
                    if(this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]-1])){
                        hold = this.deck.findByPos([startingPos[0]+1,startingPos[1]-1]);
                        if(hold.get_color == "Black"){
                            outcome.push([startingPos[0]+1,startingPos[1]-1])
                        }
                    }
                    //If its in the middle check both sides.
                }else{
                    if(this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]-1])){
                        hold = this.deck.findByPos([startingPos[0]+1,startingPos[1]-1]);
                        if(hold.get_color == "Black"){
                            outcome.push([startingPos[0]+1,startingPos[1]-1])
                        }
                    }
                    if(this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]+1])){
                        hold = this.deck.findByPos([startingPos[0]+1,startingPos[1]+1]);
                        if(hold.get_color == "Black"){
                            outcome.push([startingPos[0]+1,startingPos[1]+1])
                        }
                    }
                }
            }
            else{
                if(this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]])){
                    //Pawn is stuck
                }else{
                    outcome.push([startingPos[0]-1,startingPos[1]]);
                }
                if(col == 1){
                    if(this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]+1])){
                        hold = this.deck.findByPos([startingPos[0]-1,startingPos[1]+1]);
                        if(hold.get_color == "White"){
                            outcome.push([startingPos[0]-1,startingPos[1]+1])
                        }
                    }
                    //Check diagonally to the left if its in col 8.
                }else if(col == 8){
                    if(this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]-1])){
                        hold = this.deck.findByPos([startingPos[0]-1,startingPos[1]-1]);
                        if(hold.get_color == "White"){
                            outcome.push([startingPos[0]-1,startingPos[1]-1])
                        }
                    }
                    //If its in the middle check both sides.
                }else{
                    if(this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]-1])){
                        hold = this.deck.findByPos([startingPos[0]-1,startingPos[1]-1]);
                        if(hold.get_color == "White"){
                            outcome.push([startingPos[0]-1,startingPos[1]-1])
                        }
                    }
                    if(this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]+1])){
                        hold = this.deck.findByPos([startingPos[0]-1,startingPos[1]+1]);
                        if(hold.get_color == "White"){
                            outcome.push([startingPos[0]-1,startingPos[1]+1])
                        }
                    }
                }
            }
            //Check to see if pawn can move 2, other wise only forward.

            if(piece.get_pos[0] == 2 && piece.get_color == "White"){
                //Potential to move 2 for white
                if(this.deck.findIfPosFilled([startingPos[0]+2,startingPos[1]]) || this.deck.findIfPosFilled([startingPos[0]+1,startingPos[1]])){
                    //Pawn is stuck
                }else{
                    outcome.push([startingPos[0]+2,startingPos[1]]);
                }
            }else if (piece.get_pos[0] == 7 && piece.get_color == "Black"){
                //Potential to move 2 for black
                if(this.deck.findIfPosFilled([startingPos[0]-2,startingPos[1]]) || this.deck.findIfPosFilled([startingPos[0]-1,startingPos[1]])){
                    //Pawn is stuck
                }else{
                    outcome.push([startingPos[0]-2,startingPos[1]]);
                }
            }

            //Check to see if can take diagonally

        }
        //Check en passant here
        if(color && temp == 5){
            var pawnPiece;
            var string;
            //Check enemy pawn on either side of col
            if(col >=2){
                if(this.deck.findIfPosFilled([5,col-1])){
                    pawnPiece = this.deck.findByPos([5,col-1]);
                    if(pawnPiece.get_type == "Pawn" && pawnPiece.get_color == "Black"){
                        string = pawnPiece.get_moves[0];
                        if(string.charAt(0) - string.charAt(13) == 2){
                            outcome.push([6,col-1]);

                        }
                    }

                }
            }
            if(col <= 7){
                if(this.deck.findIfPosFilled([5,col+1])){
                    pawnPiece = this.deck.findByPos([5,col+1]);
                    if(pawnPiece.get_type == "Pawn" && pawnPiece.get_color == "Black"){
                        string = pawnPiece.get_moves[0];
                        if(string.charAt(0) - string.charAt(13) == 2){
                            outcome.push([6,col+1]);

                        }
                    }
                }
            }


        }else if(!color && temp == 4){
            var pawnPiece;
            var string;
            //Check enemy pawn on either side of col
            if(col >=2){
                if(this.deck.findIfPosFilled([4,col-1])){
                    pawnPiece = this.deck.findByPos([4,col-1]);
                    if(pawnPiece.get_type == "Pawn" && pawnPiece.get_color == "White"){
                        string = pawnPiece.get_moves[0];
                        if(string.charAt(0) - string.charAt(13) == -2){
                            outcome.push([3,col-1]);

                        }
                    }

                }
            }
            if(col <= 7){
                if(this.deck.findIfPosFilled([4,col+1])){
                    pawnPiece = this.deck.findByPos([4,col+1]);
                    if(pawnPiece.get_type == "Pawn" && pawnPiece.get_color == "White"){
                        string = pawnPiece.get_moves[0];
                        if(string.charAt(0) - string.charAt(13) == -2){
                            outcome.push([3,col+1]);

                        }
                    }
                }
            }
        }
        
        return outcome;

    }





    movementKing(piece){
        var outcome = [];
        var hold;
        var startingPos = piece.get_pos;
        var potentialMoves = [];
        var temp;
        //King can move 8 spots
        //Check above row

        //Need arrays of potential movement
        //Iterate through arrays and call method.
        for(let i = -1; i<2; i++){
            potentialMoves.push([startingPos[0]+1,startingPos[1]+i]);
            potentialMoves.push([startingPos[0]-1,startingPos[1]+i]);
            if(i != 0){
                potentialMoves.push([startingPos[0],startingPos[1]+i]);
            }
        }
        for(let k =0; k<potentialMoves.length; k++){
            temp = this.addValidSpot(potentialMoves[k],piece);

            if(temp.length > 0){
                outcome = outcome.concat(temp);
                //console.log("Adding a valid spot");
            }
        }
        if(piece.get_color == "White"){
            outcome = outcome.concat(this.canWhiteKingCastle());
        }
        else{
            outcome = outcome.concat(this.canBlackKingCastle());
        }
        //console.log(outcome);
        
        return outcome;
    }






    movementQueen(piece){
        var outcome = [];
        //Queen follows same rules as bishop and rook

        outcome = this.movementBishop(piece).concat(this.movementRook(piece));
        //console.log(outcome);
        
        return outcome;
    }






    movementKnight(piece){
        var outcome = [];
        var hold;
        var startingPos = piece.get_pos;
        var potentialMoves = [];
        var temp;
        //Every knight can move up to 8 spots
        //Up and Right
        //Create array of potential valid movement spots

        //Up and right/left
        potentialMoves.push([startingPos[0]+2,startingPos[1]+1]);
        potentialMoves.push([startingPos[0]+2,startingPos[1]-1]);
        //Down and right/left
        potentialMoves.push([startingPos[0]-2,startingPos[1]+1]);
        potentialMoves.push([startingPos[0]-2,startingPos[1]-1]);
        //Right and up/down
        potentialMoves.push([startingPos[0]+1,startingPos[1]+2]);
        potentialMoves.push([startingPos[0]-1,startingPos[1]+2]);
        //Left and up/down
        potentialMoves.push([startingPos[0]+1,startingPos[1]-2]);
        potentialMoves.push([startingPos[0]-1,startingPos[1]-2]);
        //Check the spots
        for(let k =0; k<potentialMoves.length; k++){
            temp = this.addValidSpot(potentialMoves[k],piece);

            if(temp.length > 0){
                outcome = outcome.concat(temp);
                //console.log("Adding a valid spot");
            }
        }


        //console.log(outcome);
       
        return outcome;
    }


    //Check diagonally until you reach end of board or another piece. Stop if friendly, add ability to take enemy pieces.
    movementBishop(piece){
        var outcome = [];
        var startingPos = piece.get_pos;
        var hold;
        var k;
        var j;
        var count = 1;
        //two diagonals, split into fours
        //Top Right
        for(let i = startingPos[0]+1; i<=8; i++){
                k = startingPos[1]+count;
                if(this.deck.findIfPosFilled([i,k]) && k<=8){
                    hold = this.deck.findByPos([i,k]);
                    if(hold.get_color != piece.get_color){
                        outcome.push([i,k]);

                    }
                    break;
                }else if(k<=8){
                    outcome.push([i,k]);
                }
                count++;
        }
        //Top Left
        count = 1;
        for(let i = startingPos[0]+1; i<=8; i++){
                j = startingPos[1]-count;
                if(this.deck.findIfPosFilled([i,j]) && j >= 1){
                    hold = this.deck.findByPos([i,j]);
                    if(hold.get_color != piece.get_color){
                        outcome.push([i,j]);

                    }
                    break;
                }
                else if (j>=1){
                    outcome.push([i,j]);
                }

            count++;
        }
        //Bottom Right
        count = 1;
        for(let i = startingPos[0]-1; i>=1; i--){
                k = startingPos[1]+count;
                if(this.deck.findIfPosFilled([i,k]) && k<=8){
                    hold = this.deck.findByPos([i,k]);
                    if(hold.get_color != piece.get_color){
                        outcome.push([i,k]);

                    }
                    break;
                }else if(k<=8){
                    outcome.push([i,k]);
                }
            count++;
        }
        //Bottom Left
        count =1;
        for(let i = startingPos[0]-1; i>=1; i--){
                j = startingPos[1]-count;
                if(this.deck.findIfPosFilled([i,j]) && j >=1){
                    hold = this.deck.findByPos([i,j]);
                    if(hold.get_color != piece.get_color){
                        outcome.push([i,j]);
                    }
                    break;
                }
                else if (j>=1){
                    outcome.push([i,j]);
                }

            count++;
        }
        //console.log(outcome);
        
        return outcome;
    }
}
