const level_titles = [ "n00b",
                       "Recruit",
                       "Student",
                       "Apprentice",
                       "Graduate",
                       "Rookie",
                       "Novice",
                       "Adept",
                       "5W337 5K1LLz",
                       "Master",
                       "Ninja",
                       "1337",
                       "1337 M4573R",
                       "1337 M4573R N1NJ4",
                       "CH13F 1337 M4573R N1NJ4"
                     ];

const game_files = ["NA",
                    "test_template_game.js",
                    "cyber_warfare_game.js"
                   ];
const game_options = [["Select Game", "NA"],
                      ["Testing Template", game_files[1]],
                      ["Cyber Warfare", game_files[2]]
                     ];


//PROFILE MANAGER CLASS
//class funcs:
//assign_profile_el_id(el_id)
//update_profile_el()
//get_user_storage_obj()
//create_profile_insert(el_id)-------------//multiple pages (profile insert)
//create_user_options_insert(el_id)--------//user_page.html (panel)
//create_user_lists_insert(el_id)----------//user_page.html (list selection insert)
//create_list_edit_insert(el_id)-----------//list_editor.html (list editor insert)
//create_game_select_insert(el_id)---------//game_select.html (game selection options insert)
//create_avitar_chooser(el_id)-------------//multiple pages (called by profile insert to add in avatar chooser)
//change_avatar_pic(img_url, usr_strg)-----//multiple pages (called by avatar chooser)
//create_list_download_insert(el_id, data)-//download_list.html (insert lists selection only)
//create_footer(el_id)---------------------//every page
class ProfileManager
{
  constructor(user_obj)
  {
    this.user_storage_obj = user_obj;
    this.user_data_obj = null;
    this.level_ratio = 1.7;
    //if user obj, get ref to it
    if(user_obj != null)
    {
      this.user_data_obj = user_obj.get_user_obj();
    }
    
    this.profile_el_id_ref = null;
    //alert(this.user_data_obj);
  }
  //create profile page
  //get lists/score/etc
  
  //assign the id of the profile el for later ref
  assign_profile_el_id(el_id)
  {
    this.profile_el_id_ref = el_id;
  }
  
  //if an el id has been assigned to user profile, can update el contents
  update_profile_el()
  {
    if(this.profile_el_id_ref != null)
    {
      this.create_profile_insert(this.profile_el_id_ref)
    }
  }
  
  //return ref to user storage obj
  get_user_storage_obj()
  {
    return this.user_storage_obj;
  }
  
  //create insert for game page
  create_profile_insert(el_id)
  {
    let parent_el = document.getElementById(el_id);
    //calc level progression % for bar
    let level_percent = Math.floor((this.user_data_obj.user_xp 
                      / this.user_data_obj.user_next_lvl)
                      * 100);
    let bg_color = "var(--neon-red)";
    
    if(level_percent > 10 && level_percent < 30)
    {
      bg_color = "var(--neon-orange)";
    }
    else if(level_percent >= 30 && level_percent < 40)
    {
      bg_color = "var(--neon-yellow)";
    }
    else if(level_percent >= 40 && level_percent < 60)
    {
      bg_color = "var(--neon-green)";
    }
    else if(level_percent >= 60 && level_percent < 90)
    {
      bg_color = "var(--neon-blue)";
    }
    else if(level_percent >= 90)
    {
      bg_color = "var(--neon-white)";
    }
    
    
    let html = "";
    html += "<div class='mini_profile'>";//container div
    html += "<div class='user_header_left'>";//left div container
    html += "<h2> " + this.user_data_obj.user_name + "</h2>";
    
    //Avitar chooser
    //hidden div -> on img click -> diff avitars on click:
    html += "<div class='avatar_selector hidden' id='avatar_chooser'>"
         + "</div>";
    
    
      //change avitar
      //save user info
    html += "<img id='usr_img' class='cursor_ptr' src='" + this.user_data_obj.user_avitar + "'"
      + " onclick='toggle_hidden(\"avatar_chooser\");'>";
    
    html += "</div>";//end left dif container
    html += "<div class='user_header_right'>";//right div container
    html += "<h2>" + this.user_data_obj.user_level + "</h2>";
    html += "<h3>" + level_titles[this.user_data_obj.user_level] + "</h3>";
    html += "<div class='outer_xp_bar'>";//outer bar
    html +=  "<div class='inner_xp_bar' style='width: " + level_percent 
             + "%; min-width:  " + level_percent + "%; background-color: "
             + bg_color + ";'>";//inner bar
    html += "</div>";//end inner bar
    html += "</div>";//end outer bar
    html += "<div>" + this.user_data_obj.user_xp + " / " + this.user_data_obj.user_next_lvl
         + "</div>";//show xp numbers
    html += "</div>";//end right div container
    html += "<hr>";
    html += "</div>"//end container div
    parent_el.innerHTML = html;
    
    //add in avitar chooser
    this.create_avitar_chooser('avatar_chooser');
  }//END CREATE PROFILE INSERT

