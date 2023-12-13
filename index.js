/* set the option for 1st player */
function showPlayer1(){
    let label = document.createElement('label');
        label.innerHTML = "Color of Pieces (Player 1):";     
        let select = document.createElement('select');
        select.id = "colorPieces_ply1";
        // set the color option of pieces
        let option1 = document.createElement('option');     // set the 1st option
        option1.id = "red";
        option1.innerHTML = "Red";
        let option2 = document.createElement('option');     // set the 2nd option
        option2.id = "blue";
        option2.innerHTML = "Blue";
        let option3 = document.createElement('option');     // set the 3rd option
        option3.id = "green";
        option3.innerHTML = "Green";
        let option4 = document.createElement('option');     // set the 4th option
        option4.id = "purple";
        option4.innerHTML = "Purple";
        let option5 = document.createElement('option');     // set the 5th option
        option5.id = "yellow";
        option5.innerHTML = "Yellow";
        let option6 = document.createElement('option');     // set the 6th option
        option6.id = "orange";
        option6.innerHTML = "Orange";
        let option7 = document.createElement('option');     // set the 7th option
        option7.id = "pink";
        option7.innerHTML = "magenta";  
            
        // append the select and each option
        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);
        select.appendChild(option4);
        select.appendChild(option5);
        select.appendChild(option6);
        select.appendChild(option7);
        document.getElementById('player1').innerHTML = '';
        document.getElementById('player1').appendChild(label);
        document.getElementById('player1').appendChild(select);
}

/* set the options for 2nd player */
function showPlayer2(){
    let label = document.createElement('label');
        label.innerHTML = "Color of Pieces (Player 2):"
        let select = document.createElement('select');
        select.id = "colorPieces_ply2";

        // Check the number of players selected
        let numPlayer = document.getElementById('numPlayer').value;
        let player2DefaultColor;

        // Set default color for player 2 based on the number of players
        if (numPlayer === '1ply') {
            player2DefaultColor = 'black'; // Default color for CPU in 1-player mode
        } else {
            player2DefaultColor = 'blue';  // Default color for player 2 in 2-player mode
        }

        // set the color option of pieces
        let option1 = document.createElement('option');     // set the 1st option
        option1.id = "red";
        option1.innerHTML = "Red";
        let option2 = document.createElement('option');     // set the 3rd option
        option2.id = "blue";
        option2.innerHTML = "Blue";
        let option3 = document.createElement('option');     // set the 3rd option
        option3.id = "green";
        option3.innerHTML = "Green";
        let option4 = document.createElement('option');     // set the 4th option
        option4.id = "purple";
        option4.innerHTML = "Purple";
        let option5 = document.createElement('option');     // set the 5th option
        option5.id = "yellow";
        option5.innerHTML = "Yellow";
        let option6 = document.createElement('option');     // set the 6th option
        option6.id = "orange";
        option6.innerHTML = "Orange";
        let option7 = document.createElement('option');     // set the 7th option
        option7.id = "pink";
        option7.innerHTML = "magenta";
        
        
        // append the select and each option 
        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);
        select.appendChild(option4);
        select.appendChild(option5);
        select.appendChild(option6);
        select.appendChild(option7);
        document.getElementById('player2').innerHTML = '';
        document.getElementById('player2').appendChild(label);
        document.getElementById('player2').appendChild(select);
}

/* show up the options depending on the number of players*/
function generatePlayer(){
    let numPlayer = document.getElementById('numPlayer').value; 
    if (numPlayer === '2ply'){
        // the case of 2 players
        showPlayer1();
        showPlayer2();
    }
    else {
        // the case of 1 player
        showPlayer1();
    }
}

