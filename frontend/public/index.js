/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

// Shortcuts to DOM Elements.
const recentWaterSection = document.getElementById('recent-water-list')
const signInButton = document.getElementById('sign-in-button')
const loadDataButton = document.getElementById('load-data-button')
const plantList = document.getElementById("plant-list");
const lightRange = [200,4000];
const waterRange = [4095, 500];
let listeningFirebaseRefs = [];

function startDatabaseQueries() {
    getPlants().then((firstPlant) => {
       setAndTrackPlant(firstPlant);
    }).catch((error) => {
        console.log('Error getting plants.');
    });
}

function changePlant(event) {
    console.log(event);
    const uuid = event.target.getAttribute('uuid');
    console.log(`Change to plant: ${uuid}`);
    setAndTrackPlant(uuid);
}

function configButton(event) {
    event.stopPropagation();
    console.log(event);
    const uuid = event.target.getAttribute('uuid');
    const plantName = event.target.getAttribute('name');
    console.log(`Plant to config: ${uuid}`);
    document.getElementById("plant-uuid").value = uuid;
    document.getElementById("plant-name").value = plantName;
    document.getElementById('plant-config-dialog').showModal();
}

function savePlantConfig() {
    console.log('Save Plant Config');
    const plantUuid = document.getElementById("plant-uuid").value;
    const plantName = document.getElementById("plant-name").value;
    const plantConfigRef = firebase.database().ref(`plants/${plantUuid}/config/name`);
    plantConfigRef.set(plantName);
    document.getElementById(`plant-button-${plantUuid}`).textContent = plantName;
    document.getElementById(`plant-button-${plantUuid}`).setAttribute('name', plantName);
    document.getElementById('plant-config-dialog').close();
}

function setAndTrackPlant(uuid) {
    const currentRef = firebase.database().ref(`plants/${uuid}/last_update`);
    const logsRef = firebase.database().ref(`plants/${uuid}/logs`).limitToLast(500);
    logsRef.on("value", updateCharts, (error) => {
        console.log("Error: " + error.code);
    });
    listeningFirebaseRefs = [logsRef, currentRef];
}

function updateCharts(snapshot) {
    const log = Object.values(snapshot.val())
    log.forEach(function(d){ 
        d.timestamp = new Date(d.timestamp * 1000) 
        d.light_perc = ((d.light - lightRange[0]) * 100) / (lightRange[1] - lightRange[0])
        d.water_perc = ((d.water - waterRange[0]) * 100) / (waterRange[1] - waterRange[0])
    });
    updateLines(log)
    updateDonuts(log[log.length - 1]);
}

function getPlants() {
    return new Promise((resolve) => {
        const plantsRef = firebase.database().ref("plants");
        plantsRef.once("value", function(snap) {
            const plants = snap.val();
            const plantList = document.getElementById("plant-list");
            const [firstPlant] = Object.keys(snap.val());
            for(const plantUuid of Object.keys(snap.val())) {
                const plant = plants[plantUuid];
                let plantName = plantUuid;
                if(plant.config && plant.config.name) {
                    plantName = plant.config.name;
                }
                const plantMenuButton = getPlantMenuItem(plantUuid, plantName);
                plantList.appendChild(plantMenuButton);
            }
            resolve(firstPlant);
        });
    });
}

function getPlantMenuItem(uuid, name) {
    const plantButton = document.createElement("a");
    plantButton.className = "mdl-navigation__link";
    plantButton.setAttribute('uuid', uuid);
    plantButton.setAttribute('name', name);
    plantButton.addEventListener('click', changePlant);

    const plantIcon = document.createElement("i");
    plantIcon.className = "plant-icon mdl-color-text--blue-grey-400 material-icons";
    plantIcon.innerHTML = "local_florist";
    plantIcon.setAttribute('uuid', uuid);
    plantIcon.setAttribute('name', name);

    const nameElement = document.createElement("span");
    nameElement.textContent = name;
    nameElement.id = `plant-button-${uuid}`;
    nameElement.setAttribute('uuid', uuid);
    nameElement.setAttribute('name', name);

    const plantConfigIcon = document.createElement("i");
    plantConfigIcon.className = "plant-settings mdl-color-text--blue-grey-400 material-icons";
    plantConfigIcon.innerHTML = "settings";
    plantConfigIcon.setAttribute('uuid', uuid);
    plantConfigIcon.setAttribute('name', name);
    plantConfigIcon.addEventListener('click', configButton);

    plantButton.appendChild(plantIcon);
    plantButton.appendChild(nameElement);
    plantButton.appendChild(plantConfigIcon);

    return plantButton;
}

/**
 * Triggers every time there is a change in the Firebase auth state (i.e. user signed-in or user signed out).
 */
function onAuthStateChanged(user) {
    if (user) {
        startDatabaseQueries();
        document.querySelector("img.user-avatar").src = `${user.photoURL}=s48`;
        document.querySelector("div.user-email").innerHTML = user.email;
        document.getElementById("logged-in").classList.remove("hidden");
        document.getElementById("logged-out").classList.add("hidden");
    } else {
        document.querySelector("img.user-avatar").src = '';
        document.querySelector("div.user-email").innerHTML = '';
        document.getElementById("logged-in").classList.add("hidden");
        document.getElementById("logged-out").classList.remove("hidden");
    }
}