  create_avitar_chooser(el_id)
  {
    let self = this;
    let parent_el = document.getElementById(el_id);
    let main_panel = document.createElement("div");
    let tmp_el = document.createElement("h2");
    main_panel.appendChild(tmp_el);
    tmp_el.innerHTML = "Choose Your Avatar";
    
    //add img buttons (ie, imgs with an click event listener)
    for(let i = 1; i < 5; i++)
    {
      let tmp_el = document.createElement("img");
      main_panel.appendChild(tmp_el);
      tmp_el.src="imgs/common/avatar_" + i + ".png";
      tmp_el.classList.add("cursor_ptr");
      tmp_el.addEventListener("click", 
                              function()
                              {
                                //Hide selection div and change img/save avatar choice
                                document.getElementById(el_id).classList.add("hidden");
                                self.change_avatar_pic(this.src, self.user_storage_obj);
                                document.getElementById("usr_img").src = this.src;
                              });
    }//END FOR EACH AVITAR CHOICE
    
    
    //add panel to page
    parent_el.appendChild(main_panel);
  }
  
  create_user_options_insert(el_id)
  {
    let parent_el = document.getElementById(el_id);
    
    let html_obj = document.createElement("div");
    
    //add hide show contorller div
    let tmp_ctrl_div = document.createElement("div");
    html_obj.appendChild(tmp_ctrl_div);
    tmp_ctrl_div.classList.add("div_btn");
    tmp_ctrl_div.innerHTML = "Profile Options ";
    
    //add ctrl_symbol
    let tmp_sym = document.createElement("span");
    tmp_ctrl_div.appendChild(tmp_sym);
    tmp_sym.innerHTML = "&#9661;";
    tmp_sym.id = "profile_options_sym";
    
    //attach show/hide function
    tmp_ctrl_div.addEventListener("click",
                                  function()
                                  {
                                    toggle_hidden("user_options_display", "profile_options_sym")
                                  });
    
    //add hide show div
    let tmp_options_div = document.createElement("div");
    html_obj.appendChild(tmp_options_div);
    tmp_options_div.id = "user_options_display";
    tmp_options_div.classList.add("hidden", "display_panel");
    tmp_options_div.innerHTML  = "<h3> Profile Options </h3>";
    tmp_options_div.innerHTML += "<hr>";
    
    //add buttons
    let tmp_btn_1 = document.createElement("input");
    tmp_options_div.appendChild(tmp_btn_1);
    tmp_btn_1.type = "button";
    tmp_btn_1.classList.add("btn");
    tmp_btn_1.value = "Delete Profile";
    
    //attach functions to buttons
    let self = this;
    tmp_btn_1.addEventListener("click",
                               function()
                               {
                                 if(confirm("Are you sure you want to delete your profile? This can NOT be undone!"))
                                 {
                                   self.user_storage_obj.remove_user(self.user_data_obj.user_name);
                                   window.location.href = "index.html";
                                 }
                               });
    //attach el to document
    parent_el.appendChild(html_obj);
    
  }//END FUNC CREATE USER OPTIONS INSERT
  
