 
  //////////////////QUESTION CONTROLLER///////////////////////////////
  //selects current question
  //tracks if live/full, source, answers, display, etc
  //tracks current input for question
  //returns object to controller of what to do (ie, nothing, good/bad points to give game controller)
  class QuestionController
  {
    constructor(prompt_el = null, 
                output_el = null,
                q_type_dis_el = null, 
                live_img_src = "",
                full_img_src = "",
                bank_ref = null
                )
    {
      this.q_bank = bank_ref;
      this.curr_input = "";
      this.curr_input_display = "";
      this.output_el = output_el;
      this.prompt_el = prompt_el;
      this.ans_type_display = q_type_dis_el;
      this.full_type_img = full_img_src;
      this.live_type_img = live_img_src;
      this.q_len = -1;
      this.curr_q_num = -1;
      this.curr_q = null;
      this.q_list = [];
      this.curr_strike = 0;//hard/soft limit counter
      this.round = 0;
      this.list_done = true;
    }
    
    set_question_bank(bank_ref)
    {
      this.q_bank = bank_ref;
      this.q_len = this.q_bank.get_num_questions();
      //console.log("Q_LEN: " + this.q_len);
    }
    
    set_answer_type_display(el)
    {
      this.ans_type_display = el;
    }
    
    set_live_type_img(img_link)
    {
      this.live_type_img = img_link;
    }
    
    set_full_type_img(img_link)
    {
      this.full_type_img = img_link;
    }
    
    show_question_type(is_live)
    {
      if(is_live)
      {
        this.ans_type_display.src = this.live_type_img;
      }
      else
      {
        this.ans_type_display.src = this.full_type_img;
      }
    }
    
    set_output_el(el)
    {
      this.output_el = el;
    }
    
    set_prompt_el(el)
    {
      this.prompt_el = el;
    }
    
    get_input_dev()
    { 
      if(this.curr_q == null)
      {
        return "ENG";
      }
      
      return this.curr_q.input_dev;
    }
    
    gen_q_list(random_order)
    {
      if(random_order)
      {
        //questions ordered at random
        this.q_list = this.gen_random_q_list();
      }
      else
      {
        //questions keep order of extraction
        this.q_list = this.gen_ordered_list();
      }
      
      //set that list not done
      this.list_done = false;
      //init q trackers
      this.get_next_question();
    }
    
    get_next_question()
    { 
      //check if questions are empty
      if(this.q_list.length > 0)
      {
        this.curr_q_num = this.q_list.shift();
        this.set_curr_question();
      }
      else
      {
        this.round++;
        this.list_done = true;
        //app controller will check if round inc then
        //will either end game or call question controller
        //to create the q_list again
      }
    }
    
    set_curr_question()
    {
      //set q_obj property
      this.curr_q = this.q_bank.get_question(this.curr_q_num);
      //reset input/input display
      this.curr_input = "";
      this.curr_input_display = "";
      this.update_input_display();
      //reset strikes for hard/soft limit
      this.curr_strike = 0;
      //display prompt
      this.prompt_el.innerHTML = this.curr_q.questions[0];
      
      //multi choice questions setup
      if(this.curr_q.f_is_mc && this.curr_q.mc_id != "na")
      {
        let ans_display = "<div> <h3> Answer Choices: </h3>";
        //get q_bank
        let tmp_id = this.curr_q.mc_id;
        let tmp_bank = this.q_bank.get_mc_bank_by_id(tmp_id);
        
        //create a new temp bank to pull from
        //create array for pulling random answers out of the bank
        let tmp_arr = make_ordered_array(tmp_bank.length);
        let new_bank = [];
        //we create a temporary index array to splice from because
        //we don't want to splice out of the bank itself, that would
        //break it before future questions could use it
        //place in possible answers from incorrect list
        for(let i = 0; i < this.curr_q.num_i; i++)
        {
          //get index number
          let tmp_index = tmp_arr.splice(Math.floor(Math.random() * tmp_arr.length), 1);
          new_bank[i] = tmp_bank[tmp_index];
        }
        
        //create array for pulling random answers out of the pool
        tmp_arr = make_ordered_array(this.curr_q.answers.length);
        //now add in random correct answers
        for(let i = 0; i < this.curr_q.num_a; i++)
        {
          //get index number
          let tmp_index = tmp_arr.splice(Math.floor(Math.random() * tmp_arr.length), 1);
          new_bank.push(this.curr_q.answers[tmp_index]);
        }
        
        //generate the answer list by pulling randomly from the new bank
        while(new_bank.length > 0)
        {
          let tmp_index = Math.floor(Math.random() * new_bank.length);
          let tmp_word = new_bank.splice(tmp_index, 1);
          ans_display += "<span class='small_margins'> " + tmp_word + " </span>";
        }
        
        ans_display += "</div>";
        
        this.prompt_el.innerHTML += ans_display;
      }//END MULTI-CHOICE SET UP
      
      //check question type(Live/full)
      this.show_question_type(this.curr_q.f_live);
    }//END FUNC SET CURR QUESTION
    
    gen_ordered_list()
    {
      let len = this.q_len;
      
      let tmp_arr = make_ordered_array(len);
      return tmp_arr;
    }
    
    gen_random_q_list()
    {
      let return_list = [];
      
      let tmp_arr = this.gen_ordered_list();
      //console.log("TMP ARR LEN:" + tmp_arr.length);
      while(tmp_arr.length > 0)
      {
        //pull rand question number from q numbers left
        let rand = Math.random() * tmp_arr.length;
        rand = Math.floor(rand);
        //extract q number
        let tmp_num = tmp_arr.splice(rand, 1);
        return_list.push(tmp_num[0]);
        
      }
      
      //console.log("ret ARR LEN:" + return_list.length);
      return return_list;
      
    }//END FUNC GEN RANDOM Q LIST
    
    get_num_questions()
    {
      return this.q_list.length;
    }
    
    is_list_done()
    {
      return this.list_done;
    }
    
    update_input_display()
    {
      this.output_el.innerHTML = this.curr_input_display;
    }
    
    check_input(input_char)
    {
      //check for special case chars
      let answer_submitted = false;
      if(input_char == "Backspace")
      {
        this.curr_input = this.curr_input.replace(/.$/, "");
        this.curr_input_display = this.curr_input;
        this.update_input_display();
        return;
      }
      else if(input_char == "Enter")
      {
        input_char = "";
        answer_submitted = true;
      }
      
      //DVDVDVDVDVDVDV//only do if input is not "Enter" (full answer)
      let tmp_input = this.curr_input + input_char;
      
      //create pattern for matching to input from live/full answers
      let patt = new RegExp("^" + excape_regex_chars(tmp_input));
      
      //is live question/full?
      if(this.curr_q.f_live)
      {//live
        //if enter button, do nothing
        if(answer_submitted)
        {
          return 0;
        }
      
      
        //inc question's total strokes
        this.curr_q.total_strokes++;
      
        //search for matches for live answers
        let matches = this.curr_q.answers.filter(answer => answer.match(patt) != null);
        //if match
        if(matches.length > 0)
        {
          this.curr_q.good_strokes++;
          //add correct input to current saved input
          this.curr_input += input_char;
          //display stuff
          
          //check soft limit
          if( this.curr_strike >= this.curr_q.soft_lim)
          {
            let show_answer = this.get_answer_remainder(this.curr_input, this.curr_q);
            
            this.curr_input_display = this.curr_input
                                    + "<span class='show_answer'>"
                                    + show_answer + "</span>";
          }
          else
          { //no soft limit then just the input
            this.curr_input_display = this.curr_input;
          }
          
          //update display
          this.update_input_display();
          this.show_correct();
            
          //check if question fully answered
          if(this.check_answer(this.curr_q, this.curr_input))
          {
            //if full answer, next question
            this.get_next_question();
          }
          
          //return correct point
          return 1;
        }
        else
        {
          //if no match
            //inc strikes (hard/soft limits)
            this.curr_strike++;
            let show_answer = ""
            
            //Check for if past soft limit, show rest of answer
            if( this.curr_strike >= this.curr_q.soft_lim)
            {
              show_answer = this.get_answer_remainder(this.curr_input, this.curr_q);
              
              show_answer = "<span class='show_answer'>"
                          + show_answer + "</span>";
            }
            
            
            //set display for general case
            this.curr_input_display = this.curr_input
                                    + "<span class='bad_answer'>"
                                    + input_char + "</span>" + show_answer;
            
            //check if past hard limit to skip whole question
            if (this.curr_strike >= this.curr_q.hard_lim)
            {
              //play sound
              //do question fail display
              this.get_next_question();
            }
            
            //DVDVDVDVDVDVDVD
            //if(parent.settings.audio)
            //{//play a sound}
            //do other display it was wrong stuff in a function
            this.update_input_display();
            //return negative point
            return -1;
        }
      }//END IF IS LIVE QUESTION
      else if(answer_submitted)
      {//FULL (only check if answer has been submitted)
        //update question's score
        this.curr_q.total_strokes++;
        let points = 0;
        let matches = this.curr_q.answers.filter(answer => answer == this.curr_input);
        
        //if match
        if(matches.length > 0)
        {
          //update good score for question
          this.curr_q.good_strokes++;
          //reward?
          if(this.curr_q.f_reward)
          {
            //get char count
            points = matches[0].length;
          }
          else
          {
            points = 1;
          }
          //show correct animation/sound
          this.show_correct();
          
          //get next question
          this.get_next_question();
        }
        else
        {//if no match
        
          //punish?
          if(this.curr_q.f_reward)
          {
            //get char count
            points = -this.curr_input.length;
          }
          else
          {
            points = -1;
          }
          //show wrong
          this.curr_input_display = "<span class='bad_answer'>"
                                  + this.curr_input + "<span>";
        
          //inc strikes
          this.curr_strike++;
          //Check for if past soft limit (show rest of answer)
          if( this.curr_strike >= this.curr_q.soft_lim)
          {
            let show_answer = this.get_answer_remainder(this.curr_input, this.curr_q);
            
            this.curr_input_display += "<span class='show_answer'>"
                                    + show_answer + "</span>";
                        
          }
          //check if past hard limit (skip question)
          if (this.curr_strike >= this.curr_q.hard_lim)
          {
            //play sound
            //do question fail display
            this.get_next_question();
          }
        }//END IF WRONG ANSWER
        
        
        this.update_input_display();
        
        return points;
      }//END ELSE IF FULL QUESTION SUBMITTED
      else
      {//FULL, NOT SUBMITTED (update display)
        this.curr_input += input_char;
        this.curr_input_display = this.curr_input;
        this.update_input_display();
      }
      
    }//END FUNC CHECK Input
    
    show_correct()
    {
      if(this.output_el.classList.contains("good_answer_a")
         || this.output_el.classList.contains("good_answer_b"))
      {
        this.output_el.classList.toggle("good_answer_a");
        this.output_el.classList.toggle("good_answer_b");
      }
      else
      {
        this.output_el.classList.toggle("good_answer_a");
      }
      //DVDVDVDVDVDVDVD
      //if(parent.settings.audio)
      //{//play a sound}
    }//END FUNC SHOW CORRECT
    
    get_answer_remainder(input, question)
    {
      //show_answer
      let answer_remainder = "";
      //find possible match w/curr input only if there is input
      
      if(input != "")
      {
        //find possible matches
        let patt = new RegExp("^" + excape_regex_chars(input));
        //filter for answers that matches tmp_input
        let tmp_matches = question.answers.filter(answer => answer.match(patt) != null);
        
        //get answer remainder
        if(tmp_matches.length > 0)
        {
          answer_remainder = tmp_matches[0].replace(patt, "");
        }
      }
      
      //if no matches to curr correct input or blank, just show first
      if(answer_remainder == "")
      {
        answer_remainder = question.answers[0];
      }
      return answer_remainder;
    }//END GET ANSWER REMAINDER
    
    check_answer(question, input)
    {
      let ans_arr = question.answers;
      let tmp_matches = ans_arr.filter(ans => ans == input);
      if(tmp_matches.length > 0)
      {//correct/exact answer in answer bank
        return true;
      }
      else
      {//not a full answer
        return false;
      }
    }
  }//END QUESTON CONTROLLER CLASS

  
  export {QuestionController};