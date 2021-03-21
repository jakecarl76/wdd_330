
  //////////////////QUESTON BANK CONTROLLER///////////////////////////
  
  //program extracts and tracks questions
  //questions are "banks"
    //thus more than one question can have the same answer,
    //so each question is a bank. When the question is asked,
    //it randomly takes a question from the question bank and
    //displays it as a prompt. in the text list questions are
    //the 2nd csv field, each question is separated by a semi-colon
    //ie-> Flag, Q1; Q2; Qn;, A1; A2; An \n
  //Answers are "banks"
    //a single question (or a question "bank") could have multiple
    //correct answers. Thus each question field is actually a bank
    //of possible correct answers separated by semicolons
    //ie-> Flag, Q1; Q2; Qn;, A1; A2; An \n
    //answering a question
      //Answering questions can occur in several diff ways depending
      //on the Flag settings
      //LIVE ANSWERS(L)default:
        //>answer is checked for each char typed
        //>each char entered is checked against the answer bank.
        //if it matches one of the answers it is added to a 'pool'
        //or string of the current user entry and correct point/action given
        //>as chars after the first are typed, to check them you
        //cant just check the nth char since you have to consider
        //the previous part or entered chars. To do this the new entered
        //char is added on to the 'pool' and the combined is checked
        //against possible answers. If it is wrong it is not added to
        //the 'pool' and a wrong point/action is given
        //>doing this in this manner allows for the possibility for
        //the user to use the backspace key to delete or remove some of 
        //their previous input. this is useful if the user doesn't
        //know the correct answer that they may have started to type,
        //so they can backspace and give one of the correct answers they
        //do know from the 'bank'.
          //(eg for a question w/answers "edifice; building" and the user
          //things the answer is egg. They begin and type 'e', but then 'g'
          //is wrong. They remember building is correct, but are stuck with
          //an 'e' and don't know the edifice answer. With backspace enabled
          //they can erase the 'e' and then type 'building')
      //FULL ANSERS(F):
        //each answer is not checked until the user hits the "Enter" key
        //the whole answer is then checked against the bank of answers.
        //if the answer is correct, they get a point/action
        //if the answer is wrong, they get a wrong point/action
        //HINT (H):
          //with the hint flag enabled, if the user got part of the beginning
          //correct, then it will show them that part/not delete that part
          //of their input
        //PUNISH(P):
          //with the punish flag, there is additional wrong points given
          //with each char of bad input (ie full answers mode)
        //REWARD(R):
          //with reward flag, user given additional points for each correct
          //char of the answer. (this is good for rewarding the extra typing
          //skill required for longer answers (ie full answers mode)
      //MULTI CHOICE BANK(MCID#A#I#):
        //these are questions that pool incorrect answers with other questions.
        //each question given the same bank id will pool its answers into a bank
        //of incorrect answers. For every one of these questions asked it will
        //display a list of several (# of specified in flag) incorrect answers along
        //with the correct answers (# of also specified in flag). Depending on 
        //other flags (live/full answers) the answer is then checked against the
        //selected good or correct answers.
        //(ie. each question's answers can be wrong answer choices for other questions.)
        //This is a good choice to keep the list fresh and not just memorize
        //what answer is correct for the particularly phrased question or
        //memorize the answer by the given answer bank or other question
        //specific properties that do not actually test subject knowledge.
        //(eg. would work especially well with a vocab/definition list study)
      //INPUT (N[ENG|RUSS|(etc)])
        //Input device or keyboard. Input lang is captured in the brackets
        //ENG for English qwerty keyboard is default(if flag is omitted)
        //because this has such an array of possible input values, it will need to be removed before
        //any other flags are extracted.
      //GIVE UP 
        //the number of wrong answers before answer is shown/question thrown out
        //if flag is omitted -> unlimited attempts, hint never shown
        //GIVE UP HARD (Q#)
          //The hard give up/quit. The number of wrong attempts till the question is skipped
        //GIVE UP SOFT (S#)
        //The soft give up/show the answer.
      //L -live answers
      //F -full answers
      //H -hint
      //P -punish
      //R -reward
      //MCID# -id# for 'wrong' answer bank
        //A# -# of correct answer choices to show
        //I# -# of incorrect choices to show 
      //N[ENG|RUSS] -input
      //Q# -hard quit
      //S# -soft quit
        