  create_user_lists_insert(el_id)
  {
    let parent_el = document.getElementById(el_id);
    let html_obj = document.createElement("form");//container el
    html_obj.id = "list_form";
    
    let tmp_header = document.createElement("div");
    html_obj.appendChild(tmp_header);
    tmp_header.classList.add("list_header");
    
    //add titles
    let tmp_title = document.createElement("h2");
    tmp_title.innerHTML = "My Lists";
    tmp_header.appendChild(tmp_title);
    
    tmp_title = document.createElement("h3");
    tmp_title.innerHTML = "List Name";
    tmp_header.appendChild(tmp_title);
    
    tmp_title = document.createElement("h3");
    tmp_title.innerHTML = "High Score";
    tmp_header.appendChild(tmp_title);
    
    tmp_title = document.createElement("h3");
    tmp_title.innerHTML = "Last Score";
    tmp_header.appendChild(tmp_title);
    
    let tmp_panel = document.createElement("ul");
    html_obj.appendChild(tmp_panel);
    tmp_panel.classList.add("list_panel");
    
    //add each list
    for(let i = 0; i < this.user_data_obj.user_lists.length; i++)
    {
      let tmp_list = document.createElement("li");
      tmp_panel.appendChild(tmp_list);
      
      //add function so clicking line clicks its radio button
      tmp_list.addEventListener("click",
                                function(event)
                                {
                                  let kids = this.children;
                                  kids[0].children[0].click();
                                  document.getElementById("list_select_btn").disabled = false;
                                });
      
      let tmp_name = document.createElement("h3");
      tmp_name.classList.add("game_name");
      tmp_list.appendChild(tmp_name);
      
      let tmp_raido = "<input type='radio' class='hidden' name='list_label' id='list_" + i
                    + "' value='" + i + "'>";
      
      tmp_name.innerHTML += tmp_raido + " <label for='list_" + i + "'> "
                         + this.user_data_obj.user_list_names[i] + "</label>";
      let tmp_score = document.createElement("div");
      tmp_score.classList.add("score_tag");
      tmp_score.innerHTML += "<h3>" + this.user_data_obj.high_scores[i] + "</h3>";
      tmp_score.innerHTML += "<h4>" + this.user_data_obj.high_score_game[i] + "</h4>";
      tmp_list.appendChild(tmp_score);
      
      tmp_score = document.createElement("div");
      tmp_score.classList.add("score_tag");
      tmp_score.innerHTML += "<h3>" + this.user_data_obj.last_scores[i] + "</h3>";
      tmp_score.innerHTML += "<h4>" + this.user_data_obj.last_score_game[i] + "</h4>";
      tmp_list.appendChild(tmp_score);
      
      
      
    }//end for each list
    
    
    //bottom buttons panel/buttons
    tmp_panel = document.createElement("div");
    tmp_panel.classList.add("list_btns_panel");
    html_obj.appendChild(tmp_panel);
    
    //create self ref for functions
    let self = this;
    
    //Select btn
    //radio buttons activate the select/go button
    let tmp_btn = document.createElement("input");
    tmp_btn.type = "button"
    tmp_btn.classList.add("btn");
    tmp_btn.id = "list_select_btn";
    tmp_btn.value = "Select";
    tmp_btn.disabled = true;
    tmp_btn.addEventListener("click",
                             function()
                             {
                               let tmp_f = document.getElementById("list_form");
                               let tmp_radios = tmp_f.list_label;
                               //DVDVDVDVDVDVDVDVDVDV
                               window.location.href = "game_select.html?list_num=" + tmp_radios.value;
                               console.log(tmp_radios.value);
                             });
    
    tmp_panel.append(tmp_btn);
    
    //create new list btn
    tmp_btn = document.createElement("input");
    tmp_btn.type = "button"
    tmp_btn.classList.add("btn");
    tmp_btn.value = "Create New List";
    
    //DVDVDVDVDVDV
    tmp_btn.addEventListener("click",
                         function()
                         {
                           let tmp_f = document.getElementById("list_form");
                           let tmp_radios = tmp_f.list_label;
                           window.location.href = "list_editor.html?action=new";
                         });
    tmp_panel.append(tmp_btn);
    
    //get new list btn
    tmp_btn = document.createElement("input");
    tmp_btn.type = "button"
    tmp_btn.classList.add("btn");
    tmp_btn.value = "Get New Lists";
    
    //DVDVDVDVDVDV
    tmp_btn.addEventListener("click",
                         function()
                         {
                           window.location.href = "download_list.html";
                         });
    tmp_panel.append(tmp_btn);
    
    //logout btn
    tmp_btn = document.createElement("input");
    tmp_btn.type = "button"
    tmp_btn.classList.add("btn");
    tmp_btn.value = "Logout";
    
    //DVDVDVDVDVDV
    tmp_btn.addEventListener("click",
                         function()
                         {
                           //remove user from current storage
                           self.user_storage_obj.logout_user();
                           window.location.href = "index.html";
                         });
    tmp_panel.append(tmp_btn);
    
    //add to webpage
    parent_el.appendChild(html_obj);
  }//END FUNC CREATE USER Lists INSERT
  
  
  //list edit page
  create_list_edit_insert(el_id)
  {
    //get info from url
    let tmp_url = window.location.search;
    let list_num = -1;
    let prev_page = "user_page.html";
    //default goes to list select 
    //(because no need have list select for that page so on err, best solution)
    
    //check if editing a list/get list num if so
    if(tmp_url.match(/action=edit/) != null && tmp_url.match(/list_num=\d+/) != null)
    {
      //get/set list_num
      list_num = Number(tmp_url.match(/list_num=\d+/)[0].replace("list_num=", ""));
    }
    
    //check for prev_page info
    if(tmp_url.match(/prev_page=game_select/) != null)
    {
      //get/set list_num
      prev_page = "game_select.html";
    }
    
    
    let main_panel = document.createElement("div");
    
    //create panel for and add list name field
    let tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    main_panel.classList.add("display_panel", "left_align");
    
    let tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.id = "list_name";
    tmp_input.type = "text";
    tmp_input.placeholder = "List Name";
    
    //create new panel for text area
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    
    let tmp_txt_area = document.createElement("textarea");
    tmp_panel.appendChild(tmp_txt_area);
    tmp_txt_area.id = "list_txt";
    
    //if editing a list, place name into name field
    if(list_num != -1)
    {
      tmp_input.value = this.user_data_obj.user_list_names[list_num];
      tmp_txt_area.value = this.user_data_obj.user_lists[list_num];
    }
    
    //crate hidden panel for list num ref
    tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.type = "hidden";
    tmp_input.id = "list_num";
    tmp_input.value = list_num;
    
    //add new panel for buttons
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    tmp_panel.classList.add("center_align", "list_btns_panel");
    
    //add save button
    tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.type = "button";
    tmp_input.id = "save_btn";
    tmp_input.classList.add("btn");
    tmp_input.value = "Save";
    
    //create object ref for child functions
    self = this;
    
    tmp_input.addEventListener("click",
                               function()
                               {
                                 //uses a hidden input for the list number
                                 //if new will be set to -1, otherwise list's num
                                 //if -1 just save as new list
                                 //if not -1, confirm with user, then replace old list
                                 
                                 //get list num
                                 let tmp_num = Number(document.getElementById("list_num").value);
                                 
                                 //check NaN
                                 if(isNaN(tmp_num))
                                 {
                                   console.log("Error: list number is NaN.");
                                 }
                                 
                                 //check if this is replacing old list
                                 if(tmp_num != -1)
                                 {
                                   //warn/confirm
                                   if(!confirm("By saving you will be replacing the original list"
                                               + " and resetting its recorded scores. Are you sure "
                                               + "you want to overwrite the list?"))
                                   {
                                     //on fail return;
                                     return;
                                   }
                                 }
                                 else
                                 {
                                   //if a new list, first time saving -> save as new
                                   document.getElementById("save_as_new_btn").click();
                                   return;
                                 }
                                 
                                 //save list to user obj
                                 self.user_data_obj.user_list_names[tmp_num] = document.getElementById("list_name").value;
                                 self.user_data_obj.user_lists[tmp_num] = document.getElementById("list_txt").value;
                                 
                                 //reset scores/score-games
                                 self.user_data_obj.high_scores[tmp_num] = 0;
                                 self.user_data_obj.last_scores[tmp_num] = 0;
                                 self.user_data_obj.high_score_game[tmp_num] = "Not Played";
                                 self.user_data_obj.last_score_game[tmp_num] = "Not Played";
                                 
                                 //save user obj
                                 self.user_storage_obj.save_curr_user();
                                 console.log("saved " + tmp_num);
                                 console.log(self.user_storage_obj);
                               });
    //add save as new button
    tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.type = "button";
    tmp_input.id = "save_as_new_btn";
    tmp_input.classList.add("btn");
    tmp_input.value = "Save As New List";
    
    //create object ref for child functions
    self = this;
    
    tmp_input.addEventListener("click",
                               function()
                               {
                                 //get a new list num for this list...
                                 let tmp_num = self.user_data_obj.user_lists.length;
                                 
                                 //set new list number in hidden input
                                 document.getElementById("list_num").value = tmp_num;
                                 
                                 //save list to user obj
                                 self.user_data_obj.user_list_names[tmp_num] = document.getElementById("list_name").value;
                                 self.user_data_obj.user_lists[tmp_num] = document.getElementById("list_txt").value;
                                 
                                 //init scores/score-games
                                 self.user_data_obj.high_scores[tmp_num] = 0;
                                 self.user_data_obj.last_scores[tmp_num] = 0;
                                 self.user_data_obj.high_score_game[tmp_num] = "Not Played";
                                 self.user_data_obj.last_score_game[tmp_num] = "Not Played";
                                 
                                 //save user obj
                                 self.user_storage_obj.save_curr_user();
                                 console.log("saved " + tmp_num);
                                 console.log(self.user_storage_obj);
                               });
    //add done button (alias for cancel button)
    tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.type = "button";
    tmp_input.id = "done_btn";
    tmp_input.classList.add("btn");
    tmp_input.value = "Done";
    
    //create object ref for child functions
    self = this;
    
    tmp_input.addEventListener("click",
                               function()
                               {
                                 document.getElementById("cancel_btn").click();
                               });
                               
    //add cancel button
    tmp_input = document.createElement("input");
    tmp_panel.appendChild(tmp_input);
    tmp_input.type = "button";
    tmp_input.id = "cancel_btn";
    tmp_input.classList.add("btn");
    tmp_input.value = "Cancel";
    
    //create object ref for child functions
    self = this;
    
    tmp_input.addEventListener("click",
                               function()
                               {
                                 //get the query info for prev page
                                 let tmp_url = "user_page.html"
                                 
                                 let q_str = window.location.search;
                                 
                                 //check prev page
                                 if(q_str.match(/prev_page=game_select/))
                                 {
                                   //get list num
                                   let tmp_num = Number(document.getElementById("list_num").value);
                                   //check validity of number
                                   if(!isNaN(tmp_num) 
                                      && tmp_num <  self.user_data_obj.user_lists.length)
                                   {
                                     //number valid, create new url
                                     tmp_url = "game_select.html?list_num=" + tmp_num;
                                   }
                                 }
                                 
                                 //go to url
                                 window.location.href = tmp_url;
                               });
      
    //create new panel for list creation rules
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    
    let tmp_para = document.createElement("p");
    tmp_panel.appendChild(tmp_para);
    
    //INSTRUCTION TEXT:
    tmp_para.innerHTML = "<h2> How to Create a List </h2>"
      + "<p>Lists contain all of the questions, answers, and other"
      + " information the needed for the list. As they are read by the "
      + "game they need to be formatted correctly or the game won't run.</p>"
      + "<h3> Format </h3>"
      + "<p>Lists consist of three sections or 'fields': the flags, the question, "
      + "and the answer(s). Each section is separated by a comma. Because of this "
      + "you can't actually use a comma in any of your questions or answers as "
      + "it would interferer with the list's format. Each different question is "
      + "separated by placing it on a new line. The field order is: "
      + "<strong>Flags, Question, Answer(s)</strong></p>"
      + "<h3> Commas and Comma Replacements </h3>"
      + "<p>While you can't use an actual comma, you can use the "
      + "html entity for a comma. Html entities are codes that are translated "
      + "by a web browser into a character or symbol. The entity for the comma "
      + "is: <strong>&amp;#44;</strong> </p>"
      + "<p>Do not use the html entity comma in an answer! The game expects "
      + "the player's input to match exactly what is placed in the answer field, "
      + "so if you put an html entity in the field, the game expects the user to "
      + "type an html entity. This would result in a frustrating no win situation."
      + " Even worse, if you set the question to give a hint after enough wrong"
      + " answers, the hit will show a comma, not the html entity character the"
      + " player would actually need to type! </p>"
      + "<p>If you need to use a separator in your answer, try another"
      + " character like a hyphen, underscore, or slash. Just make sure"
      + " in the question prompt to indicate to the player what format "
      + "their answer should be in. Do not use the semicolon as that is also"
      + "used as a list separator.</p>"
      + "<h3> The Semicolon </h3>"
      + "<p>The game uses the semi colon in the answers field to separate "
      + "different plausible answers. This is means you can include a question "
      + "with multiple answers the player could respond with to pass it. </p>"
      + "<p>For example consider a math question like, \"Name a factor of 20\""
      + ". 20 has multiple possible factors: 1, 2, 5, 10, and 20. Instead of "
      + "listing only one and letting the player try to guess which factor"
      + " you were thinking of when you wrote the question, you can include"
      + " all of the factors, each separated by a semicolon: 1; 2; 5; 10; 20</p>"
      + "<p>By including all factors this way, the game will use them as a pool"
      + " of correct answers to pull from. The player then can enter any one of"
      + " the correct answers to pass the question.</p>"
      + "<h3> HTML and Images</h3>"
      + "<p>The questions can include html if you know how to write it. "
      + "This allows for custom formatting a question to "
      + "appear exactly how you like it or even include images."
      + " To include an image simply place in the html tag for an image"
      + " with the web-available image's url in its src attribute. For example:"
      + " &lt;img src='http://mysite.com/my_img.jpg'></p>"
      + "<h3> Flags </h3>"
      + "<p>There is a lot of information about each of the flags here. You don't"
      + " need to know all of it to create a list! While knowing what the flags do"
      + " can help you to make your list more robust, you can actually leave the "
      + "flags section blank and defaults will kick in.</p>"
      + "<p>Flags dictate everything about how the question is asked and "
      + "answered. It from the input keyboard to the number of tries a "
      + "player gets to enter the correct answer. Flags do not need to be "
      + "separated by spaces or any character. The possible flags are as follows:</p>"
      + "<p><strong>L</strong> - Live Answer</p>"
      + "<p>A live answer flag dictates that input is submitted 'live' or as the "
      + "player types it in.</p>"
      + "<p><strong>F</strong> - Full Answer</p>"
      + "<p>A full answer flag dictates that input is submitted only after"
      + " the player hits the Enter key. This allows them to use the Backspace"
      + " key to correct their answer before submitting it.</p>"
      + "<p><strong>H</strong> - Hint</p>"
      + "<p>The hint flag allows for hints. A hint shows the answer after the"
      + " player passes the 'soft limit' for incorrect guesses. It chooses an"
      + " answer based off user input. If the user has part of a correct answer"
      + " the hint will scan the pool of answers and show the remainder of the"
      + " first partial match to the player's input field. If there are no "
      + "partial matches in the answer pool, the full first correct answer is shown.</p>"
      + "<p>For example, if the answers to question were 'fifteen' and 'five', and "
      + "the player has submitted 'fi', the hint would show 'fteen' next to their"
      + " input in pale text to indicate what is left to enter in. This would update"
      + " after each new input was submitted (after each key stroke in a live answer).</p>"
      + "<p><strong>S#(number)</strong> - Soft Limit</p>"
      + "<p>The soft limit flag indicates the number of incorrect answers "
      + "a player can enter before the hint is given. It consists of '<strong>S#(number)</strong>'"
      + " where '(number)' is substituted by the number of tries. For example "
      + "'<strong>S#3</strong>' gives the player three incorrect answers before the hint is shown.</p>"
      + "<p><strong>Q#(number)</strong> - Hard Limit</p>"
      + "<p>The hard limit or 'quit' limit sets the number of incorrect answers "
      + "entered before the question is skipped. For example, '<strong>Q#5</strong>' will skip "
      + " the question after the player enters more than five wrong answers. "
      + "If this is set lower than the soft limit flag, the hint will never be shown.</p>"
      + "<p><strong>N[(input)]</strong> - Input Keyboard</p>"
      + "<p>The input keyboard flag indicates from which keyboard the player's"
      + " input should be read from to answer the question. The format of "
      + "the flag is '<strong>N[(input)]</strong>' where '(input)' is replaced"
      + " with the input keyboard. For example to pull from the Russian keyboard"
      + " the flag would need to be '<strong>N[RUSS]</strong>'. The default "
      + "input keyboard (if no flag is set) is the <strong>"
      + "ENG</strong> or the typical English 'QWERTY' keyboard and layout."
      + "</p>"
      + "<p><strong>MCID#(number)</strong> - Multi Choice Bank Id</p>"
      + "<p>The Multi Choice Bank Id flag is the id of the multi choice bank"
      + " for the question to pull from. When a question is part of a "
      + "multi choice bank, it pools its answers with any other questions that"
      + " are a part of that bank. Each question can then pull from that bank"
      + " for incorrect answers to display, along with its own correct answers,"
      + " as options for the player to choose from.</p>"
      + "<p>This allows for a random option bank to be selected each time "
      + "the question is asked. This makes it much harder for a player to just "
      + "memorize a particular choice for a particular question, and forces them"
      + " to actually learn the correct answer(s).</p>"
      + "<p>There are still a few issues to be aware of with using this method. "
      + "As all answers are pooled together, when selecting 'wrong answers' to "
      + "display for the particular question, there is a chance that the "
      + "question's correct answers that were added to the pool may be selected"
      + " as well. It also does not limit the question to be answered by only"
      + " the correct answers displayed. If an answer from the answer pool"
      + " was not displayed in the options, it is <strong>not</strong>"
      + " eliminated as a correct choice.</p>"
      + "<p><strong>A#(number)</strong> - Multi Choice Correct Answers</p>"
      + "<p>The multi choice correct answers flag selects the number of"
      + " correct answers to display in a multi choice question. The format "
      + "of the flag is '<strong>A#(number)</strong>' where '(number)' "
      + "is the number of correct answers to display.</p>"
      + "<p>There may be more or duplicate of the question's correct answers displayed"
      + " from the incorrect answer bank, as it contains all the question's "
      + "correct answers as well. Usually you will want to set this number"
      + " the same as the number of answers the question has to "
      + "avoid confusion since all answers will work, even if not displayed.</p>"
      + "<p><strong>I#(number)</strong> - Multi Choice Incorrect Answers</p>"
      + "<p>The multi choice incorrect answers flag selects the number of"
      + " incorrect answers to display from the multi choice bank "
      + "in a multi choice question. The format "
      + "of the flag is '<strong>I#(number)</strong>' where '(number)' "
      + "is the number of incorrect answers to display.</p>"
      + "<p>As the bank also has all of the questions correct answers, "
      + "there is a chance that they will be selected as 'wrong answers'"
      + " to be displayed. </p>"
      + "<h3> Have Fun and Learn!</h3>"
      + "<p>There is a lot of information here on how the program works. You don't"
      + " need to memorize or even read all of it. Flags can actually be left blank"
      + " and the default settings will kick in. Don't overload yourself with trying"
      + " to learn all of these instructions. The main thing each list needs is the"
      + " three comma separated sections, with answers and questions for each row. "
      + "Have fun and learn something!</p>";
    
    //panel for generating a sample list
    let tmp_div = document.createElement("div");
    tmp_panel.appendChild(tmp_div);
    
    let tmp_el = document.createElement("h3");
    tmp_div.appendChild(tmp_el);
    tmp_el.innerHTML = "Example Russian Typing List Generator";
    
    tmp_el = document.createElement("p");
    tmp_div.appendChild(tmp_el);
    tmp_el.innerHTML = "Need an example list? Just want to put your "
      + "Russian typing skills to the test? You can generate a random"
      + " list of Russian characters using this tool! Just enter the "
      + "number of characters you want for each question and how many "
      + "questions to generate and the the tool do the rest! (The list "
      + "will appear in the text area above.)";
    
    //label # of q's
    tmp_el = document.createElement("label");
    tmp_div.appendChild(tmp_el);
    tmp_el.htmlFor = "num_qs";
    tmp_el.innerHTML = "number of questions: ";
    
    //input # of q's
    tmp_el = document.createElement("input");
    tmp_div.appendChild(tmp_el);
    tmp_el.id = "num_qs";
    tmp_el.classList.add("small_margins");
    tmp_el.value = 5;
    tmp_el.placeholder = "Number";
    
    //label # of char's
    tmp_el = document.createElement("label");
    tmp_div.appendChild(tmp_el);
    tmp_el.htmlFor = "num_chars";
    tmp_el.innerHTML = "number of characters: ";
    
    //input # of q's
    tmp_el = document.createElement("input");
    tmp_div.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.id = "num_chars";
    tmp_el.value = 5;
    tmp_el.placeholder = "Number";
    
    //generate button
    tmp_el = document.createElement("input");
    tmp_div.appendChild(tmp_el);
    tmp_el.type = "button";
    tmp_el.value = "generate";
    tmp_el.classList.add("btn", "small_margins");
    tmp_el.addEventListener("click",
                            function()
                            {
                              let tmp_qs = document.getElementById("num_qs").value;
                              let tmp_chars = document.getElementById("num_chars").value;
                              
                              let tmp_text = get_test_russ_list(tmp_chars, tmp_qs);
                              document.getElementById("list_txt").value = tmp_text;
                            });
    
    //add button to return to top of page
    tmp_div = document.createElement("div");
    main_panel.appendChild(tmp_div);
    tmp_div.classList.add("center_align", "small_margins");
    tmp_el = document.createElement("input");
    tmp_div.appendChild(tmp_el);
    tmp_el.type = "button";
    tmp_el.classList.add("btn");
    tmp_el.value = "return to top";
    tmp_el.addEventListener("click",
                            function()
                            {
                              document.body.scrollTop = 0;
                              document.documentElement.scrollTop = 0;
                            });
    
    //add to page
    document.getElementById(el_id).appendChild(main_panel);
  }//END FUNC CREATE LIST EDIT INSERT
  
