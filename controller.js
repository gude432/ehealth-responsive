$(document)
		.on(
				"mobileinit",
				function() {
					levelpage();
					var filename = "file.json"; // change this for a different												
					loadfile(filename);
					var quiz;
					var currentquestion = 0;
					var partindex = 0;
					var score = 0;
					var delta = 10;
					var level = 'easy';
					var currentpart = [];
					var currentanswer;
					var red = "#f0454b";
					var green = "#77B477";
					var question;
					var rightAudio = $("#mysoundclip")[0];					
					var wrongAudio = $("#myWrongSoundClip")[0];
					var speakAudio = $("#speak-audio")[0];
					var progress = 0;
				
				
				
					
					// events
					$(".levelPage").click(function() {
						set_level_section("level", this.id);
					});
					$(".sectionPage").click(function() {
						set_level_section("section", this.id);
					});
					$("#speak").click(function() {
						speak();
					});

					$(document).on('click', '#Next', function() {
						nexthandler();
					});

					$(document).on('click', '.option', function() {
						evaluate(parseInt(this.id) - 1);
						lock();
					});

					function initialize() {
						/*
					    Function: initialize
					    Initializes a set of questions according to level and section.
					    See Also:
						  <randomizechoice>
						  <printquestion>
						*/
						var part = splitsection(quiz.questions[level], 10);
						console.log(part);

						currentpart_unshuffled = part[partindex];

						var randomindex = shuffleindex(currentpart_unshuffled);
						console.log(randomindex);
						for (var i = 0; i < currentpart_unshuffled.length; i++) {

							currentpart
									.push(currentpart_unshuffled[randomindex[i]]);
						}
						question = currentpart[currentquestion];
						question = randomizechoice(question);
						printquestion(question);

					}

					function printmenu(array, array_fi, page, topage) {
						/*
					    Function: printmenu
					    Prints menu by creating set of links from the given array 
						Paramenters:
						array - an array of strings.
						array_fi - an array of strings in Finnish
						page - a page id string on which it will be printed.
						topage - a string id that will create to create link to navigate to.						
					    See Also:
						 
						*/
						for (var i = 0; i < array.length; i++) {
							$("#" + page).find("#ui").append(
									'<a  href="' + topage + '" ><button id='
											+ array[i]
											+ ' class = "menu-item ui-btn '
											+ page + '" > ' + array_fi[i]
											+ '</button></a>');
						}
					}
					function printbutton(array,array_fi, page) {
						/*
					    Function: printbutton
					    Prints buttons from the given array 
						Paramenters:
						array - an array of strings.
						page - a page id string on which it will be printed.											
					    See Also:
						 
						*/
						for (var i = 0; i < array.length; i++) {
							$("#" + page).find("#ui").append(
									'<button id=' + array[i]
											+ ' class = "menu-item ui-btn '
											+ page + '" > ' + array_fi[i]
											+ '</button>');
						}
					}					

					function lock() {
						/*
					    Function: lock
					    locks questions after a selection
						 
						*/
						$('.option').addClass("locked");
						$('.option').removeClass("option");

					}
					function unlock() {
						/*
					    Function: unlock
					    unlocks questions 
						 
						*/
						$('.locked').addClass("option");
						$('.locked').removeClass("locked");
					}
					function nexthandler() {
						/*
					    Function: nexthandler
					    resets, unlocks, randomizeschoice and prints it to screen
						Paramenters:
						none
												
					    See Also:
							<reset>
							<unlock>
							<randomizechoice>
							<printquestion>
						*/
						
						reset();
						unlock();
						if (currentquestion < currentpart.length - 1) {
							currentquestion++;
							question = currentpart[currentquestion];
							question = randomizechoice(question);
							console.log(currentanswer);
							printquestion(question);
						} else {
							printfinalpage();
							console.log("show final slide");
							$.mobile.changePage("#finalPage", {});
						}
					}

					function levelpage() {
						/*
					    Function: levelpage
					    defines levels and sections
						prints menu
						Paramenters:
						none
												
					    See Also:							
							<printmenu>
						*/
						level = {
							"name" : [ "easy", "medium", "difficult" ],
							"name_fi" : [ "Helppo", "Keskitaso", "Vaikea" ],
							"page" : "levelPage",
							"topage" : "#sectionPage"
						};
						section = {
							"name" : [ "first", "second", "third" ],
							"name_fi" : [ "Ensimmäinen", "Toinen", "Kolmas" ],
							"page" : "sectionPage",
							"topage" : "#questionPage"
						};
						printmenu(level.name, level.name_fi, level.page, level.topage);
						printmenu(section.name, section.name_fi, section.page, section.topage);
					}

					function set_level_section(toset, item) {
						/*
					    Function: levelpage
					    sets levels and sections according to user selection
						Paramenters:
						toset - is the parameter to be changed
						item - value of elements to be tested or assigned to toset(first par.)
												
					    See Also:							
							
						*/
						
						if (toset == "level") {
							level = item;
							return;
						}

						if (toset == 'section') {
							if (item == 'first') {
								partindex = 0;

							}
							if (item == 'second') {
								partindex = 1;

							}
							if (item == 'third') {
								partindex = 2;
							}

						}						
						initialize();
					}

					function loadfile(file) {
						/*
					    Function: loadfile
					    loads file given on the parameter using ajax synchronous
						Paramenters:
						file - the file name to be loaded					
												
					    See Also:							
							
						*/
						$.ajax({
							async : false,
							url : filename,
							success : function(data) {
								quiz = data;
							}
						});
					}

					function splitsection(array, size) {
						
						/*
					    Function: splitsection
					    takes object array and splits to a group of number of parts
						Paramenters:
						array - question array
						size- the amount to be splited
												
					    See Also:							
							
						*/
						var result = [];
						var i = 0;
						while (i < array.length) {
							result.push(array.slice(i, i += size));
						}
						return result;
					}

					function shuffleindex(array) {
						
						
						/*
					    Function: shuffleindex
					    takes an array, shuffles and returns a random numbers of the arrays size
						Paramenters:
						array - question array
						
												
					    See Also:							
							
						*/
						var max = array.length;
						var rand, i;
						var store = [];
						for (i = 0; store.length != max; i++) {
							rand = Math.floor(Math.random() * max);
							if ($.inArray(rand, store) == -1) {
								store.push(rand);
							}
						}
						return store;
					}

					function randomizechoice(question) {
						
						/*
					    Function: randomizeschoice
					    takes a question object as an argument and returns the questions
						Paramenters:
						array - question array					
												
					    See Also:							
							
						*/
						
						var tmp = [ question.option1, question.option2,
								question.option3, question.option4 ];
						shuffle = shuffleindex(tmp);
						question.option1 = tmp[shuffle[0]];
						question.option2 = tmp[shuffle[1]];
						question.option3 = tmp[shuffle[2]];
						question.option4 = tmp[shuffle[3]];
						question.answer = parseInt(shuffle[0]);
						currentanswer = question.answer;
						return question;
					}

					function printmessage(image, msg, id_to) {
						
						/*
					    Function: printmessage
					    takes an image  and message as an argument and returns as feed back 
						Paramenters:
						image- feedback image
						msg - feedback message
						id_to - id of element where to display
												
					    See Also:							
							
						*/
						stage = id_to;
						$(stage).append(
								'<div><img src="img/' + image
										+ '.png"></div>');
						$(stage).append(
								'<div class="feedback_msg"><h2 id="congrats">'
										+ msg + '</h2></div>');
					}
					function printfinalpage() {
						// displays the final page
						
						/*
					    Function: printfinalpage
					    prints feedback on final page
						Paramenters:
						none
						
												
					    See Also:							
							
						*/
						var message1 = [ "Erinomainen!", "Excellent!" ];
						var message2 = [ "Oikein hyvä!", "Very good!" ];
						var message3 = [ "Voit tehdä paremmin !",
								"You can do better!" ];

						var msg1 = message1[0];
						var msg2 = message2[0];
						var msg3 = message3[0];
						var msg4 = ".....";

						point = score;
						stage = "#finalPage_feedback";

						if ((point >= 75) && (point < 100)) {
							printmessage("3stars", msg1, stage);
						}
						;
						if ((point >= 50) && (point < 75)) {
							printmessage("2stars", msg2, stage);
						}
						;
						if ((point >= 0) && (point < 50)) {
							printmessage("1stars", msg3, stage);
						}
						;

					}

					function printquestion(question) {
						/*
					    Function: printquestion
					    prints question into appropriate DOM element in the html
						Paramenters:
						question - question object						
												
					    See Also:							
							
						*/
						$("#question").text(question.question);
						$("#1").text(question.option1);
						$("#2").text(question.option2);
						$("#3").text(question.option3);
						$("#4").text(question.option4);
					}

					function evaluate(useranswer) {
						/*
					    Function: evaluate
					    checks if the user answer is correct and prints feedback to the panel section of html
						Paramenters:
						useranswer - question object						
												
					    See Also:							
							
						*/						
						printbutton([ "Next" ],[ "Jatka" ], "questionPage", "");
						printmenu([ "Feedback" ],[ "Palaute" ], "questionPage",
								"#feedbackPanel");
						$("#feedback").text(question.description);
						update_progress();
						if (useranswer == currentanswer) {
							righthandler();
							return 1;
						} else {
							wronghandler(useranswer);
							return 0;
						}
					}

					function writescore() {
						/*
					    Function: writescore
					    writes score into div element with id = "score"	
						*/	
						$("#score").text(score);
					}

					function righthandler() {
						/*
					    Function: righthandler
					    set of events when the user answer is right
						 See Also:		
						 <writescore>
						*/	
						score += delta;
						writescore();
						rightAudio.play();	
						var happy = ["happy","happy1"];
						var rand = Math.floor(Math.random()*2);				
						printmessage(happy[rand],"", "#avatar");						
						$("#" + (currentanswer + 1)).css("background-color",
								green);
						
					}
					function wronghandler(useranswer) {
						/*
					    Function: wronghandler
					    set of events when the user answer is wrong
						See Also:
						<writescore>
						*/
						writescore();
						wrongAudio.play();
						var sad = ["sad","sad1"];
						var rand = Math.floor(Math.random()*2);				
						printmessage(sad[rand],"", "#avatar");
						
						$("#" + (currentanswer + 1)).css("background-color",
								green);
						$("#" + (useranswer + 1)).css("background-color", red);

					}
					function reset() {
						/*
					    Function: reset
					    cleans up color changes that indicate wrong answer and feedback area for new question 
						See Also:
						
						*/
						$(".option").css("background-color", "white");
						$(".locked").css("background-color", "white");
						$("#questionPage").find("#ui").empty();
						$("#questionPage").find("#avatar").empty();
						
					}
					
					function speak() {
						/*
					    Function: speak
					    speaks aloud using an on-line speech service.
						See Also:
						
						*/
						var audio_src = "http://84.249.214.65/tts.php?text='"+question.description+"'";							
						var audio = document.getElementById('speak-audio');
						audio.src = audio_src;
						audio.play();						
					}
					
					function update_progress(){
						progress+=delta; //increase progress bar by delta
						$( "#progressbar" ).progressbar({ 
							value: progress});}
});
