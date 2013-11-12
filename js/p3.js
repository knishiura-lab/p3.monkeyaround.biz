// generic javascript functions
// test if an elment exists in an array
function isElementInArray(element, array){ 
    var exists = false;
      for (var i=0; i<array.length && !exists; i++) {
        if (element==array[i]) {
            exists = true;
        }
   }
   return exists;
}

// shuffle array: 
// Thanks to http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

    return array;
}

// a global variable to store all images pulled from the web
var imageLocations = new Array();

// pull images using google's api, and store the source into a global variable: imageLocations
function  getWebImagesByKeyword(keyword){ 
  $("#status").html('Loading '+keyword+'...'); 
	//console.log("getWebImagesByKeyword "+keyword)	;
  //$("#status").html('Please wait while searching for '+keyword);
	// This is the URL for Google Image Search that we'll make the Ajax call to
	var google_url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&imgsz=medium&rsz=8&q=' + 
	    keyword + '&callback=?';	
		
	// getJSON is a Ajax method provided to us by jQuery
	// It's going to make a call to the url we built above, and let us work with the results that Google sends back
	// Everthing in the function below is what will occur when getJSON is done and sends us the results back from Google
	$.getJSON(google_url, function(data){
	
		// This line will basically parse the data we get back from Google into a nice array we can work with
	    var images = data.responseData.results;	    
	
		// Only attempt to do the following if we had images...I.e there was more than 0 images
	    if(images.length > 0){
			
			// .each() is a jQuery method that lets us loop through a set of data. 
			// So here our data set is images
			// Essentially we're unpacking our images we got back from Google, store them into an array
	        $.each(images, function(key, image) {	        
            	imageLocations.unshift(image.url);
	        });
          //$("#status").html('Done...');
          clearStatusIn(1000);
	    }	   
	});			
}

var numberOfImages = 24;

// this is a mutable array store a list of keywords used to pull images from the web
var defaultImageKeywords = "cats,dogs,snakes".split(",");

// keep track of what keywords used, it prevents user entering the same keywords.
var keywordsUsed = defaultImageKeywords.join(",");

// it generates 8 images for ecah keyword, it will prodcue total of 24 images by default.
function getWebImagesByKeywords() {
  if (defaultImageKeywords.length>0)  {
    // please note that the defaultImageKeywords array is changed after pop()
    getWebImagesByKeyword(defaultImageKeywords.pop());
    setTimeout('getWebImagesByKeywords()',1000);
  } else {
    $("#status").html('&nbsp;');
    clearStatusIn(1000);
  }
}

// pull images from the web, and store the locations into imageLocations globle variable
getWebImagesByKeywords(); 

// clone 19 boxes, with images populated., so total boxes are 20.
// also add event listeners to them
//It will also load for boxes, as long as there are enough images shuffled,
function cloneBoxes() { 

  $('#sample_box_0').click(function() {
      manageUserClick($(this));
  });

  // to start fresh, remove the cloned copy first
  $("div[id ^='clonedbox_']").remove();
   
    // there is one box comes with the page with the id: sample_box_0 
    // clone 19 boxes, the Id are:    
    //
    // clonebox_1     
    // clonebox_2
    // ....
    // clonebox_19
    //
    // the numeric portion of the id is essential to the application.    
    // it is used as the index to get the shuffled images

  for (i=0; i<19; i++) { 
      var currentId = i+1;
      var newBox = $('#sample_box_0').clone();
      
      newBox.attr("id","clonedbox_"+currentId);
      newBox.click(function(){
          manageUserClick($(this));
      });

      
      if (areImagesShuffled()) {
        if (shuffledImages.length >currentId) {  // if we have enough images for the boxes
            var imageUrl = 'url("'+shuffledImages[currentId]+'")';
            //console.log('assigning image:'+currentId+' '+imageUrl);
            newBox.css('background-image',imageUrl);  
         } else {
            alert('Problem! not enough images to assign to the boxes, please load more images or wait for system to load');
         }
      }
    
      newBox.appendTo("body"); 
  }

    // assign the first one too
  var firstUrl = 'url("'+shuffledImages[0]+'")';    
  $("#sample_box_0").css('background-image',firstUrl);
}

var shuffledImages= new Array();

