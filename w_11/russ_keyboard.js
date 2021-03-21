 
class RussKeyBoard
{
  constructor(unique_id = "", eng_key_map)
  {
    this.unique_id = unique_id;
    this.russ_key_map = {
    '`' : 'ё', 
    '~' : 'Ё',
    '1' : '1',
    '!' : '!',
    '2' : '2',
    '@' : '"',
    '3' : '3',
    '#' : '№',
    '4' : '4',
    '$' : ';',
    '5' : '5',
    '%' : '%',
    '6' : '6',
    '^' : ':', 
    '7' : '7',
    '&' : '?',
    '8' : '8',
    '*' : '*',
    '9' : '9',
    '(' : '(',
    '0' : '0',
    ')' : ')',
    '-' : '-',
    '_' : '_',
    '=' : '=',
    '+' : '+',
    'q' : 'й',
    'w' : 'ц',
    'e' : 'у',
    'r' : 'к',
    't' : 'е',
    'y' : 'н',
    'u' : 'г',
    'i' : 'ш',
    'o' : 'щ',
    'p' : 'з',
    '[' : 'х',
    '{' : 'Х',
    ']' : 'ъ',
    '}' : 'Ъ',
    '\\' : '\\',
    '|' : '/',
    'a' : 'ф',
    's' : 'ы',
    'd' : 'в',
    'f' : 'а',
    'g' : 'п',
    'h' : 'р',
    'j' : 'о',
    'k' : 'л',
    'l' : 'д',
    ';' : 'ж',
    ':' : 'Ж',
    '\'' : 'э',
    '"' : 'Э',
    'z' : 'я',
    'x' : 'ч',
    'c' : 'с',
    'v' : 'м',
    'b' : 'и',
    'n' : 'т',
    'm' : 'ь',
    ',' : 'б',
    '<' : 'Б',
    '.' : 'ю',
    '>' : 'Ю',
    '/' : '.',
    '?' : ','
    };
    if(eng_key_map == undefined)
    {
      this.key_map = EngQWERTYKeyMap.getKeyMap();
    }
    else
    {
      this.key_map = eng_key_map;
    }
    this.id_map = {};
  }
    
    //resets the display key when key is lifted up.
    key_up_func(event_obj)
    {
      let tmp_var = event_obj.key.toLowerCase();
      let tmp_char = this.russ_key_map[tmp_var];
      
      //set to upper case if shift key is used
      /*if(event.shiftKey && tmp_char != undefined)
      {
        tmp_char = tmp_char.toUpperCase();
      }*/
      
      //update keyboard 'display'
      let tmp_class = [this.id_map[tmp_var]];
      
      //check that was associated, if not check special keys
      if (tmp_class[0] == undefined  && this.id_map["l" + tmp_var] != undefined)
      {
        tmp_class = [this.id_map["l" + tmp_var], this.id_map["r" + tmp_var]];
      }
      else if (tmp_class[0] == undefined)
      {//not a key on the display board, set to empty string
        tmp_class = [];
      }
      
      //check for and change class for each key
      for(let i = 0; i < tmp_class.length; i++)
      {
        let tmp_el = document.getElementById(tmp_class[i]);
        //remove class
        tmp_el.classList.remove('key_down');
        //else already done
      }//end for each key to 'press'
    }
    