window.addEventListener('load', function() {
  const provider = new firebase.auth.GoogleAuthProvider();
  signInButton.addEventListener('click', () => {
    firebase.auth().signInWithPopup(provider);
  });
  firebase.auth().onAuthStateChanged(onAuthStateChanged);
  const plantConfigSaveBtn = document.getElementById('plant-config-save');
  const plantConfigCancelBtn = document.getElementById('plant-config-cancel');

  plantConfigSaveBtn.addEventListener('click', savePlantConfig);
  plantConfigCancelBtn.addEventListener('click', () => {
      document.getElementById('plant-config-dialog').close();
  });
  document.getElementById('log-out-button').addEventListener('click', () => {
    firebase.auth().signOut();
  });
}, false);

/**
 * Visualisation 
 */
const margin = {top: 20, right: 30, bottom: 30, left: 40}
const width = 900 - margin.left - margin.right, height = 400 - margin.top - margin.bottom;
// append the svg object 
const svg = d3
    .select("#graph")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

const graph = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleTime().range([0, width])
const yScaleLight = d3.scaleLinear().range([height, 0])
const yScaleWater = d3.scaleLinear().range([height, 0])

const xAxisGroup = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(50,${height + margin.bottom})`)
        
const yAxisLight = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

const yAxisWater = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${width + margin.left}, ${margin.top})`)

const pathLight = graph
    .append('g')
    .append("path")  
    .attr('fill', 'none')
    .attr('stroke', '#ef6c00')
    .attr('stroke-width', 1)

const pathWater = graph
    .append('g')
    .append("path")  
    .attr('fill', 'none')
    .attr('stroke', '#0288d1')
    .attr('stroke-width', 1)

const lineLight = d3.line()
    .defined(d => !isNaN(d.light))
    .x(d => xScale(d.timestamp))
    .y(d => yScaleLight(d.light_perc))
    .curve(d3.curveMonotoneX) 

const lineWater = d3.line()
    .defined(d => !isNaN(d.water))
    .x(d => xScale(d.timestamp))
    .y(d => yScaleWater(d.water_perc))
    .curve(d3.curveMonotoneX)     

/** 
* Some simple application logic
*/

const updateLines = data => {
    console.log('Updating line data');

    xScale.domain(d3.extent(data, d => d.timestamp))
    yScaleLight.domain([0, 100])
    yScaleWater.domain([0, 100])

    xAxisGroup
        .call(d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%a %H:%M"))
        .ticks(width / 80).tickSizeOuter(0))

    yAxisLight
        .call(d3.axisLeft(yScaleLight))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone())

    yAxisWater
        .call(d3.axisRight(yScaleWater))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone())

    pathLight
        .datum(data)
        .attr('d', lineLight)    

    pathWater
        .datum(data)
        .attr('d', lineWater)   
}


const donutDims = {width: 180, height: 180, radius: 90, hole: 40}
const donutColors = ['#64b5f6', '#eee', '#ff9800']

const arc = d3.arc()
    .innerRadius(donutDims.radius - donutDims.hole)
    .outerRadius(donutDims.radius);

let donutgroup = []
document.querySelectorAll('.donut').forEach((element) => {
    donutgroup.push(d3.select(element)
        .append('svg')
        .attr('width', donutDims.width)
        .attr('height', donutDims.height)
        .append('g')
        .attr('class', 'donut-container')
        .attr('transform', `translate(${ donutDims.width / 2 },${ donutDims.height / 2 })`))   
});

const updateDonuts = data => {
    const waterData = [{type: 'water', perc: data.water_perc}, {type: 'rest', perc: 100 - data.water_perc}]
    const lightData = [{type: 'light', perc: data.light_perc}, {type: 'rest', perc: 100 - data.light_perc}]
    const colorScale = d3.scaleOrdinal( waterData.map(d => d.type), donutColors )

    const pie = d3.pie()
        .padAngle(0.005)
        .sort(null)
        .value(d => d.perc)
    const pieArcsWater = pie(waterData);
    const pieArcsLight = pie(lightData);

    donutgroup[0].selectAll('path')
        .data(pieArcsWater)
        .join('path')
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('fill', d => colorScale( d.data.type ))
            .attr('d', arc)

  	donutgroup[0].selectAll("text")
  	  .data([waterData])
  	  .join("text")
  	  .attr("text-anchor", "middle")
  	  .attr("dy", ".3em")
  	  .style("font", "8px sans-serif")
  	  .style("max-width", "100%")
  	  .style("height", "auto")
  	  .attr("text-anchor", "middle")
  	  .attr("fill", '#616161')
  	  .text( d => Math.floor(d[0].perc) + "%")
        .attr("transform", `scale(${ (donutDims.radius - donutDims.hole)/15 })`);    
        

    donutgroup[1].selectAll('path')
        .data(pieArcsLight)
        .join('path')
            .style('stroke', 'white')
            .style('stroke-width', 2)
            .style('fill', d => colorScale( d.data.type ))
            .attr('d', arc)

  	donutgroup[1].selectAll("text")
  	  .data([lightData])
  	  .join("text")
  	  .attr("text-anchor", "middle")
  	  .attr("dy", ".3em")
  	  .style("font", "8px sans-serif")
  	  .style("max-width", "100%")
  	  .style("height", "auto")
  	  .attr("text-anchor", "middle")
  	  .attr("fill", '#616161')
  	  .text( d => Math.floor(d[0].perc) + "%")
  	  .attr("transform", `scale(${ (donutDims.radius - donutDims.hole)/15 })`);           
}