  //list get insert
  create_list_download_insert(el_id, data)
  {
    let parent_el = document.getElementById(el_id);
    
    let main_panel = document.createElement("div");
    let title_el = document.createElement("h2");
    title_el.innerHTML = "Available Lists";
    main_panel.appendChild(title_el);
    
    
    let tmp_panel = document.createElement("ul");
    main_panel.appendChild(tmp_panel);
    tmp_panel.classList.add("list_alternating", "left_align");
    
    //split data
    let lists = data.split("\n");
    
    //create row for each list
    for(let i = 0; i < lists.length; i++)
    {
      //get info from list
      let tmp_data = lists[i].split(",");
      //only create row if not blank (just check name);
      if(tmp_data[0] != "")
      {
        //user obj ref
        let self = this.user_storage_obj;
        
        //check for name in user list
        let has_list = self.get_user_obj().user_list_names.includes(tmp_data[0]);
        
        
        
        //list name
        let tmp_row = document.createElement("li");
        if(has_list)
        {
          tmp_row.classList.add("has_list");
        }
        tmp_panel.appendChild(tmp_row);
        let tmp_el = document.createElement("span");
        tmp_row.appendChild(tmp_el);
        tmp_el.classList.add("emf_span", "small_margins");
        tmp_el.innerHTML = tmp_data[0];
        
        //list desc
        tmp_el = document.createElement("span");
        tmp_row.appendChild(tmp_el);
        tmp_el.classList.add("small_margins");
        tmp_el.innerHTML = tmp_data[2];
        
        //get list button
        tmp_el = document.createElement("input");
        tmp_row.appendChild(tmp_el);
        tmp_el.type = "button";
        tmp_el.classList.add("btn");
        tmp_el.value = "get list";
        tmp_el.addEventListener("click",
                                function()
                                {
                                  this.parentElement.classList.add("has_list");
                                  let txt_resouce = tmp_data[1]
                                  get_text_resource(txt_resouce, 
                                                    function(data)
                                                    {
                                                      let tmp_user = self.get_user_obj();
                                                      let list_num = tmp_user.user_lists.length;
                                                      tmp_user.user_list_names[list_num] = tmp_data[0];
                                                      tmp_user.user_lists[list_num] = data;
                                                      tmp_user.high_scores[list_num] = 0;
                                                      tmp_user.last_scores[list_num] = 0;
                                                      tmp_user.high_score_game[list_num] = "Not Played";
                                                      tmp_user.last_score_game[list_num] = "Not Played";
                                                      
                                                      //save user profile
                                                      self.save_curr_user();
                                                    });
                                });//END ADD EVENT LISTENER
        
      }//end if list data not empty
      
    }//END FOR EACH LIST
    
    //attach insert to given el with el_id
    parent_el.appendChild(main_panel)
  }
  