/* go to the game page after gathering necessary information for playing checkers */
function startGame(){
    let sizeBoard = document.getElementById('sizeBoard').value;     // get the selected size of board
    let colorBoard = document.getElementById('colorBoard').value;
    let data = [];
    let dataBoard = [];      // create martrix for each square
    let dataPieces = []; // create matrix to check the positoin of pieces
    let cells;          // get the size of board

    // check the size of board
    switch(sizeBoard){
        case '8x8':
            cells = 8;
            break;
        case '10x10':
            cells = 10;
            break;
    }

    // Fetch player one color from the selected options
    let player1Color = document.getElementById('colorPieces_ply1').value;
    piece_ply1 = player1Color;

    // Fetch player two color if there are 2 players
    let player2Color;
    let numPlayer = document.getElementById('numPlayer').value;
    if (numPlayer === '2ply') {
        player2Color = document.getElementById('colorPieces_ply2').value;
        //piece_ply2 = player2Color;
    } else {
        // Default color for player 2 in 1-player mode
        player2Color = 'black';
        //piece_ply2 = player2Color;
    }

    
    // Store player one and player two colors in Local Storage
    localStorage.setItem('colorPieces_ply1', player1Color);
    localStorage.setItem('colorPieces_ply2', player2Color);

    // create the board
    let tbody = document.createElement('tbody');
    var board_data1;  // store the color data
    var board_data2;  // store the color data
    for (let i = 0; i < cells; i++){
        let tr = document.createElement('tr');
        data[i] = [];
        dataBoard[i] = [];
        dataPieces[i] = [];
        for (let j = 0; j < cells; j++) {
            let td = document.createElement('td');
            dataBoard[i][j] = 0;
            // set the color of board
            if ((i+j)%2 == 0){
                td.id = "board_color1";
                dataPieces[i][j] = 0;                        
                switch (colorBoard) {
                    case 'board_white':
                        td.style.backgroundColor = "white"; // set the black to board
                        board_data1 = "white";
                        break;
                    case 'board_pink':
                        td.style.backgroundColor = "pink";  // set the black to board
                        break;
                    case 'board_blue':
                        td.style.backgroundColor = "rgb(98, 179, 216)"; // set the blue to board
                        break;
                    case 'board_yellow':
                        td.style.backgroundColor = "rgb(237, 232, 146)";    // set the yellow to board
                        break;
                    case 'board_green':
                        td.style.backgroundColor = "rgb(146, 237, 175)";    // set the green to board
                        break;
                    case 'board_purple':
                        td.style.backgroundColor = "rgb(192, 135, 228)";    // set the purple to board
                        break;
                }
            }
            else {
                td.id = "board_color2";
                dataBoard[i][j] = 1;
                if(cells == 8){
                    // case of 8x8
                    if (i < 3){
                        // player 1 side
                        dataPieces[i][j] = -1;
                    }
                    else if(i > 4) {
                        // player 2 side
                        dataPieces[i][j] = 1;
                    }
                    else{
                        // no pieces
                        dataPieces[i][j] = 0;
                    }
                }
                else{
                    // case of 10x10
                    if (i < 4){
                        // player 1 side
                        dataPieces[i][j] = -1;
                    }
                    else if(i > 5) {
                        // player 2 side
                        dataPieces[i][j] = 1;
                    }
                    else{
                        // no pieces
                        dataPieces[i][j] = 0;
                    }
                }
                // set the color of board depending on player's choice
                
                td.style.backgroundColor = "rgb(76, 75, 75)";  // set the black to board
                board_data2 = "rgb(76, 75, 75)";

            }                    
            tr.appendChild(td);
            
        }
        tbody.appendChild(tr);
    }

    let colorData = {
        sizeCells: cells,
        numPlayer: numPlayer,
        board_data1: board_data1,
        board_data2: board_data2,
        piece_ply1: player2Color,
        piece_ply2: player2Color
    };

    /* gather the game data */

    console.log(dataBoard);
    
    localStorage.setItem('data', tbody.outerHTML);  // set the table data of checkers board
    localStorage.setItem('sizeBoard', sizeBoard);  // set the selected size of the board
    localStorage.setItem('colorBoard', colorBoard);  // set the selected color of the board
    localStorage.setItem('dataPieces', JSON.stringify(dataPieces));  // set the data of pieces position
    localStorage.setItem('dataColor', JSON.stringify(colorData));  // set the data of color
    localStorage.setItem('dataBoard', JSON.stringify(dataBoard));  // set the data of board

    // check whether player1 and player2 select different colors
    if(numPlayer === '2ply' && player1Color === player2Color){
        alert("Please choose different color between player1 and player2");
    }
    else{
        location.href = './game_Page.html' ;    // go to game_Page.html
    } 
    
}
