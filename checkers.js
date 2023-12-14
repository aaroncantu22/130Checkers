var selectedSize;
    var highlightedPiece = null;

    /* --- Board --- */
    var tableData = localStorage.getItem('data');
    document.getElementById('board').innerHTML = tableData;

    /* --- timer --- */
    var startTime;
    var timerInterval;
    var gameStarted = false; // Add a flag variable to track game status
    var hoverEnabled = true; // Flag to enable/disable hover color
    var currentPlayer = 'player1';  // initialize within startGame()

   function startGame() {
        if (!gameStarted) {
        gameStarted = true;

        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);

        currentPlayer = 'player1';
        document.getElementById('displayTurn').innerHTML = currentPlayer +"'s Turn";
        console.log("chceck2", currentPlayer);

        gamePlayStart();
        }
    }   

    function restartGame() {
        clearInterval(timerInterval); // Stop the timer
        document.getElementById('playTime').innerHTML = '00:00:00'; // Reset the timer display

        // Reset the game started flag and disable hover event listeners
        gameStarted = false;
    }

    /* count Time */
    function updateTimer() {
        var now = new Date();
        var elapsedTime = now - startTime;

        var hours = Math.floor(elapsedTime / 3600000);
        var minutes = Math.floor((elapsedTime % 3600000) / 60000);
        var seconds = Math.floor((elapsedTime % 60000) / 1000);

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        var timerDisplay = hours + ':' + minutes + ':' + seconds;
        document.getElementById('playTime').innerHTML = timerDisplay;
    }

    /* ---- Piece --- */
    // create Checker Pieces
    function createCheckerPiece(color, player) {
        var checkerPiece = document.createElement('div');
        checkerPiece.className = 'checker-piece ' + player; // Add player class
        checkerPiece.style.backgroundColor = color;
        checkerPiece.style.border = '4px solid black'; // Add black border
        return checkerPiece;
    }

        // set checkers pieces (8x8)
        function placeCheckerPieces8x8() {
            console.log('Placing pieces for 8x8 board.');
            var checkerPiecesContainer = document.getElementById('checkerPieces');
            var cells = document.querySelectorAll('td');

            cells.forEach(function (cell, index) {
                var row = Math.floor(index / 8) + 1;
                var col = index % 8 + 1;

                if ((row + col) % 2 !== 0 && row >= 6) {
                var checkerPiece = createCheckerPiece(localStorage.getItem('colorPieces_ply1'), 'player1');
                cell.appendChild(checkerPiece);
                }

                if ((row + col) % 2 !== 0 && row <= 3) {
                var checkerPiece = createCheckerPiece(localStorage.getItem('colorPieces_ply2'), 'player2');
                cell.appendChild(checkerPiece);
                }
            });

        }

    // set checkers pieces (10x10)
    function placeCheckerPieces10x10() {
        console.log('Placing pieces for 10x10 board.');
        var checkerPiecesContainer = document.getElementById('checkerPieces');
        var cells = document.querySelectorAll('td');

        cells.forEach(function (cell, index) {
            var row = Math.floor(index / 10) + 1;
            var col = index % 10 + 1;

            if ((row + col) % 2 !== 0 && row >= 7) {
            var checkerPiece = createCheckerPiece(localStorage.getItem('colorPieces_ply1'), 'player1');
            cell.appendChild(checkerPiece);
            }

            if ((row + col) % 2 !== 0 && row <= 4) {
            var checkerPiece = createCheckerPiece(localStorage.getItem('colorPieces_ply2'), 'player2');
            cell.appendChild(checkerPiece);
            }
        });
    }

    selectedSize = localStorage.getItem('sizeBoard');

    if (selectedSize === '8x8') {
        placeCheckerPieces8x8();
    } else if (selectedSize === '10x10') {
        placeCheckerPieces10x10();
    } else {
        console.error('No board size selected.');
    }




    /* Action of pieces */
