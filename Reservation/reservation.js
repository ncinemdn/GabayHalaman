const DEFAULT_PLANT_IMAGE =
"https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const plantsByCategory = {
"Fruit Bearing":[
{id:1,name:"Rambutan RR Tuklapin",price:250,image:DEFAULT_PLANT_IMAGE},
{id:2,name:"Mangosteen",price:350,image:DEFAULT_PLANT_IMAGE},
{id:3,name:"Durian Puyat",price:300,image:DEFAULT_PLANT_IMAGE}
],

"Citrus Variety":[
{id:4,name:"Calamansi",price:200,image:DEFAULT_PLANT_IMAGE},
{id:5,name:"Lemon Meyer",price:250,image:DEFAULT_PLANT_IMAGE}
],

"Mangga Variety":[
{id:6,name:"Carabao Mango",price:350,image:DEFAULT_PLANT_IMAGE},
{id:7,name:"Indian Mango",price:250,image:DEFAULT_PLANT_IMAGE}
],

"Dwarf Coconut":[
{id:8,name:"Golden Coconut",price:400,image:DEFAULT_PLANT_IMAGE}
]
};

let selectedPlant=null;

function updatePlantDisplay(){

const category=document.getElementById("category").value;
const display=document.getElementById("plantDisplay");

if(!category){
display.innerHTML=`<div class="empty-state">Select a category to view plants</div>`;
return;
}

const plants=plantsByCategory[category]||[];

let html='<div class="plants-list">';

plants.forEach(p=>{

html+=`
<div class="plant-card ${selectedPlant?.id===p.id?'selected':''}"
onclick="selectPlant(${p.id},'${category}')">

<img src="${p.image}" class="plant-image">

<div>
<div class="plant-name">${p.name}</div>
<div class="plant-price">₱${p.price}</div>
</div>

</div>
`;

});

html+="</div>";

display.innerHTML=html;

}

function selectPlant(id,category){

selectedPlant=plantsByCategory[category].find(p=>p.id===id);

updatePlantDisplay();

}

function handleReserve(){

const category=document.getElementById("category").value;
const size=document.getElementById("plantSize").value;
const quantity=document.getElementById("quantity").value;
const date=document.getElementById("deliveryDate").value;

if(!selectedPlant){
alert("Please select a plant.");
return;
}

alert(
`Reservation Successful!

Plant: ${selectedPlant.name}
Category: ${category}
Size: ${size}
Quantity: ${quantity}
Delivery: ${date}`
);

}

document.getElementById("category")
.addEventListener("change",updatePlantDisplay);

updatePlantDisplay();