// shuffle images and generate shuffled images into shuffledImages.
// if shuffleImages(4), it will generaate 8 images into shuffledImages
function shuffleImages(pairsOffImages){
  
 	shuffled = shuffle(imageLocations);

  shuffledArray1 = shuffled.slice(0,pairsOffImages); 	
  
 	// duplicate the images, so every image appears twice
  shuffledArray2 = shuffle(shuffledArray1);

  // combine two arrays together, and shuffle again
 	shuffledImages = shuffle(shuffledArray1.concat(shuffledArray2)); 
  //console.log('shuffle image returned:'+ shuffledImages.length);
}

function areImagesShuffled(){
  return shuffledImages.length>0;
} 

// logic for hide all images
function showImages() {
   var allBoxes = document.getElementsByName("boxName");
   for (var j =0; j<allBoxes.length; j++) { 
      var id = allBoxes[j].getAttribute("id").replace("clonedbox_",'').replace('sample_box_','');
      var image = shuffledImages[id];
      //console.log("image"+id+": "+image);           
      allBoxes[j].style.backgroundImage ='url('+image+")";       
   }
}
 
// logic for hide images
function hideImages() {
   var allBoxes = document.getElementsByName("boxName");
   for (var j =0; j<allBoxes.length; j++) {                     
      var image = shuffledImages[j];
      //console.log("image"+j+": "+image);           
      allBoxes[j].style.backgroundImage ='';       
   }
}

var matchedImageIdArray= new Array();

// hide only unmatched images
function hideUnmatchedImages(){
   var allBoxes = document.getElementsByName("boxName");
   for (var j =0; j<allBoxes.length; j++) {
      var id = allBoxes[j].getAttribute("id");  
      if (!isElementInArray(id,matchedImageIdArray)) { // no matched, hide it!
        allBoxes[j].style.backgroundImage ='';   
      }
   }
}

// how many times user clicked the images on the page
var numberOfClicks = 0;

// what was the Id of the box that user clicked at the odd time
//var previousIdClicked ='';
var idClickedOnOddTime ='';

// logic to handle user click a image object
// for every 2 clicks, if the image source are same, then. matched
// otherwise, not match!
// program ignores the sequential clicks on the same image. 
// considered user might have clicked it by mistake
function manageUserClick(object) { 

    var idOfObjectClicked = object.attr('id');

    // only execute when using clicked a different box,
    // just in case user clicked the same one by mistake
    if (idClickedOnOddTime != idOfObjectClicked && 
        !isElementInArray(idOfObjectClicked,matchedImageIdArray)) {  

        showImage(idOfObjectClicked); 
        numberOfClicks +=1;

        $('#clickCount').html('Total Clicks: '+numberOfClicks);  

        // if clicked odd time, simply record it
        if (numberOfClicks%2 ==1) {           
           idClickedOnOddTime = idOfObjectClicked;
        } 

        // if clicked even time, we need to compare to see if matched
        else  {            
           var matched =matchOddClick(idOfObjectClicked);
           // hide it after 0.5 second if they do not match!
           if (!matched) {
              setTimeout('hideImage("'+idOfObjectClicked+'")',500);
              setTimeout('hideImage("'+idClickedOnOddTime+'")',500);
           } else {// record the images matched., so they are not clickable, not hide-able
              recordMatchingId(idClickedOnOddTime,idOfObjectClicked);
           }
           processyMatchedStatus(matched);
        }
    }

}

function recordMatchingId(idOfOddClick, idOfEvenClick){  
  matchedImageIdArray.push(idOfOddClick);  
  matchedImageIdArray.push(idOfEvenClick);
}

var matchedCount =0;
// it displays the status based on matched or not.
// record the total matchCount;
function processyMatchedStatus(matched) {  
  if (matched) {
    matchedCount +=1;      
    $('#status').html("Congratulations! You have a good memory!") ;        
  } else {
    $('#status').html("Sorry, try again!");      
  }

  clearStatusIn(2000);

  if (matchedCount == 10) {
    gameFinished = true;
    var finishingTime = (new Date()).getTime();
    var percentage = Math.round(20*1000/numberOfClicks)/10;
    var finalMessage = 'Your finishing time is: '+ (finishingTime - startingTime)/1000 +" s!";
    finalMessage += "and "+percentage+"% of your clicks produced positive results\n";
    $('#status').html('Congratulations!You have found all of the matching images!\n'+ finalMessage);      
  }

  $('#matchCount').html('Total matches: '+(matchedCount*2));  
  
}

