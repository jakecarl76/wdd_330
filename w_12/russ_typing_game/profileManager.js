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
                    "test_template_game.js"
                   ];
const game_options = [["Select Game", "NA"],
                      ["Testing Template", game_files[1]]
                     ];
                     
                     
class ProfileManager
{
  constructor(user_obj)
  {
    this.user_storage_obj = user_obj;
    this.user_data_obj = user_obj.get_user_obj();
    //alert(this.user_data_obj);
  }
  //create profile page
  //get lists/score/etc
  
  //create insert for game page
  create_profile_insert(el_id)
  {
    let parent_el = document.getElementById(el_id);
    //calc level progression % for bar
    let level_percent = Math.floor(this.user_data_obj.user_xp 
                      / this.user_data_obj.user_next_lvl);
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
    
    //DVDVDVDVDVDV Avitar chooser
    //hidden div -> on img click -> diff avitars on click:
      //change avitar
      //save user info
    html += "<img src='" + this.user_data_obj.user_avitar + "'>";
    
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
  }//END CREATE PROFILE INSERT

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
      
      tmp_name.innerHTML += tmp_raido + " <label for='list_" + i + "'>"
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
    
    tmp_para.innerHTML = "[DESC_HERE]";
    
    //add to page
    document.getElementById(el_id).appendChild(main_panel);
  }//END FUNC CREATE LIST EDIT INSERT
  
  
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
  
}////END CLASS PROFILE MANAGER////


//separate into utils file:
function toggle_hidden(div, symbol)
{
  let div_el = document.getElementById(div);
  let sym_el = document.getElementById(symbol);
  
  //toggle hidden
  div_el.classList.toggle("hidden");
  
  //adjust controllers symbol to reflect state
  if(div_el.classList.contains("hidden"))
  {
    sym_el.innerHTML = "&#9661;";
  }
  else
  {
    sym_el.innerHTML = "&#9660;";
  }
}//END FUNC TOGGLE HIDDEN



