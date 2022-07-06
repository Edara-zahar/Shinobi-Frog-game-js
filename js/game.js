var main;
var ctxmain;
var hero; // Герой лягуха
var ctxHero;
var gameWidth = 3250; //Размер игрового поля
var gameHeight = 1800;
var fon = new Image(); // Создаём переменную типа Изображения
fon.src = "img/fon_1.jpg"; //Путь изображения
var block; //Блоки
var ctxBlock;
var heroimg = new Image();
heroimg.src = "img/Sprite.png";
var map = []; //Массив для блоков
var LeftRightHero = "R"; //Переменная для загрузки нужного положения героя
var requestAnimFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame;
var isPlayIng = true; //Переменная старта игры, если установленное значение истина, значит игра запущена
var beginspeed = 0;//Начальная скорость
var grav = 0.5;    //гравитация
var tg = 0;        //стоит ли герой на блоке | 0 - стоит, 1 - в прыжке
var maxJump =-13;  //Высота прыжка по Y
var num = 0;       //переменная для текущей картинки спрайта игрока
var mon = []; //массив для монеток
var nummoney = 0; //переменная для текущей картинки со спрайта монетки
var CountMoney = 0; //Кол-во собранных

window.onload = init;

function init () {
	main = document.getElementById("main");
	ctxmain = main.getContext("2d");
	block = document.getElementById("block");
	ctxBlock = block.getContext("2d");
	hero = document.getElementById("hero");
	ctxHero = hero.getContext("2d");
	title = document.getElementById("title");
	ctxTitle = title.getContext("2d");

	main.width = gameWidth;
	main.height = gameHeight;
	block.width = gameWidth;
	block.height = gameHeight;
	hero.width = gameWidth;
	hero.height = gameHeight;
	title.width = gameWidth;
	title.height = gameHeight;

	ctxTitle.fillStyle = "#FFF";
	ctxTitle.font = "bold 20px Arial";

	block_scena = new Block(); // Создадим переменную типа функции
	player = new Player();

	Fon(); //Выполняем функцию по созданию фона
	block_scena.draw(); //Вызываем метод риосвания блока
	player.draw(); //Рисование игрока
	arrayMoney(); //Массив для бананов

	//Слушатели нажатия клавиш
	document.addEventListener("keydown", checkKeyDown, false);
	document.addEventListener("keyup", checkKeyUp, false);

	EnterFrame(); //Вызываем функцию анимации
}

function EnterFrame(){
	if (isPlayIng){ //Если игра запущена
		update(); //Запускаем функцию обновления
		requestAnimFrame(EnterFrame); //Запускаем анимацию 
	}
}

function update(){
	player.chooseDir(); //Проверка нажатия клавиш
	player.draw();      // Рисование игрока
	block_scena.draw(); //Функця рисования блоков каждый кадр
	MoneyDraw(); 		//Анимация монеток
}


function Fon(){
	ctxmain.clearRect(0, 0, gameWidth, gameHeight);
	ctxmain.drawImage(fon, 0, 0 , 1888, 1080,
			0, 0, gameWidth, gameHeight);
}
function Block(){
	this.srcX = 0; // Координаты блока
	this.srcY = 45;
	this.drawX = 0; // Положение блока
	this.drawY = 0;
	this.width = 40;
	this.height = 40; // Размер блока
	//Задаём координаты каждого блока
	map.push({
		x:70,
		y:500,
		width: this.width,
		height: this.height
	});
	map.push({x:128, y:500, width: this.width, height: this.height
	});
	map.push({x:186, y:500, width: this.width, height: this.height
	});
	map.push({x:244, y:500, width: this.width, height: this.height
	});
	map.push({x:322, y:350, width: this.width, height: this.height
	});
	map.push({x:380, y:350, width: this.width, height: this.height
	});
	map.push({x:438, y:350, width: this.width, height: this.height
	});
	map.push({x:676, y:350, width: this.width, height: this.height
	});
	map.push({x:734, y:350, width: this.width, height: this.height
	});
	map.push({x:380, y:150, width: this.width, height: this.height
	});
	map.push({x:264, y:350, width: this.width, height: this.height
	});
	map.push({x:900, y:350, width: this.width, height: this.height
	});
	map.push({x:960, y:350, width: this.width, height: this.height
	});
	map.push({x:1000, y:150, width: this.width, height: this.height
	});
	map.push({x:1060, y:150, width: this.width, height: this.height
	});
}

