//user_list: list of all users
//curr_user_name: current user logged in
//curr_user: object for current user's data

class UserStorage
{
  constructor()
  {
    //init as no users
    this.curr_user = null;
    this.curr_user_name = null;
    
    //start by loading/creating user list
    this.user_list = this.get_user_list();
    if(this.user_list == null)
    {
      this.user_list = [];
    }
    else
    { //userList exists
      //check for current user
      this.curr_user_name = this.get_current_user();
      
      if(this.curr_user_name == null)
      { //no curr user
        this.curr_user = null;
      }
      else
      { //curr_user_name not null
        //current user logged in, check exists/load profile
        if(this.user_exists(this.curr_user_name))
        {
          //load user
          this.load_user(this.curr_user_name);
        }
        else
        {
          //error set to blank
          this.curr_user = null;
          this.curr_user_name = null;
        }
      }
    }//END IF USER LIST EXISTS YET
    
  }//END CONSTRUCTOR FUNC
  
  //debug function
  test_list()
  {
    //log each user to console
    let tmp_users = this.get_user_list();
    console.log("LIST: " + this.get_user_list());
    for(let i = 0; i < tmp_users.length; i++)
    {
      console.log("CHECKING: " + tmp_users[i]);
      console.log(localStorage.getItem(tmp_users[i]));
    }
  }
  
  //self destruct user data base
  uninstall_user_database()
  {
    //log each user to console as removed
    let tmp_users = this.get_user_list();
    console.log("LIST: " + this.get_user_list());
    for(let i = 0; i < tmp_users.length; i++)
    {
      console.log("REMOVING: " + tmp_users[i]);
      localStorage.removeItem(tmp_users[i]);
    }
    //remove references
    localStorage.removeItem("arcade_user_list");
    localStorage.removeItem("current_arcade_user");
  }
  
  get_user_list()
  {
    return JSON.parse(localStorage.getItem("arcade_user_list"));
  }
  get_current_user()
  {
    return localStorage.getItem("current_arcade_user");
  }
  set_current_user(user_name)
  {
    return localStorage.setItem("current_arcade_user", user_name);
  }
  
  user_exists(user_name)
  {
    //check array for user
    let in_list = this.user_list.includes(user_name);
    let is_saved_obj = (localStorage.getItem(user_name) == null);
    return (in_list && !is_saved_obj);
  }
  
  get_user()
  {
    return this.curr_user_name;
  }
  
  get_user_obj()
  { 
    return this.curr_user;
  }
  
  load_user(user_name)
  {
    this.curr_user = JSON.parse(localStorage.getItem(user_name));
    if(this.curr_user != null)
    {
      this.curr_user_name = user_name;
      //save current user
      this.set_current_user(user_name);
      //check settings/set up for user
      if(!this.curr_user.background_animation)
      {
        document.body.classList.add('stop_animation');
      }
    }
    else
    {
      console.log("Error, could not load user, does not exist");
    }
  }
  
  save_user(user_obj)
  {
    localStorage.setItem(user_obj.user_name, JSON.stringify(user_obj));
  }
  
  save_curr_user()
  {
    localStorage.setItem(this.curr_user.user_name, JSON.stringify(this.curr_user));
  }
  
  remove_user(user_name)
  {
    localStorage.removeItem(user_name);
    //remove from array
      arr_remove_item(this.user_list, user_name);
    //save user list
    localStorage.setItem("arcade_user_list", JSON.stringify(this.user_list));
    console.log("REMOVING: " + user_name);
  }
  
  create_user(new_user_name)
  {
    //set user obj to new obj
    this.curr_user = { user_name:       new_user_name,
                       user_list_names: [],
                       user_lists:      [],//list text
                       high_scores:     [ ],
                       last_scores:     [],
                       high_score_game: [],
                       last_score_game: [],
                       user_level:      0,
                       user_xp:         0,
                       user_avitar:     "imgs/common/avatar_3.png",
                       user_next_lvl:   100,
                       background_animation: true,
                       sound_muted: false
                     };
    //set user name to user name
    this.curr_user_name = new_user_name;
    //save user as current user
    this.set_current_user(new_user_name)
    //save user obj to user name
    this.save_user(this.curr_user);
    
    //add to user list
    this.user_list.push(new_user_name);
    //save user list
    localStorage.setItem("arcade_user_list", JSON.stringify(this.user_list));
  }
  
  //login user
  login_user(user_name)
  { 
    if(this.user_exists(user_name))
    {
      this.load_user(user_name);
    }
    else
    {
      //prompt to create user
      if(confirm("No user by that name exists. Do you wish to create a new user?"))
      {
        //if yes create user
        this.create_user(user_name);
      }
      else
      {
        return false;
      }
    }
    //debug: show who's current user
    //console.log(this.curr_user);
    return true;
  }//END FUNC login_user
  
  //logout user
  logout_user()
  {
    this.curr_user = null;
    this.curr_user_name = null;
    this.set_current_user(null);
  }
}//END CLASS USER STORAGE


//separate into utils file:
function arr_remove_item(arr, item)
{
  let tmp_index = arr.indexOf(item);
  //ensure item is in arr
  if(tmp_index < 0)
  {
    return false;
  }
  
  arr.splice(tmp_index, 1);
  return true;
}

export {UserStorage};