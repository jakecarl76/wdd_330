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
      this.repeat = true;//ie keep running though questions list *** -> game options will affect!!!
                          //once list is done app controller calls the wrap_up func
                          //can have wrap up func ask if keep playing? if so can
                          //call parent app controller to run the q's again
      this.game_won = false;
      this.level_up_ref = null;//for level up function
      this.game_type = "score";
      this.max_score = 500;//default win score
      this.num_repeats = -1;
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
      this.player_is_dead = false;
      this.computer_is_dead = false;
      this.death_flash = 0;//death animation stuff
      this.death_flash_accel = 0;
      this.game_over_clock = 0;
      this.game_over_click = false;
      
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
      
      //img resources
      this.img_bg = new Image();
      this.img_bg.src = "imgs/games/cyber_warfare/cyber_space_bg.png";
      this.img_mg = new Image();
      this.img_mg.src = "imgs/games/cyber_warfare/cyber_mid_ground_props.png";
      this.img_player_norm_left = new Image();
      this.img_player_norm_left.src = "imgs/games/cyber_warfare/player_normal.png";
      this.img_player_pain_left = new Image();
      this.img_player_pain_left.src = "imgs/games/cyber_warfare/player_pain.png";
      this.img_player_dead_left = new Image();
      this.img_player_dead_left.src = "imgs/games/cyber_warfare/player_dead.png";
      
      this.img_player_norm_right = new Image();
      this.img_player_norm_right.src = "imgs/games/cyber_warfare/player_normal_right.png";
      this.img_player_pain_right = new Image();
      this.img_player_pain_right.src = "imgs/games/cyber_warfare/player_pain_right.png";
      this.img_player_dead_right = new Image();
      this.img_player_dead_right.src = "imgs/games/cyber_warfare/player_dead_right.png";
      
      //audio
      this.sound1 = document.createElement("audio");
      this.sound1_src = document.createElement("source");
      this.sound1.appendChild(this.sound1_src);
      this.sound1_src.src = "audio/wrong_answer.mp3";
      
      this.sound2 = document.createElement("audio");
      this.sound2_src = document.createElement("source");
      this.sound2.appendChild(this.sound2_src);
      this.sound2_src.src = "audio/robo_screem_1.mp3";
      
      this.sound3 = document.createElement("audio");
      this.sound3_src = document.createElement("source");
      this.sound3.appendChild(this.sound3_src);
      this.sound3_src.src = "audio/robo_screem_2.mp3";
      
      this.sound4 = document.createElement("audio");
      this.sound4_src = document.createElement("source");
      this.sound4.appendChild(this.sound4_src);
      this.sound4_src.src = "audio/upgrade1.mp3";
      
      this.sound5 = document.createElement("audio");
      this.sound5_src = document.createElement("source");
      this.sound5.appendChild(this.sound5_src);
      this.sound5_src.src = "audio/upgrade2.mp3";
      
      this.sound6 = document.createElement("audio");
      this.sound6_src = document.createElement("source");
      this.sound6.appendChild(this.sound6_src);
      this.sound6_src.src = "audio/upgrade3.mp3";
      
      this.sound7 = document.createElement("audio");
      this.sound7_src = document.createElement("source");
      this.sound7.appendChild(this.sound7_src);
      this.sound7_src.src = "audio/upgrade4.mp3";
      
      this.sound8 = document.createElement("audio");
      this.sound8_src = document.createElement("source");
      this.sound8.appendChild(this.sound8_src);
      this.sound8_src.src = "audio/level_up.mp3";
      
      this.sound9 = document.createElement("audio");
      this.sound9_src = document.createElement("source");
      this.sound9.appendChild(this.sound9_src);
      this.sound9_src.src = "audio/score_tally_a.mp3";
      
      
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
      this.game_clocks = [1000, 500];
      this.game_ticks = [1000, 500];
      this.game_updates = [
        function(){self.update_func_1();},//pool update
        function(){self.update_func_2();},//computer input
        
      ];
      
      //show start screen
      this.display_start_screen();
      
    }//END GAME CONTROLLER INIT FUNC
    
    reset()
    {
      this.game_won = false;
      this.num_repeats = -1;
      this.score_shown_ref = false;
      this.game_over_click = false;
      this.game_over_clock = 0;
      this.player_bit_level = 0;
      this.computer_bit_level = 0;
      this.player_num_bits = 0;
      this.player_bits_buffer = 0;
      this.computer_bits_buffer = 0;
      this.computer_num_bits = 0;
      this.player_curr_code_row = 0;
      this.player_curr_code_col = 0;
      this.computer_curr_code_row = 0;
      this.computer_curr_code_col = 0;
      this.player_is_dead = false;
      this.computer_is_dead = false;
      this.computer_pool = 0;
      this.repeat = true;
      this.score = 0;
      this.total_score = 0;
      this.actual_score = 0;
      this.xp_pts = 0;
      
      //reset canvas
      this.canvas = document.createElement("CANVAS");
      this.canvas.width = this.canvas_w;
      this.canvas.height = this.canvas_h;
      //this.game_el.appendChild(this.canvas);
      //get 2d context
      this.ctxt = this.canvas.getContext("2d");
      
      //create code imgs
      this.player_code_img = this.get_canvas_img();
      this.computer_code_img = this.get_canvas_img();
    }
    start()
    {
      //set game el
      this.game_el.innerHTML = "";
      this.game_el.appendChild(this.canvas);
      
      //set based on settings/difficulty:
      if(this.d_lvl == 0)
      {
        this.game_clocks[1] = 500;
        this.computer_floor = 0;
        this.computer_skill = 10;
        this.computer_threshold = 5;
      }
      else if(this.d_lvl == 1)
      {
        this.game_clocks[1] = 500;
        this.computer_floor = 2;
        this.computer_skill = 10;
        this.computer_threshold = 5;
      }
      else if(this.d_lvl == 2)
      {
        this.game_clocks[1] = 400;
        this.computer_floor = 3;
        this.computer_skill = 10;
        this.computer_threshold = 5;
      }
      else if(this.d_lvl == 3)
      {
        this.game_clocks[1] = 400;
        this.computer_floor = 4;
        this.computer_skill = 10;
        this.computer_threshold = 5;
      }
      else if(this.d_lvl == 4)
      {
        this.game_clocks[1] = 250;
        this.computer_floor = 4;
        this.computer_skill = 10;
        this.computer_threshold = 5;
      }
      
      this.repeat = true;
      
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
    
    display_start_screen()
    {
      this.game_el.innerHTML = this.start_screen;
    }
    display_game_over_screen()
    {
      this.game_el.innerHTML = this.game_over_screen;
    }
    display_win_screen()
    {
      this.game_el.innerHTML = this.win_screen;
    }
    
    list_completed()
    {
      this.num_repeats--;
    }
    //function bridges end of game and win screen (ie when out of questions)
    
    check_win_conditions()
    {
      if(this.game_type == "score")
      {//score based game calls its own wrap up
        if(this.player_num_bits > this.max_score || this.computer_num_bits > this.max_score)
        {
          this.wrap_up();
        }
      }
      else if (this.num_repeats <= 0)
      {//game_end based on list repeats (app_controller calls wrap up when list done)
        //only need to tell app controller not repeating after repeats fulfilled.
        this.repeat = false;
      }
    }
    
    wrap_up()
    {  
      let self = this;
      //lock game input
      this.busy = true;
      //stop game engine
      clearInterval(this.game_engine);
      
      
      //will call correct wrap up function
      //if player dead -> lose screen or level up player immediately
      if (this.player_is_dead)
      {
        //Perform any wrap-up stuff
        //set to end screen
        //set loosing score xp (incorporates act_score so negative points do hurt!)
        this.xp_pts = this.score + this.player_num_bits + this.actual_score;
        
        //add pointer class
        this.canvas.classList.add("cursor_ptr");
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
        return;//skip calling tally func etc
      }//END IF LOSSING SCORE STUFF
      
      //set up tally func
      //create obj to track score tally
      this.tally_obj = {};
      //frame number to easily adjust how long tally runs
      this.tally_obj.frames = 20;
      this.tally_obj.max_bar = 400;
      //figure out max/min score for calcs
      this.tally_obj.max_score = this.player_num_bits;
      if(this.computer_num_bits > this.tally_obj.max_score)
      {
        this.tally_obj.max_score = this.computer_num_bits;
      }
      
      this.tally_obj.min_score = this.player_num_bits;
      if(this.computer_num_bits < this.tally_obj.min_score)
      {
        this.tally_obj.min_score = this.computer_num_bits;
      }
      
      //figure subtraction amount val
      this.tally_obj.tmp_val = Math.floor(this.tally_obj.min_score / this.tally_obj.frames);
      
      //check val value
      if(this.tally_obj.tmp_val <= 0)
      {
        this.tally_obj.tmp_val = 1;
      }
      
      //set up tmp scores
      this.tally_obj.tmp_player_score = this.player_num_bits;
      this.tally_obj.tmp_comp_score = this.computer_num_bits;
      this.tally_obj.tmp_player_pool = this.score;
      this.tally_obj.tmp_comp_pool = this.computer_pool;
      
      //set up wait times before calc-ing scores
      this.tally_obj.wait_1 = 25;
      this.tally_obj.wait_2 = 25;
      this.tally_obj.wait_3 = 25;
      this.tally_obj.wait_4 = 25;
      this.tally_obj.phase = 0;
      
      //call interval for talli func
      this.game_engine = setInterval(function()
                                     {
                                       self.score_compare_func();
                                     },
                                     50)
      //BOTH GAME TYPES >> go to tally screen
        //tally screen sets up bar for each player proportional to highest points
          //cacl pts, ie -> set tmp var = to num_bits, drop each by x (proportial to smallest)
          //until smallest at zero
          //then add on pool points (by protportinal amounts, last, when amount > pool, just add pool)
          //then recalc and redo points drop until one at zero -> loser, other is winner.          
      
      
      //after score tallied, then multiply by difficulty
    
      //this.game_el.innerHTML = this.win_screen;
      
    }//END WRAP UP FUNC
    
    //set up tally stuff
    score_compare_func()
    {
      //set bar heights
      //player
      let tmp_player_score_bar = this.tally_obj.tmp_player_score/this.tally_obj.max_score;
      tmp_player_score_bar *= this.tally_obj.max_bar;
      let tmp_player_pool_bar = this.tally_obj.tmp_player_pool/this.tally_obj.max_score;
      tmp_player_pool_bar *= this.tally_obj.max_bar;
      //computer
      let tmp_comp_score_bar = this.tally_obj.tmp_comp_score/this.tally_obj.max_score;
      tmp_comp_score_bar *= this.tally_obj.max_bar;
      let tmp_comp_pool_bar = this.tally_obj.tmp_comp_pool/this.tally_obj.max_score;
      tmp_comp_pool_bar *= this.tally_obj.max_bar;
      
      //clear canvas
      this.ctxt.clearRect(0, 0, this.canvas_w, this.canvas_h);
      
      
      //build page/draw bars etc
      this.ctxt.font = "10px 'Press Start 2P'";
      //player bars
      
      //main score bar
      //bg
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(200, 50, 50, this.tally_obj.max_bar);
      //score bar
      
      this.ctxt.fillStyle = "#4f4";
      //check for negative bar
      if(tmp_player_score_bar < 0)
      {
        tmp_player_score_bar *= -1;
        this.ctxt.fillStyle = "#f20";
      }
      
      //calc rect start draw y coordinate
      let tmp_height = this.tally_obj.max_bar - tmp_player_score_bar + 50;
      
      this.ctxt.fillRect(200, tmp_height, 50, tmp_player_score_bar);
    
      this.ctxt.fillStyle = "#ddf";
       //display total score
      this.ctxt.fillText("player" , 195, 465);
      this.ctxt.fillText("bits" , 205, 485);
      
      //pool score bar
      //bg
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(350, 50, 50, this.tally_obj.max_bar);
      
      this.ctxt.fillStyle = "#08f"
      //check for negative bar
      if(tmp_player_pool_bar < 0)
      {
        tmp_player_pool_bar *= -1;
        this.ctxt.fillStyle = "#f90";
      }
      
      //score bar
      tmp_height = this.tally_obj.max_bar - tmp_player_pool_bar + 50;
      this.ctxt.fillRect(350, tmp_height, 50, tmp_player_pool_bar);
      
      this.ctxt.fillStyle = "#ddf";
       //display total score
      this.ctxt.fillText("player" , 346, 465);
      this.ctxt.fillText("buffer" , 346, 485);
      
      
      
      
      
      //computer bars
      /*****************************/
      
      //build page/draw bars etc
      this.ctxt.font = "10px 'Press Start 2P'";
      //player bars
      
      //main score bar
      //bg
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(550, 50, 50, this.tally_obj.max_bar);
      //score bar
      this.ctxt.fillStyle = "#4f4";
      
      //check for negative bar
      if(tmp_comp_score_bar < 0)
      {
        tmp_comp_score_bar *= -1;
        this.ctxt.fillStyle = "#f20";
      }
      
      //calc bar y coordinate
      tmp_height = this.tally_obj.max_bar - tmp_comp_score_bar + 50;
      //draw bar
      this.ctxt.fillRect(550, tmp_height, 50, tmp_comp_score_bar);
    
      this.ctxt.fillStyle = "#ddf";
       //display total score
      this.ctxt.fillText("computer" , 537, 465);
      this.ctxt.fillText("bits" , 557, 485);
      
      //pool score bar
      //bg
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(700, 50, 50, this.tally_obj.max_bar);
      
      //pool bar
      this.ctxt.fillStyle = "#08f"
      //check for negative bar
      if(tmp_comp_pool_bar < 0)
      {
        tmp_comp_pool_bar *= -1;
        this.ctxt.fillStyle = "#f90";
      }
      
      //calc start draw y coord
      tmp_height = this.tally_obj.max_bar - tmp_comp_pool_bar + 50;
      this.ctxt.fillRect(700, tmp_height, 50, tmp_comp_pool_bar);
      
      this.ctxt.fillStyle = "#ddf"
       //display total score
      this.ctxt.fillText("computer" , 685, 465);
      this.ctxt.fillText("buffer" , 696, 485);
      
      
      
      
      
      /******************************/
      
      
      //do according to phase
      if(this.tally_obj.phase == 0)
      {
        this.tally_obj.wait_1--;
        if(this.tally_obj.wait_1 <= 0)
        {
          this.tally_obj.phase++;
        }
      }
      else if(this.tally_obj.phase == 1 || this.tally_obj.phase == 5)
      {
        this.play_sound(this.sound9, true);
        //lower each bar by tmp_val amount
        let tmp_amt = this.tally_obj.tmp_val;
        
        //check if ether are less that subtraction amt
        if(this.tally_obj.tmp_player_socore < this.tmp_comp_score)
        {
          if(tmp_amt > this.tally_obj.tmp_player_score)
          {
            tmp_amt = this.tally_obj.tmp_player_score;
          }
        }
        else
        {
          if(tmp_amt > this.tally_obj.tmp_comp_score)
          {
            tmp_amt = this.tally_obj.tmp_comp_score;
          }
        }
        
        //subtract from scores
        this.tally_obj.tmp_player_score -= tmp_amt;
        this.tally_obj.tmp_comp_score -= tmp_amt;
        
        //if one score at zero phase++
        if(this.tally_obj.tmp_player_score <= 0 || this.tally_obj.tmp_comp_score <= 0)
        {
          this.tally_obj.phase++;
        }
      }//END PHASE 1/5 (subtract from score)
      else if(this.tally_obj.phase == 2)
      {
        this.tally_obj.wait_2--;
        if(this.tally_obj.wait_2 <= 0)
        {
          this.tally_obj.phase++;
        }
      }
      else if(this.tally_obj.phase == 3)
      {//add to scores from pools
        //lower each bar by tmp_val amount
        this.play_sound(this.sound9, true);
        let tmp_amt = this.tally_obj.tmp_val;
        
        //check if ether are less that subtraction amt
        if(tmp_amt > Math.abs(this.tally_obj.tmp_player_pool)
           && this.tally_obj.tmp_player_pool != 0)
        {
          this.tally_obj.tmp_player_score += this.tally_obj.tmp_player_pool;
          this.tally_obj.tmp_player_pool = 0;
        }
        
        //check for computer
        if(tmp_amt > Math.abs(this.tally_obj.tmp_comp_pool) 
           && this.tally_obj.tmp_comp_pool != 0)
        {
          this.tally_obj.tmp_comp_score += this.tally_obj.tmp_comp_pool;
          this.tally_obj.tmp_comp_pool = 0;
        }
        
        //make sure tally doesn't drag on too long (for player pool)
        if(this.tally_obj.tmp_player_pool > 0
           && this.tally_obj.tmp_player_pool / tmp_amt > 50)
        {
          let tmp_2 = this.tally_obj.tmp_player_pool/10;
          this.tally_obj.tmp_player_pool -= tmp_2;
          this.tally_obj.tmp_player_score += tmp_2;
        }
        
        //make sure tally doesn't drag on too long (for computer pool)
        if(this.tally_obj.tmp_comp_pool > 0
           && this.tally_obj.tmp_comp_pool / tmp_amt > 50)
        {
          let tmp_2 = this.tally_obj.tmp_comp_pool/10;
          this.tally_obj.tmp_comp_pool -= tmp_2;
          this.tally_obj.tmp_comp_score += tmp_2;
        }
          
          
        //subtract from pool to add to scores only if pool to use
        if(this.tally_obj.tmp_player_pool > 0)
        {
          this.tally_obj.tmp_player_pool -= tmp_amt;
          this.tally_obj.tmp_player_score += tmp_amt;
        }
        else if(this.tally_obj.tmp_player_pool < 0)
        {
          this.tally_obj.tmp_player_pool += tmp_amt;
          this.tally_obj.tmp_player_score -= tmp_amt;
        
        }
        
        if(this.tally_obj.tmp_comp_pool > 0)
        {
          this.tally_obj.tmp_comp_pool -= tmp_amt;
          this.tally_obj.tmp_comp_score += tmp_amt;
        }
        else if(this.tally_obj.tmp_comp_pool < 0)
        {
          this.tally_obj.tmp_comp_pool += tmp_amt;
          this.tally_obj.tmp_comp_score -= tmp_amt;
        }
        
        //if one score at zero phase++
        if(Math.abs(this.tally_obj.tmp_player_pool) == 0 && Math.abs(this.tally_obj.tmp_comp_pool) == 0)
        {
          this.tally_obj.phase++;
        }
      }//END ADD SCORE FROM POOLS
      else if(this.tally_obj.phase == 4)
      {
        this.tally_obj.wait_3--;
        if(this.tally_obj.wait_3 <= 0)
        {
          this.tally_obj.phase++;
        }
      }
      else if(this.tally_obj.phase == 6)
      {
        this.tally_obj.wait_4--;
        if(this.tally_obj.wait_4 <= 0)
        {
          this.tally_obj.phase++;
        }
      }
      else if(this.tally_obj.phase == 7)
      {
        //declare winner end cycle, add click func event 
        //listener to canvas to go to the level up screen
        
        clearInterval(this.game_engine);
        if(this.tally_obj.tmp_player_score > this.tally_obj.tmp_comp_score)
        {//player wins
          //write text to screen
          this.ctxt.font = "60px 'Press Start 2P'";
          this.ctxt.fillText("YOU WIN" , 246, 250);
            this.ctxt.font = "30px 'Press Start 2P'";
            this.ctxt.fillText("[click to continue]" , 167, 350);
          //set as won
          this.game_won = true;
          //set xp
          this.xp_pts = this.score * 2 + this.player_num_bits + this.actual_score + 5000 + this.tally_obj.tmp_player_score;
        }
        else if(this.tally_obj.tmp_player_score < this.tally_obj.tmp_comp_score)
        {//player loses
          //display text to screen
          this.ctxt.font = "60px 'Press Start 2P'";
          this.ctxt.fillText("YOU LOSE" , 211, 250);
          this.ctxt.font = "30px 'Press Start 2P'";
          this.ctxt.fillText("[click to continue]" , 167, 350);
          
          //set as loss
          this.game_won = false;
          //set xp
          this.xp_pts = this.score + this.player_num_bits + this.actual_score + 100;
        }
        else
        {//tie
          //display text to screen
          this.ctxt.font = "60px 'Press Start 2P'";
          this.ctxt.fillText("DRAW" , 363, 250);
          this.ctxt.font = "40px 'Press Start 2P'";
          this.ctxt.fillText("YOU LOSE" , 323, 300);
          this.ctxt.font = "30px 'Press Start 2P'";
          this.ctxt.fillText("[click to continue]" , 167, 350);
          
          //set as loss
          this.game_won = false;
          //set xp
          this.xp_pts = this.score + this.player_num_bits + this.actual_score + 1000 + this.tally_obj.tmp_player_score;
        }//END FOR EACH WIN/LOSE/DRAW CONDITION
        //reset obj
        this.tally_obj = null;
        let self = this;
        //set function to move to levelup func
        this.canvas.classList.add("cursor_ptr");
        this.canvas.addEventListener("click",
                                     function()
                                     {
                                       //reset canvas
                                       self.canvas = document.createElement("canvas");
                                       self.canvas.width = self.canvas_w;
                                       self.canvas.height = self.canvas_h;
                                       self.ctxt = self.canvas.getContext("2d");
                                       self.game_el.innerHTML = "";
                                       self.game_el.appendChild(self.canvas);
        
                                       //add pointer class
                                       self.canvas.classList.add("cursor_ptr");
                                       //set up level-up screen skip listener on canvas
                                       self.canvas.addEventListener("click",
                                                                    function()
                                                                    {
                                                                      self.instant_level_up();
                                                                    });
                                       
                                       //start level up screen process
                                       self.score_shown_ref = false;
                                       self.game_engine = setInterval(function()
                                                                       {
                                                                        self.level_up_user();
                                                                      },
                                                                      50);
                                     });//END SET FUNCTION
      }
      //END PHASES
      
      
    }//END SCORE COMPARE FUNC
    
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
          
          //play sound
          this.play_sound(this.sound7, true);
        }
        if(this.xp_pts > 200 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 20;
        
          //add 1 xp to user
          tmp_user.user_xp += 20;
          
          //play sound
          this.play_sound(this.sound7, true);
        }
        if(this.xp_pts > 100 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 10;
        
          //add 1 xp to user
          tmp_user.user_xp += 10;
          
          //play sound
          this.play_sound(this.sound6, true);
        }
        if(this.xp_pts > 40 * this.xp_value)
        {//fast
          this.xp_pts -= this.xp_value * 5;
        
          //add 1 xp to user
          tmp_user.user_xp += 5;
          
          //play sound
          this.play_sound(this.sound5, true);
        }
        else
        {//final 10 pts
          this.xp_pts -= this.xp_value;
        
          //add 1 xp to user
          tmp_user.user_xp += 1;
          
          //play sound
          this.play_sound(this.sound4, true);
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
          tmp_user.user_next_lvl = Math.floor(tmp_user.user_next_lvl * this.user_ref.level_ratio);
                    
          
          //play sound
          this.play_sound(this.sound8, true);
          console.log("PLAYING SOUND!");
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
        
        let x = Math.floor(this.canvas_w * 0.15);
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
      
      //make sure first code col is created even if no bits to write
      if(tmp_row <= 0 && tmp_col <= 0)
      {
        //create new col
        this.add_code_col(tmp_img, st_x, st_y, shift_x, shift_y)
        
        //update column/row
        tmp_row = this.max_rows;
        tmp_col = this.max_cols;
      }
      
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
        tmp_bar_lvl = this.score - (12 * this.player_bit_level);
      }
      else
      {//calculate critical level
        tmp_bar_lvl = Math.abs(Math.floor(this.score / 12));
      }
      //fill background for bar hub
      
      
      //player buffer level text
      this.ctxt.fillStyle = "#000";
      this.ctxt.fillRect(0, 420, this.canvas_w, 85);
      
      //draw markers, if less <= tmp_bar_lvl -> highlighted color
      //for each marker
      for(let i = 1; i < 11; i++)
      {
        //start x
        let tmp_x = (i * 32) + 100;
        if(this.score >= 0)
        {
          if(tmp_bar_lvl > i - 1)
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
          if(tmp_bar_lvl > i - 1)
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
        tmp_bar_lvl = this.computer_pool - (11 * this.computer_bit_level);
      }
      else
      {//calculate critical level
        tmp_bar_lvl = Math.abs(Math.floor(this.computer_pool / 11));
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
      
      //lable hubs
      this.ctxt.font = "10px 'Press Start 2P'";
      this.ctxt.fillText(this.user_ref.user_data_obj.user_name, 135, 445);
      this.ctxt.fillText("Computer Player", 620, 445);
      
      
    }//END BUILD BUFFER HUBS
    
    engine_cycle()
    { 
      //if needed, generate a flash img/update death flash
      let tmp_flash = null;
      if(this.death_flash > 0)
      {
        this.death_flash_accel += 0.5;
        this.death_flash -= this.death_flash_accel;
        let tmp_num =  Math.round(this.death_flash); 
        //this.ctxt.globalCompositeOperation = 'lighter';
        this.ctxt.fillStyle = "rgb(" + tmp_num + "," + tmp_num + "," + tmp_num + ")";
        
        this.ctxt.rect(0 , 0, 900, 500);
        this.ctxt.fill();
        tmp_flash = this.get_canvas_img();
      }
      else if(this.death_flash < 0)
      {
        this.death_flash = 0;
        this.death_flash_accel = 0;
        //this.ctxt.globalCompositeOperation = 'source-over';
      }
      
      
      //clear canvas
      this.ctxt.clearRect(0, 0, this.canvas_w, this.canvas_h);
      //get blank img to draw on
      let tmp_img = this.get_canvas_img();
      
      //getbgimg
      this.ctxt.drawImage(this.img_bg, 0,0);
      let main_img = this.get_canvas_img();
      
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
      
      
      //overlay code images
      tmp_img.overlay_px_helper(this.player_code_img);
      tmp_img.overlay_px_helper(this.computer_code_img);
      
      
      //overlay characters/etc
      let tmp_player_img = this.img_player_norm_left;
      let tmp_x = 258;
      let tmp_y = 180;
      //player model
      if(this.player_display_pain > 0 && !this.player_is_dead)
      {//show pain
        this.player_display_pain--;
        let tmp_num = Math.random() * 10;
        if(tmp_num > 4)
        {
          tmp_player_img = this.img_player_pain_left;
          tmp_x = 261;
          tmp_y = 180;
        }
      }
      else if(this.player_is_dead)
      {
        tmp_player_img = this.img_player_dead_left;
        tmp_x = 257;
        tmp_y = 180;
      }
      
      //computer model
      let tmp_comp_img = this.img_player_norm_right;
      let tmp_x_comp = 482;
      let tmp_y_comp = 180;
      if(this.computer_display_pain > 0 && !this.computer_is_dead)
      {//show pain
        this.computer_display_pain--;
        let tmp_num = Math.random() * 10;
        if(tmp_num > 4)
        {
          tmp_comp_img = this.img_player_pain_right;
          tmp_x_comp = 483;
          tmp_y_comp = 180;
        }
      }
      else if(this.computer_is_dead)
      {
        tmp_comp_img = this.img_player_dead_right;
        tmp_x_comp = 483;
        tmp_y_comp = 180;
      }
      
      
      
      //overlay background onto img
      main_img.overlay_px_helper(tmp_img);
      
      //update img
      this.set_canvas_img(main_img);
      
      //overlay midground imgs:
      this.ctxt.drawImage(this.img_mg, 255,0);
      
      //overlay players
      this.ctxt.drawImage(tmp_player_img, tmp_x, tmp_y);
      this.ctxt.drawImage(tmp_comp_img, tmp_x_comp, tmp_y_comp);
      
      
      
      //check for fail for player (score too negative)
      if(this.score < 0)
      {
        let tmp_buff_err = Math.abs(Math.floor(this.score / 12));
        if(tmp_buff_err > 12 && !this.player_is_dead)
        {
          this.player_is_dead = true;
          this.death_flash = 255;
          this.death_flash_accel = 0;
          this.busy = true;//stop player input etc
        }
        else if(this.player_is_dead && this.death_flash <= 0)
        {
          //start adding to game_over_clock/check clock for what to display/do
          this.game_over_clock++;
          
          //display game
          if(this.game_over_clock > 10)
          {
            this.ctxt.font = "60px 'Press Start 2P'";
            this.ctxt.fillStyle = "#ddf";
            this.ctxt.fillText("GAME" , 183, 250);
          }
          
          //display over
          if(this.game_over_clock > 18)
          {
            this.ctxt.font = "60px 'Press Start 2P'";
            this.ctxt.fillStyle = "#ddf";
            this.ctxt.fillText("OVER" , 483, 250);
          }
          
          
          //display click instruction/make clickable
          if(this.game_over_clock > 28 )
          {
            this.ctxt.font = "30px 'Press Start 2P'";
            this.ctxt.fillStyle = "#ddf";
            this.ctxt.fillText("[click to continue]" , 167, 350);
            
            //add function (only once!)
            if(!this.game_over_click)
            {
              let self = this;
              this.game_over_click = true;
              this.canvas.classList.add("cursor_ptr");
              this.canvas.addEventListener("click",
                                function()
                                {
                                  //replace canvas to get rid of click func
                                  //let tmp_img = this.get_canvas_img();
                                  self.canvas = document.createElement("canvas");
                                  self.canvas.width = self.canvas_w;
                                  self.canvas.height = self.canvas_h;
                                  self.ctxt = self.canvas.getContext("2d");
                                  //this.set_canvas_img(tmp_img);
                                  self.game_el.innerHTML = "";
                                  self.game_el.appendChild(self.canvas);
                                  
                                  //call wrap up function
                                  self.wrap_up();
                                  
                                });//END ADD CONTINUE CLICK EVENT/FUNC TO CANVAS
            }//END IF FUNC NOT ADDED TO CANVAS
          }//END IF DONE WAIT AFTER GAME OVER TEXT
          
        }//END ELSE IF AFTER FLASH
      }//END IF SCORE IS < 0
      
      //check for fail for computer (score too negative)
      if(this.computer_pool < 0)
      {
        let tmp_buff_err = Math.abs(Math.floor(this.computer_pool / 12));
        if(tmp_buff_err > 12 && !this.computer_is_dead)
        {//computer failed, game doesn't end until player wins
          this.computer_is_dead = true;
          this.death_flash = 255;
          this.death_flash_accel = 0;
        }
      }
      
      //if death flash, then overlay death flash
      if(this.death_flash > 0 && tmp_flash != null)
      {
        //get tmp img of what current canvas is
        let tmp_img = this.get_canvas_img();
        //combine with the flash
        tmp_img.overlay_px_helper(tmp_flash, 0, 0, this.canvas_w, this.canvas_h, "add");
        //overlay combined image
        this.set_canvas_img(tmp_img);
      }
      
      
      
      //overlay hub
      this.build_buffer_hubs();
      
      
      //check game func clocks to see if the funcs need to be called
      this.check_clocks();
      
      //check win conditions to end game
      this.check_win_conditions();
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
      let tmp_level = Math.floor(this.score / 12);
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
      let tmp_level = Math.floor(this.computer_pool / 12);
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
      //if computer is dead, quit
      if(this.computer_is_dead)
      {
        return;
      }
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
        this.computer_display_pain = 20;
        this.play_sound(this.sound3);
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
        this.player_display_pain = 20;
        //if player audio is on, play sound for wrong answer
        this.play_sound(this.sound1, true);
        this.play_sound(this.sound2);
        
        
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
                             + this.total_score + "</div>" + "<div>Player Bits: " + this.player_num_bits
                             + "</div><div>Computer Bits: " + this.computer_num_bits + "</div>";
    }
    
    play_sound(aud_obj, restart = false)
    {
      if(!this.user_ref.get_user_storage_obj().sound_muted)
      {
        if(restart)
        {
          aud_obj.currentTime = 0;
        }
        aud_obj.play();
      }
    }//END FUNC PLAY SOUND
  }//END GAME CONTROLLER CLASS
  
  export {GameController};
  