<!DOCTYPE html>
<html>
  <head>
    <title>Memory Game</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	

    <!-- Common CSS/JSS -->
    <link rel="stylesheet" href="css/p3.css" type="text/css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" /> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

  </head>

  <body>	

    <div class='title'> Memory Game <br>
        <div class='subtitle'> Find the Matching Images as Fast as You Can </div>
    </div>


    <div id ="instructions" class="instructions" title="Match Images as Fast as You Can"> 
       
      <p>You will be presented with 20 images found from the internet.               
      You have 10 seconds to memorize the image locations.</p> 
      <p>If the quality of the images do not meet your expectation, try to reload the page!    
      <p>Optionally, you can add some images of your choice by entering a word,
       like fish, ants etc. and click 'Load'. </p>     
    </div>

    <div id="musicConfirmation" title="Listen and Play, Makes Your Day!">  
      <p>
        Do you want to listen to music while you play the game?        
      </p>
      <p>
        It requires updated plug-in and the high bandwidth of the internet connection.        
      </p> 
      <p>
        "Listen and Play" increases the chance of getting caught if playing at work!
        <img src='img/smile.gif' alt='image not supported by browser'>
      </p> 

    </div> 

     <div id="gameOver" title="Congratulations!">  
      <p>
        Congratulations on finding all of the matching images!        
      </p> 
      <p>
        You completed the challenge in <span id='timeElapsed'></span> seconds!     
      </p> 
      <p>
         <span id='positivePercentage'></span>% of your clicks produced positive results.     
      </p> 
    </div> 
    <br>
    <label for="imageKeywords"> Enter a word to load additional images (optional):</label>      
    <input type="text" id="imageKeywords" name='imageKeywords'>    
    <button class='button' id='loadUserImages'> Load </button><br>
    <div class="subinstructions">
      Disclaimer: There is no gaurantee that your images
      will be added because the program will shuffle images from a pool of images. 
    </div>
    <div class="status" id="status">Please wait... </div> <br>
    <div class="status" id="timer"> </div>
    <div class="status" id="clickCount"> </div> 
    <div class="status" id="matchCount"> </div> <br>

    <button class='button' id="start_stop">Start Game</button> 
    <button class='button' id="cheat"> Cheat</button> 
    
    <br> <br>

    <script type="text/javascript" src="js/p3.js"></script>

  </body>

</html>