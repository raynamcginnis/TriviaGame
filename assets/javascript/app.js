$(document).ready(function(){
  
  // event listeners
  $("#remaining-time").hide();
  $("#start").on('click', trivia.startGame);
  $(document).on('click' , '.option', trivia.guessChecker);
  
})

var trivia = {
  correct: 0,
  incorrect: 0,
  unanswered: 0,
  currentSet: 0,
  timer: 30,
  timerOn: false,
  timerId : '',
  // questions options and answers data
  questions: {
    q1: "Rock climbing is defined as?",
    q2: "In climbing, the term beta is defined as?",
    q3: "Which type of rock climbing involves wresting pebbles and landing on soft pads that are used by other climbers are makeshift couches?",
    q4: "Which type of rock climbing rewards a very short term memory and a twisted appreciation for suffering?",
    q5: "What does the word CRUX refer to in climbing?",
    q6: "Which of the following automatically allows you to climb at least one full grade harder?",
    q7: "What is the primary rock climbing grading scale used in the United States?",
    q8: "What is the standard length of a rock climbing rope?",
    q9: "Who is currently the strongest climber in the world (2018)?",
    q10:"What is the most important thing you should do while belaying another climber?"
},
  options: {
    q1: ["Hiking to the top of a rocky mountain", "Climbing through a boulder field", "Using your body to ascend a rock face with or without the use of technical gear", "Hanging out at the crag eating jelly beans and yelling beta"],
    q2: ["Offering route advice", "A move that resembled the way a Beta fish swims", "A term equivalent to RAD!", "When a male climber yells unsolicited advice to a female climber"],
    q3: ["Sport climbing", "Traditional climbing", "Bouldering", "Alpine climbing"],
    q4: ["Sport climbing", "Traditional climbing", "Bouldering", "Alpine climbing"],
    q5: ["A specific route", "The highest point of a set route", "The hardest part of a route", "The safety gear necessary for a specific route"],
    q6: ["Grigri", "Belay glasses", "A chalk bag shaped like a stuffed animal", "A beanie"],
    q7: ["UIAA", "Yosemite Decimal System", "Fontainebleau", "All climbing is graded the same throughout the world"],
    q8: ["30-50 meters", "40-60 meters", "50-70 meters", "60-80 meters"],
    q9: ["Chris Sharma", "Adam Ondra", "Lynn Hill","Ashima Shiraishi"],
    q10: ["Never let go of your break hand", "Encourage them by yelling things like DON'T FALL!", "Think about what type of pizza you're going to order when you're done", "Sweet talk the cute unleashed dog that's currently trying to steal your lunch out of your pack"]
},
  answers: {
    q1: "Using your body to ascend a rock face with or without the use of technical gear",
    q2: "Offering route advice",
    q3: "Bouldering",
    q4: "Alpine climbing",
    q5: "The hardest part of a route",
    q6: "A beanie",
    q7: "Yosemite Decimal System",
    q8: "60-80 meters",
    q9: "Adam Ondra",
    q10:"Never let go of your break hand"
  },
  // Start Game Function
  startGame: function(){
    // reset game results
    trivia.currentSet = 0;
    trivia.correct = 0;
    trivia.incorrect = 0;
    trivia.unanswered = 0;
    clearInterval(trivia.timerId);
    clearTimeout(trivia.timerId);
    
    // show game section
    $('#game').show();
    
    //  empty last results
    $('#results').html('');
    
    // show timer
    $('#timer').text(trivia.timer);
    
    // remove start button
    $('#start').hide();

    $('#remaining-time').show();
    
    // ask first question
    trivia.nextQuestion();
    
  },
  // method to loop through and display questions and options 
  nextQuestion : function(){
    
    // set timer to 25 seconds each question
    trivia.timer = 25;
     $('#timer').removeClass('last-seconds');
    $('#timer').text(trivia.timer);
    
    // to prevent timer speed up
    if(!trivia.timerOn){
      trivia.timerId = setInterval(trivia.timerRunning, 1000);
    }
    
    // displays questions
    var questionContent = Object.values(trivia.questions)[trivia.currentSet];
    $('#question').text(questionContent);
    
    // shows current question options
    var questionOptions = Object.values(trivia.options)[trivia.currentSet];
    
    // puts questions in html
    $.each(questionOptions, function(index, key){
      $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
    })
    
  },
  // timer function
  timerRunning : function(){
    // if timer still has time left and there are still questions left to ask
    if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
      $('#timer').text(trivia.timer);
      trivia.timer--;
        if(trivia.timer === 4){
          $('#timer').addClass('last-seconds');
        }
    }
    // the time has run out and question is unanswered, run result
    else if(trivia.timer === -1){
      trivia.unanswered++;
      trivia.result = false;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Out of time! The correct answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
    }
    // if all the questions have been shown end the game, show results
    else if(trivia.currentSet === Object.keys(trivia.questions).length){
      
      // adds results of game (correct, incorrect, unanswered) to the page
      $('#results')
        .html('<h3>Thank you for playing!</h3>'+
        '<p>Correct: '+ trivia.correct +'</p>'+
        '<p>Incorrect: '+ trivia.incorrect +'</p>'+
        '<p>Unaswered: '+ trivia.unanswered +'</p>'+
        '<p>Want to try again?</p>');
      
      // hide game sction
      $('#game').hide();
      
      // show start button to begin a new game
      $('#start').show();
    }
    
  },
  // method to figure out if question was answered correctly
  guessChecker : function() {
    
    // timer ID for gameResult setTimeout
    var resultId;
    
    // the answer to the current question being asked
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      trivia.result = true;
      resultId = setTimeout(trivia.guessResult, 3000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      trivia.result = true;
      resultId = setTimeout(trivia.guessResult, 5000);
      $('#results').html('<h3>Better luck next time! '+ "The correct answer was: " + currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }

}