function create_default_answer()
{
  return {f_live:   true,
          f_full:   false,
          f_hint:   false,
          f_punish: false,
          f_reward: false,
          f_is_mc:  false,
          f_hard_lim: false,
          f_soft_lim: false,
          f_input_set: false,
          input_dev: "ENG",
          answer_type: "live",
          mc_id:  "na",
          num_a:  1,
          num_i:  0,
          questions: [],
          answers: [],
          soft_lim: -1,
          hard_lim: -1,
          used: 0,//number times question has been asked
          total_strokes: 0,//total keystrokes (for score)
          good_strokes: 0,//correct keystrokes (for score)
          };
}//END FUNC CREATE/RETURN DEFALUT ANSWER

class QuestionBankController
{
  constructor(list_txt)
  {
    this.list_text = list_txt;
    this.question_banks = [];//associative arr (access via id)
    this.questions = [];//each question is an object
    this.extract_from_text();
  }
  
  get_num_questions()
  {
    return this.questions.length;
  }
  
  get_question(index)
  {
    return this.questions[index];
  }
  
  extract_from_text()
  {
    //separate each line (questons)
    let line_list = this.list_text.split("\n");
    let list_size = line_list.length;
    
    //check if zero? error?dvdvdvdvdvdv
    
    //create each question obj (for each split line)
    for(let i = 0; i < list_size; i++)
    {
      //check curr question line correct format 
      //(should have at least 3 parts: flags, Q's, A's)
      if(line_list[i].length < 3)
      {
        //if line incomplete, skip.
        console.log("ERROR: question line too short at: " 
                   + line_list[i].length + ". Length should be at least 3.");
        continue;
      }
      
      //create default question obj
      let cur_q_obj = create_default_answer();//current question object
      //split segments
      let q_items = line_list[i].split(",");
      //split questions/answers
      //split questions -> array
      let tmp_questions = q_items[1].split(";");
      
      //split answers -> array
      let tmp_answers = q_items[2].split(";");
      
      //GET FLAGS
      //get flags str
      let flags_str = q_items[0].toUpperCase();
      
      //check/set flags
      
      //First need to extract input flag if present so the lang part
      //does not mess with looking for other flags
        //check if input flag present
        let tmp_match = flags_str.match(/N\[[^\]]+\]/);
        if(tmp_match != null)
        {
          cur_q_obj.f_input_set = true;
          //eliminate extra info
          tmp_match = tmp_match[0].replace("N[", "");
          tmp_match = tmp_match.replace("]", "");
          
          //set the input dev of obj
          cur_q_obj.input_dev = tmp_match;
          
          //erase the input flag (so doesn't mess with other flags)
          flags_str = flags_str.replace(/N\[[^\]]+\]/, "");
          
          //erase input from flag str
          cur_q_obj.answer_type = "full";
        }
        
        
        //answer_type: (live/full)
        tmp_match = flags_str.match(/L/);
        if(tmp_match == null)
        {
          cur_q_obj.f_live = false;
          cur_q_obj.answer_type = "full";
        }
        
        tmp_match = flags_str.match(/F/);
        if(tmp_match != null)
        {
          cur_q_obj.f_full = true;
          cur_q_obj.f_live = false;
          cur_q_obj.answer_type = "full";
        }
        //If both live and full answer flags present: Full dominates
        
        //hit: true/false
        tmp_match = flags_str.match(/H/);
        if(tmp_match != null)
        {
          cur_q_obj.f_hint = true;
        }
        
        //punish: true/false
        tmp_match = flags_str.match(/P/);
        if(tmp_match != null)
        {
          cur_q_obj.f_punish = true;
        }
        
        //reward: true/false
        tmp_match = flags_str.match(/R/);
        if(tmp_match != null)
        {
          cur_q_obj.f_reward = true;
        }
        
