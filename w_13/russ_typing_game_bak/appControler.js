 //////////////////APP CONTROLLER/////////////////////////////////////
    //connects all modules and helps them to interact/pass info to one another
  class AppController
  {
    constructor(config_obj)
    {
      //save configs
      this.configs = config_obj;
      
      //init vars
      this.user_storage = new UserStorage();
      this.profile_manager = new ProfileManager(this.user_storage);
      this.user_obj  = this.user_storage.get_user_obj();
      this.list_num  = this.get_list_from_url();
      this.game_name = this.get_game_name();
      this.list_txt  = this.get_list_txt(this.list_num);
      this.dev_names = config_obj.key_devs;
      this.dev_dis_ids = config_obj.key_devs_dis_ids;
      
      
      //add footer if assigned
      if(config_obj.footer_id != undefined)
      {
        this.profile_manager.create_footer("footer_el");
      }
      
      //init objs
      this.input_c = new InputController(config_obj.eng_map,
                                         config_obj.dev_arr);
      this.q_bank =  new QuestionBankController(this.list_txt);
      this.game_c = null;
      //load game controller
      //this.game_c =  new GameController(config_obj.game_el, config_obj.score_el, this.profile_manager);
      if(this.game_name != null)
      {
        this.set_game(this.game_name);
      }
      this.q_c    =  new QuestionController(config_obj["prompt_el"],
                                            config_obj["output_el"],
                                            config_obj["q_type_el"],
                                            config_obj["live_img_src"],
                                            config_obj["full_img_src"],
                                            this.q_bank
                                            );
                                            
      this.random_order = config_obj["rand_order"];
    }//END CONSTRUCTOR
    
    init()
    {
      const self = this;
      //construct html:
      
      //add in keyboard devs:
      this.gen_keyboard_displays();
      
      //add profile insert:
      this.profile_manager.create_profile_insert(this.configs.profile_id);
      //assign profile
      this.profile_manager.assign_profile_el_id(this.configs.profile_id);
      
      //add listening events to body to pick up input
      document.body.addEventListener("keydown", 
                                     function(event)
                                     {
                                       self.key_down_event(event);
                                     });
      document.body.addEventListener("keyup", 
                                     function(event)
                                     {
                                       self.key_up_event(event);
                                     });
      //everything should be set, check
      if(   this.input_c == null
         || this.q_bank  == null
         || this.game_c  == null
         || this.q_c     == null)
      {
        //log error
        console.log("Error AppController.init(). Not all controllers have been set.");
        return;
      }
      
      //give the question controller ref to its bank
      this.q_c.set_question_bank(this.q_bank);
      //init question controllerdvdvdvdvdvDVDVDVDVDVDVDVDV
      
      this.q_c.gen_q_list(this.random_order);
      this.game_c.set_start_screen( this.configs.start_screen);
      this.game_c.set_win_screen(this.configs.win_screen);
      this.game_c.set_game_over_screen(this.configs.game_over_screen);
      
      this.game_c.init();
      
    }//END FUNC INIT()
    
    //gets keyboards for each dev
    gen_keyboard_displays()
    {
      for(let i = 0; i < this.dev_names.length; i++)
      {
        this.input_c.get_device(this.dev_names[i]).create_russ_keyboard(this.dev_dis_ids);
      }
    }
    
    get_list_from_url()
    {
      //get selected list from url
      //get info from url/init list_num
      let tmp_url = window.location.search;
      let list_num = -1;
      let tmp_err = false;
      
      //check if editing a list/get list num if so
      if(tmp_url.match(/list_num=\d+/) != null)
      {
        //get/set list_num
        list_num = Number(tmp_url.match(/list_num=\d+/)[0].replace("list_num=", ""));
        //check limits
        if(this.user_storage.get_user_obj().user_lists.length <= list_num)
        {
          tmp_err = true;
        }
      }
      else
      {
        tmp_err = true;
      }
      
      //err check
      if(tmp_err)
      {
        //alert user of error
        alert("Sorry, there was an error retrieving the list. Please try selecting it again.");
        //go back to list select page
        window.location.href="user_page.html";
      }
      return list_num;
    }//END FUNC GET LIST
    
    get_list()
    {
      return this.list_num;
    }
    
    //get game name from url and set up to load game controller
    get_game_name()
    {
      //get selected list from url
      //get info from url/init list_num
      let tmp_url = window.location.search;
      let game_name = "";
      let tmp_err = false;
      
      //check if editing a list/get list num if so
      if(tmp_url.match(/game=[^&]+/) != null)
      {
        //get game name
        game_name = tmp_url.match(/game=[^&]+/)[0].replace("game=", "");
        //check game name
        //NOTE: game_files/etc arr currently in profileManager.js dvdvdvdvdvdv move to a file game_resources module
        if(!game_files.includes(game_name))
        {
          tmp_err = true;
        }
      }
      else
      {
        tmp_err = true;
      }
      
      //err check
      if(tmp_err)
      {
        //alert user of error
        alert("Sorry, there was an error loading the game. Please try again.");
        //go back to list select page
        window.location.href="user_page.html";
        return null;
      }
    
      return game_name;
    }
    
    get_game_ref()
    {
      return this.game_c;
    }
    
    set_game(game_name)
    {
      let self = this;
      //err check
      if(game_name == null)
      {
        //alert user of error
        alert("Sorry, there was an error loading the game. Please try again.");
        //go back to list select page
        window.location.href="user_page.html";
        return false;
      }
      
      //load correct game module//CANT ACTUALLY DO THIS... for security reasons (cross scripting)
      //it is disallowed to dynamically load a javascript like this. oh poo...
      //document.getElementById("game_mod").src = game_name;
      //console.log("Loading game module: " + game_name);
      
      //actually... you can do it:
      //dynamically load game module
      import("./" + game_name).then(function(game_mod)
                                    {
                                      //create game module
                                      let tmp_game_c = new game_mod.GameController(
                                                             self.configs.can_w,
                                                             self.configs.can_h,
                                                             self.configs.xp_value,
                                                             self.configs.game_el,
                                                             self.configs.score_el, 
                                                             self.profile_manager,
                                                             self);
                                      //assign game module
                                      self.set_game_controller(tmp_game_c);
                                      //self init.
                                      self.init();
                                    });
      
      //return game set success
      return true;
    }//END FUNC GET GAME NAME
    
    get_list_txt(list_num)
    {
      //get templist
      let tmp_list = this.user_storage.get_user_obj().user_lists[list_num];
      return tmp_list;
    }
    
    set_input_controller(input_obj)
    {
      this.input_c = input_obj;
    }
    set_bank_controller(q_bank_obj)
    {
      this.q_bank = q_bank_obj;
    }
    set_game_controller(game_c_obj)
    {
      this.game_c = game_c_obj;
    }
    set_question_controller(q_c_obj)
    {
      this.q_c = q_c_obj;
    }
    
    start_game()
    {
      this.game_c.start();
    }
    
    end_game()
    {
      window.location.href = "game_select.html?list_num=" + this.list_num;
    }
    
    pause_game()
    {
      this.game_c.toggle_pause();
    }
    
    key_down_event(event)
    {
      if(event.key == "Pause")
      {
        //console.log("pause");
        this.game_c.toggle_pause();
        return;
      }
      
      //else
      //other issues prevent input extraction/giving to question controller?
      
      //is special key?
      if(event.key == "Shift")
      {
        return;
      }
      
      
      //get_curr_q_input
      let input_dev = this.q_c.get_input_dev();
      let tmp_input = this.input_c.input_key_down(input_dev, event);
      
      
      
      //do stuff only if not hold set from game controller
      if(!this.game_c.is_busy() && !this.game_c.is_paused())
      {
        let points = this.q_c.check_input(tmp_input);
        this.game_c.add_points(points);
      
        //check if list is done
        //get num questions left
        //if zero
        
        if(this.q_c.is_list_done())
        {
          //check if game is a repeating game (ie repeats questions
          //until the GAME is done)
          if(this.game_c.get_repeat())
          {
            console.log("REPEATING!!");
            //if so call list to repeat
            this.q_c.gen_q_list(this.random_order);
            this.game_c.list_completed();
            
          }
          else
          {
            //if not call game to wrap up
            this.game_c.wrap_up();
          }
        }//END IF Q_LIST IS DONE
      }//END IF GAME NOT BUSSY/PAUSED CHECK INPUT
      
      
    }////END KEY DOWN EVENT FUNC////
    
    key_up_event(event)
    {
      //get curr q input
      let input_dev = this.q_c.get_input_dev();
      
      this.input_c.input_key_up(input_dev, event);
    }//END KEY UP EVENT FUNC
    
    //DVDVDVDVDVDVDVDVVDV
    //need to giv ref to user data
    //need to include user data into the page etc
    //Level up func run after game is finished (or when desired)
      //could run after each stage etc
      //adds gained score to xp (* scale factor) and saves user data via userStorage mod
        //set user profile inserto to fixed above everything else
        //set an interval to count though points/ refresh or edit the
        //user profile's bar len.
        //when surpasses next level needs to recalculate next level etc before continues
        //FOR NOW, will probably just make it instant jumps etc
          //ie if xp > next level xp > loop though recalculating and setting to next level till xp < next level xp
  }//END APP CONTROLLER CLASS
  /////////////////////////////////////////////////////////////////////////////
  
  