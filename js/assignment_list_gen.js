function gen_links_list(el_id)
{
  html = "";
  
  for(var i = 0; i < w_list.length; i++)
  {
    html += "<li> " + w_list[i].assignment_name;
    
    //sub list
    if(w_list[i].assignment_list.length > 0)
    {
      html += "<ul>";
      for(var j = 0; j < w_list[i].assignment_list.length; j++)
      {
        if(w_list[i].assignment_list[j].type == "note")
        {
          html += "<li> <p class=\"p-note\">" + w_list[i].assignment_list[j].note + "</p></li>";
        }
        else if(w_list[i].assignment_list[j].type == "link")
        {
          html+= "<li> <a href=\"" + w_list[i].assignment_list[j].url
               + "\">" + w_list[i].assignment_list[j].label + "</a> </li>";
        }
      }//END FOR EACH ASSING-ITEM
      html += "</ul>";
    }
    
    html+= "</li>"
  }//END FOR EACH ASSIGNMENT
  
  //assign new html
  document.getElementById(el_id).innerHTML = html;
}//END FUNC