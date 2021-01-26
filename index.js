let finalData,
authorSurname = [],
finalPoem,
searchBtn = document.getElementById("searchBtn"),
authorInput = document.getElementById("authorName"),
titleInput = document.getElementById("titleName");

window.onload = (event) => {
    onloadAuthor('loadAuthor',function(){
        autocomplete(document.getElementById("authorName"), finalData);
    });
  };

authorInput.addEventListener("keydown", function(e){
    switch(e.keyCode){
        case 8:
            titleInput.value = "";
            break; 
        case 46:
            titleInput.value = "";
            break;
        default:
            break;
    }
});  


searchBtn.addEventListener("click", function(e){
    e.preventDefault();
    searchPoem('loadPoem',function(){        
        let  finalLines = finalPoem.data[0].lines, finalLinesModified = [];
        for(i in finalLines){
            if(finalLines[i] != "")
                if(finalLines[i].replace(/[^a-zA-Z ]/g, "") != "")
                    finalLinesModified.push(finalLines[i].replace(/[^a-zA-Z ]/g, ""));
        }       

        sessionStorage.setItem("poem", JSON.stringify(finalLinesModified));
        let relativePath = window.location.href;        
        let pathArray = relativePath.split("/");
        pathArray.pop(-1);
        let defaultPath= pathArray.join("/");
        sessionStorage.setItem("defaultPath",defaultPath);
        sessionStorage.setItem("aName",authorName.value);
        sessionStorage.setItem("title",titleName.value);
        location.href= defaultPath+"/poemLines.html";
    });
});

async  function onloadAuthor (subject,callback) {
	let result = await axios.get("https://poetrydb.org/author");
    finalData=result.data.authors;
    callback();

};
async  function searchPoem (subject,callback) {
    authorSurname = authorName.value;
    authorSurname = authorSurname.split(" ");    
	finalPoem = await axios.get("https://poetrydb.org/author,title/"+authorSurname[1]+";"+titleName.value);
        
    callback();
};

function autocomplete(autocompleteField, arr) {
    /*the autocomplete function takes two arguments*/
    
    
    autocompleteField.addEventListener("input", function(e) {
        let newDivElem, matchingElem, i, authorValue = this.value, btnEnable;
        /*close any already open lists */
        closeDropdown();
       // if (!authorValue) { return false;}
        
        newDivElem = document.createElement("DIV");
        newDivElem.setAttribute("id", this.id + "autocomplete-list");
        newDivElem.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(newDivElem);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, authorValue.length).toUpperCase() == authorValue.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            matchingElem = document.createElement("DIV");
            matchingElem.setAttribute("class", "new-item");            
            matchingElem.innerHTML = "<strong>" + arr[i].substr(0, authorValue.length) + "</strong>";
            matchingElem.innerHTML += arr[i].substr(authorValue.length);
           
            matchingElem.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*event listener for slected author or selected title*/

            matchingElem.addEventListener("click", function(e) {
                                
                let enableKey = this.closest(".authorGroup");
                if(enableKey) {
                    authorName.value = this.getElementsByTagName("input")[0].value;                    
                    titleInput.removeAttribute("disabled");
                    titleInput.classList.remove("disabledTitle");                
                    
                    axios.get('https://poetrydb.org/author/'+authorName.value+'/title')
                    .then(function (response) {
                    
                        let resultT= response.data,ctr,titleArr=[];                        
                        for(ctr in resultT)
                            titleArr[ctr]=resultT[ctr].title;                            
                        autocomplete(titleInput, titleArr);// recursively calling for populating title box

                    })
                    .catch(function (error) {                    
                        console.log(error);
                    })
                 }
                else{
                    btnEnable= searchBtn;
                    btnEnable.removeAttribute("disabled");
                    btnEnable.classList.remove("disabledTitle");
                    titleName.value = this.getElementsByTagName("input")[0].value;
                }
                closeDropdown();

            });
            newDivElem.appendChild(matchingElem);            
          }
        }
    });
   
    function closeDropdown() {
      
      var autoItems = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < autoItems.length; i++) {
        
        autoItems[i].parentNode.removeChild(autoItems[i]);
        
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeDropdown();
    });

    
  }





