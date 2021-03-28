//////////////////GAME CONTROLLER///////////////////////////////////
    //controls the game
  class GameController
  {
    constructor(game_el = null, score_el = null)
    {
      this.score = 0;//working value, game eninge can manipulate as a resource for game
      this.total_score = 0;//totlal points earned (no negative)
      this.actual_score = 0;//actualy how they are performing (includes negative points)
      
      this.game_el = game_el;
      this.score_display_el = score_el;
      
      this.busy = true;
      this.paused = false;
      
      this.canvas_w = 0;
      this.canvas_h = 0;
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
      this.repeat = false;//ie keep running though questions list
                          //once list is done app controller calls the wrap_up func
                          //can have wrap up func ask if keep playing? if so can
                          //call parent app controller to run the q's again
    }
    
    //game eninge runs, updates game
      //every interval runs check func
        //check func updates and checks clock arr.
        
        //clock arr [time1][time2][time-n]
        //obj arr   [obj1] [obj2] [obj n]
        //each obj has an update func that updates its thing (player, monster, etc)
        //also will hav ref in canv_objs arr, have a diff func-> draw
    init()
    {
      //set attributes (width/height)
      this.canvas_w = 1000;
      this.canvas_h = 400;
    
      //create and insert canvas obj
      this.canvas = document.createElement("CANVAS");
      this.canvas.width = this.canvas_w;
      this.canvas.height = this.canvas_h;
      //this.game_el.appendChild(this.canvas);
      //get 2d context
      this.ctxt = this.canvas.getContext("2d");
      
      
      //set self ref
      let self = this;
      
      //set the game clocks/ticks
      //run dec. function every 5 seconds, dec by 2 every 15 seconds
      this.game_clocks = [5000, 15000];
      this.game_ticks = [5000, 15000];
      this.game_updates = [
        function(){self.update_func_1();console.log("update1");},
        function(){self.update_func_2();console.log("update2");},
        
      ];
      
      //show start screen
      this.game_el.innerHTML = this.start_screen;
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
      //Perform any wrap-up stuff
      
      //set to end screen
      this.game_el.innerHTML = this.win_screen;
      
      //stop game engine
      clearInterval(this.game_engine);
    }
    
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
    
    //DVDVDVDVDVDV   Create a test func to run via set interval
    //to see about using ref etc with the interval to access this obj/ref to canvas etc
    
    engine_cycle()
    { //get img
      let tmp_img = this.get_canvas_img();
      
      //update px
      for(let i = 0; i < tmp_img.width; i++)
      {
        for(let j = 0; j < tmp_img.height; j++)
        {
          if(this.score > 0 && i < this.score)
          {
            tmp_img.set_px(i, j, [0, 255, 0, 255]);
          }
          else if(this.score < 0 && i < Math.abs(this.score))
          {
            tmp_img.set_px(i, j, [255, 0, 0, 255]);
          }
          else
          {
            tmp_img.set_px(i, j, [0, 0, 0, 0]);
          }
        }
      }
      //update img
      this.set_canvas_img(tmp_img);
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
    
    
    update_func_1()
    {
      let tmp_img = this.get_canvas_img();
      
      //flash blue
      for(let i = 0; i < tmp_img.width; i++)
      {
        for(let j = 0; j < tmp_img.height; j++)
        {
            tmp_img.set_px(i, j, [0, 0, 255, 255]);
        }
      }
      //update img
      this.set_canvas_img(tmp_img);
      
      //decrement score
      this.score--;
    }
    update_func_2()
    {
      let tmp_img = this.get_canvas_img();
      
      //flash yellow
      for(let i = 0; i < tmp_img.width; i++)
      {
        for(let j = 0; j < tmp_img.height; j++)
        {
            tmp_img.set_px(i, j, [255, 255, 0, 255]);
        }
      }
      //update img
      this.set_canvas_img(tmp_img);
      
      //decrease score
      this.score -= 2;
    }
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
      //update actual score
      this.actual_score += points;
      if(points < 0)
      {//negative points
        this.score += points
      }
      else if(points > 0)
      {//positive points
        this.score += points;
        this.total_score += points;
      }
      //else do nothing: 0 points -> backspace, typing full answer, etc
      
      this.update_score();
    }//END FUNC ADD POINTS
    
    update_score()
    {//DVDVDVDVDVDV
      this.score_display_el.innerHTML = "<div>SCORE: " + this.score + "</div> <div> TOTAL SCORE: "
                             + this.total_score + "</div>";
    }
  }//END GAME CONTROLLER CLASS
  