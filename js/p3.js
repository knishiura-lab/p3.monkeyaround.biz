
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

// this is an array store a list of images pulled from the web.
// it shuffles an array of zodiac animals and only get the first 3 
var defaultImageKeywords = shuffle("rat,cow,tigger,rabbit,dragon,snakes,horse,sheep,monkey,chicken,dog,pig".
    split(",")).slice(0,3);

// keep track of what keywords used, to pull images from the web,
// it prevents user entering the same keywords.
var keywordsUsed = defaultImageKeywords.join(",");

// array of images that are shuffled, used by the 20 boxes as the back-ground images
var shuffledImages= new Array();

// keep track of what images that user matched
var matchedImageIdArray= new Array();

// how many times user clicked the images on the page
var numberOfClicks = 0;

var numberOfBoxes = 20;

// what was the Id of the box that user clicked at the odd time
var idClickedOnOddTime ='';

var startingTime = (new Date()).getTime();

var gameFinished = true; 

var matchedCount =0;
var countDownFinished = true;
var countDownStartingTime =0;  

// pull images using google's api, and store the source into a global variable: imageLocations
function  getWebImagesByKeyword(keyword){ 
  $("#status").html('Searching images...'); 
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
    $("#start_stop").fadeIn("fast");
  }
}

// pull images from the web, and store the locations into imageLocations globle variable
getWebImagesByKeywords(); 

//fadeOut the cheat button upon the initial rendering of the page
//$("#cheat").fadeOut('fast');

// create numberOfBoxes boxes, with images populated. .
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

  for (i=1; i<numberOfBoxes; i++) {  // clone numberOfBoxes -1  
    var currentId = i;
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
        alert("Oops, that is really embarrassing! It appears that there are not enought images loaded for the game.\n"+
              "Please wait a little bit and refresh the page");
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
  for (var i=0; i<numberOfBoxes; i++) {
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
  for (var i=0; i<numberOfBoxes; i++) {
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

  for (var i=0; i<numberOfBoxes; i++) {
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
    $('#matchCount').html('Total matches: '+(matchedCount*2));       
    $('#status').html("Congratulations! You have a good memory!") ;        
  }
  else {
    $('#status').html("Sorry, try again!");      
  }

  clearStatusIn(2000);

  if (matchedCount >= numberOfBoxes/2) {//2
     handleGameFinished();    
  } 
}

// handle the logic when the game is finished
//including reset the variales, button labels 
// and display message to user
function handleGameFinished(){
  gameFinished = true; 
  $("#cheat").fadeOut('fast'); 
  $("#start_stop").html('Start Game'); 
  var finishingTime = (new Date()).getTime();
  var positivePercentage = Math.round(matchedCount*2000/numberOfClicks)/10;
  var timeElapsed = (finishingTime - startingTime)/1000;
  $("#timeElapsed").html(timeElapsed);
  $("#positivePercentage").html(positivePercentage);  
  $("#gameOver" ).dialog('open');
}

// test if an even numbered click matches an odd numbered click
// return true: if 2 sequential clicks of the same images (shuffledImages's index)
function matchOddClick(idOfObjectClicked) {
  var currentIndex =Number(idOfObjectClicked.replace("box_",''));
  var oddIndex =Number(idClickedOnOddTime.replace("box_",''));
  
  return shuffledImages[currentIndex]==shuffledImages[oddIndex];
}

// show image for a given html element id  
function showImage(elementId) {  
  var index = Number(elementId.replace("box_",''));  
  var imageUrl = shuffledImages[index];  
  document.getElementById(elementId).style.backgroundImage='url('+imageUrl+")";
}

// hide image for a given html element id
function hideImage(elementId) {      
  document.getElementById(elementId).style.backgroundImage='';
}

// timing user how much time elapsed since started the game
// and display the time in the timer field
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
    // change the label to Start Game
    $(this).html('Start Game');  
  }
  
});

// start games logic, invoked by clicking start-stop game button
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

// fade out images wihin a specific time
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

// start games logic, invoked by clicking start-stop game button
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

//everytime when user types something in imageKeywords field
// if the length is greater than 1, show the load button
$('#imageKeywords').keyup(function() {
  var keyWordsEntered = $.trim($('#imageKeywords').val());  
  if (keyWordsEntered.length>1) {
    $('#loadUserImages').fadeIn('fast');
  }
  else {
    $('#loadUserImages').fadeOut('fast');
  }
});
 
// the game is kind of stressful to play, 
// play short music  (loop) for user,so it can play with calm mode
function playMusic() { 
  soundEmbed = document.createElement("embed");
  soundEmbed.setAttribute("id", "musicId");
  soundEmbed.setAttribute("src", 'music/POL-cave-story-short.wav');
  soundEmbed.setAttribute("hidden", true);
  soundEmbed.setAttribute("autostart", true);
  soundEmbed.setAttribute("loop", true);  
  document.body.appendChild(soundEmbed); 
} 

// prepare game over dialog,but doe not display it yet!
$("#gameOver" ).dialog({
  modal: true,
  autoOpen: false,
  width:650,
  buttons:{
    'OK, I Got It': function(){  
                           $(this).dialog( "close" );                               
                          } 
            },
  show: {
        effect: "explode",
        duration: 1000
        },
  hide: {
        effect: "explode",
        duration: 1000
        }
});
 
// display modal window to ask user for music decision
$("#musicConfirmation").dialog({
  autoOpen: false,
  modal: true,
  width:650,
  buttons:{
    'Yes, Listen and Play': function() {
                              playMusic();      
                              $(this).dialog( "close" );
                            },
    'No, Keep It Quiet Please': function() {
                                $(this).dialog( "close" );
                                // do not play music;
                            }  
          },
  show: {
        effect: "slide",   
        duration: 1000
        },
  hide: {
        effect: "explode",
        duration: 1000
        }
});

// display instructions dialog.
$("#instructions" ).dialog({
  modal: true,
  autoOpen: true,
  width:650,
  buttons:{
    'OK, I Got It': function(){
                  $("#musicConfirmation").dialog("open");
                  $(this).dialog( "close" );
                } 
  },
  show: {
        effect: "blind",
        duration: 1000
        },
  hide: {
        effect: "explode",
        duration: 1000
        }
});