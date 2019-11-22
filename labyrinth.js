// Creating variables
var state=2;
// state=1  pick level
// state=2  pick starting position
// state=3  calculate BFS
// state=4  display the solution/path
const maze = [
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
// wall=0;
// up=1;
// right=2;
// down=3;
// left=4;
var direction = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
];

var size=50;
var mazeysize = maze.length;
var mazexsize = maze[0].length;

var queue = [];
var steps = 0;
var pre = [];
var finalx;
var finaly;
var prex; 
var prey;
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
	if(state==2){
		drawMaze();
	}
	if(state==3){
		drawMaze();
		//drawText("Loading...",300,300);
	}
	if(state==4){
		drawMaze();
	}
}

function keyup(key) {
}
function mouseup() {
	if(state==2){
		var curX, curY;
		curX=Math.floor(mouseX/size);
		curY=Math.floor(mouseY/size);
		if(maze[curY][curX]!='*'){
			state=3;
			maze[curY][curX]='s';
			queue=[];
			queue.push({y:curY,x:curX});
			console.log(curY + " " + curX);
			bfs();
		}
	}	
}




function bfs(){
    while(queue.length>0 && state==3){
		var pos = queue.shift();
		console.log('bfs ',pos.y ,' ', pos.x);
		prex=pos.x;
		prey=pos.y;
		tryPos(pos.x+1, pos.y,4);
        tryPos(pos.x-1, pos.y,2);
        tryPos(pos.x, pos.y+1,1);
        tryPos(pos.x, pos.y-1,3);
	}
	// ??? handle case with no solution
	if(queue.length==0 && state==3){
		drawText('No solution',250,250);
		state==2;
	}else{
		findpath();
	}
}
function tryPos(cx,cy,cdirection){
	console.log(cy, ' ',cx);
    if(cy<mazeysize || cy>=0 || cx<mazexsize || cx>=0){
		if(maze[cy][cx]===' '){
			if(cy==mazeysize-1 || cy==0 || cx==mazexsize-1 || cx==0){
				state=4;
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
	console.log('in findpath ',finalx,' ',finaly,' ',direction[finaly][finalx],' ',maze[finaly][finalx]);
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
