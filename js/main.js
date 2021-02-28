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
                     label: "Week2",
                     url: "w_02/index.html"
                   },
                   {
                     label: "Week3",
                     url: "w_03/index.html"
                   },
                   {
                     label: "Week4",
                     url: "w_04/index.html"
                   },
                   {
                     label: "Week5",
                     url: "w_05/index.html"
                   },
                   {
                     label: "Week6 - Midterm Checkin",
                     url: "w_06/index.html"
                   },
                   {
                     label: "Week7",
                     url: "w_07/index.html"
                   },
                   {
                     label: "Week8",
                     url: "w_08/index.html"
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

