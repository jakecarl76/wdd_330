/******************************************************************************************************
********************************************************************************************************
********************************************************************************************************
*********---**|***|**|---***|---**|---***|*************|*****|****|---***|---*****|*****|---***|---*****
********|***|**|*|***|***|**|*****|***|**|************|*****|*|***|***|**|*******|*|****|***|**|********
*******|********|****|***|**|*****|***|***|**********|******|*|***|***|**|*******|*|****|***|**|********
*******|********|****|--|***|--***|---*****|****|***|******|***|**|---***|--****|***|***|---***|--******
********|***|***|****|****|*|*****|*|********|*|*|*|*******|---|**|*|****|******|---|***|*|****|********
*********---****|****|---|**|---**|**|********|***|*******|*****|*|**|***|*****|*****|**|**|***|---*****
********************************************************************************************************
********************************************************************************************************
********************************************************************************************************/
//////////////////GAME CONTROLLER///////////////////////////////////
//func list:
//init()
//start()
//set_start_screen(html)
//set_win_screen(html)
//set_game_over_screen(html)
//wrap_up()
//level_up_user()
//instant_level_up()
//get_repeat()
//get_canvas_img()
//set_canvas_img(px_helper)
//set_game_el(el)
//set_score_display_el(el)
//engine_cycle()*
//check_clocks()
//update_func_1()*
//update_func_2()*
//is_busy()
//is_paused()
//toggle_pause()
//add_points(points)
//update_score()
//* -> indicates functions where most customization will be done.
    //controls the game
  class GameController
  {
    constructor(can_w = 400, can_h = 400, xp_value_default = 5, game_el = null, score_el = null, user_storage_obj = null, parent_obj = null)
    {
      this.game_name = "Testing Template Game";
      this.parent_app_obj = parent_obj;//ref to app controller
      this.user_ref = user_storage_obj; //profile manager. can be used for game info, mainly used for level up
      this.score = 0;//working value, game eninge can manipulate as a resource for game
      this.total_score = 0;//totlal points earned (no negative)
      this.actual_score = 0;//actualy how they are performing (includes negative points)
      this.xp_pts = 0;//xp well for when levelling up user
      this.xp_value = xp_value_default;
      
      this.game_el = game_el;
      this.score_display_el = score_el;
      
      this.busy = true;
      this.paused = false;
      
      this.canvas_w = can_w;
      this.canvas_h = can_h;
      this.canvas = null;
      this.ctxt = null; //canvas context 2D obj
      
      this.canv_objs = [];//array of items that need to be added to canvas
      this.player = null;
      
      this.game_clocks = [];//timers for certain updates
      this.game_ticks = []; //current time or ticks until update func run
      this.game_updates = [];//the update funcs
      this.game_rpm = 100;//default game update 100ms
      this.game_engine = null;
      this.start_screen = "";
      this.win_screen = "";
      this.game_over_screen = "";
      this.repeat = false;//ie keep running though questions list *** -> game options will affect!!!
                          //once list is done app controller calls the wrap_up func
                          //can have wrap up func ask if keep playing? if so can
                          //call parent app controller to run the q's again
      this.game_won = false;
      this.level_up_ref = null;//for level up function
      this.score_shown_ref = false;
      
      //game function stuff
      this.computer_pool = 0;//computer 'score' equivalent
      this.computer_bit_level = 0;
      this.player_bit_level = 0;
      this.computer_model = 0;//character model
      this.player_code_img = null;
      this.computer_code_img = null;
      
      this.player_display_pain = 0;  //how long to display pain sprites
      this.computer_display_pain = 0; //acts like clock, count down till zero (then normal again)
      
      this.player_curr_code_row = 0;//track where bits show up in code column
      this.player_curr_code_col = 0;//track where bits show up in code column
      this.computer_curr_code_row = 0;//track where bits show up in code column
      this.computer_curr_code_col = 0;//track where bits show up in code column
      this.max_rows = 350;
      this.max_cols = 28;
      
      this.player_num_bits = 0;
      this.computer_num_bits = 0;
      this.player_bits_buffer = 0;//bits to be written on update
      this.computer_bits_buffer = 0;//bits to be written on update
      
      //Difficulty level stuff >> 0=easy
      this.d_lvl = 0;
      this.computer_floor = 0;//computer hit = floor + rand() * skill > thresh
      this.computer_skill = 10;
      this.computer_threshold = 3;
      
      
      //update funcs --> user and computer
      //create the thing to put out px dots
        //save each full row? would look cool
      
      
    }//END CONSTRUCTOR FUNC
    
    //game eninge runs, updates game
      //every interval runs check func
        //check func updates and checks clock arr.
        
        //clock arr [time1][time2][time-n]
        //obj arr   [obj1] [obj2] [obj n]
        //each obj has an update func that updates its thing (player, monster, etc)
        //also will hav ref in canv_objs arr, have a diff func-> draw
    init()
    {    
      //create and insert canvas obj
      this.canvas = document.createElement("CANVAS");
      this.canvas.width = this.canvas_w;
      this.canvas.height = this.canvas_h;
      //this.game_el.appendChild(this.canvas);
      //get 2d context
      this.ctxt = this.canvas.getContext("2d");
      
      //create code imgs
      this.player_code_img = this.get_canvas_img();
      this.computer_code_img = this.get_canvas_img();
      
      
      //set self ref
      let self = this;
      
      //set the game clocks/ticks
      //game computer's typing clock depends on the hardness level default should be faster than pool withdraw
      this.game_clocks = [1000, 800];
      this.game_ticks = [1000, 800];
      this.game_updates = [
        function(){self.update_func_1();},//pool update
        function(){self.update_func_2();},//computer input
        
      ];
      
      //show start screen
      this.game_el.innerHTML = this.start_screen;
    }//END GAME CONTROLLER INIT FUNC
    
    start()
    {
      //set game el
      this.game_el.innerHTML = "";
      this.game_el.appendChild(this.canvas);
      //set interval
      let self = this;
      this.game_engine = setInterval(function(){self.engine_cycle();}, this.game_rpm);
      this.busy = false;
      
      
    }
    
    set_start_screen(html)
    {
      this.start_screen = html;
    }
    
    set_win_screen(html)
    {
      this.win_screen = html;
    }
    
    set_game_over_screen(html)
    {
      this.game_over_screen = html;
    }
    
    //function bridges end of game and win screen (ie when out of questions)
    wrap_up()
    {
      let self = this;
      //Perform any wrap-up stuff
      this.busy = true;//lock game input
      //set to end screen
      //this.game_el.innerHTML = this.win_screen;
      
      //stop game engine
      //check/set scores for list in user's profile
      this.xp_pts = this.score + this.actual_score;
      
      //check win condition:
      //must get 75% right (75% of total score )
      //in reality, this isn't quite right as some questions could be guessed wrong
      //so many times they are skipped, but since we allow multiple answers figuring
      //out at the beginning what the correct score is to judge this is not quite straight forward.
      let win_score = this.total_score * 0.75;
      if(this.actual_score >= win_score)
      {
        //add bonus
        this.total_score += 100;
        this.xp_pts += 100;
        this.game_won = true;
      }
      
      clearInterval(this.game_engine);
      //set up level-up screen skip listener on canvas
      this.canvas.addEventListener("click",
                                   function()
                                   {
                                     self.instant_level_up();
                                   });
      
      //start level up screen process
      this.score_shown_ref = false;
      this.game_engine = setInterval(function()
                                     {
                                       self.level_up_user();
                                     },
                                     50);
    }//END WRAP UP FUNC
    
    
    level_up_user()
    {  
      //check xp well
      if(this.xp_pts > 0 || !this.score_shown_ref)
      {
        this.score_shown_ref = true;
        //clear canvas
        this.ctxt.clearRect(0, 0, this.canvas_w, this.canvas_h);
        
        let lvl_up = false;
        let tmp_user = this.user_ref.user_data_obj;
        
        //subtract x
        if(this.xp_pts > 1000 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 100;
        
          //add 1 xp to user
          tmp_user.user_xp += 100;
        }
        if(this.xp_pts > 200 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 20;
        
          //add 1 xp to user
          tmp_user.user_xp += 20;
        }
        if(this.xp_pts > 100 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 10;
        
          //add 1 xp to user
          tmp_user.user_xp += 10;
        }
        if(this.xp_pts > 40 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 5;
        
          //add 1 xp to user
          tmp_user.user_xp += 5;
        }
        else
        {//final 10 pts
          this.xp_pts -= this.xp_value;
        
          //add 1 xp to user
          tmp_user.user_xp += 1;
        }
        
        if(this.xp_pts < 0)
        {
          this.xp_pts = 0;
        }
        
        //DVDVDVDVDV
        //if sound settings:
        //play sound
        
        //check level up
        if(tmp_user.user_xp >= tmp_user.user_next_lvl)
        {
          lvl_up = true;
          //inc level
          tmp_user.user_level++;
          //subtract old xp
          tmp_user.user_xp -= tmp_user.user_next_lvl;
          //calc new xp amnt
          tmp_user.user_next_lvl = Math.floor(tmp_user.user_next_lvl * 2.7);
                    
          //DVDVDVDVDV
          //if sound settings:
          //play sound
        }//END IF LEVELUP
        
        //update canvas with info
        //cacl 15% mark of canvas to align
        let x = Math.floor(this.canvas_w * 0.15);
        let y = 40;
        this.ctxt.font = "30px 'Press Start 2P'";
        this.ctxt.fillStyle = "#ddf"
         //display total score
        this.ctxt.fillText("Total Score: " + this.total_score, x, y);
        y += 50;
        
        //display user name
        this.ctxt.fillText(tmp_user.user_name, x, y);
        y += 50;
        
        //display user level
        this.ctxt.fillStyle = "#f90";
        this.ctxt.fillText("Level: " + tmp_user.user_level, x, y);
        y += 50;
        
        //show xp_pts left
        this.ctxt.fillStyle = "#08f";
        this.ctxt.fillText("Points Left: " + this.score, x, y);
        y += 50;
        
        //show xp_pts left
        this.ctxt.fillStyle = "#08f";
        this.ctxt.fillText("Full Score: " + this.actual_score, x, y);
        
        y += 15;
        //bar
        //figure out bar specs
        let bar_st = Math.floor(this.canvas_w * 0.05);
        let bar_end = Math.floor(this.canvas_w * 0.95);
        let bar_full = bar_end - bar_st;
        
        //calc bar width %
        let xp_bar = (tmp_user.user_xp / tmp_user.user_next_lvl);
        
        let level_percent = xp_bar * 100;
        
        //configure bar color
        let bar_color = "#f20"
        if(level_percent > 10 && level_percent < 30)
        {
          bar_color = "#f90";
        }
        else if(level_percent >= 30 && level_percent < 40)
        {
          bar_color = "#df0";
        }
        else if(level_percent >= 40 && level_percent < 60)
        {
          bar_color = "#4f4";
        }
        else if(level_percent >= 60 && level_percent < 90)
        {
          bar_color = "#08f";
        }
        else if(level_percent >= 90)
        {
          bar_color = "#ddf";
        }
        
        //calc bar width
        xp_bar = Math.floor(xp_bar * bar_full);
        
        //draw bar outline/box
        this.ctxt.strokeStyle = "#ddf";
        this.ctxt.strokeRect(bar_st, y, bar_end - bar_st, 15);
        //draw xp bar
        this.ctxt.fillStyle = bar_color;
        this.ctxt.fillRect(bar_st, y, xp_bar, 15);
        y += 60;

        //user_xp/next_level
        this.ctxt.fillStyle = "#df0";
        this.ctxt.fillText("xp: " + tmp_user.user_xp + "/" + tmp_user.user_next_lvl, x, y);
        y+= 50;
        
        //show xp_pts left
        this.ctxt.fillStyle = "#08f";
        this.ctxt.fillText("xp Earned: " + this.xp_pts, x, y);
      }//END IF XP_PTS LEFT
      else
      {
        //unset interval, 
        clearInterval(this.game_engine);
        //update scores for list
        let tmp_lst_num = this.parent_app_obj.get_list()
        
        //check high score
        if(this.user_ref.user_data_obj.high_scores[tmp_lst_num] < this.total_score)
        {
          //update total score and totals score game
          this.user_ref.user_data_obj.high_scores[tmp_lst_num] = this.total_score;
          this.user_ref.user_data_obj.high_score_game[tmp_lst_num] = this.game_name;
        }
        //update last score and last score game
        this.user_ref.user_data_obj.last_scores[tmp_lst_num] = this.total_score;
        this.user_ref.user_data_obj.last_score_game[tmp_lst_num] = this.game_name;
        
        //save user data
        this.user_ref.get_user_storage_obj().save_curr_user();
        //reset user profile insert, set end game screen
        this.user_ref.update_profile_el();
        
        let x = Math.floor(this.canvas_w * 0.25);
        let y = 405;
        
        //show xp_pts left
        this.ctxt.fillStyle = "#ddf";
        this.ctxt.fillText("[click here to continue]", x, y);
        
        let self = this;
        
        //remove skip listener via replacing canvas
        let tmp_img = this.get_canvas_img();
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.canvas_w;
        this.canvas.height = this.canvas_h;
        this.ctxt = this.canvas.getContext("2d");
        this.set_canvas_img(tmp_img);
        this.game_el.innerHTML = "";
        this.game_el.appendChild(this.canvas);
        
        //add continue listener
        let tmp_func = this.continue_func;
        
        this.canvas.addEventListener("click",
                                     function()
                                     {
                                        //remove continue listener when replace el with game screen end
                                        if(self.game_won)
                                        {
                                          self.game_el.innerHTML = self.win_screen;
                                        }
                                        else
                                        {
                                          self.game_el.innerHTML = self.game_over_screen;
                                        }
                                     });
        //load end screen
      }
    }//END LEVE UP FUNC
    
    instant_level_up()
    {
      //forloop levelupuser func until score zero
      //while still score
      while(this.xp_pts > 0)
      {
        //do level up func
        this.level_up_user();
      }
      
      //do once more
      this.level_up_user();
    }//END INSTANT LEVEL UP FUNC
    
    
    get_repeat()
    {
      return this.repeat;
    }
    
    //returns a px_helper obj
    get_canvas_img()
    {
      let tmp_img_dat = this.ctxt.getImageData(0, 0, this.canvas.width, this.canvas.height);
      return get_px_helper(tmp_img_dat);
    }
    
    //requires and uses a px_helper obj to update the canvas
    set_canvas_img(px_helper)
    {
      
      this.ctxt.putImageData(px_helper.get_ref(), 0, 0);
    }
    set_game_el(el)
    {
      this.game_el = el;
    }
    set_score_display_el(el)
    {
      this.score_display_el = el;
    }
    
    //game engine funcs
    
    add_code_col(code_img, code_col_x, code_col_y, shift_x, shift_y)
    {
      //shift
      //need to copy to new px img
      let img_copy = code_img.get_copy();
      
      //figure out start/end for x/y
      let st_x = shift_x;
      let st_y = shift_y;
      let end_x = this.canvas_w + shift_x;
      let end_y = this.canvas_h + shift_y;
      
      //check limits
      if(st_x < 0)
      {
        st_x = 0;
      }
      if(st_y < 0)
      {
        st_y = 0;
      }
      if(end_x > this.canvas_w)
      {
        end_x = this.canvas_w;
      }
      if(end_y > this.canvas_h)
      {
        end_y = this.canvas_h;
      }
      
      //loop and copy
      for(let i = st_x; i < end_x; i++)
      {
        for(let j = st_y; j < end_y; j++)
        {
          code_img.set_px(i + shift_x, j + shift_y, img_copy.get_px(i, j));
        }
      }
      
      //add new code col
      //remember to add on padding around bits -> cols + 10, rows + 10
      let end_col = code_col_x + 10 + this.max_cols;
      let end_row = code_col_y + 10 + this.max_rows;
      
      for(let i = code_col_x; i < end_col; i++)
      {
        for(let j = code_col_y; j < end_row; j++)
        {
          code_img.set_px(i, j, [0,0,0,255]);
        }
      }
    }//END FUNC ADD CODE COL
    
    write_new_bits(player, num_bits)
    {
      //get row/col placement and img
      let tmp_row = 0;
      let tmp_col = 0;
      let tmp_img = null;
      let st_x = 0;
      let st_y = 0;
      let shift_x = 0;
      let shift_y = 0;
      
      if(player == "player")
      {
        tmp_row = this.player_curr_code_row;
        tmp_col = this.player_curr_code_col;
        tmp_img = this.player_code_img;
        st_x = 145;
        st_y = 50;
        shift_x = -10;
        shift_y = -5;
      }
      else
      {//computer
        tmp_row = this.computer_curr_code_row;
        tmp_col = this.computer_curr_code_col;
        tmp_img = this.computer_code_img;
        st_x = 717;
        st_y = 50;
        shift_x = 10;
        shift_y = -5;
      }
      
      //bit starting points (cold col has padding around bits
      let bit_st_x = st_x + 5;
      let bit_st_y = st_y + 5;
      
      //write each bit
      for(let i = 0; i < num_bits; i++)
      {
        //check if need to add new col
        if(tmp_row <= 0 && tmp_col <= 0)
        {
          //create new col
          this.add_code_col(tmp_img, st_x, st_y, shift_x, shift_y)
          
          //update column/row
          tmp_row = this.max_rows;
          tmp_col = this.max_cols;
        }
        
        //add bit
        //calc color/make tmp px
        let g = Math.floor(Math.random() * 250);
        tmp_px = [0, g, 0, 255];
        //calc x/y
        let x = st_x + 5 + (this.max_cols - tmp_col);
        let y = st_y + 5 + (this.max_rows - tmp_row);
        
        tmp_img.set_px(x, y, tmp_px);
        
        //update col (--)
        tmp_col--;
        //check/update col/row
        if(tmp_col < 0)
        {
          //col = max;
          tmp_col = this.max_cols;
          //row--
          tmp_row--;
          //check row
          if(tmp_row < 0)
          {
            tmp_row = this.max_rows;
          }
        }
      }//end for each bit to write
      
      //update player stats
      if(player == "player")
      {
        this.player_curr_code_row = tmp_row;
        this.player_curr_code_col = tmp_col;
      }
      else
      {
        this.computer_curr_code_row = tmp_row;
        this.computer_curr_code_col = tmp_col;
      }
    }//END FUNC Write NEW BITS
    
    build_buffer_hubs()
    {
      //player buffer level bar
      let tmp_bar_lvl = 0;
      if(this.score >= 0)
      {
        tmp_bar_lvl = this.score - (10 * this.player_bit_level);
      }
      else
      {//calculate critical level
        tmp_bar_lvl = Math.abs(Math.floor(this.score / 10));
      }
      //fill background for bar hub
      
      
      //player buffer level text
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(0, 445, this.canvas_w, 55);
      
      //draw markers, if less <= tmp_bar_lvl -> highlighted color
      //for each marker
      for(let i = 1; i < 11; i++)
      {
        //start x
        let tmp_x = (i * 32) + 100;
        if(this.score >= 0)
        {
          if(tmp_bar_lvl > i)
          {
            this.ctxt.fillStyle = "#4f4";
          }
          else
          {
            this.ctxt.fillStyle = "#df0";
          }
        }
        else
        {
          if(tmp_bar_lvl > i)
          {
            this.ctxt.fillStyle = "#f20";
          }
          else
          {
            this.ctxt.fillStyle = "#f90";
          }
        }
        
        this.ctxt.fillRect(tmp_x , 450, 27, 45);
      }
        
        this.ctxt.fillStyle = "#aaa";
        this.ctxt.fillRect(450 , 450, 5, 45);
      
      this.ctxt.font = "10px 'Press Start 2P'";
      this.ctxt.fillStyle = "#ddf";
      this.ctxt.fillText("Buffer" , 10, 460);
      this.ctxt.fillText("Level", 15, 475);
      this.ctxt.fillText(this.player_bit_level, 35, 490);
      
      //display buffer error if score negative
      if(this.score < 0)
      {
        this.ctxt.font = "20px 'Press Start 2P'";
        this.ctxt.fillText("BUFFER ERROR!", 170, 485);
      }
      
      
      //computer buffer level bar
      if(this.computer_pool >= 0)
      {
        tmp_bar_lvl = this.computer_pool - (10 * this.computer_bit_level);
      }
      else
      {//calculate critical level
        tmp_bar_lvl = Math.abs(Math.floor(this.computer_pool / 10));
      }
      
      //draw markers, if less <= tmp_bar_lvl -> highlighted color
      //for each marker
      for(let i = 1; i < 11; i++)
      {
        //start x
        let tmp_x = (-i * 32) + 779;
        if(this.computer_pool >= 0)
        {
          if(tmp_bar_lvl > i)
          {
            this.ctxt.fillStyle = "#4f4";
          }
          else
          {
            this.ctxt.fillStyle = "#df0";
          }
        }
        else
        {
          if(tmp_bar_lvl > i)
          {
            this.ctxt.fillStyle = "#f20";
          }
          else
          {
            this.ctxt.fillStyle = "#f90";
          }
        }
        
        this.ctxt.fillRect(tmp_x , 450, 27, 45);
      }
        
      
      this.ctxt.font = "10px 'Press Start 2P'";
      this.ctxt.fillStyle = "#ddf";
      this.ctxt.fillText("Buffer" , 820, 460);
      this.ctxt.fillText("Level", 825, 475);
      this.ctxt.fillText(this.computer_bit_level, 845, 490);
      
      //display buffer error if score negative
      if(this.computer_pool < 0)
      {
        this.ctxt.font = "20px 'Press Start 2P'";
        this.ctxt.fillText("BUFFER ERROR!", 500, 485);
      }
      
      
    }//END BUILD BUFFER HUBS
    
    engine_cycle()
    { 
      //clear canvas
      this.ctxt.clearRect(0, 0, this.canvas_w, this.canvas_h);
      //get blank img to draw on
      let tmp_img = this.get_canvas_img();
      
      //check/update pain sprite model clocks/ticks
      if(this.player_display_pain > 0)
      {
        this.player_display_pain--;
      }
      if(this.computer_display_pain > 0)
      {
        this.computer_display_pain--;
      }
      
      
      //overlay background img
      //DDDDDDDDDDDDDDDDDDDDDDVDVDVDVDVDVDVDVDVDVVDVDVDV
      
      //DVDVDVDVDV testing:
      //this.score--;
      //this.computer_pool--;
      
      
      //write any new bits
      //player
      this.write_new_bits("player", this.player_bits_buffer);
      //update bits tracker
      this.player_num_bits += this.player_bits_buffer;
      this.player_bits_buffer = 0;
      
      //computer
      this.write_new_bits("computer", this.computer_bits_buffer);
      //update bits tracker
      this.computer_num_bits += this.computer_bits_buffer;
      this.computer_bits_buffer = 0;
      
      
      //add new squares if code squares are full
      //code row -> 28 px long, col-> 350px high
      //test add to robo img 
      
      
      tmp_img.overlay_px_helper(this.player_code_img);
      tmp_img.overlay_px_helper(this.computer_code_img);
      
      
      //overlay characters/etc
      //dvdvdvdvdvdvd
      //which char model?
      //is in pain?
      //is 'dead'?
      
      
      
      //update img
      this.set_canvas_img(tmp_img);
      
      
      //overlay hub
      
      this.build_buffer_hubs();
      
      //check for fail for player (score too negative)
      if(this.score < 0)
      {
        let tmp_buff_err = Math.abs(Math.floor(this.score / 10));
        if(tmp_buff_err > 11)
        {
          //DVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDDVDVDVDVDVDVDVDVDVDVDVDVDVDVDV
          //func to show failed, end game
        }
      }
      
      //check for fail for computer (score too negative)
      if(this.computer_pool < 0)
      {
        let tmp_buff_err = Math.abs(Math.floor(this.computer_pool / 10));
        if(tmp_buff_err > 11)
        {
          //DVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDVDDVDVDVDVDVDVDVDVDVDVDVDVDVDVDV
          //func to show failed, game doesn't end until player wins
        }
      }
      this.check_clocks();
    }//END FUNC ENGINE CYCLE
    
    check_clocks()
    {
      for(let i = 0; i < this.game_clocks.length; i++)
      {
        //update
        this.game_ticks[i] -= this.game_rpm;
        //check
        if(this.game_ticks[i] <= 0)
        {
          //run func
          this.game_updates[i]();
          //reset clock
          this.game_ticks[i] = this.game_clocks[i];
        }
      }
    }//END FUNC CHECK CLOCKS
    
    check_bit_level_player()
    {
      let tmp_level = Math.floor(this.score / 10);
      if(tmp_level > 14)
      {
        tmp_level = 14;
      }
      else if(tmp_level < 0)
      {
        tmp_level = 0;
      }
      
      this.player_bit_level = tmp_level;
    }
    
    check_bit_level_computer()
    {
      let tmp_level = Math.floor(this.computer_pool / 10);
      if(tmp_level > 14)
      {
        tmp_level = 14;
      }
      else if(tmp_level < 0)
      {
        tmp_level = 0;
      }
      
      this.computer_bit_level = tmp_level;
    }
    
    update_func_1() //adjust pools
    {
      //check on pools/subtract from score and send to bit buffer
      //check for player
      if(this.score > 0)
      {
        this.score--;
        this.player_bits_buffer += Math.pow(2, this.player_bit_level);
      }
      this.check_bit_level_player();//update bit level
      
      //check for computer
      if(this.computer_pool > 0)
      {
        this.computer_pool--;
        this.computer_bits_buffer += Math.pow(2, this.computer_bit_level);
      }
      this.check_bit_level_computer();//update bit level
      
      //update score
      this.update_score();
    }//END UPDATE FUNC 1
    update_func_2() //computer hit
    {
      //computer 'types' every time this func runs
      //calc if computer got a hit or a miss
      let hit_score = this.computer_floor + (Math.random() * this.computer_skill);
      if(hit_score >= this.computer_threshold)
      {
        this.computer_pool++;
      }
      else
      {
        this.computer_pool--;
      }
      console.log("computer hit score: " + hit_score);
    
      //update bitlevels
      this.check_bit_level_computer();
    }//END UPDATE FUNC 2
    is_busy()
    {
      return this.busy;
    }
    
    is_paused()
    {
      return this.paused;
    }
    
    toggle_pause()
    {
      this.paused = !this.paused;
      console.log(this.paused);
      if(this.paused)
      {
        //stop game
        clearInterval(this.game_engine);
        //display paused
        this.game_el.classList.toggle("paused");
        if(this.game_el.classList.contains("unpaused"))
        {
          this.game_el.classList.remove("unpaused")
        }
      }
      else
      {
        //resume game
        //set interval
        this.start();
        //display not paused
        this.game_el.classList.toggle("paused");
        this.game_el.classList.add("unpaused");
      }
    }
    
    add_points(points)
    {
      //avoid addition of non numbers
      if(isNaN(points))
      {
        return;
      }
      //update actual score
      this.actual_score += points;
      if(points < 0)
      {//negative points
        this.score += points;
        //set pain since made mistake
        this.player_display_pain = 60;
      }
      else if(points > 0)
      {//positive points
        this.score += points;
        this.total_score += points;
      }
      //else do nothing: 0 points -> backspace, typing full answer, etc
      
      this.update_score();
      
      //update bit levels
      this.check_bit_level_player();
    }//END FUNC ADD POINTS
    
    update_score()
    {//DVDVDVDVDVDV
      this.score_display_el.innerHTML = "<div>SCORE: " + this.score + "</div> <div> TOTAL SCORE: "
                             + this.total_score + "</div>";
    }
  }//END GAME CONTROLLER CLASS
  
  export {GameController};
  