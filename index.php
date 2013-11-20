<!DOCTYPE html>
<html>
  <head>
    <title>Memory Game</title>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	

    <!-- Common CSS/JSS -->
    <link rel="stylesheet" href="/css/p3.css" type="text/css">
    <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" /> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>

  </head>

  <body>	

    <div class='title'> Memory Game <br>
        <div class='subtitle'> find the matching images as fast as you can </div>
    </div>


    <div class="instructions">You will be presented with 20 picitures found from the internet.  <br>
     You have about 10 seconds to memorize the image locations.<br> 
     Optionally, you can add some images of your choice by entering a word, like fish, ants etc. and click 'Load' <br><br>
     <div class="subinstructions">Disclaimer: There is no gaurantee that your images will be added because the program will shuffle images from a pool of images. </div>
     </div>

    <div id="musicConfirmation" title="Listen and Play"> 
      <p> 
        Listen and Play, Makes your day! 
      </p>
      <p>
        Do you want to listen music while you play the game?
      </p>
      <p>
        "Listen and Play" increases the chance of getting caught if player at work! <img src='img/smile.gif' alt='image not supported by browser'>
      </p>
    </div>

    <label for="imageKeywords"> Enter a word to add images of your choice (optional):</label>      
    <input type="text" id="imageKeywords" name='imageKeywords'>    
    <button class='button' id='loadUserImages'> Load </button><br>
    <div class="status" id="status">Please wait... </div> <br>
    <div class="status" id="timer"> </div>
    <div class="status" id="clickCount"> </div> 
    <div class="status" id="matchCount"> </div> <br>

    <button class='button' id="start_stop">Start Game</button> 
    <button class='button' id="cheat"> Cheat</button> 
    
    <br> <br>

    <script type="text/javascript" src="/js/p3.js"></script>

  </body>

</html>