// function gamePlayStart(){
        
        var pieces = document.querySelectorAll('.checker-piece');   
        var dataPieces = JSON.parse(localStorage.getItem('dataPieces'));
        var dataColor = JSON.parse(localStorage.getItem('dataColor'));
        var dataBoard = JSON.parse(localStorage.getItem('dataBoard'));
        
        // add click event for pieces
        pieces.forEach(function (piece) {
            piece.addEventListener('click', handlePieceClick);
        });
                       

        var cell
        var rowNum;     // set current row
        var colNum;     // set current column
        var row_new;    // the number of row for destination
        var col_new;    // the number of col for destination
        var clickedPiece;
        var selectedPiece = null;
        //var movCells;

        var rowInd;
        var cellInd;
        var movCells;

        var remCells;
        var remove;
        var jumpedRow;
        var jumpedCol;
        var jumpedCell;

                
        // handle after clicking pieces
        function handlePieceClick(event) {
            if (currentPlayer === 'player1') {
                clickedPiece = event.target;
                if (clickedPiece.classList.contains('player1')){
                    movePieces();
                    //checkPromotion(rowNum, currentPlayer, colNum);
                }     
            }   
            else if (currentPlayer === 'player2')   {
                clickedPiece = event.target;
                if (clickedPiece.classList.contains('player2')){
                    movePieces();
                    //checkPromotion(rowNum, currentPlayer, colNum);
                } 
            }         
        }          
            
        var tbodyInd
        function movePieces(){
            resetPiecesColors();    // reset pieces color
                resetBoardColors();     // reset board color
                clickedPiece.style.border = '4px solid white';
                selectedPiece = clickedPiece;

                cell = getContainingCell(clickedPiece);
                rowNum = cell.parentElement.rowIndex; 
                colNum = cell.cellIndex;
                
                tbodyInd = document.querySelector('tbody');
                    
                //movCells = getMovalableCells(tbodyInd, rowNum, colNum, clickedPiece.classList);
                getMovalableCells(tbodyInd, rowNum, colNum);

                var allPieces = document.querySelectorAll('.checker-piece');
                allPieces.forEach(function (piece) {
                    if (piece !== clickedPiece) {
                        piece.style.border = '4px solid black';
                    }
                });
                //currentPlayer = (currentPlayer === 'player1') ? 'player2' : 'player1';
                if (dataPieces[rowNum,colNum] == 2 || dataPieces[rowNum,colNum] == -2){
                    checkPromotion(rowNum, currentPlayer, colNum);
                }

        }
        
        // set the click event for every dark cell
        var clickBoard = document.querySelectorAll('#board_color2');
        clickBoard.forEach(function (clickB){
            clickB.addEventListener('click', boardClick);
        });
        
        var createPieces;
        // set the board click event
        function boardClick(event){
            var clilckedBoard = event.target;   // the clicked cell
            cell = getContainingCell(clilckedBoard);    // get the clicked cell information
            row_new = cell.parentElement.rowIndex;      // get the clicked cell of row 
            col_new = cell.cellIndex;                   // get the clicked cell of column
            
            // check the selected pieces are included in avaliable place to move
            if (selectedPiece && isMoveAllowed(row_new,col_new) ){
                //var createPieces;
                
                if (currentPlayer === 'player1') {
                    createPieces = clilckedBoard.appendChild(selectedPiece);
                    currentPlayer = 'player2';  // switch the player's turn 
                } 
                else if (currentPlayer === 'player2') {
                    createPieces = clilckedBoard.appendChild(selectedPiece);
                    currentPlayer = 'player1';      // switch player's turn
                }
                clilckedBoard.appendChild(createPieces);
                createPieces.addEventListener('click', handlePieceClick);   // add click event
                clickedPiece.style.border = "4px solid black";
                update_dataPieces(rowNum, colNum, row_new, col_new, clickedPiece.classList, createPieces); 
                console.log ("num", row_new, col_new, createPieces);
                resetBoardColors();
                //removeJumpedPiece(rowNum, colNum, row_new, col_new);
                var jump = removeJumpedPiece();
                if (jump){
                    checkDoubleJump(row_new, col_new);
                    //console.log("checkJ:", checkJump, checkJump[0],checkJump[1]);
                    /*
                    while (checkJump != true){
                        console.log("checkJ-2:",checkJump);
                        checkJump = checkDoubleJump(checkJump[0], checkJump[1]);
                        console.log("checkJ-3:", checkJump);
                    }
                    */
                }                
                //checkDoubleJump(clickedPiece.classList, createPieces, row_new, col_new);
                console.log("num: ", rowNum, colNum, row_new, col_new);
                selectedPiece = null;
                checkWinner();
            }
        }

        function update_JumpPieces(i,j,m,n){
            /* --- add pieces --- */
            var totalNum = dataColor.sizeCells;
            if (currentPlayer == 'player2'){
                //dataPieces[i][j] = 0;
                if (m == 0 || dataPieces[i][j] == 2){
                    dataPieces[m][n] = 2;                    
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply1'), 'player1');
                    newJumpPieces.classList.add('king');
                    newJumpPieces.addEventListener('click', handlePieceClick);
                    var createJumpPieces = document.querySelector('tbody').rows[m].cells[n];
                    createJumpPieces.appendChild(newJumpPieces);
                    
                }
                else {
                    dataPieces[m][n] = 1;
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply1'), 'player1');
                    newJumpPieces.addEventListener('click', handlePieceClick);
                    var createJumpPieces = document.querySelector('tbody').rows[m].cells[n];
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply1'), 'player1')
                    createJumpPieces.appendChild(newJumpPieces);
                }                
            }
            else {
                //dataPieces[i][j] = 0;
                if (m == totalNum-1 || dataPieces[i][j] == -2){
                    dataPieces[m][n] = -2;
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply2'), 'player2');
                    newJumpPieces.addEventListener('click', handlePieceClick);
                    newJumpPieces.classList.add('king');
                    var createJumpPieces = document.querySelector('tbody').rows[m].cells[n];
                    createJumpPieces.appendChild(newJumpPieces);
                }
                else {
                    dataPieces[m][n] = -1;
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply2'), 'player2');
                    newJumpPieces.addEventListener('click', handlePieceClick);
                    var createJumpPieces = document.querySelector('tbody').rows[m].cells[n];
                    var newJumpPieces = createCheckerPiece(localStorage.getItem('colorPieces_ply2'), 'player2')
                    createJumpPieces.appendChild(newJumpPieces);
                }
                console.log('dataPieces:', dataPieces);
            } 
            console.log('double pices:', dataPieces);
        }

        /*
            --- explaination about each value ----
            jump = jump case
            regular = regular case
            king = king case
            arr = [removeRow, removeCol,currentRow, currentCol, destRow, destCol]
            */

        var dataJump;
        // check the double jump
        function checkDoubleJump(rowNew, colNew){     
            var result  = isAvailableDouble(rowNew,colNew); 
            console.log("double Jump:", result);    
            //update_dataPieces(i, j, m, n, piecesTags, createPieces)
            if (result != "noJumpPly1" || result != "noJumpPly2"){
                //var ele = dataJump[0];
                //console.log("double Jump:", dataJump, "and", ele[0], and, dataJump.length);  
                if (dataJump.length != 0){
                    var i = 0;
                    console.log("double Jump2:", dataJump[i][2], dataJump[i][3], dataJump[i][4],dataJump[i][5])
                    //var newDest = [dataJump[i][4],dataJump[i][5]];
                    setTimeout(function () {
                        update_JumpPieces(dataJump[i][2], dataJump[i][3], dataJump[i][4],dataJump[i][5]);
                        removeDoubleJump(dataJump[i][0], dataJump[i][1],dataJump[i][2], dataJump[i][3]);    
                    }, 500);                   
                    
                    //return newDest;
                }               
                
            }   
        
        }

        function removeDoubleJump(remRow, remCol, remRow2, remCol2) {           
            console.log("remDouble:", remRow, remCol, remRow2, remCol2);
            // get the cell information after jumping
            var removeDouble1 = document.querySelector('tbody').rows[remRow].cells[remCol];
            // delete cells jumped by opponents
            removeDouble1.innerHTML = '';
            dataPieces[remRow][remCol] = 0;
            
            var removeDouble2 = document.querySelector('tbody').rows[remRow2].cells[remCol2];
            // delete cells jumped by opponents
            removeDouble2.innerHTML = '';
            dataPieces[remRow2][remCol2] = 0;            
        }

        function isAvailableDouble(row, col){
            let totalNum = dataColor.sizeCells;
            var arrJump;
            dataJump = [];
            if(currentPlayer == "player2"){
                // check player1 can't move (check doubl jump )
                // regular case
                if (dataPieces[row][col] == 1){
                    // top right (jump case)
                    if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){  
                        if ((dataPieces[row-1][col+1] == -1 || dataPieces[row-1][col+1] == -2) && dataPieces[row-2][col+2] == 0){
                            arrJump = [row, col, row-1, col+1, row-2, col+2];
                            dataJump.push(arrJump);
                        }
                    }
                    // top left (jump case)
                    if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){  
                        if((dataPieces[row-1][col-1] == -1 || dataPieces[row-1][col-1] == -2) && dataPieces[row-2][col-2] == 0){
                            arrJump = [row, col, row-1, col-1, row-2, col-2];
                            dataJump.push(arrJump);
                        }
                    }
                }
                // king pieces case
                else if (dataPieces[row][col] == 2){
                    // Bottom right (jump case)
                    if (0 <= row+1 && 0 <= col+1 && 0 <= row+2 && 0 <= col+2){
                        if ((dataPieces[row+1][col+1] == -1 || dataPieces[row+1][col+1] == -2) && dataPieces[row+2][col+2] == 0){
                            arrJump = [row, col, row+1, col+1, row+2, col+2];
                            dataJump.push(arrJump);
                        }
                    }
                    // Bottom left (jump case)
                    if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){
                        if((dataPieces[row+1][col-1] == -1 || dataPieces[row+1][col-1] == -2) && dataPieces[row+2][col-2] == 0){
                            arrJump = [row, col, row+1, col-1, row+2, col-2];
                            dataJump.push(arrJump);
                        }
                    }    
                }     
                if(dataJump.length == 0){
                    // player 1 lose if it doesn't have any place to move
                    return "noJumpPly1";
                }
                else{
                    return "doubleJump";
                }
            }
            else{
                // check player2 can't move
                // regular pieces case
                if (dataPieces[row][col] == -1 || dataPieces[row][col] == -2){ 
                    // bottom right (jump case)  
                    if (row+1 < totalNum && col+1 < totalNum && row+2 < totalNum && col+2 < totalNum){                           
                        if ((dataPieces[row+1][col+1] == 1 || dataPieces[row+1][col+1] == 2) && dataPieces[row+2][col+2] == 0){
                            arrJump = [row, col, row+1, col+1, row+2, col+2];
                            dataJump.push(arrJump);
                        }
                    }            
                    // bottom left (jump case)
                    if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){ 
                        if ((dataPieces[row+1][col-1] == 1 || dataPieces[row+1][col-1] == 2) && dataPieces[row+2][col-2] == 0){
                            arrJump = [row, col, row+1, col-1, row+2, col-2];
                            dataJump.push(arrJump);
                        }
                    }
                }            
                // king pieces case
                if (dataPieces[row][col] == -2){       
                    // Top right (jump case)
                    if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){
                        if ((dataPieces[row-1][col+1] == 1 || dataPieces[row-1][col+1] == 2) && dataPieces[row-2][col+2] == 0){
                            arrJump = [row, col, row-1, col+1, row-2, col+2];
                            dataJump.push(arrJump);
                        }
                    }        
                    // Top left (jump case)
                    if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){
                        if((dataPieces[row-1][col-1] == 1 || dataPieces[row-1][col-1] == 2) && dataPieces[row-2][col-2] == 0){
                            arrReg2 = [row, col, row-1, col-1, row-2, col-2];
                            dataJump.push(arrJump);
                        }
                    }                                 
                }                   
                if(dataJump.length == 0){
                    // player 2 lose if it doesn't have any place to move
                    return "noJumpPly2";
                }
                else{
                    return "doubleJump";
                }
            }
        }

        // check the condition of game (win, lose, or continue)
        function checkWinner(){
            var countPiece = countRestPiece();
            var gameStatus = gameOver();
            console.log("checkMove:", gameStatus);
            if(countPiece[1] == 0){
                // player 1 Wins (delete all player2's pieces)
                document.getElementById("displayTurn").innerHTML = "Player1 Wins &#129395";
            }
            else if (countPiece[0] == 0){
                // player 2 wins    (delete all player1's pieces)
                document.getElementById("displayTurn").innerHTML = "Player2 Wins &#129321";
            }
            else if (gameStatus == "losePly2"){
                // player 1 Wins (no more move)
                document.getElementById("displayTurn").innerHTML = "Player1 Wins &#129395";
            }
            else if (gameStatus == "losePly1"){
                // player 2 wins (no more move)
                document.getElementById("displayTurn").innerHTML = "Player2 Wins &#129321";
            }
            else {
                // continue game
                document.getElementById("displayTurn").innerHTML = currentPlayer +"'s Turn";
            }
        }

        // check whether game is over or not
        function gameOver(){
            var arrReg1;
            var arrReg2;
            var condRegular1 = [];  // Player1's condition
            var condRegular2 = [];  // player2's condition
            var totalNum = dataColor.sizeCells;     // set the size of cells

            /*
            --- explaination about each value ----
            jump = jump case
            regular = regular case
            king = king case
            arr = [currentRow, currentCol, removeRow, removeCol, destRow, destCol, status]
            */

            if(currentPlayer == "player2"){
                // check player1 can't move
                for(let row=0;row<dataColor.sizeCells;row++){
                    for(let col=0;col<dataColor.sizeCells;col++){
                        // Regular pieces case
                        if (dataPieces[row][col] == 1){
                            // Top right
                            if (0 <= row-1 && col+1 < totalNum){                             
                                if (dataPieces[row-1][col+1] == 0){
                                    arrReg1 = [row, col, 0, 0, row-1, col+1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }     
                            } 
                            // top left  
                            if (0 <= row-1 && 0 <= col-1){        
                                if (dataPieces[row-1][col-1] == 0){
                                    arrReg1 = [row, col, 0, 0, row-1, col-1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }
                            } 
                            // top right (jump case)
                            if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){  
                                if ((dataPieces[row-1][col+1] == -1 || dataPieces[row-1][col+1] == -2) && dataPieces[row-2][col+2] == 0){
                                    arrReg1 = [row, col, row-1, col+1, row-2, col+2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // top left (jump case)
                            if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){  
                                if((dataPieces[row-1][col-1] == -1 || dataPieces[row-1][col-1] == -2) && dataPieces[row-2][col-2] == 0){
                                    arrReg1 = [row, col, row-1, col-1, row-2, col-2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                        }
                        // king pieces case
                        if (dataPieces[row][col] == 2){
                            // Top right
                            if (0 <= row-1 && col+1 < totalNum){
                                if (dataPieces[row-1][col+1] == 0){
                                    arrReg1 = [row, col, 0, 0, row-1, col+1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }  
                            }
                            // Top left 
                            if (0 <= row-1 && 0 <= col-1){            
                                if (dataPieces[row-1][col-1] == 0){
                                    arrReg1 = [row, col, 0, 0, row-1, col-1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // Bottom right
                            if (row+1 < totalNum && col+1 < totalNum){
                                if (dataPieces[row+1][col+1] == 0){
                                    arrReg1 = [row, col, 0, 0, row+1, col+1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }
                            }   
                            // Bottom left
                            if (row+1 < totalNum && 0 < col-1){             
                                if (dataPieces[row+1][col-1] == 0){
                                    arrReg1 = [row, col, 0, 0, row+1, col-1, 'regular'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // Top right (jump case)
                            if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){
                                if (dataPieces[row-1][col+1] == -1 && dataPieces[row-2][col+2] == 0){
                                    arrReg1 = [row, col, row-1, col+1, row-2, col+2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // Top left (jump case)
                            if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){
                                if((dataPieces[row-1][col-1] == -1 || dataPieces[row-1][col-1] == -2) && dataPieces[row-2][col-2] == 0){
                                    arrReg1 = [row, col, row-1, col-1, row-2, col-2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // Bottom right (jump case)
                            if (0 <= row+1 && 0 <= col+1 && 0 <= row+2 && 0 <= col+2){
                                if ((dataPieces[row+1][col+1] == -1 || dataPieces[row+1][col+1] == -2) && dataPieces[row+2][col+2] == 0){
                                    arrReg1 = [row, col, row+1, col+1, row+2, col+2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                            // Bottom left (jump case)
                            if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){
                                if((dataPieces[row+1][col-1] == -1 || dataPieces[row+1][col-1] == -2) && dataPieces[row+2][col-2] == 0){
                                    arrReg1 = [row, col, row+1, col-1, row+2, col-2, 'jump'];
                                    condRegular1.push(arrReg1);
                                }
                            }
                        }
                    }                        
                }
                if(condRegular1.length == 0){
                    // player 1 lose if it doesn't have any place to move
                    return "losePly1";
                }
            }
            else{
                // check player2 can't move
                for(let row=0;row<dataColor.sizeCells;row++){
                    for(let col=0;col<dataColor.sizeCells;col++){
                        if (dataPieces[row][col] == -1){
                            // bottom right
                            if (row+1 < totalNum && col+1 < totalNum){
                                if (dataPieces[row+1][col+1] == 0){
                                    arrReg2 = [row, col, 0, 0, row+1, col+1, 'regular'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // bottom left
                            if (row+1 < totalNum && 0 <= col-1){                                
                                if (dataPieces[row+1][col-1] == 0){
                                    arrReg2 = [row, col, 0, 0, row+1, col-1, 'regular'];
                                    condRegular2.push(arrReg2);
                                } 
                            }  
                            // bottom right (jump case)  
                            if (row+1 < totalNum && col+1 < totalNum && row+2 < totalNum && col+2 < totalNum){                           
                                if ((dataPieces[row+1][col+1] == 1 || dataPieces[row+1][col+1] == 2) && dataPieces[row+2][col+2] == 0){
                                    arrReg2 = [row, col, row+1, col+1, row+2, col+2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // bottom left (jump case)
                            if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){ 
                                if ((dataPieces[row+1][col-1] == 1 || dataPieces[row+1][col-1] == 2) && dataPieces[row+2][col-2] == 0){
                                    arrReg2 = [row, col, row+1, col-1, row+2, col-2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                        }
                        if (dataPieces[row][col] == -2){
                            // Top right
                            if (0 < row-1 && col+1 < totalNum){
                                if (dataPieces[row-1][col+1] == 0){
                                    arrReg2 = [row, col, 0, 0, row-1, col+1, 'regular'];
                                    condRegular2.push(arrReg2);
                                }    
                            } 
                            // Top left 
                            if (0 <= row-1 && 0 <= col-1){          
                                if (dataPieces[row-1][col-1] == 0){
                                    arrReg2 = [row, col, 0, 0, row-1, col-1, 'regular'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // Bottom right
                            if (row+1 < totalNum && col+1 < totalNum){
                                if (dataPieces[row+1][col+1] == 0){
                                    arrReg2 = [row, col, 0, 0, row+1, col+1, 'regular'];
                                    condRegular2.push(arrReg2);
                                } 
                            }
                            // Bottom left  
                            if (row+1 < totalNum && 0 <= col-1){             
                                if (dataPieces[row+1][col-1] == 0){
                                    arrReg2 = [row, col, 0, 0, row+1, col-1, 'regular'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // Top right (jump case)
                            if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){
                                if ((dataPieces[row-1][col+1] == 1 || dataPieces[row-1][col+1] == 2) && dataPieces[row-2][col+2] == 0){
                                    arrReg2 = [row, col, row-1, col+1, row-2, col+2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // Top left (jump case)
                            if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){
                                if((dataPieces[row-1][col-1] == 1 || dataPieces[row-1][col-1] == 2) && dataPieces[row-2][col-2] == 0){
                                    arrReg2 = [row, col, row-1, col-1, row-2, col-2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // Bottom right (jump case)
                            if (row+1 < totalNum && col+1 < totalNum && row+2 < totalNum && col+2 < totalNum){
                                if ((dataPieces[row+1][col+1] == 1 || dataPieces[row+1][col+1] == 2) && dataPieces[row+2][col+2] == 0){
                                    arrReg2 = [row, col, row+1, col+1, row+2, col+2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }
                            // Bottom left (jump case)
                            if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){
                                if((dataPieces[row+1][col-1] == 1 || dataPieces[row+1][col-1] == 2) && dataPieces[row+2][col-2] == 0){
                                    arrReg2 = [row, col, row+1, col-1, row+2, col-2, 'jump'];
                                    condRegular2.push(arrReg2);
                                }
                            }                            
                        }
                    }
                }
                if(condRegular2.length == 0){
                    // player 2 lose if it doesn't have any place to move
                    return "losePly2";
                }
            }
            
        }

        
        // coutn the number of rest of pieces
        function countRestPiece(){
            var countPiece1 = 0;
            var countPiece2 = 0;
            for(let i=0;i<dataColor.sizeCells;i++){
                for(let j=0;j<dataColor.sizeCells;j++){
                    if (dataPieces[i][j] == 1 || dataPieces[i][j] == 2){
                        countPiece1++;
                    }
                    if (dataPieces[i][j] == -1 || dataPieces[i][j] == -2){
                        countPiece2++;
                    }
                }
            }
            document.getElementById("restPiece1").innerHTML = countPiece1;  // display the rest of player1's pieces
            document.getElementById("restPiece2").innerHTML = countPiece2;  // display the rest of player1's pieces
            
            var restArr = [countPiece1, countPiece2];   // --> [restPiece_player1, restPiece_player2]
            return restArr;
        }
        
        var remNum  // set the remove index number
        // check the available places
        function isMoveAllowed(row_new,col_new){
            for (var i = 0; i < movCells.length; i++) {
                var move = movCells[i];
                if (move[0] === row_new && move[1] === col_new) {
                    remNum = i;
                    return true;
                }
            }
            return false;
        }

        function removeJumpedPiece() {           
            remove = remCells[remNum];
            jumpedRow =remove[0];
            jumpedCol =remove[1];

            if (jumpedRow == 0 && jumpedCol == 0){
                return false;
            }
            else {
                // get the cell information after jumping
                jumpedCell = document.querySelector('tbody').rows[jumpedRow].cells[jumpedCol];

                // delete cells jumped by opponents
                jumpedCell.innerHTML = '';
                dataPieces[jumpedRow][jumpedCol] = 0;
                return true;
            }
            
        }


        function update_dataPieces(i, j, m, n, piecesTags, createPieces){
            var totalNum = dataColor.sizeCells;
            if (piecesTags.contains('player1')){
                //dataPieces[i][j] = 0;
                if (m == 0 || dataPieces[i][j] == 2){
                    dataPieces[m][n] = 2;
                    createPieces.classList.add('king');
                }
                else {
                    dataPieces[m][n] = 1;
                }                
            }
            else {
                //dataPieces[i][j] = 0;
                if (m == totalNum-1 || dataPieces[i][j] == -2){
                    dataPieces[m][n] = -2;
                    createPieces.classList.add('king');
                }
                else {
                    dataPieces[m][n] = -1;
                }
            } 
            dataPieces[i][j] = 0;
        }
             

        function resetPiecesColors() {
            pieces.forEach(function (piece) {
                piece.style.border = '4px solid black';
            });
        }

        function resetBoardColors() {
            var allCells = document.querySelectorAll('td');
            allCells.forEach(function (cell, index) {
                var row = Math.floor(index / dataColor.sizeCells);
                var col = index % dataColor.sizeCells;
                // set the color of pieces
                if (dataBoard[row][col] == 0) {
                    cell.style.backgroundColor = dataColor.board_data1;
                } else if (dataBoard[row][col] == 1) {
                    cell.style.backgroundColor = dataColor.board_data2;
                }
                });
        }

        function getContainingCell(piece) {
            if (piece.tagName === 'TD') {
                return piece;
            }
            return piece.parentElement;
        }    
        
        // check the condition to be a king
        function checkPromotion(rowNum, currentPlayer, colNum) {
            if ((currentPlayer === 'player1' && rowNum === dataColor.sizeCells - 1) ||
                (currentPlayer === 'player2' && rowNum === 0)) {
                promoteToKing(selectedPiece, currentPlayer, rowNum, colNum);
            }
        }

        // set the pieces to a king
        function promoteToKing(piece, currentPlayer, row, col) {
            piece.classList.add('king');            
        }
        

        function getMovalableCells(tbodyInd, row, col){
            movCells = [];   // move cells
            console.log("movCells", movCells);
            remCells = [];   // remove cells
            var arrCells;
            var arrRem;     // get remove row and col
            var totalNum = dataColor.sizeCells;
            /*
            let colorData = {
                sizeCells: cells,
                numPlayer: numPlayer,
                board_data1: board_data1,
                board_data2: board_data2,
                piece_ply1: player2Color,
                piece_ply2: player2Color
            };
            */
            console.log("cell 1: " ,row);
            console.log("cell 2: " ,col);
            
            console.log("cell 3: " ,dataColor.sizeCells);

            // player 2 (regular pieces)
            if (dataPieces[row][col] == -1) {
                // bottom right
                if (row+1 < totalNum && col+1 < totalNum){
                    if (dataPieces[row+1][col+1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';  // get applicable "td"
                        arrCells = [row+1,col+1];
                        arrRem = [0,0];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                    }
                }
                // bottom left
                if (row+1 < totalNum && 0 <= col-1){                                
                    if (dataPieces[row+1][col-1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+1,col-1];
                        arrRem = [0,0];                        
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                    } 
                }  
                // bottom right (jump case)  
                if (row+1 < totalNum && col+1 < totalNum && row+2 < totalNum && col+2 < totalNum){                           
                    if ((dataPieces[row+1][col+1] == 1 || dataPieces[row+1][col+1] == 2) && dataPieces[row+2][col+2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col+2];
                        arrRem = [row+1,col+1];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                        console.log("dataPieces",dataPieces);
                        console.log("dataColor", dataColor);
                    }
                }
                // bottom left (jump case)
                if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){ 
                    if ((dataPieces[row+1][col-1] == 1 || dataPieces[row+1][col-1] == 2) && dataPieces[row+2][col-2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col-2];
                        arrRem = [row+1,col-1];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                        console.log("dataPieces",dataPieces);
                        console.log("dataColor", dataColor);
                    }
                }
            }
            // player 1 (Regular Pieces)
            else if (dataPieces[row][col] == 1) {    
                // Top right
                if (0 <= row-1 && col+1 < totalNum){                             
                    if (dataPieces[row-1][col+1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col+1];
                        arrRem = [0,0];
                        movCells.push(arrCells);
                        remCells.push(arrRem);   
                    }     
                } 
                // top left  
                if (0 <= row-1 && 0 <= col-1){        
                    if (dataPieces[row-1][col-1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col-1];
                        arrRem = [0,0];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                    }
                } 
                // top right (jump case)
                if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){  
                    if ((dataPieces[row-1][col+1] == -1 || dataPieces[row-1][col+1] == -2) && dataPieces[row-2][col+2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col+2];
                        arrRem = [row-1,col+1];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                    }
                }
                // top left (jump case)
                if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){  
                    if((dataPieces[row-1][col-1] == -1 || dataPieces[row-1][col-1] == -2) && dataPieces[row-2][col-2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col-2];
                        arrRem = [row-1,col-1];
                        movCells.push(arrCells);
                        remCells.push(arrRem);
                    }
                }
            }
            // player 2 (king pieces)
            else if (dataPieces[row][col] == -2) {
                // Top right
                if (0 < row-1 && col+1 < totalNum){
                    if (dataPieces[row-1][col+1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col+1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem);  
                    }    
                } 
                // Top left 
                if (0 <= row-1 && 0 <= col-1){          
                    if (dataPieces[row-1][col-1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col-1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem);  
                    }
                }
                // Bottom right
                if (row+1 < totalNum && col+1 < totalNum){
                    if (dataPieces[row+1][col+1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+1,col+1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem);     
                    } 
                }
                // Bottom left  
                if (row+1 < totalNum && 0 <= col-1){             
                    if (dataPieces[row+1][col-1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+1,col-1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem);  
                    }
                }
                // Top right (jump case)
                if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){
                    if ((dataPieces[row-1][col+1] == 1 || dataPieces[row-1][col+1] == 2) && dataPieces[row-2][col+2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col+2];
                        movCells.push(arrCells);
                        arrRem = [row-1,col+1];
                        remCells.push(arrRem);
                    }
                }
                // Top left (jump case)
                if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){
                    if((dataPieces[row-1][col-1] == 1 || dataPieces[row-1][col-1] == 2) && dataPieces[row-2][col-2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col-2];                    
                        movCells.push(arrCells);
                        arrRem = [row-1,col-1];
                        remCells.push(arrRem);
                    }
                }
                // Bottom right (jump case)
                if (row+1 < totalNum && col+1 < totalNum && row+2 < totalNum && col+2 < totalNum){
                    if ((dataPieces[row+1][col+1] == 1 || dataPieces[row+1][col+1] == 2) && dataPieces[row+2][col+2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col+2];                    
                        movCells.push(arrCells);
                        arrRem = [row+1,col+1];
                        remCells.push(arrRem);
                    }
                }
                // Bottom left (jump case)
                if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){
                    if((dataPieces[row+1][col-1] == 1 || dataPieces[row+1][col-1] == 2) && dataPieces[row+2][col-2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col-2];                    
                        movCells.push(arrCells);
                        arrRem = [row+1,col-1];
                        remCells.push(arrRem);
                    }
                }
            }
            // player 1 (king pieces)
            else if (dataPieces[row][col] == 2) {
                // Top right
                if (0 <= row-1 && col+1 < totalNum){
                    if (dataPieces[row-1][col+1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col+1];
                        movCells.push(arrCells); 
                        arrRem = [0,0]; 
                        remCells.push(arrRem);            
                    }  
                }
                // Top left 
                if (0 <= row-1 && 0 <= col-1){            
                    if (dataPieces[row-1][col-1] == 0){
                        rowInd = tbodyInd.rows[row-1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-1,col-1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem); 
                    }
                }
                // Bottom right
                if (row+1 < totalNum && col+1 < totalNum){
                    if (dataPieces[row+1][col+1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col+1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+1,col+1];
                        movCells.push(arrCells); 
                        arrRem = [0,0]; 
                        remCells.push(arrRem);       
                    }
                }   
                // Bottom left
                if (row+1 < totalNum && 0 < col-1){             
                    if (dataPieces[row+1][col-1] == 0){
                        rowInd = tbodyInd.rows[row+1];
                        cellInd = rowInd.cells[col-1];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+1,col-1];
                        movCells.push(arrCells);
                        arrRem = [0,0]; 
                        remCells.push(arrRem); 
                    }
                }
                // Top right (jump case)
                if (0 <= row-1 && col+1 < totalNum && 0 <= row-2 && col+2 < totalNum){
                    if (dataPieces[row-1][col+1] == -1 && dataPieces[row-2][col+2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col+2];                    
                        movCells.push(arrCells);
                        arrRem = [row-1,col+1];
                        remCells.push(arrRem);
                    }
                }
                // Top left (jump case)
                if (0 <= row-1 && 0 <= col-1 && 0 <= row-2 && 0 <= col-2){
                    if((dataPieces[row-1][col-1] == -1 || dataPieces[row-1][col-1] == -2) && dataPieces[row-2][col-2] == 0){
                        rowInd = tbodyInd.rows[row-2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row-2,col-2];                    
                        movCells.push(arrCells);
                        arrRem = [row-1,col-1];
                        remCells.push(arrRem);
                    }
                }
                // Bottom right (jump case)
                if (0 <= row+1 && 0 <= col+1 && 0 <= row+2 && 0 <= col+2){
                    if ((dataPieces[row+1][col+1] == -1 || dataPieces[row+1][col+1] == -2) && dataPieces[row+2][col+2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col+2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col+2];                    
                        movCells.push(arrCells);
                        arrRem = [row+1,col+1];
                        remCells.push(arrRem);
                    }
                }
                // Bottom left (jump case)
                if (row+1 < totalNum && 0 <= col-1 && row+2 < totalNum && 0 <= col-2){
                    if((dataPieces[row+1][col-1] == -1 || dataPieces[row+1][col-1] == -2) && dataPieces[row+2][col-2] == 0){
                        rowInd = tbodyInd.rows[row+2];
                        cellInd = rowInd.cells[col-2];
                        cellInd.style.backgroundColor = 'rgba(208, 44, 3, 0.688)';
                        arrCells = [row+2,col-2];                    
                        movCells.push(arrCells);
                        arrRem = [row+1,col-1];
                        remCells.push(arrRem);
                    }
                }
            }
            
            if (movCells.length == 0){
                checkWinner();
            }

            //checkPromotion(row, currentPlayer, col);
            console.log("dataPieces",dataPieces);
            console.log("dataColor", dataColor);
            console.log("removeCells" ,remCells);
            console.log("movCells2", movCells);
            return movCells;            
        }
    //}
