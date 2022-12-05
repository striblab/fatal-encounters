	/********** SPECIAL STATE AND METRO RESET BUTTONS **********/


const center = [-94.351646, 46.607469];
const metrocenter = [-93.218950, 44.935852];
const zoom = 5.5;
const mzoom = 4.5;
const metrozoom = 9;


export class HomeReset {
    constructor (map) {
        this.map = map
    }
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl my-custom-control mapboxgl-ctrl-group statereset';
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
        el.innerHTML = '<img width="15" src="https://static.startribune.com/news/projects/all/20220215-redistrict/build/img/mn.png" alt="mn" />';
        el.addEventListener('click',(e)=>{
            this.map.flyTo({
                center: center,
                zoom: (document.getElementById("map").offsetWidth < 520) ? mzoom : zoom,
            });
        },false )
        return el;
    }
}

export class MetroReset {
    constructor (map) {
        this.map = map
    }
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl my-custom-control mapboxgl-ctrl-group metroreset';

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
        el.innerHTML = '<i style="font-size:20px" class="fas fa-city"></i>';
        el.addEventListener('click', (e)=>{
            this.map.flyTo({
                center: metrocenter,
                zoom: metrozoom,
            });
        },false )
        return el;
    }
}