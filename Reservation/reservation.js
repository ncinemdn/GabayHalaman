const plantsByCategory = {

"Fruit Bearing":[
{
name:"Rambutan",
price:250,
image:"https://images.unsplash.com/photo-1609123079242-086695c6ff09"
},
{
name:"Mangosteen",
price:350,
image:"https://images.unsplash.com/photo-1706698352015-a907c7f8a445"
}
]

};

const categorySelect = document.getElementById("category");
const plantDisplay = document.getElementById("plantDisplay");

let selectedPlant = null;

categorySelect.addEventListener("change",function(){

const category=this.value;

plantDisplay.innerHTML="";

if(!plantsByCategory[category]){
plantDisplay.innerHTML="<p>No plants available</p>";
return;
}

plantsByCategory[category].forEach(plant=>{

const card=document.createElement("div");
card.className="plant-card";

card.innerHTML=`
<img src="${plant.image}">
<div>
<h3>${plant.name}</h3>
<p>₱${plant.price}</p>
</div>
`;

card.onclick=()=>{
document.querySelectorAll(".plant-card").forEach(c=>c.classList.remove("selected"));
card.classList.add("selected");
selectedPlant=plant;
};

plantDisplay.appendChild(card);

});

});

function handleReserve(){

const quantity=document.getElementById("quantity").value;
const date=document.getElementById("deliveryDate").value;

if(!selectedPlant){
alert("Please select a plant.");
return;
}

alert(
`Reservation Successful!
Plant: ${selectedPlant.name}
Quantity: ${quantity}
Delivery Date: ${date}`
);

}