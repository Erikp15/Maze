// Creating variables
var state=1;
// state=1  pick level
// state=2  generation of level
// state=3  pick starting position
// state=4  calculate BFS
// state=5  display the solution/path
// state=6  no solution
var maze = [[]];
/*[
    ['*','*','*',' ','*','*','*'],
    ['*',' ','*',' ',' ','*','*'],
    ['*',' ','*','*',' ',' ',' '],
    ['*',' ',' ','*',' ','*','*'],
    ['*',' ',' ',' ',' ','*','*'],
    ['*','*','*',' ','*','*','*'],
    ['*',' ',' ',' ','*','*','*'],
    ['*',' ','*','*','*','*','*'], 
    ['*',' ','*','*','*','*','*'], 
];
*/
// wall=0;
// up=1;
// right=2;
// down=3;
// left=4;
var direction = [[]];

var maze_selection_gridy = [10,30,100,250];
var maze_selection_gridx = [20,60,200,500];
var maze_selection_prob = [0.5,0.5,0.65,0.7];
var random_maze_empty_prob;
var mazeysize;
var mazexsize;
var maze_selection_button_count=maze_selection_gridx.length;
var size=50; // auto calculated later
 

var queue = [];
var steps = 0;
var pre = [];
var finalx;
var finaly;
var prex; 
var prey;
var buttonx=250, buttony=250, buttonsizex=200, buttonsizey=50;

// Color can be "red"  "#f01020"
function setColor(color){  
	context.fillStyle=color;
}
function drawText(text,x,y){
   context.fillText(text,x,y);
}

function update() {}

function drawMaze(){
	var x=0;
	var y=0;
	for(x=0; x<mazexsize; x++){
		for(y=0; y<mazeysize; y++){
			if(maze[y][x]==' ' || maze[y][x]=='b'){
				setColor('gray');
			}
			if(maze[y][x]=='s'){
				setColor('lime');
			}
			if(maze[y][x]=='*'){
				setColor('red');
			}
			if(maze[y][x]=='p'){
				setColor('blue');
			}
			context.fillRect(x*size, y*size, size-1, size-1);
		}
	}
}
function draw() {
	if(state==1){
		for(var y=0; y<maze_selection_button_count; y++){
			setColor("grey");
			createbutton(buttonx,buttony+y*buttonsizey,buttonsizex,buttonsizey*0.9);
			fontheight=buttonsizey*0.5;
			context.font = "" + fontheight + "px Arial";
			setColor("black");
			drawText("size " + maze_selection_gridx[y] + "x" +maze_selection_gridy[y] ,buttonx,buttony+y*buttonsizey+fontheight+(buttonsizey-fontheight)/2);
		}
	}
	if(state==2){	
		generateMaze();
	}
	if(state==3){
		drawMaze();
	}
	if(state==4){
		drawMaze();
		//drawText("Loading...",300,300);
	}
	if(state==5){
		drawMaze();
	}
	if(state==6){
		drawText('No solution',250,250);
	}
}

function keyup(key) {
}
function mouseup() {
	if(state==1){
		if(mouseX>=buttonx && mouseY>=buttony && mouseX<=buttonx+buttonsizex && mouseY<=buttony+buttonsizey*maze_selection_button_count){
			var button_pressed = Math.floor((mouseY-buttony)/buttonsizey);
			mazexsize=maze_selection_gridx[button_pressed];
			mazeysize=maze_selection_gridy[button_pressed];
			size=Math.floor(1000/mazexsize);
			maze = new Array(mazeysize).fill(' ').map( () => new Array(mazexsize).fill(' '));
			direction = new Array(mazeysize).fill(0).map( () => new Array(mazexsize).fill(0));
			random_maze_empty_prob = maze_selection_prob[button_pressed];
			state=2;
		}
	}
	if(state==3){
		var curX, curY;
		curX=Math.floor(mouseX/size);
		curY=Math.floor(mouseY/size);
		if(maze[curY][curX]!='*'){
			state=4;
			maze[curY][curX]='s';
			queue=[];
			queue.push({y:curY,x:curX});
			//console.log(curY + " " + curX);
			bfs();
		}
	}	
}
function generateMaze(){
	for(var y=0;y<mazeysize;y++){
		for(var x=0;x<mazexsize;x++){
			if(Math.random()>=random_maze_empty_prob){
				maze[y][x]='*';
			}else{
				maze[y][x]=' ';
			}
		}
	}
	state=3;
	return;
}

function createbutton(bx,by,bl,bw){
	context.fillRect(bx,by,bl,bw);
}

function bfs(){
    while(queue.length>0 && state==4){
		var pos = queue.shift();
		//console.log('bfs ',pos.y ,' ', pos.x);
		prex=pos.x;
		prey=pos.y;
		tryPos(pos.x+1, pos.y,4);
        tryPos(pos.x-1, pos.y,2);
        tryPos(pos.x, pos.y+1,1);
        tryPos(pos.x, pos.y-1,3);
	}
	// ??? handle case with no solution
	if(queue.length==0 && state==4){
		state=6;
	}else{
		findpath();
	}
}
function tryPos(cx,cy,cdirection){
	//console.log(cy, ' ',cx);
    if(cy<mazeysize || cy>=0 || cx<mazexsize || cx>=0){
		if(maze[cy][cx]===' '){
			if(cy==mazeysize-1 || cy==0 || cx==mazexsize-1 || cx==0){
				state=5;
				finalx=cx;
				finaly=cy;				
			}else{
				queue.push({x:cx, y:cy});
			}
			maze[cy][cx]='b';
			direction[cy][cx]=cdirection;
		}
	}
    return;
}
function findpath(){
	//console.log('in findpath ',finalx,' ',finaly,' ',direction[finaly][finalx],' ',maze[finaly][finalx]);
	if(maze[finaly][finalx]==='s'){
		return;
	}
	if(direction[finaly][finalx]===1){
		maze[finaly][finalx]='p';
		finaly--;
		findpath();		
	}
	if(direction[finaly][finalx]===2){
		maze[finaly][finalx]='p';
		finalx++;
		findpath();		
	}
	if(direction[finaly][finalx]===3){
		maze[finaly][finalx]='p';
		finaly++;
		findpath();		
	}
	if(direction[finaly][finalx]===4){
		maze[finaly][finalx]='p';
		finalx--;
		findpath();		
	}
	return;
}
