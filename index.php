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
      <h2> Find the matching images</h2>

      <h3>you will be presented with 20 picitures loaded from the internet.  
       After clicking 'Start Game' button, you have about 10 seconds to memorize the images locations. <br>       
       To make it more interesting, you can load images of your choice by enter a word, like fish, ants etc.</h3>
 
      <label for="imageKeywords"> Please load images for this word:</label>      
      <input type="text" id="imageKeywords" name='imageKeywords'>    

      <div class="timer" id="timer"> </div><br> 
      <div class="status" id="status">Please wait... </div><br>        
      <button class='button' style="display:none" id="populate"> Populate Images</button>  
      <button class='button' style="display:none" id="hideImages"> Hide Images</button> 
      
      <button class='button' id="startGame"> Start Game</button> 
      <button class='button' id="showImages"> Cheat</button> <br>

      <div  class="box"  id="sample_box_0" name='boxName'></div>   <br>

      <script type="text/javascript" src="/js/p3.js"></script>
    
  </body>
</html>