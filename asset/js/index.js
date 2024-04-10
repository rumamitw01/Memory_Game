var carddata = [
  { selector: ".card1", name: "1", pitch: "1" },
  { selector: ".card2", name: "2", pitch: "2" },
  { selector: ".card3", name: "3", pitch: "3" },
  { selector: ".card4", name: "4", pitch: "4" },
  { selector: ".card5", name: "5", pitch: "5" },
  { selector: ".card6", name: "6", pitch: "6" },
];
  
var soundsetdata = [
  { name: "correct", sets: [1, 3, 5, 8] },
  { name: "wrong", sets: [2, 4, 5.5, 7] }
];
  
var levelDatas = [
  "peko-peko_what-peko-peko_what",
  "peko_what-peko-peko_oree-peko_oree-peko-peko_what"
];
  
var Cards = function (cardAssign, setAssign) {
  this.allOn = false;
  this.cards = cardAssign.map((d, i) => ({
    name: d.name,
    el: $(d.selector),
}));
  
  this.soundSets = setAssign.map((d, i) => ({
    name: d.name,
    sets: d.sets.map((pitch) => this.getAudioObject(pitch))
  }));
};
  
Cards.prototype.flash = function (note) {
  let card = this.cards.find((d) => d.name == note);
  if (card) {
    card.el.addClass("active");
    setTimeout(() => {
      if (this.allOn == false) {
        card.el.removeClass("active");
      }
    }, 300);
  }
};
  
Cards.prototype.turnAllOn = function () {
  this.allOn = false;
  this.cards.forEach((card) => {
    card.el.addClass("active");
  });
};
  
Cards.prototype.turnAllOff = function () {
  this.allOn = false;
  this.cards.forEach((card) => {
    card.el.removeClass("active");
  });
};
  
Cards.prototype.getAudioObject = function (pitch) {
  return new Audio(
    "https://awiclass.monoame.com/pianosound/set/" + pitch + ".wav"
  );
};
  
Cards.prototype.playSet = function (type) {
  let sets = this.soundSets.find((set) => set.name == type).sets;
  sets.forEach((obj) => {
    obj.currentTime = 0;
    obj.play();
  });
};
  
var Game = function () {
  this.Cards = new Cards(carddata, soundsetdata);
  this.levels = levelDatas;
  this.currentLevel = 1;
  this.playInterval = 500;
  this.mode = "waiting";
  this.difficulty="easy"
};
  
Game.prototype.startLevel = function () {
  this.showLevelMessage("Level " + this.currentLevel);
  let leveldata = this.levels[this.currentLevel-1];
  this.startGame(leveldata)
};
  
Game.prototype.showMessage = function (mes) {
  console.log(mes);
  $(".status").text(mes);
};

Game.prototype.showLevelMessage = function (mes) {
  console.log(mes);
  $(".levelstatus").text(mes);
};
  
Game.prototype.startGame = function (answer) {
  this.changeLayout(this.difficulty+"-"+this.currentLevel)
  $(".card").removeClass("has-invisible")
  this.mode = "gamePlay";
  this.answer = answer;
  let notes = this.answer.split("-");
  index=1;
  this.timer = setInterval(() => {
    let char = notes.shift();
    if (notes.length == 0) {
      this.startUserInput();
      clearInterval(this.timer);
    }
  
    this.playNote(char);
    this.Cards.flash(index);
    index++
  }, this.playInterval);
};
  
Game.prototype.playNote = function (note) {
  console.log(note);
  audio=new Audio("./asset/se/"+note+".mp3")
  audio.currentTime = 0;
  audio.play();
};
  
Game.prototype.startUserInput = function () {
  this.userInput = "";
  this.mode = "userInput";
  this.firstCard=""
  this.secondCard=""
  this.firstCardNo=""
  this.secondCardNo=""
  this.cardNumber=this.levels[this.currentLevel-1].split("-").length
};
  
Game.prototype.userSendInput = function (inputChar) {
  if (this.mode == "userInput") {
    let tempString = this.userInput + "-"+this.levels[this.currentLevel-1].split("-")[inputChar+1];
    this.playNote(this.levels[this.currentLevel-1].split("-")[inputChar-1]);
    if(this.firstCard!=""){
      this.secondCard=this.levels[this.currentLevel-1].split("-")[inputChar-1]
      this.secondCardNo=inputChar-1;
      this.checkForMatch(this.firstCard)
      this.firstCard=""
    }
    this.firstCard=this.levels[this.currentLevel-1].split("-")[inputChar-1]
    this.firstCardNo=inputChar-1;
    this.showMessage("Card Remain:"+this.cardNumber)
    if(this.cardNumber==0){
      this.showMessage("Congratulations!")
      this.Cards.playSet("correct")
      this.currentLevel++
    }
  }    
};
Game.prototype.checkForMatch=function(first){
  if(first===this.secondCard && this.firstCardNo!=this.secondCardNo){
    $(".card"+(this.firstCardNo+1)).addClass("has-invisible")
    $(".card"+(this.secondCardNo+1)).addClass("has-invisible")
    this.firstCard=""
    this.cardNumber-=2
    this.Cards.playSet("correct")
    return 0
  }
  this.Cards.playSet("wrong")
}
Game.prototype.changeLayout = function(level){
  $(".cards").addClass("has-hidden");
  $("#"+level).removeClass("has-hidden");
}
var game = new Game();