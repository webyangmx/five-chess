var cvs = document.getElementById('chess');
var ctx = chess.getContext('2d');
var me = true;//默认黑子先下
var chessBoard = [];//存储棋盘中哪些已经被下子

var wins = [];//赢法数组

// 赢法统计数组 统计572种赢法中第k种赢法的已下子数
var myWin = [];//我方/黑子 赢法统计数组
var computerWin = [];//计算机/白子 赢法统计数组
var count = 0;//计算全部赢法种数,同时代表第count种赢法

var over = false;//是否结束

window.onload = function() {
	drawChessBoard();
	// 初始化 下子情况
	for (var i = 0; i < 15; i++) {
		chessBoard[i] = [];
		for (var j = 0; j < 15; j++) {
			chessBoard[i][j] = false;
		}
	}

	// 初始化3维数组
	for (var i = 0; i < 15; i++) {
		wins[i] = [];
		for(var j = 0;j <15; j++){
			wins[i][j] = [];
		}
	}
	// 初始化赢法数组

	//所有横线赢法 
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 11; j++) {
			for(var k = 0; k < 5; k++){
				wins[i][j + k][count] = true;
			}
			count++;
		}
	}

	//所有竖线赢法 
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 15; j++) {
			for(var k = 0; k < 5; k++){
				wins[i + k][j][count] = true;
			}
			count++;
		}
	}

	//所有斜线赢法 
	for (var i = 0; i < 11; i++) {
		for (var j = 0; j < 11; j++) {
			for(var k = 0; k < 5; k++){
				wins[i + k][j + k][count] = true;
			}
			count++;
		}
	}

	//所有反斜线赢法 
	for (var i = 14; i >= 4; i--) {
		for (var j = 0; j < 11; j++) {
			for(var k = 0; k < 5; k++){
				wins[i - k][j + k][count] = true;
			}
			count++;
		}
	}

	// 最终算出总共572种赢法
	console.log(count);//572


	// 初始化赢法统计数组 初始化为0
	for (var i = 0; i < count; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}
}


function drawChessBoard() {
	// ctx.save();
	ctx.strokeStyle = '#bfbfbf';
	for (var i = 0; i < 15; i++) {
	// 纵线
	ctx.moveTo(15 + i*30, 15);
	ctx.lineTo(15 + i*30, 435);
	ctx.stroke();
	// 横线
	ctx.moveTo(15, 15 + i*30);
	ctx.lineTo(435 , 15 + i*30);
	ctx.stroke();
}
	// ctx.restore();
}
/* 
i 行
j 列
me true为黑棋 false为白棋
*/
function oneStep(i,j,me) {
	ctx.save();

	// createRadialGradient 有两组参数 每组3个参数 分别代表圆心x、y、半径
	// addColorStop的参数为对应的渐变颜色
	var gradient = ctx.createRadialGradient(15 + i*30 + 2,15 + j*30 - 2, 13, 15 + i*30 + 2,15 + j*30 - 2, 0);
	if(me){
		gradient.addColorStop(0,'#0a0a0a');
		gradient.addColorStop(1,'#636766');
	}else{
		gradient.addColorStop(0,'#d1d1d1');
		gradient.addColorStop(1,'#f9f9f9');

	}
	ctx.fillStyle = gradient;

	ctx.beginPath();
	ctx.arc(15 + i*30,15 + j*30, 13, 0, 2* Math.PI);
	ctx.closePath();

	ctx.fill();
	ctx.restore();
}
cvs.onclick = function(e) {

	if(over || !me)
		return;

	// offsetX 为相对canvas的偏移量
	// pageX或x 为相对document位置
	// screenX 为相对window位置
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x/30);
	var j = Math.floor(y/30);
	if(chessBoard[i][j]){
	  return;
	}
	oneStep(i,j,me);
	chessBoard[i][j] = 1;
	for (var k = 0; k < count; k++) {
		if (wins[i][j][k]) {//第k种赢法在i,j位置有子
			myWin[k]++;
			console.log('第' + k +'种赢法有'+myWin[k] + '个黑子');
			computerWin[k] = 100;
			if(myWin[k] == 5){
				alert('黑子赢');
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
		computerAI();
	}
};
function computerAI() {
	var myScore = [];
	var computerScore =[];

	var max = 0;//记录最大分数
	var u = 0,v = 0;//保存最大分数点的下标

	for (var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for (var j = 0; j < 15; j++) {
			// 初始化分数全为0
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if(chessBoard[i][j] == 0){//还没下子
				for (var k = 0; k < count; k++) {//遍历赢法统计数组
					if(wins[i][j][k]){//wins[i][j][k]为true 说明ij点属于第K种赢法
						switch(myWin[k]){
							case 1:myScore[i][j] += 200;break;
							case 2:myScore[i][j] += 400;break;
							case 3:myScore[i][j] += 2000;break;
							case 4:myScore[i][j] += 10000;break;
						}
						switch(computerWin[k]){
							case 1:computerScore[i][j] += 220;break;
							case 2:computerScore[i][j] += 420;break;
							case 3:computerScore[i][j] += 2100;break;
							case 4:computerScore[i][j] += 20000;break;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] == max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}


				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] == max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u,v,false);
	chessBoard[u][v] = 2;
	for (var k = 0; k < count; k++) {
		if (wins[u][v][k]) {//第k种赢法在i,j位置有子
			computerWin[k]++;
			console.log('第' + k +'种赢法有'+myWin[k] + '个白子');
			myWin[k] = 100;
			if(computerWin[k] == 5){
				alert('白子赢');
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
}
