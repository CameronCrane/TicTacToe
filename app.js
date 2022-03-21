//Initial turn (X goes first)
var turn = "X";

//Will be converted to matrix representing game board
var grid = [[0,0,0],[0,0,0],[0,0,0]];

//Necessary matrices for winner calculations
var a = math.matrix([1,1,1]);
var e1 = math.matrix([1,0,0]);
var e2 = math.matrix([0,1,0]);
var e3 = math.matrix([0,0,1]);
var permute = math.matrix([[0,0,1],[0,1,0],[1,0,0]]);

//Get caption text element, alter it as needed
var capText = document.getElementById('caption');
//Get button elements?
var buttons = document.getElementsByName('gamecell');

//Sound effects
var click = new Audio('sounds/drop_003.ogg');
var win = new Audio('sounds/jingles_PIZZI10.ogg');
var draw = new Audio('sounds/jingles_PIZZI07.ogg');
var re = new Audio('sounds/question_002.ogg');

//Keep track of # of cells used
var used = 0;

//Record wins/losses
var xWins = 0;
var oWins = 0;
var draws = 0;

//Each time someone makes a play, adjust the board and check for a victor with checkWin
function play(cell) 
{
    click.play();
    //Pull game board index from value of table cell clicked
    cell.value = turn;
    const index = cell.className;
    const parse = index.split(",")
    const i = parseInt(parse[0]);
    const j = parseInt(parse[1]);
    //X plays marked as +1, O plays marked as -1 (this is important for the math)
    //Sets corresponding cell to +1 or -1, change the turn, then check win conditions
    if(turn == "X")
    {
        grid[i][j] = 1;
        capText.innerHTML = "Current Turn: O";
        turn = "O";
        checkWin(grid);   
        cell.style["background-color"] = '#F05656';
    }
    else 
    {
        grid[i][j] = -1;
        capText.innerHTML = "Current Turn: X";
        turn = "X";
        checkWin(grid);
        cell.style["background-color"] = '#8BC4F1';
    }
    cell.disabled = true;
}

function checkWin(arr) 
{
    //Matrix operations designed to check for victory if any one of these returns +/-3. +3 if X wins, -3 if O wins.
    var mathBoard = math.matrix(arr);
    var check1 = math.multiply(a,mathBoard,e1);
    var check1T = math.multiply(a,math.transpose(mathBoard),e1);
    var check2 = math.multiply(a,mathBoard,e2);
    var check2T = math.multiply(a,math.transpose(mathBoard),e2);
    var check3 = math.multiply(a,mathBoard,e3);
    var check3T = math.multiply(a,math.transpose(mathBoard),e3);
    var check4 = math.trace(mathBoard);
    var check5 = math.trace(math.multiply(permute, math.transpose(mathBoard)));
    used++;
    if(check1 == 3 || check1T == 3 || check2 == 3 || check2T == 3 || check3 == 3 || check3T == 3 || check4 == 3 || check5 == 3)
    {
        buttons.forEach(btn => btn.disabled=true);
        capText.innerHTML = "X is the winner!!!";
        xWins++;
        document.getElementById('numXWins').innerHTML = "X WINS: " +xWins;
        win.play();
        
    }
    else if(check1 == -3 || check1T == -3 || check2 == -3 || check2T == -3 || check3 == -3 || check3T == -3 || check4 == -3 || check5 == -3)
    {
        buttons.forEach(btn => btn.disabled=true);
        capText.innerHTML = "O is the winner!!!";
        oWins++;
        document.getElementById('numOWins').innerHTML = "O WINS: " +oWins;
        win.play();
    }
    //If all cells have been played with no victor, it becomes a draw
    else if(used == 9)
    {
        buttons.forEach(btn => btn.disabled=true);
        capText.innerHTML = "It's a draw :(";
        draws++;
        document.getElementById('numDraws').innerHTML = "DRAWS: " +draws;
        draw.play();
        buttons.forEach(btn => {
            btn.style["background-color"] = '#3f3f3f';
            btn.style["background-color"] = '';
        }); 
    }    
}

//Reset gamestate on button click
function rematch()
{
    re.play();
    turn = "X";
    used = 0;
    grid = [[0,0,0],[0,0,0],[0,0,0]];
    capText.innerHTML = "Current Turn: X";
    buttons.forEach(btn => {
        btn.value="   ";
        btn.style["background-color"] = '#F0F0F0';
        btn.disabled=false;
        btn.style["background-color"] = '';
    });       
}