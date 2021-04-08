//alert("poo");
function call_poo()
{
  alert("poo");
}

class PooClass
{
  constructor(init_var)
  {
    this.val = init_var;
  }
  
  call_val()
  {
    alert(this.val);
  }
}

export {call_poo, PooClass};