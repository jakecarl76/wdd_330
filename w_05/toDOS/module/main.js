
  import { update_list, load_list, save_list, delete_list } from './ls.js';
  import { create_new_task, get_todos_by_id, HtmlTaskEditor, delete_task } from './utilities.js';
  //check if there is a master list already
  const m_id_list = init_master_list();
  let curr_list = null;
  let html_editor = new HtmlTaskEditor(curr_list);
  
  //Check for user, return user, or false/new list_obj if no match exists
  function user_signin(m_list, param_name)
  {
    //check that sign-in is not empty
    if(param_name == "")
    {
      doc_alert("Please enter a user name to sign in");
      return false;
    }
    
    //check if list exists in list names arr
    if(!m_list.to_dos_lists.includes(param_name))
    { //no list found
      //ask if want to create a new list
      if(confirm("No list found for " + param_name 
                 + ". Create a new list?"))
      {
        //create the new entry in masters list
        m_list.to_dos_lists.push(param_name);
        //update master list
        update_list(m_list);
        //create/save a new list
        let tmp_new_list = {list_id:param_name, todos: []};
        save_list(tmp_new_list);
        return tmp_new_list;
      }
      return false;
    }
    else
    { //list exists
      //load list
      let tmp_list = load_list(param_name)
      return tmp_list;
    }
  }
  
  function user_init()
  {
    //"sign-in" user ie see if given name is in arr
    let tmp_obj = user_signin(m_id_list, document.getElementById("user_name").value);
    
    //if false, list did not exist, user did not want to create new (do nothing)
    //else load list and all list tasks into the html
    if(tmp_obj !== false)
    {
      //hide signin, show list 
      document.getElementById("welcome").classList.remove("displayed");
      document.getElementById("welcome").classList.add("hidden");
      document.getElementById("main").classList.remove("hidden");
      document.getElementById("main").classList.add("displayed");
      curr_list = tmp_obj;
      filter_all();
      
    }//END IF LIST OBJ RETURNED FALSE (ie signed in or not
  }//END FUNC USER_INIT

  function load_task_list(list_arr)
  {
    for(let i = 0; i < list_arr.length; i++)
    {
      add_task(list_arr[i]);
    }
  }
  //filter finished tasks
  function load_done_tasks(list_arr)
  {
    for(let i = 0; i < list_arr.length; i++)
    {
      if(list_arr[i].completed)
      {
        add_task(list_arr[i]);
      }
    }
  }
  //filter active tasks
  function load_active_tasks(list_arr)
  {
    for(let i = 0; i < list_arr.length; i++)
    {
      if(!list_arr[i].completed)
      {
        add_task(list_arr[i]);
      }
    }
  }
  //count active tasks
  function count_active_tasks(list_arr)
  {
    let count = 0;
    for(let i = 0; i < list_arr.length; i++)
    {
      if(!list_arr[i].completed)
      {
        count++;
      }
    }
    
    return count;
  }
  
  //refresh list with only completed tasks
  function filter_completed()
  {
    //reset/reload tasks
    document.getElementById("tasks").innerHTML="";
    load_done_tasks(curr_list.todos);
    update_count();
  }
  
  //refresh list with only active tasks
  function filter_active()
  {
    //reset/reload tasks
    document.getElementById("tasks").innerHTML="";
    load_active_tasks(curr_list.todos);
    update_count();
  }
  
  //load all tasks
  function filter_all()
  {
    //reset/reload tasks
    document.getElementById("tasks").innerHTML="";
    load_task_list(curr_list.todos);
    update_count();
  }
  
  //update count for number of tasks left
  function update_count()
  {
    let tmp_count = count_active_tasks(curr_list.todos);
    document.getElementById("count").innerHTML = tmp_count + " tasks left";
  }
  
  
  
  function init_master_list()
  {
    let tmp_master_list = load_list("master_list");
  
    //if no master list, create new
    if(tmp_master_list == null)
    {
      tmp_master_list = { list_id: "master_list", to_dos_lists: [] }
    }
    save_list(tmp_master_list);
    return tmp_master_list;
  }
  
  //creates a new task and updates the html
  function add_new_task()
  {
    //get task text
    let tmp_tsk_txt = document.getElementById("new_tsk_txt").value;
    
    //check that task text not empty-cells
    if(tmp_tsk_txt == "")
    {
      doc_alert("You cannot submit a blank task.");
      return false;
    }
    else
    {
      
      let tmp_task = create_new_task(tmp_tsk_txt);
      add_task(tmp_task);
      //add task to the task list
      curr_list.todos.push(tmp_task);
      update_list(curr_list);
      return true;
    }
  }
  
  //adds the task to the html
  function add_task(tmp_task)
  {
    
    let tmp_id = tmp_task.id;
    
    //create a task "item"
    let tmp_html_task = html_editor.create_html_task(tmp_task);
    
    //create a new function for task item's checkbox
    let tmp_func = function(event)
                 {
                   //get id number from own id
                   let tmp_id = event.target.id.match(/\d+/)[0];
                   let tmp_item = get_todos_by_id(curr_list, tmp_id);
                   let tmp_bool = !tmp_item.completed;
                   tmp_item.completed = tmp_bool;
                   
                   //cross out text/don't
                   if(tmp_bool)
                   {
                     document.getElementById("content" + tmp_id).classList.toggle("line-through");
                   }
                   else
                   {
                     document.getElementById("content" + tmp_id).classList.toggle("line-through");
                   }
                   update_list(curr_list);//save to local storage
                   update_count();//update displayed count
                   
                 }//end checkbox function
    
    //create new function for task item's delete button
    let tmp_func_del = function(event)
                     {
                       //get id of item though delete btn's id
                       let tmp_id = event.target.id.match(/\d+/)[0];
                       delete_task(curr_list.todos, tmp_id);
                       event.target.parentElement.parentElement.removeChild(
                         event.target.parentElement);
                       update_list(curr_list);//update local storage
                       update_count();//update displayed count
                     }//end del btn func
    
    //use item's checkbox handle to set it's checkbox click function
    tmp_html_task.checkbox_hndl.addEventListener("click", tmp_func);
    
    //user item's del_btn handle to set delete button's function
    tmp_html_task.delete_btn_hndl.addEventListener("click", tmp_func_del);
    
    //add task item to the html
    document.getElementById("tasks").appendChild(tmp_html_task.item);
    
  }//END FUNC ADD TASK

  
  //doc alert
  function hide_doc_alert()
  {
    document.getElementById("doc_alert").classList.toggle("hidden");
  }
  
  function doc_alert(txt_msg)
  {
    document.getElementById("doc_alert_msg").innerHTML = txt_msg;
    document.getElementById("doc_alert").classList.toggle("hidden");
  }
  
  function logout()
  {
    curr_list = null;
    document.getElementById("tasks").innerHTML = "";
    document.getElementById("main").classList.toggle("hidden");
    document.getElementById("welcome").classList.toggle("hidden");
  }
  
  function set_up_usr_rmv_list()
  {
    document.getElementById("all_users").innerHTML = "";
    let tmp_html = document.createElement("div");
    for (let i = 0; i < m_id_list.to_dos_lists.length; i++)
    {
      let tmp_item = document.createElement("div");
      tmp_item.innerHTML = m_id_list.to_dos_lists[i];
      
      let tmp_item2 = document.createElement("input");
      tmp_item2.type = "button";
      tmp_item2.value = "remove";
      tmp_item2.addEventListener("click", 
                                 function()
                                 {
                                   delete_list(m_id_list.to_dos_lists[i]);
                                   let tmp_index = m_id_list.to_dos_lists.indexOf(m_id_list.to_dos_lists[i]);
                                   m_id_list.to_dos_lists.splice(tmp_index, 1);
                                   update_list(m_id_list);
                                   this.parentElement.parentElement.removeChild(this.parentElement);
                                 });
      tmp_item.appendChild(tmp_item2);
      tmp_html.appendChild(tmp_item);
    }
    document.getElementById("all_users").appendChild( tmp_html);
  }
  
  //assign buttons
  document.getElementById("sign_in_btn").addEventListener("click", 
                                                          function()
                                                          {
                                                            user_init();
                                                          });
  document.getElementById("new_tsk_btn").addEventListener("click", 
                                                          function()
                                                          {
                                                          add_new_task();
                                                        });
  document.getElementById("doc_alert_btn").addEventListener("click", 
                                                          function()
                                                          {
                                                          hide_doc_alert();
                                                        });
  document.getElementById("bk_btn").addEventListener("click", 
                                                         function()
                                                         {
                                                           document.getElementById("welcome").classList.toggle("hidden");
                                                           document.getElementById("remove_users").classList.toggle("hidden");
                                                         });
  document.getElementById("rmv_usrs_btn").addEventListener("click", 
                                                         function()
                                                         {
                                                           set_up_usr_rmv_list()
                                                           document.getElementById("welcome").classList.toggle("hidden");
                                                           document.getElementById("remove_users").classList.toggle("hidden");
                                                         });
  document.getElementById("logout_btn").addEventListener("click", logout);
                                                        
                                                        
  document.getElementById("filter_all").addEventListener("click", filter_all);
  document.getElementById("filter_completed").addEventListener("click", filter_completed)
  document.getElementById("filter_active").addEventListener("click", filter_active);
  
  //add event listeners to make entering text more convenient (ie enter clicks button for you).
  document.getElementById("user_name").addEventListener("keypress",
                                             function(event)
                                             {
                                               if(event.keyCode === 13)
                                               {
                                                 document.getElementById("sign_in_btn").click();
                                               }
                                             }); 
  document.getElementById("new_tsk_txt").addEventListener("keypress",
                                             function(event)
                                             {
                                               if(event.keyCode === 13)
                                               {
                                                 document.getElementById("new_tsk_btn").click();
                                               }
                                             });  
  //save load test
  //let tmp_obj = {list_id: "list1", val1: "value1", val2:"value2"};
  
  //save_list(tmp_obj);
  
  //let tmp_obj2 = load_list("list1");
  //alert(tmp_obj2.val1);*/