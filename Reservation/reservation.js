const DEFAULT_PLANT_IMAGE =
"https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const plantsByCategory = {
"Fruit Bearing":[
{id:1,name:"Rambutan RR Tuklapin",price:250,image:DEFAULT_PLANT_IMAGE},
{id:2,name:"Mangosteen",price:350,image:DEFAULT_PLANT_IMAGE},
{id:3,name:"Durian Puyat",price:300,image:DEFAULT_PLANT_IMAGE},
{id:4,name:"Lansones Longkong",price:350,image:DEFAULT_PLANT_IMAGE},
{id:5,name:"Sweet Tamarind",price:250,image:DEFAULT_PLANT_IMAGE},
{id:6,name:"Bangkok Santol",price:250,image:DEFAULT_PLANT_IMAGE},
{id:7,name:"Dian't Duhat",price:250,image:DEFAULT_PLANT_IMAGE},
{id:8,name:"Sweet Balimbing",price:250,image:DEFAULT_PLANT_IMAGE},
{id:9,name:"Atis",price:300,image:DEFAULT_PLANT_IMAGE},
{id:10,name:"Chico",price:300,image:DEFAULT_PLANT_IMAGE},
{id:11,name:"Macopa Red",price:260,image:DEFAULT_PLANT_IMAGE},
{id:12,name:"Avocado Lagkitan",price:350,image:DEFAULT_PLANT_IMAGE},
{id:13,name:"Cacao",price:200,image:DEFAULT_PLANT_IMAGE}
],

"Citrus Variety":[
{id:14,name:"Japanese Orange",price:300,image:DEFAULT_PLANT_IMAGE},
{id:15,name:"Davao Pomelo",price:250,image:DEFAULT_PLANT_IMAGE},
{id:16,name:"Satsuma Citrus",price:250,image:DEFAULT_PLANT_IMAGE},
{id:17,name:"Dalanghita",price:250,image:DEFAULT_PLANT_IMAGE},
{id:18,name:"Dayap",price:250,image:DEFAULT_PLANT_IMAGE},
{id:19,name:"Calamansi",price:200,image:DEFAULT_PLANT_IMAGE},
{id:20,name:"Kiat Kiat",price:300,image:DEFAULT_PLANT_IMAGE},
{id:21,name:"Poncan",price:250,image:DEFAULT_PLANT_IMAGE},
{id:22,name:"Lemon Meyer",price:250,image:DEFAULT_PLANT_IMAGE}
],

"Mangga Variety":[
{id:23,name:"Carabao Mango",price:350,image:DEFAULT_PLANT_IMAGE},
{id:24,name:"Queen Mango",price:350,image:DEFAULT_PLANT_IMAGE},
{id:25,name:"Sweet Catimon",price:350,image:DEFAULT_PLANT_IMAGE},
{id:26,name:"Sweet Catimon Double Rootstock",price:800,image:DEFAULT_PLANT_IMAGE},
{id:27,name:"Indian Mango",price:250,image:DEFAULT_PLANT_IMAGE},
{id:28,name:"King Mango",price:350,image:DEFAULT_PLANT_IMAGE},
{id:29,name:"Purple Mango",price:350,image:DEFAULT_PLANT_IMAGE},
{id:30,name:"Apple Mango",price:250,image:DEFAULT_PLANT_IMAGE}
],

"Dwarf Coconut":[
{id:31,name:"Golden Coconut",price:400,image:DEFAULT_PLANT_IMAGE},
{id:32,name:"Tacunan Variety",price:550,image:DEFAULT_PLANT_IMAGE},
{id:33,name:"Catigan Variety",price:250,image:DEFAULT_PLANT_IMAGE}
],

