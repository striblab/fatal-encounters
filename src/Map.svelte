

<script>
import hennepin from './data/hennepin.json';
import addresses from './data/addresses.json';
import mpls from './data/minneapolis.json';
import covenants from './data/covenants.json';
import { onMount } from 'svelte';
import * as jq from 'jquery';
import * as mapboxgl from 'mapbox-gl';

let center = [-93.265015, 44.977753];
let mcenter = [-93.265015, 44.977753];
let zoom = 10.5;

mapboxgl.accessToken = 'pk.eyJ1Ijoic3RhcnRyaWJ1bmUiLCJhIjoiY2sxYjRnNjdqMGtjOTNjcGY1cHJmZDBoMiJ9.St9lE8qlWR5jIjkPYd3Wqw';

function makeMap() {
/********** MAKE MAP **********/

const map = new mapboxgl.Map({
  container: 'map_alt',
  style: 'mapbox://styles/startribune/ck1b7427307bv1dsaq4f8aa5h',
  center: center,
  zoom: zoom,
  minZoom: 9.5,
  maxZoom: 16,
  maxBounds: [-97.25, 43.2, -89.53, 49.5],
  scrollZoom: false
});

/********** SPECIAL RESET BUTTON **********/
class HomeReset {
  onAdd(map){
    this.map = map;
    this.container = document.createElement('div');
    this.container.className = 'mapboxgl-ctrl my-custom-control mapboxgl-ctrl-group';

    const button = this._createButton('mapboxgl-ctrl-icon StateFace monitor_button')
    this.container.appendChild(button);
    return this.container;
  }
  onRemove(){
    this.container.parentNode.removeChild(this.container);
    this.map = undefined;
  }
  _createButton(className) {
    const el = window.document.createElement('button')
    el.className = className;
    el.innerHTML = '&#x21BB;';
    el.addEventListener('click',(e)=>{
      e.style.display = 'none'
      console.log(e);
      // e.preventDefault()
      e.stopPropagation()
    },false )
    return el;
  }
}
const toggleControl = new HomeReset();

var scale = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: 'imperial'
  });
  map.addControl(scale)

// Setup basic map controls
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  map.dragPan.disable();
  map.keyboard.disable();
  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.scrollZoom.disable();
  jq("#map").css("pointer-events","none");
} else {

  map.getCanvas().style.cursor = 'pointer';
  map.addControl(new mapboxgl.NavigationControl({ showCompass: false }),'top-left');
  map.addControl(toggleControl,'top-left');

jq('.my-custom-control').on('click', function(){
  map.jumpTo({
    center: center,
    zoom: zoom,
  });
});

}

/********** MAP BEHAVIORS **********/

map.on('load', function() {

  map.setPaintProperty(
    'water',
    'fill-color','#ededed' 
  );

      map.addSource('addresses', {
        type: 'geojson',
        data: addresses
      });

      map.addLayer({
              'id': 'addresses-layer',
              'type': 'circle',
              'source': 'addresses',
              'paint': {
              'circle-radius': 3,
              'circle-color': '#C2655F',
              'circle-opacity': 1
          }
      });

      map.addSource('hennepin', {
        type: 'geojson',
        data: hennepin
      });

      map.addLayer({
          'id': 'hennepin-layer',
          'interactive': true,
          'source': 'hennepin',
          'layout': {},
          'type': 'line',
          'paint': {
              'line-width': 0.7,
              'line-color': '#333333'
            }
      }, "settlement-subdivision-label");

      map.addSource('mpls', {
        type: 'geojson',
        data: mpls
      });

      map.addLayer({
          'id': 'mpls-layer',
          'interactive': true,
          'source': 'mpls',
          'layout': {},
          'type': 'line',
          'paint': {
              'line-width': 0.7,
              'line-color': '#333333'
            }
      }, "settlement-subdivision-label");

      map.addSource('covenants', {
        type: 'geojson',
        data: covenants
      });

      map.addLayer({
          'id': 'covenants-layer',
          'interactive': true,
          'source': 'covenants',
          'layout': {},
          'type': 'fill',
              'paint': {
              'fill-antialias' : true,
              'fill-opacity': 1,
              'fill-color': "#aabdcb",
              'fill-outline-color': "#aabdcb"
        }
      }, "settlement-subdivision-label");

});


jq(document).ready(function() {
  if ((jq("#map").width() < 520)) {
      map.flyTo({
          center: mcenter,
          zoom: 10
      });
  }
  jq(window).resize(function() {
      if ((jq("#map").width() < 520)){
          map.flyTo({
              center: mcenter,
              zoom: 10
          });
      } else {
          map.flyTo({
              center: center,
              zoom: zoom
          });
      }
  });
});

map.resize();
}

    onMount(() => {
        makeMap();
    });
</script>

<div id="map_alt"></div>