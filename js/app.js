/**
* @description enemy object
* @constructor
* @param {int} line - enemy is in which line
* @param {int} speed - how speed  enemy is moving
* @param {int} delay - delay time of the enemy
*/
var Enemy = function(line,speed,delay) {
    this.sprite = 'images/enemy-bug.png';
    this.line=line;
    this.speed=101*speed;//101 is length of one grass
    this.delay=delay;
    this.init();

};
Enemy.prototype.init=function(){
    this.isstop=false;
    this.x= -101 - 404*this.delay;//initial X position
    this.y= 60 + 83 * this.line;//initial Y position
};
//start move
Enemy.prototype.start=function(){
    this.isstop=false;
};
//stop function stop the move of enemy
Enemy.prototype.stop=function(){
    this.isstop=true;
};
Enemy.prototype.update = function(dt) {
    if(this.isstop) return ;//if stop is true and then return without moving
    if(this.x>=505){ this.x=-101;}//if move out the screen and return to initial position
    this.x +=dt*this.speed; //move on
    this.render();
};
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//get enemy's center coordinate 
Enemy.prototype.getRange=function(){
    return {x:(this.x+2+this.x+98)/2,y:this.y};
};

/**
* @description player
* @param {array} playerImages - players' image
* @constructor
*/
var playerClass = function(playerImages) {
    this.playerImages=playerImages;
    this.playerImagesLen=playerImages.length-1;
    this.sprite = 0;
    this.minX=0;
    this.maxX=404;
    this.minY=-10;
    this.maxY=405;
    //take the stone's width as player's X move
    this.speedX=101;
    //take the stone's height as player's Y move
    this.speedY=83;
    this.isChoosedPlayer=false;
    this.init();
};
playerClass.prototype.choosePlayer=function(sprite){
    ctx.fillStyle="white";
    ctx.font="18px sans-serif";
    ctx.textAlign="center";
    ctx.fillText("choose the player and change with left and right key",250,420);
    ctx.fillStyle="white";
    ctx.font="18px sans-serif";
    ctx.textAlign="center";
    ctx.fillText("press enter to start",250,450);
};
//更换人物
playerClass.prototype.changePlayer=function(sprite){
     this.sprite = sprite;
};

playerClass.prototype.init=function(){
    this.x=202;
    this.y=405;
    this.isstop=true;
};

playerClass.prototype.start=function(){
    this.isstop=false;
};
playerClass.prototype.stop=function(){
    this.isstop=true;
};

//get player's center coordinate 
playerClass.prototype.getRange=function(){
    return {x:(this.x+28+this.x+94)/2,y:this.y};
};
playerClass.prototype.update = function() {
    if(this.isstop) {
        return ;
    }
    // prevent player moving out the screen
    this.x=this.x>=this.maxX?this.maxX:(this.x<=this.minX?this.minX:this.x);
    this.y=this.y>=this.maxY?this.maxY:(this.y<=this.minY?this.minY:this.y);
    this.render();
};
playerClass.prototype.render = function() {
    ctx.drawImage(Resources.get(this.playerImages[this.sprite]), this.x, this.y);
    if(!this.isChoosedPlayer){
        this.choosePlayer();
    }
};
//keyboard controls player
playerClass.prototype.handleInput = function(code) {
    if(!this.isChoosedPlayer){
        switch(code) {
            case "left":
                this.sprite++;
                if(this.sprite>this.playerImagesLen) this.sprite=0;
                break;
            case "right":
                this.sprite--;
                if(this.sprite<0) this.sprite=this.playerImagesLen;
                break;
            case "enter":
                this.isChoosedPlayer=true;
                this.start();
                break;
        } 
    }else{
        if(this.isstop) return ;
        switch(code) {
            case "left":
                this.x -=this.speedX;
                break;
            case "up":
                this.y -=this.speedY;
                break;
            case "right":
                this.x +=this.speedX;
                break;
            case "down":
                this.y +=this.speedY;
                break;
        } 
    }
};

/**
* @description class of success and failure
* @constructor
*/
function stageClear(txt){
    this.txt=txt;
    this.init();
}
stageClear.prototype.start=function(){
    this.isstart=true;
};
stageClear.prototype.init = function() {
    this.isstart=false;
    this.x=-300;
    this.y=-300;
};
stageClear.prototype.update = function() {
    if(this.isstart){
        this.x=250;
        this.y=300;
        this.render();
    } 
};
stageClear.prototype.render = function() {   
    ctx.fillStyle="blue";
    ctx.font="60px sans-serif";
    ctx.fontWight="border";
    ctx.textAlign="center";
    ctx.fillText(this.txt,this.x,this.y);
    ctx.font="30px sans-serif";
    ctx.fillText("press enter to start again!",this.x,this.y+70);

};
stageClear.prototype.handleInput = function(code,callback) {
    if(!this.isstart) return;
    switch(code) {
        case "enter":
            callback();
            break;
    }
};
//set three lines enemy
var enemiesNum=3;
var playerImages=[     
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];
var allEnemies =[];
for (var i = 0; i <3; i++) {
    var randomNum=Math.random();
    //each line has two enemie and the speed is the same
    allEnemies.push(new Enemy(i,2+randomNum*2,0),new Enemy(i,1+randomNum*2,1));
}
var player=new playerClass(playerImages);

var successClear=new stageClear("~~~~CLEAR~~~~");
var failClear=new stageClear("~~~~FAIL~~~~");
var cap=70;

// check whether player collides with enemies
function checkCollisions(){
    var tmpp=player.getRange();
    //when tmpp.y equals to -10, the game wins and stop each moving object. Becuse it's the position of river. 
    if(tmpp.y==-10){
        gameStop();
        successClear.start();
        return;
    }
    var res=false;
    res=allEnemies.some(function(e){
        var tmpe=e.getRange();
        return (tmpp.y-tmpe.y===13&&Math.abs(tmpp.x-tmpe.x)<cap);
    });
    //if res is true ,it means game over, and everything restart
    if(res){
        gameStop();
        failClear.start();
    }
}

//everything start
function gameInit(){
    allEnemies.forEach(function(e){
        e.stop();
        e.init();
    });
    player.stop();
    player.init();
    player.start();
    successClear.init();
    failClear.init();
}
//everything stop
function gameStop(){
    allEnemies.forEach(function(e){
        e.stop();
    });
    player.stop();
}
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        13: 'enter'
    };
    player.handleInput(allowedKeys[e.keyCode]);
    var sallowedKeys = {
        13: 'enter'// press enter to next level
    };
    successClear.handleInput(sallowedKeys[e.keyCode],function(){
        gameInit();
    });
    failClear.handleInput(sallowedKeys[e.keyCode],function(){
        gameInit();
    });
});