    //Function takes an event object
    //function returns the Russ key equivalent of the event's .key property
    //function also highlights the correct class on the Russ keyboard el
    key_down_func(event_obj)
    {
      //->this would work to prevent default actions-> eg:
      //>function keys that the browser has set to do things,
      //>Ctrl + key like save, open, etc
      //>NOTE, ctrl + w ->close window will still work
      //event_obj.preventDefault();
      
      //make event key lower case for map matching
      let tmp_var = event_obj.key.toLowerCase();
      
      //get the russian char
      let tmp_char = this.get_russ_key(event_obj.key);
      
      //update keyboard 'display'
      let tmp_class = [this.id_map[tmp_var]];
      
      //check that was associated, if not check special keys
      //if a special key (ie left/right ctrl/shift/alt) then assign class
      if (tmp_class[0] == undefined && this.id_map["l" + tmp_var] != undefined)
      {
        tmp_class = [this.id_map["l" + tmp_var], this.id_map["r" + tmp_var]];
      }
      else if (tmp_class[0] == undefined)
      {//not a key on the display board, set to empty string
        tmp_class = [];
      }
      
      //check for and change class for each key
      //(should only be multiple keys if doing left/right keys)
      for(let i = 0; i < tmp_class.length; i++)
      {
        let tmp_el = document.getElementById(tmp_class[i]);
        if(!tmp_el.classList.contains('key_down'))
        {
          tmp_el.classList.add('key_down');
        }
        //else already done
      }//end for each key to 'press'
      
      //document.getElementById('output0').innerHTML = "KEY_DOWN: " + tmp_char;
      return tmp_char;
    }
    
    
    //return the Russ equivlant of the given .key property.
    //if not a mapped key (eg. F1, UpArrow, Pause, etc...), just returns the key property
    get_russ_key(key_property)
    {
      //get the russ char (mapped to lower case)
      let tmp_char = this.russ_key_map[key_property.toLowerCase()];
      
      //check if undefined
      if(tmp_char == undefined)
      {
        tmp_char = key_property
      }
      else
      { //key is mapped
        //check case
          //only need to check if not lower case:
            //symbols   -> no diff (equal)
            //lowercase -> same->no diff (equal)
            //uppercase -> diff (not equal), need to adjust char
        if(key_property.toLowerCase() != key_property)
        {
          tmp_char = tmp_char.toUpperCase();
        }
      }
      
      return tmp_char;
    }
    
