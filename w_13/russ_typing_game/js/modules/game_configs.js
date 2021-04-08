
 import {EngQWERTYKeyMap} from "./eng_qwerty_key_map.js";
 import {RussKeyBoard} from "./russ_keyboard.js";
 
  function get_curr_game_configs()
  {
    //get/check url query string
    let tmp_url = window.location.search;
    if(tmp_url == "")
    {
      console.log("Error retrieving game configs: No query string");
      return null;
    }
    
    //get needed data section from query string
    let tmp_match = tmp_url.match(/game=[^&]+/);
    //check match made
    if(tmp_match == null)
    {
      console.log("Error retrieving game configs: Could not match game name in query.");
      return null;
    }
    
    //isolate name
    let game_name = tmp_match[0].replace("game=", "");
    game_name = game_name.replace(".js", "");
    //get configs obj from arr
    
    let tmp_obj = app_configs[game_name];
    
    return tmp_obj;
  }//END FUNC GET CURR GAME CONFIGS
  let app_configs = [];
  //game configs
  let st_scn = "<form class='generic_gm_scn' id='game_settings' onsubmit='preventDefault();'>"
              + " <h1> CYBER WARFARE </h1>"
              + "<p class='restrained margin_centered'><strong>Cyber Terrorists</strong> are attacking the Nation! "
              + "Only you have the skills to meet them head to head in a "
              + "battle of the code in <strong>Cyber Space!!</strong> Will you defeat them??"
              + " Or will you suffer from the <strong>Utimate Burn Out!!??</strong></p>"
              + "<div>"
              + "<h2> Difficulty:</h2>"
              + "<div><input type='radio' id='gd_easy' class='hidden' name='gd_radio'"
              + "value='0' checked> <label class='cursor_ptr' for='gd_easy'>Easy</label></div>"
              + "<div><input type='radio' id='gd_mid' class='hidden' name='gd_radio'"
              + "value='1'> <label class='cursor_ptr' for='gd_mid'>Moderate</label></div>"
              + "<div><input type='radio' id='gd_hard' class='hidden' name='gd_radio'"
              + "value='2'> <label class='cursor_ptr' for='gd_hard'>Hard</label></div>"
              + "<div><input type='radio' id='gd_hard2' class='hidden' name='gd_radio'"
              + "value='3'> <label class='cursor_ptr' for='gd_hard2'>1337</label></div>"
              + "<div><input type='radio' id='gd_nuke' class='hidden' name='gd_radio'"
              + "value='4'> <label class='cursor_ptr' for='gd_nuke'>The Nuclear Option</label></div>"
              + "</div>"
              + "<div><h2> Game Type:</h2>"
              + "<div><input type='radio' id='gt_score' value='score' class='hidden' name='gt_radio'"
              + " onclick=\"if(this.checked){document.getElementById("
              + "'score_game_options').classList.remove('hidden');"
              + "document.getElementById("
              + "'list_game_options').classList.add('hidden');}\" checked>"
              + "<label class='cursor_ptr' for='gt_score'>score game</label></div>"
              + "<div><input type='radio' id='gt_list' value='list' class='hidden' name='gt_radio'"
              + " onclick=\"if(this.checked){document.getElementById("
              + "'score_game_options').classList.add('hidden');"
              + "document.getElementById("
              + "'list_game_options').classList.remove('hidden');}\">"
              + "<label class='cursor_ptr' for='gt_list'>list game</label></div>"
              + "</div>"
              + "<div id='score_game_options' class='display_panel'>"
              
              + "<label for='score_lim'>score limit:</label>"
              + "<input type='number' id='score_lim' min='10' value='500'>"
              + "<p class='small_restrained small_margins margin_centered'>"
              + "Play until you reach a specified score. If your opponent reaches"
              + " the high score first, <strong>you're toast!</strong></p>"
              
              +"</div>"
              + "<div id='list_game_options' class='display_panel hidden'>"
              + "<label for='list_lim'>list iterations:</label>"
              + "<input type='number' id='list_lim' min='1' value='1'>"
              + "<p class='small_restrained small_margins margin_centered'>"
              + "Play until repeat the list the specified number of times. "
              + "Keep an eye on your score though! If your opponent gets"
              + " the high score in the end, <strong>you're fired!</strong></p>"
              
              + "</div>"
              + "<div class='small_margins'><input type='button' value='start' "
              + "onclick=\"let game_diff = document.forms[0].gd_radio.value;"
              + "let game_type = document.forms[0].gt_radio.value;"
              + "get_app_c().get_game_ref().d_lvl = game_diff;"
              + "get_app_c().get_game_ref().game_type = game_type;"
              + "get_app_c().get_game_ref().num_repeats = document.getElementById('list_lim').value - 1;"
              + "get_app_c().get_game_ref().max_score = document.getElementById('score_lim').value;"
              + "get_app_c().start_game();\"></div>"
              + "</form>"
              +"";

  let win_scn = "<div class='generic_gm_scn'> <h1> You Won! </h1>"
              + "<p class='restrained margin_centered'>Through your elite coding skills, you bested the"
              + " terrorists at their own game and saved the world from a total collapse of"
              + " cyber space!</p>"
              + "<div><input type='button' value='play again' class='small_margins'"
              + "onclick='get_app_c().get_game_ref().reset();"
              + "get_app_c().get_game_ref().display_start_screen();'></div>"
              + "<input type='button' value='end game' "
              + "onclick='get_app_c().end_game();'></div>";

  let gm_ovr_scn = "<div class='generic_gm_scn'> <h1> game over </h1>"
              + "<h2>Your Toast!!</h2>"
              + "<div><input type='button' value='play again' class='small_margins'"
              + "onclick='get_app_c().get_game_ref().reset();"
              + "get_app_c().get_game_ref().display_start_screen();'></div>"
              + "<input type='button' value='end game' "
              + "onclick='get_app_c().end_game();'></div>";
                 
  //game config obj passed to app controller
  app_configs['cyber_warfare_game'] = {
      profile_id:   "profile_el",
      prompt_el:    document.getElementById("prompt_el"),
      output_el:    document.getElementById("output_el"),
      score_el:     document.getElementById("score_el"),
      game_el:      document.getElementById("game_area"),
      q_type_el:    document.getElementById("ans_type_display"),
      footer_id:    "footer_el",
      live_img_src: "imgs/common/live_ans_dis_a.png",
      full_img_src: "imgs/common/full_ans_dis_a.png",
      start_screen: st_scn,
      win_screen: win_scn,
      game_over_screen: gm_ovr_scn,
      can_w: 900,
      can_h: 500,
      eng_map:      EngQWERTYKeyMap.getKeyMap(),
      dev_arr:      {"RUSS": new RussKeyBoard("russ_", EngQWERTYKeyMap.getKeyMap()) },
      key_devs:     ["RUSS"],//ie keyboards for which to insert a display keyboard
      key_devs_dis_ids: ["keyboard_dis"],
      xp_value: 10,
      rand_order:   true
      };
                 
                 /* TEMPLATE SCREENS*/
  st_scn = "<div class='generic_gm_scn'> <h1> Test Template Game </h1>"
         + "<input type='button' value='start' "
         + "onclick='get_app_c().start_game();'></div>";

  win_scn = "<div class='generic_gm_scn'> <h1> You Won! </h1>"
          + "<input type='button' value='done' "
          + "onclick='get_app_c().end_game();'></div>";

  gm_ovr_scn = "<div class='generic_gm_scn'> <h1> game over </h1>"
             + "<input type='button' value='end' "
             + "onclick='get_app_c().end_game();'></div>";

         
  //game config obj passed to app controller
  app_configs['test_template_game'] = {
      profile_id:   "profile_el",
      prompt_el:    document.getElementById("prompt_el"),
      output_el:    document.getElementById("output_el"),
      score_el:     document.getElementById("score_el"),
      game_el:      document.getElementById("game_area"),
      q_type_el:    document.getElementById("ans_type_display"),
      footer_id:    "footer_el",
      live_img_src: "imgs/common/live_ans_dis_a.png",
      full_img_src: "imgs/common/full_ans_dis_a.png",
      start_screen: st_scn,
      win_screen: win_scn,
      game_over_screen: gm_ovr_scn,
      can_w: 1000,
      can_h: 410,
      eng_map:      EngQWERTYKeyMap.getKeyMap(),
      dev_arr:      {"RUSS": new RussKeyBoard("russ_", EngQWERTYKeyMap.getKeyMap()) },
      key_devs:     ["RUSS"],//ie keyboards for which to insert a display keyboard
      key_devs_dis_ids: ["keyboard_dis"],
      xp_value: 10,
      rand_order:   true
      };
      
  export {get_curr_game_configs};