<script>

    import * as mapboxgl from "mapbox-gl"
    import { onMount } from "svelte";
    import { filteredData } from "../getData";
    import { HomeReset, MetroReset } from "../mapButtons";

    let map;
    let markersLoaded = false;
    let pointId = null;

    const token = "pk.eyJ1Ijoic3RhcnRyaWJ1bmUiLCJhIjoiY2xiNWF4OHFoMDRzczNybzEyMXFteTZ1YiJ9.WGjxTW63c5_XCbtZ5f8Yyw";
    const center = [-93.265015, 44.977753];
    const mcenter = [-93.265015, 44.977753];
    const zoom = 9.5;

    const createMap = () => {
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/startribune/ck1b7427307bv1dsaq4f8aa5h',
            center: center,
            zoom: zoom,
            maxZoom: 14,
            maxBounds: [-105, 43, -80, 50],
            scrollZoom: false,
            accessToken: token
        });

        let scale = new mapboxgl.ScaleControl({
            maxWidth: 80,
            unit: 'imperial'
        });
        map.addControl(scale)

        const stateZoom = new HomeReset(map);
        const metroZoom = new MetroReset(map);

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            map.dragPan.disable();
            map.keyboard.disable();
            map.dragRotate.disable();
            map.touchZoomRotate.disableRotation();
            map.scrollZoom.disable();
        } else {
            map.getCanvas().style.cursor = 'pointer';
            map.addControl(new mapboxgl.NavigationControl({ showCompass: false }),'top-left');
        }
        map.addControl(stateZoom, "bottom-left");
        map.addControl(metroZoom, "bottom-left");

        map.on("load", () =>{
            // Add a temporary points source which will get replaced once data and map load
            map.addSource("points", {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [
                        {
                            type: 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': center
                            }
                        }
                    ]
                },
                generateId: true
            });

            map.addLayer({
                id: "markers",
                source: "points",
                type: "circle",
                paint: {
                    "circle-stroke-color": "#cccccc",
                    "circle-stroke-width": 1,
                    "circle-color": [
                        "case",
                        ["boolean", ["feature-state", "hover"], false],
                        ["literal",
                        "#e1b79c"],
                        "#b9625f"
                    ]
                }
            });

            markersLoaded = true;

        });

        const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        // Hover effects and popup
        map.on("mousemove", "markers", (event) => {

            map.getCanvas().style.cursor = 'pointer';

            if (pointId) {
                map.removeFeatureState({
                    source: 'points',
                    id: pointId
                });
            }
            pointId = event.features[0].id;
            map.setFeatureState(
                {
                    source: 'points',
                    id: pointId
                },
                {
                    hover: true
                }
            );
            const coordinates = event.features[0].geometry.coordinates.slice();
            const name = event.features[0].properties.name;
            while (Math.abs(event.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += event.lngLat.lng > coordinates[0] ? 360 : -360;
            }
            popup.setLngLat(coordinates).setHTML(name).addTo(map);
        });

        map.on("mouseleave", "markers", () => {
            if (pointId) {
                map.setFeatureState(
                    {
                        source: "points",
                        id: pointId
                    },
                    {
                        hover: false
                    }
                );
            }

            pointId = null;

            map.getCanvas().style.cursor = "";
            popup.remove();
        });

        // Scroll to record on click
        map.on("click", "markers", (event) => {
            const el = document.getElementById(event.features[0].properties.id)
            el.scrollIntoView({"behavior":"smooth"})
        });

    }

    // Update "points" source based on $filteredData store
    const addMarkers = () => {
        let bounds = new mapboxgl.LngLatBounds()
        let data = {
            type: "FeatureCollection",
            features: []
        }
        $filteredData.forEach((d)=>{
            data.features.push(
                {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [d.Longitude, d.Latitude]
                    },
                    id: d.index,
                    properties: {
                        "name": `${d.FirstName} ${d.LastName}`,
                        "id": `record${d.index}`
                    }
                }
            )
            bounds.extend([d.Longitude, d.Latitude])
        })
        map.getSource("points").setData(data)
        map.fitBounds(bounds, {padding: 40});
    }

    $: if (map && markersLoaded && $filteredData) {
        addMarkers();
    }

    onMount(()=>{
        createMap();
    })
    
</script>

<div id="map" class="mapbox-map"></div>

<style>
    #map {
        height: 550px;
    }

    :global(.circle-marker) {
        background-color: #b9625f;
        opacity: .8;
        height: 7px;
        width: 7px;
        border-radius: 7px;
        border: 1px solid #cccccc;
    }

    :global(.circle-marker:hover) {
        background-color: #e1b79c;
    }
</style>