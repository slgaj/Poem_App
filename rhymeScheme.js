
let defaultPath, author,title,rhymeID;
author = document.getElementById("resultAuthor");
title = document.getElementById("resultTitle");
rhymeID = document.getElementById("rhymeID");
author.innerHTML = sessionStorage.getItem("aName");
title.innerHTML = sessionStorage.getItem("title");

let poemArray= JSON.parse(sessionStorage.getItem("poem"));

// on click of reload button of browser or back button , it should navigate to main page 
if (window.performance.getEntriesByType("navigation")[0].type=='reload'){
   loadHome();
}

document.getElementById("backBtn").addEventListener("click", function(e){
    loadHome();
});

function loadHome(){
    defaultPath = sessionStorage.getItem("defaultPath");
    location.href = defaultPath+"/index.html";  
}
window.onload = (event) => {
    checkRhyme();
};

//to Test AA BB rhyme or not

// AA BB rhyme logic starts
function  checkRhyme() {
    for (let i=0;i<poemArray.length;) {
        let ctr1=0, ctr2=0;
        let firstSetLineOne = poemArray[i].split(" ").pop();        
        let firstSetLineTwo = poemArray[i+1].split(" ").pop();       
        let SecondSetLineOne = poemArray[i+2].split(" ").pop();       
        let SecondSetLineTwo = poemArray[i+3].split(" ").pop();
        
        ctr1=twoLines(firstSetLineOne,firstSetLineTwo);
        ctr2=twoLines(SecondSetLineOne,SecondSetLineTwo);

        if(ctr1>=2 && ctr2>=2){
            rhymeID.innerHTML = "AA BB";
            break;
        }           
        i=i+4;
    }
    rhymeID.classList.remove("hide");    
}
   
function twoLines(first,second)
{
    let ctr=0;
    if(first.length<=2 || second.length<=2)
        return 0;    
    else 
        ctr=loopAndPop(first,second);    
    return ctr;
}

function loopAndPop(first,second){
    var innerCtr=0;
    first = first.split("");
    second = second.split("");
    for(let k=0;k<3;k++){        
        if(first.pop(-1) === second.pop(-1))
            innerCtr++;
    }
    return innerCtr;
}
// AA BB rhyme logic ends
let startindex = document.getElementById("lines"); 
//printing Poem Lines 
for(let i=0;i<poemArray.length;i++){
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(poemArray[i]));
    startindex.appendChild(li);
}
module.exports = { twoLines, loopAndPop }