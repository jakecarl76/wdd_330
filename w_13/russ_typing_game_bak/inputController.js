
  //////////////////INPUT CONTROLLER///////////////////////////////////
  //keeps track of input objects
  //function call made to it passed the event obj and the desired input source (eg russ, eng, etc)
    //returns the desired input from the 'source'
    
  class InputController
  {
    constructor (dev = null, input_arr = [])
    {
      this.main_dev = dev;
      this.input_devs = input_arr;
    }
    
    set_device(dev, dev_name)
    {
      this.input_devs[dev_name] = dev;
    }
    
    get_device(dev_name)
    {
      return this.input_devs[dev_name];
    }
    
    //show stroke on board and return desired input
    input_key_down(dev, event)
    {
      if(this.input_devs[dev] != undefined)
      {
        let tmp_input = this.input_devs[dev].key_down_func(event);
        return tmp_input;
      }
      else
      {
        //return normal input if no dev
        return event.key;
      }
    }
    
    //update board
    input_key_up(dev, event)
    {
      if(this.input_devs[dev] != undefined)
      {
        this.input_devs[dev].key_up_func(event);
      }
    }
  }
  //END CLASS INPUT CONTROLLER