"Cuttings/Dwarf":[
{id:34,name:"Red Guaple",price:200,image:DEFAULT_PLANT_IMAGE},
{id:35,name:"Green Guaple",price:200,image:DEFAULT_PLANT_IMAGE},
{id:36,name:"Marang",price:250,image:DEFAULT_PLANT_IMAGE},
{id:37,name:"Lychee",price:350,image:DEFAULT_PLANT_IMAGE},
{id:38,name:"Langka",price:200,image:DEFAULT_PLANT_IMAGE},
{id:39,name:"Hybrid Mulberry",price:200,image:DEFAULT_PLANT_IMAGE},
{id:40,name:"Paminta",price:250,image:DEFAULT_PLANT_IMAGE},
{id:41,name:"Red Cardinal Grapes",price:250,image:DEFAULT_PLANT_IMAGE},
{id:42,name:"Miracle Fruit",price:300,image:DEFAULT_PLANT_IMAGE},
{id:43,name:"Magic Fruit",price:300,image:DEFAULT_PLANT_IMAGE},
{id:44,name:"Sweet Guyabano",price:300,image:DEFAULT_PLANT_IMAGE},
{id:45,name:"Karamay",price:300,image:DEFAULT_PLANT_IMAGE},
{id:46,name:"Sarguelas/Siniguelas",price:300,image:DEFAULT_PLANT_IMAGE},
{id:47,name:"Abiu",price:300,image:DEFAULT_PLANT_IMAGE},
{id:48,name:"Caimito",price:250,image:DEFAULT_PLANT_IMAGE},
{id:49,name:"Mabolo",price:300,image:DEFAULT_PLANT_IMAGE},
{id:50,name:"Cacao",price:200,image:DEFAULT_PLANT_IMAGE},
{id:51,name:"Kamias/Pias",price:250,image:DEFAULT_PLANT_IMAGE},
{id:52,name:"Bignay",price:250,image:DEFAULT_PLANT_IMAGE},
{id:53,name:"Pomegranate",price:300,image:DEFAULT_PLANT_IMAGE},
{id:54,name:"Longan",price:300,image:DEFAULT_PLANT_IMAGE}
],

"Flowering Trees":[
{id:55,name:"Golden Trumpet",price:700,image:DEFAULT_PLANT_IMAGE},
{id:56,name:"Pink Trumpet",price:800,image:DEFAULT_PLANT_IMAGE},
{id:57,name:"Golden Shower",price:900,image:DEFAULT_PLANT_IMAGE},
{id:58,name:"Fire Tree",price:1200,image:DEFAULT_PLANT_IMAGE},
{id:59,name:"Ilang Ilang",price:700,image:DEFAULT_PLANT_IMAGE},
{id:60,name:"Jacaranda",price:1000,image:DEFAULT_PLANT_IMAGE},
{id:61,name:"Pine Tree",price:1200,image:DEFAULT_PLANT_IMAGE},
{id:62,name:"Palm Tree",price:1500,image:DEFAULT_PLANT_IMAGE},
{id:63,name:"Dates Palm",price:1500,image:DEFAULT_PLANT_IMAGE},
{id:64,name:"Dates Palm Bull Out",price:5500,image:DEFAULT_PLANT_IMAGE},
{id:65,name:"Palawan Cherry Blossom 3ft",price:450,image:DEFAULT_PLANT_IMAGE},
{id:66,name:"Palawan Cherry Blossom Bull Out",price:3500,image:DEFAULT_PLANT_IMAGE}
],

"Forest Trees":[
{id:67,name:"Gemelina",price:250,image:DEFAULT_PLANT_IMAGE},
{id:68,name:"Mahogany",price:350,image:DEFAULT_PLANT_IMAGE},
{id:69,name:"Narra",price:350,image:DEFAULT_PLANT_IMAGE},
{id:70,name:"Molave",price:250,image:DEFAULT_PLANT_IMAGE},
{id:71,name:"Pole Bamboo",price:550,image:DEFAULT_PLANT_IMAGE},
{id:72,name:"Thai Bamboo",price:550,image:DEFAULT_PLANT_IMAGE}
],

"Others":[
{id:73,name:"Arabica Coffee",price:150,image:DEFAULT_PLANT_IMAGE},
{id:74,name:"Robusta",price:150,image:DEFAULT_PLANT_IMAGE},
{id:75,name:"Barako",price:150,image:DEFAULT_PLANT_IMAGE}
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

const plant = plantsByCategory[category].find(p=>p.id===id);

if (selectedPlant && selectedPlant.id === id) {
    selectedPlant = null;
} else {
    selectedPlant = plant;
}

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