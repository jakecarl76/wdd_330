//import {getJSON, getLocaton} from 'utilities.js';
import QuakesController from 'quakeController.js';


//const baseUrl ='https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-02-02';


const quake = new quakeController();

console.log(quake.init());