  //game select page
  create_game_select_insert(el_id)
  {
    //get info from url/init list_num
    let tmp_url = window.location.search;
    let list_num = -1;
    let tmp_err = false;
    let self = this;
    
    //create base panel
    let main_panel = document.createElement("div");
    
    //check if editing a list/get list num if so
    if(tmp_url.match(/list_num=\d+/) != null)
    {
      //get/set list_num
      list_num = Number(tmp_url.match(/list_num=\d+/)[0].replace("list_num=", ""));
      //check limits
      if(this.user_data_obj.user_lists.length <= list_num)
      {
        tmp_err = true;
      }
    }
    else
    {
      tmp_err = true;
    }
    
    if(tmp_err)
    {
      console.log("Error: could not read selected list number.");
      let tmp_el = document.createElement("p")
      tmp_el.innerHTML = "Sorry, an error occurred. Please go back and try again:";
      main_panel.appendChild(tmp_el);
      //back button
      let tmp_input = document.createElement("input");
      main_panel.appendChild(tmp_input);
      tmp_input.type = "button";
      tmp_input.id = "back_btn";
      tmp_input.classList.add("btn");
      tmp_input.value = "Back";
      
      tmp_input.addEventListener("click",
                                 function()
                                 {
                                   window.location.href=("user_page.html")
                                 });
                                 
      document.getElementById(el_id).appendChild(main_panel);
    return;
    }//END else if err reading list num
    
    //create display panel
    let tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    main_panel.classList.add("display_panel", "left_align", "center_align");
    
    //place list desc
    //list name
    let tmp_el = document.createElement("h2");
    tmp_panel.appendChild(tmp_el);
    tmp_el.innerHTML = this.user_data_obj.user_list_names[list_num];
    
    //high score
    tmp_el = document.createElement("h3");
    tmp_panel.appendChild(tmp_el);
    tmp_el.innerHTML = "High Score";
    tmp_el.classList.add("marg_small_bot");
    tmp_el = document.createElement("h2");
    tmp_panel.appendChild(tmp_el);
    tmp_el.innerHTML = this.user_data_obj.high_scores[list_num];
    tmp_el.classList.add("marg_small_top_bot");
    //game title achieved on
    tmp_el = document.createElement("h3");
    tmp_panel.appendChild(tmp_el);
    tmp_el.classList.add("marg_small_top");
    tmp_el.innerHTML = this.user_data_obj.high_score_game[list_num];
    
    //last score
    tmp_el = document.createElement("h3");
    tmp_panel.appendChild(tmp_el);
    tmp_el.innerHTML = "Last Score";
    tmp_el.classList.add("marg_small_bot");
    tmp_el = document.createElement("h2");
    tmp_panel.appendChild(tmp_el);
    tmp_el.innerHTML = this.user_data_obj.last_scores[list_num];
    tmp_el.classList.add("marg_small_top_bot");
    //game title achieved on
    tmp_el = document.createElement("h3");
    tmp_panel.appendChild(tmp_el);
    tmp_el.classList.add("marg_small_top");
    tmp_el.innerHTML = this.user_data_obj.last_score_game[list_num];
    
    //add hidden list num field
    tmp_el = document.createElement("input");
    tmp_panel.appendChild(tmp_el);
    tmp_el.type = "hidden";
    tmp_el.id = "list_num";
    tmp_el.value = list_num;
    
    //new panel for game select
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    
    //game select <select> drop-down
    tmp_el = document.createElement("select");
    tmp_panel.appendChild(tmp_el);
    let game_select_el = tmp_el;
    tmp_panel.addEventListener("input",
                               function()
                               {
                                 //get value of selected game
                                 let tmp_val = game_select_el.value
                                 console.log(tmp_val);
                                 
                                 if(tmp_val != "NA")
                                 {
                                   //DVDVDVDVDVDVDVDVDVDVDV
                                   //change game img/desc etc for game
                                   
                                   //make sure to enable play button on select valid game
                                   document.getElementById("play_btn").disabled = false;
                                 }
                                 else
                                 {
                                   document.getElementById("play_btn").disabled = true;
                                 }
                               });
    
    //options
    for(let i = 0; i < game_options.length; i++)
    {
      let tmp_option = document.createElement("option");
      tmp_option.innerHTML = game_options[i][0];
      tmp_option.value = game_options[i][1];
      tmp_el.appendChild(tmp_option);
    }
    
    //play button
    tmp_el = document.createElement("input");
    tmp_panel.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.type = "button"
    tmp_el.classList.add("btn");
    tmp_el.id = "play_btn";
    tmp_el.value = "Play";
    tmp_el.disabled = true;
    tmp_el.addEventListener("click",
                             function()
                             { 
                               //build url search portion
                               //get list_num
                               let list_num = Number(document.getElementById("list_num").value);
                               //get value of selected game
                               let tmp_game = game_select_el.value
                               
                               //build query str
                               let tmp_str = "?game=" + tmp_game + "&list_num=" + list_num;
                               
                               window.location.href = "play_zone.html" + tmp_str;
                             });
    
    
    //new panel for game img/desc etc
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    tmp_panel.id = "game_desc";
    
    //new panel for buttons
    tmp_panel = document.createElement("div");
    main_panel.appendChild(tmp_panel);
    
    //each button gets own div:
    let tmp_panel_2 = document.createElement("div");
    tmp_panel.appendChild(tmp_panel_2);
    
    //edit list button
    tmp_el = document.createElement("input");
    tmp_panel_2.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.type = "button"
    tmp_el.classList.add("btn");
    tmp_el.id = "edit_btn";
    tmp_el.value = "Edit List";
    tmp_el.addEventListener("click",
                             function()
                             { 
                               //build url search portion
                               //get list_num
                               let list_num = Number(document.getElementById("list_num").value);
                               
                               //build query str
                               let tmp_str = "?action=edit&prev_page=game_select&list_num=" + list_num;
                               
                               window.location.href = "list_editor.html" + tmp_str;
                             });
    
    //each button gets own div:
    tmp_panel_2 = document.createElement("div");
    tmp_panel.appendChild(tmp_panel_2);
    
    //cancel/back button
    tmp_el = document.createElement("input");
    tmp_panel_2.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.type = "button"
    tmp_el.classList.add("btn");
    tmp_el.id = "back_btn";
    tmp_el.value = "Cancel";
    tmp_el.addEventListener("click",
                             function()
                             { 
                               window.location.href = "user_page.html";
                             });
    
    //each button gets own div:
    tmp_panel_2 = document.createElement("div");
    tmp_panel.appendChild(tmp_panel_2);
    
    //reset scores button
    tmp_el = document.createElement("input");
    tmp_panel_2.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.type = "button"
    tmp_el.classList.add("btn");
    tmp_el.id = "reset_btn";
    tmp_el.value = "Reset List Scores";
    tmp_el.addEventListener("click",
                             function()
                             { 
                               //get list_num
                               let list_num = Number(document.getElementById("list_num").value);
                               //get curr query el for reload
                               let tmp_q = window.location.search;
                               
                               //confirm before reset
                               if(confirm("Are you sure you want to reset the scores for this list?"))
                               {
                                 //reset high score, last score, and games
                                 self.user_data_obj.high_scores[list_num] = 0;
                                 self.user_data_obj.last_scores[list_num] = 0;
                                 self.user_data_obj.high_score_game[list_num] = "Not Played";
                                 self.user_data_obj.last_score_game[list_num] = "Not Played";
                                 
                                 //save object
                                 self.user_storage_obj.save_curr_user();
                                 
                                 //reload page
                                 window.location.href = "game_select.html" + tmp_q;
                               }//end if confirmed before reset
                             });
    
    //each button gets own div:
    tmp_panel_2 = document.createElement("div");
    tmp_panel.appendChild(tmp_panel_2);
    
    //delete list button
    tmp_el = document.createElement("input");
    tmp_panel_2.appendChild(tmp_el);
    tmp_el.classList.add("small_margins");
    tmp_el.type = "button"
    tmp_el.classList.add("btn");
    tmp_el.id = "delete_btn";
    tmp_el.value = "Delete List";
    tmp_el.addEventListener("click",
                             function()
                             { 
                               //get list_num
                               let list_num = Number(document.getElementById("list_num").value);
                               //get curr query el for reload
                               let tmp_q = window.location.search;
                               
                               //confirm before reset
                               if(confirm("Are you sure you want to delete this list?"))
                               {
                                 //reset high score, last score, and games
                                 self.user_data_obj.user_list_names.splice(list_num, 1);
                                 self.user_data_obj.user_lists.splice(list_num, 1);
                                 self.user_data_obj.high_scores.splice(list_num, 1);
                                 self.user_data_obj.last_scores.splice(list_num, 1);
                                 self.user_data_obj.high_score_game.splice(list_num, 1);
                                 self.user_data_obj.last_score_game.splice(list_num, 1);
                                 
                                 //save object
                                 self.user_storage_obj.save_curr_user();
                                 
                                 //reload page
                                 window.location.href = "user_page.html";
                               }//end if confirmed before reset
                             });
    
    
    //add to page
    document.getElementById(el_id).appendChild(main_panel);
  }//END FUNC CREATE GAME SELECT INSERT
  
  
  change_avatar_pic(img_url, user_storage_obj)
  {
    let tmp_user = user_storage_obj.get_user_obj();
    tmp_user.user_avitar = img_url;
    user_storage_obj.save_curr_user();
  }
  
  create_footer(el_id)
  {
    let main_panel = document.getElementById(el_id);
    
    let tmp_el = document.createElement("input");
    main_panel.appendChild(tmp_el);
    tmp_el.type = "button";
    tmp_el.classList.add("btn");
    tmp_el.value = "toggle background animation";
    tmp_el.addEventListener("click",
                            function()
                            {
                              document.body.classList.toggle('stop_animation');
                            });
  }
}////END CLASS PROFILE MANAGER////



