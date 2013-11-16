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

// this is an array store a list of images will be pulled from the web
var defaultImageKeywords = "cats,dogs,snakes".split(",");

// keep track of what keywords used, to pull images from the web,
// it prevents user entering the same keywords.
var keywordsUsed = defaultImageKeywords.join(",");

// array of images that are shuffled, used by the 20 boxes as the back-ground images
var shuffledImages= new Array();

// keep track of what images that user matched
var matchedImageIdArray= new Array();

// how many times user clicked the images on the page
var numberOfClicks = 0;

// what was the Id of the box that user clicked at the odd time
var idClickedOnOddTime ='';

var startingTime = (new Date()).getTime();

var gameFinished = true; 

var matchedCount =0;
var countDownFinished = true;
var countDownStartingTime =0;

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

//fadeOut the cheat button upon the initial rendering of the page
$("#cheat").fadeOut('fast');

// clone 19 boxes, with images populated., so total boxes are 20.
// also add event listeners to them
//It will also load for boxes, as long as there are enough images shuffled,
function cloneBoxes() { 

  // to start fresh, remove the boxes first
  $("div[id ^='box_']").remove();

  // create the first box with box_0

  $('body').append('<div class="box" id="box_0" name="boxName"></div> ');

  $('#box_0').click(function() {
    manageUserClick($(this));
  });

  // assign the first one too
  var firstUrl = 'url("'+shuffledImages[0]+'")';    
  $("#box_0").css('background-image',firstUrl);


  // clone 19 boxes based on box_0.
  // the numeric portion of the id is essential to the application.    
  // it is used as the index to get the shuffled images

  for (i=0; i<19; i++) { 
    var currentId = i+1;
    var newBox = $('#box_0').clone();

    newBox.attr("id","box_"+currentId);
    
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

}

// shuffle images and generate shuffled images into shuffledImages.
// if shuffleImages(4), it will generaate 8 images into shuffledImages
function shuffleImages(pairsOffImages){
  
  shuffled = shuffle(imageLocations);

  shuffledArray1 = shuffled.slice(0,pairsOffImages); 	

  // duplicate the images, so every image appears twice
  shuffledArray2 = shuffle(shuffledArray1);

  // combine two arrays together, and shuffle again
  shuffledImages = shuffle(shuffledArray1.concat(shuffledArray2));   
}

function areImagesShuffled(){
  return shuffledImages.length>0;
} 

// logic for hide all images
function showImages() {
  // IE does not like this way to set background image
  // var allBoxes = document.getElementsByName("boxName");
  // for (var j =0; j<allBoxes.length; j++) { 
  //   var id = allBoxes[j].getAttribute("id").replace("box_",'');
  //   var image = shuffledImages[id];              
  //   allBoxes[j].style.backgroundImage ='url('+image+")";       
  // }
  for (var i=0; i<20; i++) {
    var id = "box_"+i;    
    showImage(id);
  }
}
 
// logic for hide images
function hideImages() {
  // IE does not like this way to set background image
  // var allBoxes = document.getElementsByName("boxName");
  // for (var j =0; j<allBoxes.length; j++) {                     
  //   var image = shuffledImages[j];                
  //   allBoxes[j].style.backgroundImage ='';       
  // }
  for (var i=0; i<20; i++) {
    var id = "box_"+i;    
    hideImage(id);
  }

}

// hide only unmatched images
function hideUnmatchedImages(){
  // IE does not like this way to set background image
  // var allBoxes = document.getElementsByName("boxName");
  //   for (var j =0; j<allBoxes.length; j++) {
  //     var id = allBoxes[j].getAttribute("id");  
  //     if (!isElementInArray(id,matchedImageIdArray)) { // no matched, hide it!
  //       allBoxes[j].style.backgroundImage ='';   
  //     }
  //   }

  for (var i=0; i<20; i++) {
    var id = "box_"+i;
    if (!isElementInArray(id,matchedImageIdArray)) { // no matched, hide it!
      hideImage(id);
    }
  }  

}

// logic to handle user click a image object
// for every 2 clicks, if the image source are same, then. matched
// otherwise, not match!
// program ignores the sequential clicks on the same image. 
// considered user might have clicked it by mistake
function manageUserClick(object) { 
  if (!countDownFinished || gameFinished) return;
  var idOfObjectClicked = object.attr('id');

  // only execute when using clicked a different box,
  // just in case user clicked the same one by mistake
  if (idClickedOnOddTime != idOfObjectClicked && 
    !isElementInArray(idOfObjectClicked,matchedImageIdArray)) {  

    showImage(idOfObjectClicked); 
    numberOfClicks +=1;

    $('#clickCount').html('Total clicks: '+numberOfClicks);  

    // if clicked odd time, simply record it
    if (numberOfClicks%2 ==1) {           
      idClickedOnOddTime = idOfObjectClicked;
    } 

    // if clicked even time, we need to compare to see if matched
    else  {  

      var matched = matchOddClick(idOfObjectClicked);
      // hide it after 0.5 second if they do not match!
      if (!matched) {
        setTimeout('hideImage("'+idOfObjectClicked+'")',500);
        setTimeout('hideImage("'+idClickedOnOddTime+'")',500);
      } else {// record the images matched., so they are not clickable, not hide-able
        recordMatchingId(idClickedOnOddTime,idOfObjectClicked);
      }

      processMatchedStatus(matched);
    }
  }
}

function recordMatchingId(idOfOddClick, idOfEvenClick){  
  matchedImageIdArray.push(idOfOddClick);  
  matchedImageIdArray.push(idOfEvenClick);
}

// it displays the status based on matched or not.
// record the total matchCount;
function processMatchedStatus(matched) {  
  if (matched) {
    matchedCount +=1;      
    $('#status').html("Congratulations! You have a good memory!") ;        
  }
  else {
    $('#status').html("Sorry, try again!");      
  }

  clearStatusIn(2000);

  if (matchedCount >= 10) {
    gameFinished = true; 
    $("#cheat").fadeOut('fast'); 
    var finishingTime = (new Date()).getTime();
    var percentage = Math.round(20*1000/numberOfClicks)/10;
    var finalMessage = 'Your finishing time is: '+ (finishingTime - startingTime)/1000 +" s!";
    finalMessage += "and "+percentage+"% of your clicks produced positive results\n";
    $('#status').html('Congratulations!You have found all of the matching images!\n'+ finalMessage);      
  }

  $('#matchCount').html('Total matches: '+(matchedCount*2));  
  
}

function matchOddClick(idOfObjectClicked) {
  var currentIndex =Number(idOfObjectClicked.replace("box_",''));
  var oddIndex =Number(idClickedOnOddTime.replace("box_",''));
  if (shuffledImages[currentIndex]!=shuffledImages[oddIndex]) {            
  }

  return shuffledImages[currentIndex]==shuffledImages[oddIndex];
}

// show image for a given id  
function showImage(elementId) {  
  var index = Number(elementId.replace("box_",''));  
  var imageUrl = shuffledImages[index];  
  document.getElementById(elementId).style.backgroundImage='url('+imageUrl+")";
}

// hide image for a given id
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


// when user clicks cheat button, it displays all images 
// for 1 sec and then fade out 
$('#cheat').click (function() {
   showImages();
   setTimeout('hideUnmatchedImages()',1000);
});

// start, stop game
$("#start_stop").click(function (){
  var label = $(this).html();  
  if (label.indexOf('Start') !=-1 ) { 
    startGame();     
  } else {
    stopGame();
    $(this).html('Start Game');  
  }
  
});

function startGame(){
  $('#start_stop').fadeOut('fast');
  // init variable
  matchedImageIdArray = new Array();  
  matchedCount = 0;
  numberOfClicks =0;

  // clear all messages
  $("#status").html('&nbsp;');
  $("#matchCount").html('&nbsp;');
  $("#clickCount").html('&nbsp;');
  $("#timer").html('&nbsp;');

  $("#status").html('Shuffling images ...');
  shuffleImages(10);
  cloneBoxes();
  //showImages();
  
  // give user 10 ~12 seconds to remember the game, and then fade out 
  $("#status").html('Images will be fading away in about 10 seconds ...');
  fadeOutImages(12*1000);
}

function fadeOutImages(timeToFadeOut){

  // start to count down how much time before the images are gone.
  startCountingDown();
  $('[name="boxName"]').fadeOut(timeToFadeOut,function(){

    // fadeout in a given amount of time and display the empy boxes
    hideImages(); 
    $(this).fadeIn('fast');

    // start to time user's time
    startTimingUser();  

    // init the totals  
    $("#clickCount").html('Total clicks: 0');
    $("#matchCount").html('Total matches: 0');
    $('#start_stop').fadeIn('fast');
    $('#start_stop').html('Stop Game');
    $("#cheat").fadeIn('fast'); 
  });  
}

function startTimingUser(){
  startingTime = (new Date()).getTime(); 
  gameFinished = false;
  timingUser(); 
}  

function startCountingDown(){
  countDownFinished = false;   
  countDownStartingTime = (new Date()).getTime(); 
  countingDownTime();
}

function countingDownTime(){
  $("#status").html('&nbsp;');
  if (!countDownFinished) {
      var rightNow = (new Date()).getTime();
      var timeElapsed = rightNow - countDownStartingTime;
      var timeLeft = 10*1000-timeElapsed;
      if (timeLeft >=500) {
        $("#status").html('The game will start in '+ timeLeft+' ms!');
        setTimeout('countingDownTime()',300);
      } else {
        countDownFinished = true;
        $("#status").html('&nbsp;');
      }
      
  }  
}

function stopGame(){
  // reset variables,
  countDownFinished = true; // so the countdown can stop
  gameFinished = true; // so user is not timed   
  
  // display message 
  var currentStatusMessage = $("#status").html();
  if (($.trim(currentStatusMessage)).length !=0) {
      currentStatusMessage += ' '; // add space!
  }

  $("#status").html(currentStatusMessage +'Game stopped!');
  $("#cheat").fadeOut('fast');   
}

// wait a little bit, then clears the status message
function clearStatusIn(millisToWait){
  //setTimeout('document.getElementById("status").innerHTML="&nbsp;"',millisToWait);
  $("#status").fadeOut(2000,function() {
    $(this).html('&nbsp;');
    $(this).fadeIn('fast');
  });
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