Block.prototype.draw = function (){
	ctxBlock.clearRect(0, 0, gameWidth, gameHeight); //Очистка от наложения
	for (var i = 0; i < map.length; i++){
		ctxBlock.drawImage(heroimg, this.srcX, this.srcY, this.width,
			this.height, map[i].x, map[i].y, this.width, this.height);
		//Создаём переменную и присваиваем функцию
		var dir = colCheck(player, map[i]);
		if (dir == "1"){
			player.drawY -= grav; //Уменьшаем гравитацию
			beginspeed = 0;       //Обнуляем скорость
			if (player.drawY < map[i].y)
			{
				player.drawY = map[i].y - player.height;
				//присваиваем игроку положение блока
			}
		}
		//если игрок выше блока и его левая часть правая часть и низ
		if ((player.drawY + player.height > map[i].y) &&
		(player.drawY <= map[i].y + map[i].height + 5) &&
		(player.drawX + player.width / 2 > map[i].x) &&
		(player.drawX < map[i].x + map[i].width)){
			//присваивавем положение игрока и блока
			player.drawY = map[i].y + map[i].height + 5;
			//Уменьшаем скорость
			beginspeed += 0.9;
			//отключаем клавишу вверх дабы не прыгал в воздухе
			player.isUp = false;
		}
	}
}
function Player(){ //Фунция игрока 
	this.srcX = 0;
	this.srcY = 0;
	this.drawX = 90;
	this.drawY = 135;
	this.width = 45;
	this.height = 45;
	// Для клавиш
	this.isUp = false;
	this.isRight = false;
	this.isLeft = false;
	this.speed = 4;
}

Player.prototype.draw = function () {
	beginspeed += grav; //Увеличиваем нач. скорость на гравитацию
	player.drawY += beginspeed; //за счёт этого играк падает
	if(LeftRightHero == "R"){
		ctxHero.clearRect(0, 0, gameWidth, gameHeight);
		ctxHero.drawImage(heroimg, 48* Math.floor(num), 138, 48, 48,
	 		this.drawX, this.drawY, 48, 48);
	}
	else if (LeftRightHero == "L")
	{
		ctxHero.clearRect(0, 0, gameWidth, gameHeight);
		ctxHero.drawImage(heroimg, 48* Math.floor(num), 187, 48, 48,
	 		this.drawX, this.drawY, 48, 48);
	}
		else if (LeftRightHero == "J")
		{
			ctxHero.clearRect(0, 0, gameWidth, gameHeight);
			ctxHero.drawImage(heroimg, 0, 88, 48, 48,
				this.drawX, this.drawY, 48, 48);
		}
		else if (LeftRightHero == "SR"){
			ctxHero.clearRect(0, 0, gameWidth, gameHeight);
			ctxHero.drawImage(heroimg, 0, 0, 48, 48,
			this.drawX, this.drawY, 48, 48);
		}
			else if (LeftRightHero == "SL"){
				ctxHero.clearRect(0, 0, gameWidth, gameHeight);
				ctxHero.drawImage(heroimg, 48, 0, 48, 48,
				this.drawX, this.drawY, 48, 58);
			}
			else if (LeftRightHero == "JL"){
				ctxHero.clearRect(0, 0, gameWidth, gameHeight);
				ctxHero.drawImage(heroimg, 48, 88, 48, 48,
				this.drawX, this.drawY, 48, 48);
			}
}


function checkKeyDown(e){
	var keyId = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyId);
	if (keyChar == "D"){
		player.isRight = true
		player.isLeft = false;
		e.preventDefault();
	}
	if (keyChar == "A"){
		player.isLeft = true;
		player.isRight = false;
		e.preventDefault();
	}
	if (keyChar == "W"){
		player.isUp = true;
		e.preventDefault();
	}
}

function checkKeyUp(e){
	var keyId = e.keyCode || e.which;
	var keyChar = String.fromCharCode(keyId);
	if (keyChar == "D"){
		player.isRight = false;
		e.preventDefault();
		LeftRightHero = "SR";
	}
	if (keyChar == "A"){
		player.isLeft = false;
		e.preventDefault();
		LeftRightHero = "SL";
	}
	if (keyChar == "W"){
		player.isUp = false;
		e.preventDefault();
	}
}


