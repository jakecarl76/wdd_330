var links_list = [
                   {
                     label: "QuickCap-noob",
                     url: "quickcap_noob.html"
                   },
                   {
                     label: "Week1",
                     url: "w_01/index.html"
                   },
                   {
                     label: "Wee2",
                     url: "w_02/index.html"
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

