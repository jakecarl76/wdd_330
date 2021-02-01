
    import { tmp_var1, tmp_var2 } from './ex_mod_1.js';
    
    import my_cust_var from './ex_mod_2.js';
    
    function output(div_id, output)
    {
      document.getElementById(div_id).innerHTML += output + "<br>";
    }
    
    function ex_01(div_id)
    {
      output(div_id, tmp_var1);
      output(div_id, tmp_var1);
    }
    
    function ex_02(div_id)
    {
      
      output(div_id, my_cust_var);
    }