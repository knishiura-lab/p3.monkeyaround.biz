<!DOCTYPE html>
<html>
  <head>
	<title>Memory Game</title>

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />	

    <!-- Common CSS/JSS -->
    <link rel="stylesheet" href="/css/p3.css" type="text/css">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script> 
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
 
		
  </head>

   <body>	
      <div class='title'> Find the Matching Images</div>

      <div class="instructions">You will be presented with 20 picitures found from the internet.  <br>
       You have about 10 seconds to memorize the image locations after clicking 'Start Game' button;<br>
       Your goal is to find the matching images as soon as possible! <br>
       To make it more interesting, you can make it more  add images of your choice by entering a word, like fish, ants etc. and click 'Load' <br>
       but there is no gaurantee that your images will be added because the program will shuffle images from a pool of images.
       </div>

 
      <label for="imageKeywords"> Enter word:</label>      
      <input type="text" id="imageKeywords" name='imageKeywords'>    
      <button class='button' id='loadUserImages'> Load </button><br>
      <div class="status" id="status">Please wait... </div>
      <div class="status" id="timer"> </div>
      <div class="status" id="clickCount"> </div> 
      <div class="status" id="matchCount"> </div>
      
      <button class='button' style="display:none" id="populate"> Populate Images</button>  
      <button class='button' style="display:none" id="hideImages"> Hide Images</button> 
      
      <button class='button' id="startGame"> Start Game</button> 
      <button class='button' id="cheat"> Cheat</button> <br>

      <div  class="box"  id="sample_box_0" name='boxName'></div>   <br>

      <script type="text/javascript" src="/js/p3.js"></script>
    
  </body>
</html>