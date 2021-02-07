



//update list
function update_list(list_obj)
{
  save_list(list_obj);
}

//load list
function load_list(list_id)
{
  return JSON.parse(localStorage.getItem(list_id));
}

//save list
function save_list(list_obj)
{
  localStorage.setItem(list_obj.list_id, 
                       JSON.stringify(list_obj));
}

//delete list
function delete_list(list_id)
{
  localStorage.removeItem(list_id);
}

export {update_list,
        load_list,
        save_list,
        delete_list};