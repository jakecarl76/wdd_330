var links_list = [
                   {
                     label: "Week1",
                     url: "w_01/"
                   }
                 ];
                 
function add_list_to_el(el_id)
{
  var html = "";
  for(var i = 0; i < links_list.length; i++)
  {
    html += "<li>  <a href=\"" + links_list[i].url
         + "\">" + links_list[i].label + "</a> </li>";
  }
  
  document.getElementById(el_id).innerHTML = html;
}