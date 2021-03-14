export function getJSON(url)
{
  fetch(
    url
  ).then(
    rsp => {
      if(rsp.ok)
      {
        return rsp.json();
      }
      else
      {  throw Error(rsp.statusText);}
    }
  ).then(
    j_data => console.log(j_data)
  ).catch(
    err => console.log(err)
  );    

}//END FUNC get_json

export const getLocation = function(options) {
    return new Promise(function(resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
};



