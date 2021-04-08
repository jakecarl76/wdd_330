function excape_regex_chars(str)
{
  //first the escape char
  str = str.replace(/\\/g, "\\\\");
  //()
  str = str.replace(/\(/g, "\\(");
  str = str.replace(/\)/g, "\\)");
  
  //+
  str = str.replace(/\+/g, "\\+");
  
  //=
  str = str.replace(/\=/g, "\\=");
  
  //-
  str = str.replace(/\-/g, "\\-");
  
  //?
  str = str.replace(/\?/g, "\\?");
  
  //*
  str = str.replace(/\*/g, "\\*");
  
  //^
  str = str.replace(/\^/g, "\\^");
  
  //^
  str = str.replace(/\./g, "\\.");
  
  return str;
}


/************************************************************************
*****************************AJAX GET TEXT RESOURCE**********************
*************************************************************************/
function get_text_resource(url, callback_func)
{
  fetch(url).then(resp => resp.text()).then(data => callback_func(data));
}

/**********************************************************************
*************************KEY PRESS CLICK********************************
***********************************************************************/
function key_click(event, el_id)
{
  if(event.key == "Enter")
  {
    document.getElementById(el_id).click();
  }
}

/**********************************************************************
********************MAKE OREDERED ARRAY********************************
***********************************************************************/
function make_ordered_array(len)
{
  let tmp_arr = [];
  //create list of q numbers to pull from
  for(let i = 0; i < len; i++)
  {
    tmp_arr[i] = i;
  }
  
  return tmp_arr;
}