        //multi_choice: true/false
        tmp_match = flags_str.match(/MCID\s*#\s*\d+/);
        if(tmp_match != null)
        {
          cur_q_obj.f_is_mc = true;
          
          //get multi choice data
          //bank_id: number
          tmp_match = tmp_match[0].match(/\d+/);
          //check for error
          if (tmp_match != null)
          {
            cur_q_obj.mc_id = "id_" + tmp_match[0];
            //check if bank for id exists, if not create
            if(this.question_banks[cur_q_obj.mc_id] == undefined)
            {
              this.question_banks[cur_q_obj.mc_id] = [];
            }
          }
          else
          {
            console.log("ERROR: Multi choice question flag could not locate bank id");
            continue;
          }
        }//END IF MATCH MC CHOICE FLAG
          
          //num_answers: number
          tmp_match = flags_str.match(/A\s*#\s*\d+/);
          if(tmp_match != null)
          {
            //get number correct answers to show
            tmp_match = tmp_match[0].match(/\d+/);
            //check for error
            if (tmp_match != null)
            {
              cur_q_obj.num_a = Number(tmp_match[0]);
              
              //check/compare to actual num answers
              if(tmp_answers.length < cur_q_obj.num_a)
              {
                cur_q_obj.num_a = tmp_answers.length;
              }
            }
            else
            {
              console.log("ERROR: Multi choice question flag could not locate number of answers");
              continue;
            }
            
          }//END NUM CORRECT ANSWERS
          
          //num_incorret_options: number
          tmp_match = flags_str.match(/I\s*#\s*\d+/);
          if(tmp_match != null)
          {
            //get number incorrect answers from bank to show
            tmp_match = tmp_match[0].match(/\d+/);
            //check for error
            if (tmp_match != null)
            {
              cur_q_obj.num_i = Number(tmp_match[0]);
              //can't check questions length, may be more to add to bank
            }
            else
            {
              console.log("ERROR: Multi choice question flag could not locate number of false answers");
              continue;
            }
        }//END NUM INCORRECT ANSWERS
        
        
        //hard-quit: number
        tmp_match = flags_str.match(/Q\s*#\s*\d+/);
        if(tmp_match != null)
        {
          //set hard quit flag
          cur_q_obj.f_hard_lim = true;
          
          //get hard lim number
          tmp_match = tmp_match[0].match(/\d+/);
          //check for error
          if (tmp_match != null)
          {
            cur_q_obj.hard_lim = Number(tmp_match[0]);
          }
          else
          {
            console.log("ERROR: Multi choice question flag could not locate number for hard quit limit.");
            continue;
          }
        }
        
        //soft-quit: number
        tmp_match = flags_str.match(/S\s*#\s*\d+/);
        if(tmp_match != null)
        {
          //set soft quit flag
          cur_q_obj.f_soft_lim = true;
          
          //get soft lim number
          tmp_match = tmp_match[0].match(/\d+/);
          //check for error
          if (tmp_match != null)
          {
            cur_q_obj.soft_lim = Number(tmp_match[0]);
          }
          else
          {
            console.log("ERROR: Multi choice question flag could not locate number for hard quit limit.");
            continue;
          }
        }
        
        //extract questions
        for(let j = 0; j < tmp_questions.length; j++)
        {
          //filter blank questions (nothing or white space only)
          let tmp_q = tmp_questions[j].match(/\S+/);//must match at least one non white space char
          if(tmp_q != null)
          {
            cur_q_obj.questions.push(tmp_questions[j]);
          }
        }
        
        //extract answers
        for(let j = 0; j < tmp_answers.length; j++)
        {
          //filter blank answers (nothing or white space only)
          let tmp_q = tmp_answers[j].match(/\S+/);//must match at least one non white space char
          if(tmp_q != null)
          {
            //eliminate leading white space
            tmp_answers[j] = tmp_answers[j].replace(/^\s*/, "");
            tmp_answers[j] = tmp_answers[j].replace(/\s*$/, "");
            //eliminate trailing white space
            cur_q_obj.answers.push(tmp_answers[j]);
          }
          //if multi choice question, add answers to its bank
          if (cur_q_obj.f_is_mc)
          {
            //for each answer
            for(let k = 0; k < cur_q_obj.answers.length; k++)
            {
              this.question_banks[cur_q_obj.mc_id].push(cur_q_obj.answers[k]);
            }
          }
          
        }//END FOR EACH ANSER
      //add question to list
      this.questions.push(cur_q_obj);
      console.log(cur_q_obj);
    }//END FOR EACH QUESTON LINE
    
  }//END INNER FUNC EXTRACT FORM TEXT
}//END CLASS QUESTON CONTROLLER 