    //creates and returns a Russian/English keyboard element
    //As this function creates the keyboard elements, it also logs or maps
    //the elements id's to the id_map var.
    create_russ_keyboard()
    {
      //init id_num
      let id_num = 0;
      //anchor div
      let tmp_anchor_div = document.createElement("div");
      //create first rows
      let tmp_row = document.createElement('div');
      tmp_row.className = "key_row";
      tmp_anchor_div.appendChild(tmp_row);
      
      //begin first row of keys (0-25 in key map), 4 row keys
      for(let i = 0; i <= 25; i += 2, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //add keys
        for(let j = 0; j < 2; j++)
        {
          //eng
          let tmp_char_div = document.createElement('div');
          tmp_char_div.className = "key_label_eng";
          tmp_char_div.innerHTML = this.key_map[i + j];
          tmp_key.appendChild(tmp_char_div);
          //russ
          tmp_char_div = document.createElement('div');
          tmp_char_div.className = "key_label_russ";
          tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i + j]];
          tmp_key.appendChild(tmp_char_div);
          
          //associate ids
          this.id_map[this.key_map[i + j]] = this.unique_id + "key_" + id_num;
        }//END FOR EACH ENG CHAR ON KEY
      }//END FOR EACH KEY IN FIRST ROW (0-25)
      
      //add in backspace key
      let tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "9em";
      tmp_row.appendChild(tmp_key);
  
      //associate ids
      this.id_map['backspace'] = this.unique_id + "key_" + id_num;
      id_num++;
      
      let tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "BACKSPACE";
      tmp_key.appendChild(tmp_char_div);
      
      //CREATE ROW 2
      tmp_row = document.createElement('div');
      tmp_row.className = "key_row";
      tmp_anchor_div.appendChild(tmp_row);
      
      //add tab key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "5em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "TAB";
      tmp_key.appendChild(tmp_char_div);
      
      
      //associate ids
      this.id_map['tab'] = this.unique_id + "key_" + id_num;
      id_num++;
  
      //Q-P (2 char keys, eng/rus, 26-35)
      for(let i = 26; i <= 35; i++, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng_two_row";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
      }//END FOR EACH KEY IN 2ND ROW Q-P(26-35)
      
      //Do last three keys of second row (3, 3 4)
      for(let i = 36; i <= 39; i += 2, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        //eng
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i + 1];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
        this.id_map[this.key_map[i + 1]] = this.unique_id + "key_" + id_num;
      }//END FOR 2nd to last two keys in second row (bracket keys)
      
      //add on last key (a four char key)
      tmp_key = document.createElement('div');
      tmp_key.className = "key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "7em";
      tmp_row.appendChild(tmp_key);
      
      
      //add keys
      for(let j = 0, i = 40; j < 2; j++)
      {
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i + j];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i + j]];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i + j]] = this.unique_id + "key_" + id_num;
      }//END FOR EACH ENG CHAR ON KEY
      id_num++;
      
      
      //CREATE ROW 3
      tmp_row = document.createElement('div');
      tmp_row.className = "key_row";
      tmp_anchor_div.appendChild(tmp_row);
      
      //add capslock key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "6em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "CAPS LOCK";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["capslock"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //Q-P (2 char keys, eng/rus, 26-35)
      for(let i = 42; i <= 50; i++, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng_two_row";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
      }//END FOR EACH KEY IN 2ND ROW Q-P(26-35)
      
      //Do last three keys of second row (3, 3 4)
      for(let i = 51; i <= 54; i += 2, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        //eng
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i + 1];
        tmp_key.appendChild(tmp_char_div);
        
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
        this.id_map[this.key_map[i + 1]] = this.unique_id + "key_" + id_num;
      }//END FOR 3rd to last two keys
      
      //Add in last key (Enter)
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "9em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "ENTER";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["enter"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //CREATE ROW 4
      tmp_row = document.createElement('div');
      tmp_row.className = "key_row";
      tmp_anchor_div.appendChild(tmp_row);
      
      //add SHIFT key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "8em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "SHIFT";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["lshift"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //z-m (2 char keys, eng/rus, 55-61)
      for(let i = 55; i <= 61; i++, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng_two_row";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
      }//END FOR EACH KEY IN 4th ROW 
      
      //Do last two keys of forth row (3, 3, 4)
      for(let i = 62; i <= 65; i += 2, id_num++)
      {
        let tmp_key = document.createElement('div');
        tmp_key.className = "key_grid";
        tmp_key.id = this.unique_id + "key_" + id_num;
        tmp_row.appendChild(tmp_key);
        
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ_two_row";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i]];
        tmp_key.appendChild(tmp_char_div);
        //eng
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i + 1];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i]] = this.unique_id + "key_" + id_num;
        this.id_map[this.key_map[i + 1]] = this.unique_id + "key_" + id_num;
      }//END FOR 2nd to last keys 
      
      //add on last key (a four char key)
      tmp_key = document.createElement('div');
      tmp_key.className = "key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_row.appendChild(tmp_key);
      
      //add keys
      for(let j = 0, i = 66; j < 2; j++)
      {
        //eng
        let tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_eng";
        tmp_char_div.innerHTML = this.key_map[i + j];
        tmp_key.appendChild(tmp_char_div);
        //russ
        tmp_char_div = document.createElement('div');
        tmp_char_div.className = "key_label_russ";
        tmp_char_div.innerHTML = this.russ_key_map[this.key_map[i + j]];
        tmp_key.appendChild(tmp_char_div);
        
        //associate ids
        this.id_map[this.key_map[i + j]] = this.unique_id + "key_" + id_num;
      }//END FOR EACH ENG CHAR ON KEY
      id_num++;
      
      //Add on final shift key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "10.5em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "SHIFT";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["rshift"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //CREATE ROW 5
      tmp_row = document.createElement('div');
      tmp_row.className = "key_row";
      tmp_anchor_div.appendChild(tmp_row);
      
      //add Ctrl key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "5em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "CTRL";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["lcontrol"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      
      //add blank key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.style.minWidth = "6em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "";
      tmp_key.appendChild(tmp_char_div);
      
      
      //add alt key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "3em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "ALT";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["lalt"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //add space bar key
      tmp_key = document.createElement('div');
      tmp_key.className = "key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "17em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "";
      tmp_key.appendChild(tmp_char_div);
            
      //associate ids
      this.id_map[" "] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //add alt key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "3em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "ALT";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["ralt"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      //add Ctrl key
      tmp_key = document.createElement('div');
      tmp_key.className = "special_key_grid";
      tmp_key.id = this.unique_id + "key_" + id_num;
      tmp_key.style.minWidth = "5em";
      tmp_row.appendChild(tmp_key);
      
      tmp_char_div = document.createElement('div');
      tmp_char_div.className = "key_label_eng";
      tmp_char_div.innerHTML = "CTRL";
      tmp_key.appendChild(tmp_char_div);
      
      //associate ids
      this.id_map["rcontrol"] = this.unique_id + "key_" + id_num;
      id_num++;
      
      return tmp_anchor_div;//return div for placement in doc
    }//END FUNC CREATE RUSS KEYBOARD DISPLAY
    
}//END RUSS KEYBOARD CLASS