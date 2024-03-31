var Blockdata=[{selector:".block1",name:"1",pitch:"1"},
                {selector:".block2",name:"2",pitch:"2"},
                {selector:".block3",name:"3",pitch:"3"},
                {selector:".block4",name:"4",pitch:"4"}
];
var Blocks=function(blockAssign,setAssign){
    this.allOn=false;
    this.blocks=blockAssign.map((d,i)=>({name:d.name,el:$(d.selector)}));
}
Blocks.prototype.flash=function(note){
    let block= this.blocks.find(d=>d.name==note);
    if(block){
        block.el.addClass("active");
        setTimeout(()=>{
            block.el.removeClass("active");
        },300);
    }
}
Blocks.prototype.turnAllOn=function(){
    this.blocks.forEach((block) => {
        block.el.addClass("active");                    
    });
}
Blocks.prototype.turnAllOff=function(){
    this.blocks.forEach((block) => {
        block.el.removeClass("active");                    
    });
}
var blocks=new Blocks(Blockdata);

var clickTimes=0
$('.block').click(function(){
    clickTimes++;
    $(".clickTimes").text(clickTimes);
});

var level=1;

$(".status").text("Current Level "+level);