Player.prototype.chooseDir = function(){
	if (this.isRight) {
		player.drawX += this.speed;
		if (tg == 1)
		{
			LeftRightHero = "R";
			GoPlayerRight(); //Фунция анимации игрока направо 
		}
	}else
	if (this.isLeft) {
			player.drawX -= this.speed;
			if (tg == 1)
			{
				LeftRightHero = "L";
				GoPlayerLeft(); //функция анимации игрока налево
			}
	}
	if (this.isUp&& tg == 1){
		//прыгаем увеличивая переменную начскорость на значение прыжка
		beginspeed = maxJump;
		LeftRightHero = "J";
	}
	//если нажата клавиша вверх и игрок находится в воздуже и движется врпаво то
	if (this.isUp && tg == 0 && this.isRight)
	{
		LeftRightHero = "J";
	}
	else
		if (this.isUp && tg == 0 && this.isLeft)
		{
			LeftRightHero = "JL";
		}
}


//функция для просчёта героя на платформе shapeА - игрок, shapeB - платформа
function colCheck(shapeA, shapeB) {
	var colDir = null;
	if (shapeA.drawY < shapeB.y) //если игрок стоит на платформе
		{
			//проверяем чтобы стоял на платформе, снизу слева и справа
			if ((shapeA.drawY + shapeA.height > shapeB.y) &&
				(shapeA.drawX + shapeA.width / 2 > shapeB.x) &&
				(shapeA.drawX < shapeB.x + shapeB.width))
				{
					colDir = "1";//Присваеваем переменную 1
					tg = 1; //присваеваем тг единицу
				}
				else if (shapeA.drawY + shapeA.height < shapeB.y)
				{
					tg = 0;
				}

		}
	//Возвращаем переменную со значением в метод блок прототип драв
	//так как оттуда и вызываем функцию
	return colDir;
}

//Анимаця направо
function GoPlayerRight(){
	num = num + 0.3; //это для покадровой анимации переменную num увеличиваем на 0.3
	if (num > 3){ //если достигли лимита 4 кадра то снова к 0-му кадру, он же 1
			num = 0;
		}
}
//Анимация налево
function GoPlayerLeft(){
	num = num + 0.3;
	if (num > 3){
			num = 0;
	}
}

function arrayMoney(){
	//Создаём монеты
	mon.push({
		x:380,
		y:300,
		width: 48,
		height: 41
	});
	mon.push({x:435,y:300,width: 48, height: 41});
	mon.push({x:675,y:300,width: 48, height: 41});
	mon.push({x:730,y:300,width: 48, height: 41});
	mon.push({x:320,y:300,width: 48, height: 41});
	mon.push({x:380,y:100,width: 48, height: 41});
	mon.push({x:900,y:300,width: 48, height: 41});
	mon.push({x:950,y:300,width: 48, height: 41});
	mon.push({x:1060,y:100,width: 48, height: 41});
	mon.push({x:1000,y:100,width: 48, height: 41});
}

function MoneyDraw(){
	for (var i=0; i < mon.length; i++){
		ctxHero.drawImage(heroimg, 48*Math.floor(nummoney), 235, 48, 41,
		mon[i].x, mon[i].y, 48, 41);
	//если игрок касается
	if ((player.drawX + player.width >= mon[i].x ) &&
	(player.drawY <= mon[i].x + mon[i].width / 2) &&
	(player.drawY + player.height >= mon[i].y) &&
	(player.drawY <= mon[i].y)) {
		//удаляем из массива
		mon.splice(mon.indexOf(mon[i]),1);
		//Увеличиваем кол-во
		CountMoney++;
		}
		ctxTitle.clearRect(0, 0, gameWidth, gameHeight);
		ctxTitle.fillText("Собрано фруктов: " + CountMoney, 20, 30);
	}
	GoMoney();
}

function GoMoney(){
	nummoney = nummoney + 0.3; 
	if (nummoney > 10){
		nummoney = 0;
	}
}

//музыка
function soundClick() {
	var audio = document.getElementById('audio');
	audio.play();
}

var audio = new Audio(); // create new element of Audio
audio.src = "audio/Crazy_Frog_Beng.mp3" // identify path to sound
audio.autoplay = true; // automatic start