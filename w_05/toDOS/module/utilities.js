

function create_new_task(task_content)
{
  return {id: Date.now(), 
          content: task_content, 
          completed:false
          };
}

function delete_task(task_arr, task_id)
{
  let tmp_id = find_obj_index(task_arr, task_id);
  task_arr.splice(tmp_id, 1);
}

function find_obj_index(task_arr, task_id)
{
  for(let i = 0; i < task_arr.length; i++)
  {
    if(task_arr[i].id == task_id)
    {
      return i;
    }
  }
}

function get_todos_by_id(list_obj, id)
{ 
  let tmp_arr = list_obj.todos
  let todos_item = null;
  
  todos_item = tmp_arr.filter(item => item.id == id)[0];//note:filter returns an array
  
  return todos_item;
}

class HtmlTaskEditor
{

  constructor(p_curr_list)
  {
    this.curr_list = p_curr_list;
  }

  create_html_task(task_item)
  {
    //create base container
    let html_item =  { item: document.createElement("li")};
    //add checkbox
    let tmp_item = document.createElement("input");
    tmp_item.type = "checkbox";
    tmp_item.id = "checkbox_" + task_item.id;
    tmp_item.checked = task_item.completed;
    tmp_item.classList.add("hidden");
    
    //add item handle
    html_item.checkbox_hndl = tmp_item;
    
    
    //append checkbox
    html_item.item.appendChild(tmp_item);
    
    //add checkbox label
    tmp_item = document.createElement("label");
    tmp_item.htmlFor = "checkbox_" + task_item.id;
    
    
    //append checkbox label
    html_item.item.appendChild(tmp_item);
        
    //create content text
    tmp_item = document.createElement("span");
    tmp_item.innerHTML = task_item.content;
    tmp_item.id = "content" + task_item.id;
    
    if(task_item.completed)
    {
      tmp_item.classList.toggle("line-through");
    }
    
    //append content text
    html_item.item.appendChild(tmp_item);
    
    //create delete button
    tmp_item = document.createElement("input")
    tmp_item.id = "del_btn_" + task_item.id;
    tmp_item.type = "button";
    tmp_item.value = "\u274C";
    
    //add item handle
    html_item.delete_btn_hndl = tmp_item;
    
    //append to html
    html_item.item.appendChild(tmp_item);
    
    
    //return finished html item
    return html_item;
  }//END CREATE HTML TASK FUNC
  
}//END HTMLTASKEDITOR CLASS



export { create_new_task, get_todos_by_id, HtmlTaskEditor, delete_task}