function matchOddClick(idOfObjectClicked) {
  var currentIndex =Number(idOfObjectClicked.replace("clonedbox_",'').replace('sample_box_',''));
  var oddIndex =Number(idClickedOnOddTime.replace("clonedbox_",'').replace('sample_box_',''));
  if (shuffledImages[currentIndex]!=shuffledImages[oddIndex]) {       
     //console.log('not matched');
  }

  return shuffledImages[currentIndex]==shuffledImages[oddIndex];
}
 
function showImage(elementId) {  
    var index = Number(elementId.replace("clonedbox_",'').replace('sample_box_',''));
    //console.log('image index is used for shown:'+index);
    var imageUrl = shuffledImages[index];
    //console.log("image url for id:"+index+" is: "+imageUrl);
    document.getElementById(elementId).style.backgroundImage='url('+imageUrl+")";
}

function hideImage(elementId) {      
    document.getElementById(elementId).style.backgroundImage='';
}

function timingUser(){
  var now = (new Date()).getTime(); 
  var secondsElapsed = Math.round((now-startingTime)/1000);
  $('#timer').html('Time elapsed: '+secondsElapsed+" s");
  if (!gameFinished){
      setTimeout('timingUser()',1000);  
  }  
}
 
$('#loadUserImages').click(function(){
  var keyword = $.trim($('#imageKeywords').val());  
  var valid= validateUserKeyword();
  if (valid) {
    $("#status").html('Please wait whiling loading ...'+keyword);
    keywordsUsed += ','+keyword;
    getWebImagesByKeyword(keyword);
  }
});

// check if word user entered is valid
function validateUserKeyword(){
  var valid = true;
  $("#status").html('&nbsp;');
  var keyword = $.trim($('#imageKeywords').val());
  var defaultArray = keywordsUsed.split(',');
  if (isElementInArray(keyword, defaultArray) || isElementInArray(keyword+"s", defaultArray) ) {
    $("#status").html("The word you entered is being used by this program, please type a different word"); 
    clearStatusIn(2000);
    valid = false;
  }

  return valid;
}


// when user clicks cheat button, it displays for 1 sec and then fade out 
$('#cheat').click (function() {
   showImages();
   setTimeout('hideUnmatchedImages()',1000);
});

var startingTime = (new Date()).getTime();
var gameFinished = false;

$("#startGame").click(function (){
  // init variable
  matchedImageIdArray = new Array();
  matchCount =0;
  clickCount =0;

  // clear all messages
  $("#status").html('&nbsp;');
  $("#matchCount").html('&nbsp;');
  $("#clickCount").html('&nbsp;');
  $("#timer").html('&nbsp;');

  shuffleImages(10);
  cloneBoxes();
  showImages();
  
  // give user 10 ~12 seconds to remember the game, and then fade out 
  fadeOutImages(12*1000);
});

function fadeOutImages(timeToFadeOut){
  startCountingDown();
  $('[name="boxName"]').fadeOut(timeToFadeOut,function(){
    hideImages();
  })
  $('[name="boxName"]').fadeIn('fast', function(){startTimingUser(); });
}

function startTimingUser(){
  startingTime = (new Date()).getTime(); 
  gameFinished = false;
  timingUser(); 
}

var countDownFinished = false;
var countDownStartingTime =0;

function startCountingDown(){
  countDownFinished = false;   
  countDownStartingTime = (new Date()).getTime(); 
  countingDownTime();
}

function countingDownTime(){
  $("#timer").html('&nbsp;');
  if (!countDownFinished) {
      var rightNow = (new Date()).getTime();
      var timeElapsed = rightNow - countDownStartingTime;
      var timeLeft = 10*1000-timeElapsed;
      if (timeLeft >=1500) {
        $("#timer").html('Game will start in '+ timeLeft+' ms!');
        setTimeout('countingDownTime()',300);
      } else {
        countDownFinished = true;
        $("#timer").html('&nbsp;');
      }
      
  }  
}

// wait a little bit, then clears the status message
function clearStatusIn(millisToWait){
  setTimeout('document.getElementById("status").innerHTML="&nbsp;"',millisToWait);
}

// the following 2 events will not be fired, the buttons are hidden
// logic for populate images, the button is hidden, the 
$('#populate').click (function() {
  shuffleImages(10);
  cloneBoxes();
  showImages();
});

// logic for hide images
$('#hideImages').click (function() {
   hideImages();
 });