/**********************************************************************
**************************PX HELPER************************************
***********************************************************************/
function get_px_helper(imgdata)
{
  return {  width: imgdata.width,
            height: imgdata.height,
            data: imgdata.data,
            data_ref: imgdata,
            get_ref: function()
                     {
                       return this.data_ref;
                     },
            get_px: function (x, y)
                    {
                      index_st = y * this.width * 4;
                      index_st += x * 4;
                      tmp_px = [this.data[index_st],
                                this.data[index_st + 1],
                                this.data[index_st + 2],
                                this.data[index_st + 3]];
                      return tmp_px;
                    },
            get_copy: function ()
                      {//creates a 'corrupted' object
                        let new_img_data = [];
                        for(let i = 0; i < this.data.length; i++)
                        {
                          new_img_data[i] = this.data[i];
                        }
                        let tmp_obj = get_px_helper(this.data_ref);
                        tmp_obj.set_data_arr(new_img_data);
                        return tmp_obj;
                      },
            set_data_arr: function(new_data)
                          {//set to null since obj is corrupted
                            this.data_ref = null;
                            this.data = new_data;
                          },
            set_px: function (x, y, px)
                    {
                      let index_st = y * this.width * 4;
                      index_st += x * 4;
                      this.data[index_st] = px[0];
                      this.data[index_st + 1] = px[1];
                      this.data[index_st + 2] = px[2];
                      this.data[index_st + 3] = px[3];
                    },
            overlay_px_helper: function(px_obj,
                                        st_x = 0, st_y = 0, 
                                        end_x = this.width, end_y = this.height,
                                        action = "replace")
                               {
                                 //check width/height
                                 //dvdvdvdvdv
                                 
                                 //copy over to this img
                                 //for each selected px....
                                 for(let i = st_x; i < end_x; i++)
                                 {
                                   for(let j = st_y; j < end_y; j++)
                                   {
                                     let tmp_px = px_obj.get_px(i, j);
                                     let self_px = this.get_px(i, j);
                                     //add/stubract each px, or if replace only replace if px not zero
                                     let tmp_ratio = 0;
                                     let r = 0;
                                     let g = 0;
                                     let b = 0;
                                     let a = 0;
                                     if(tmp_px[3] != 0)
                                     {
                                       switch(action)
                                       {
                                         case "combine":
                                           //get alpha
                                           tmp_ratio = tmp_px[3] / 255;
                                           r = Math.round(tmp_ratio * tmp_px[0]) + self_px[0];
                                           g = Math.round(tmp_ratio * tmp_px[1]) + self_px[1];
                                           b = Math.round(tmp_ratio * tmp_px[2]) + self_px[2];
                                           //combine alpha?
                                           a = tmp_px[3] + self_px[3];
                                           r %= 255;
                                           g %= 255;
                                           b %= 255;
                                           a %= 255;
                                           this.set_px(i, j, [r, g, b, a]);
                                         break;
                                         case "add":
                                           //get alpha
                                           tmp_ratio = tmp_px[4] / 255;
                                           r = tmp_px[0] + self_px[0];
                                           g = tmp_px[1] + self_px[1];
                                           b = tmp_px[2] + self_px[2];
                                           //combine alpha?
                                           a = tmp_px[3] + self_px[3];
                                           if(r > 255)
                                           {
                                             r = 255;
                                           }
                                           if(g > 255)
                                           {
                                             g = 255;
                                           }
                                           if(b > 255)
                                           {
                                             b = 255;
                                           }
                                           if(a > 255)
                                           {
                                             a = 255;
                                           } 
                                           /*
                                           r %= 255;
                                           g %= 255;
                                           b %= 255;
                                           a %= 255;*/
                                           this.set_px(i, j, [r, g, b, a]);
                                         break;
                                         case "subtract":
                                           //get alpha
                                           tmp_ratio = tmp_px[3] / 255;
                                           r = tmp_px[0] - self_px[0];
                                           g = tmp_px[1] - self_px[1];
                                           b = tmp_px[2] - self_px[2];
                                           //combine alpha?
                                           a = tmp_px[3] - self_px[3];
                                           if(r < 0)
                                           {
                                             r = 0;
                                           }
                                           if(g < 0)
                                           {
                                             g = 0;
                                           }
                                           if(b < 0)
                                           {
                                             b = 0;
                                           }
                                           if(a < 0)
                                           {
                                             a = 0;
                                           } 
                                           this.set_px(i, j, [r, g, b, a]);
                                         break;
                                         case "replace":
                                           //replace px;
                                           this.set_px(i, j, tmp_px);
                                         break;
                                         default:
                                            console.log("Px helper error");
                                       }//end switch
                                     }
                                   }//end for Y
                                 }//end for X
                               }//END OVERLAY FROM PX HELPER OBJ
          };
}
/******************************END PX HELPER******************************/
  
  
/*************************************************************************
******************************TOGGLE HIDDEN*******************************
**************************************************************************/
function toggle_hidden(div, symbol = null)
{
  let div_el = document.getElementById(div);
  let sym_el = document.getElementById(symbol);
  
  //toggle hidden
  div_el.classList.toggle("hidden");
  //adjust controllers symbol to reflect state
  if(div_el.classList.contains("hidden") && symbol != null)
  {
    sym_el.innerHTML = "&#9661;";
  }
  else if(symbol != null)
  {
    sym_el.innerHTML = "&#9660;";
  }
}//END FUNC TOGGLE HIDDEN


  
 /*************************************************************************
  **************************TEST LIST CREATER*******************************
  **************************************************************************/
  //Test Program:
  function get_test_russ_list(num_chars = 5, num_qs = 10)
  {
  let tmp_list = "";
  
  
  //create new Russian keyboard 
  //first create qwerty keyboard that russ will use for its construction etc.
  const qwerty_map = EngQWERTYKeyMap.getKeyMap()
  
  //Create russ_keyboard obj
  //needs el_id prefix and obj for its keyboard it is using
  //(prob could be reworked to make more comparable w/other keyboard layouts other than qwerty...)
  const russ_key_board = new RussKeyBoard("russ_", qwerty_map);
  
  //create a temp list
  for(let i = 0; i < num_qs; i++)
  {
    let word_len = Math.floor(Math.random() * num_chars) + 1;
    let tmp_eng_char = "";
    let tmp_char = "";
    for(let k = 0; k < word_len; k++)
    {
      let tmp_new_char = qwerty_map[(Math.floor(Math.random() * 67))]
      let capitalize = Math.random() * 50;
    
      if(capitalize > 20)
      {
        tmp_eng_char += tmp_new_char.toUpperCase();
        tmp_char += russ_key_board.russ_key_map[tmp_new_char].toUpperCase();
      }
      else
      {
        tmp_eng_char += tmp_new_char;
        tmp_char += russ_key_board.russ_key_map[tmp_new_char];
      }
    }
    
    let tmp_ans_type = Math.floor(Math.random() * 10);
    let tmp_flag = "F";
    if(tmp_ans_type > 4)
    {
      tmp_flag = "L"
    }
    
    tmp_list += tmp_flag + "RPN[RUSS]MC#0A#2I#5Q#10S#7, " + tmp_char + ", " + tmp_char + " \n";
  }//END CREATE TEMP LIST
  
  console.log(tmp_list);
  return tmp_list;
  }
  /**********************************************************************
  ******************************END TEST LIST CREATOR*******************
  **********************************************************************/
  