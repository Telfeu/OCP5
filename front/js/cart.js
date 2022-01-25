let userCart = JSON.parse(localStorage.getItem("cartProduct"));
let productsInfo = [];
var totalPriceCart = 0;



// Récupération du panier

async function fetchCart(){

    if (userCart === null || userCart.length === 0){
        
        window.alert("Panier vide");
    }
    else{

for (const productCart of userCart){
    let response = await fetch(`http://localhost:3000/api/products/${productCart.idProduct}`, {
        method: "GET",
        headers:{
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
    }
    );
    let product = await response.json();
    productsInfo.push(product);
    displayProductCart(productCart, product);
    totalPriceCart += calcTotalprice(productCart, product);
    displayTotalprice(totalPriceCart);
    

}

const deleteButtons = document.getElementsByClassName("deleteItem");

for(deleteButton of deleteButtons){
deleteButton.onclick = removeProduct;
}

const quantityInputs = document.getElementsByClassName("itemQuantity");


for(quantityInput of quantityInputs){
    quantityInput.addEventListener('input', updateQuantity);
}

}
}

// Affichage dans le DOM des produits du panier

function displayProductCart(productCart, product){

let elt = document.getElementById('cart__items');
elt.innerHTML +=`
    <article class="cart__item" data-id="${product._id}">
    <div class="cart__item__img">
      <img src="${product.imageUrl}" alt="${product.altTxt}">
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__titlePrice">
        <h2>${product.name}</h2>
        <h2 class="cart__item__color" data-color="${productCart.color}">${productCart.color}</h2>
       <p>${product.price}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
         <p>Qté :</p>
         <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productCart.productQuantity}">
      </div>
      <div class="cart__item__content__settings__delete">
         <p class="deleteItem">Supprimer</p>
       </div>
     </div>
    </div>
 </article>

`

}

// Calcul du total

function calcTotalprice(productCart, product){
    var totalPrice = (productCart.productQuantity * product.price);
    return totalPrice;
}


// Fonction d'affichage du total

function displayTotalprice(totalPriceCart){
    let priceCart = document.getElementById('totalPrice');
    priceCart.innerHTML = totalPriceCart;
}



// Fonction pour retirer un produit du panier et du local storage

async function removeProduct(){

    var removeId = this.closest("article").getAttribute("data-id");
    var removeColor = this.closest("article > div").querySelector('.cart__item__color').getAttribute("data-color");


    let filtre = userCart.findIndex(x => (x.idProduct == removeId) && (x.color == removeColor));

    if(filtre!=-1){
        totalPriceCart -= productsInfo[filtre].price*userCart[filtre].productQuantity;
        displayTotalprice(totalPriceCart);
        userCart.splice(filtre, 1);
        localStorage.setItem("cartProduct", JSON.stringify(userCart));
        
        
    }
    else{
        window.alert("Erreur : le produit n'existe pas ou plus dans votre panier");
    }

    this.closest("article").remove();
}


// Fonction pour mettre à jour la quantité d'un produit

function updateQuantity(){
    var newQuantity = this.value;

    var removeId = this.closest("article").getAttribute("data-id");
    var removeColor = this.closest("article > div").querySelector('.cart__item__color').getAttribute("data-color");

    let filtre = userCart.findIndex(x => (x.idProduct == removeId) && (x.color == removeColor));

    if(filtre!=-1){
        
        if(newQuantity <= 100 && newQuantity >= 1){

            if(userCart[filtre].productQuantity > newQuantity){
                totalPriceCart -= productsInfo[filtre].price*(userCart[filtre].productQuantity-newQuantity);
                userCart[filtre].productQuantity = newQuantity;
                localStorage.setItem("cartProduct", JSON.stringify(userCart));
                displayTotalprice(totalPriceCart);
            }
            else{
                totalPriceCart += productsInfo[filtre].price*(newQuantity-userCart[filtre].productQuantity);
                userCart[filtre].productQuantity = newQuantity;
                localStorage.setItem("cartProduct", JSON.stringify(userCart));
                displayTotalprice(totalPriceCart);
            }
        }
        else{
            if(newQuantity > 100){
                totalPriceCart -= productsInfo[filtre].price*userCart[filtre].productQuantity;
                userCart[filtre].productQuantity = 100;
                this.value = 100;
                totalPriceCart += productsInfo[filtre].price*userCart[filtre].productQuantity;
                localStorage.setItem("cartProduct", JSON.stringify(userCart));
                displayTotalprice(totalPriceCart);
            }
            if(newQuantity < 1){
                totalPriceCart -= productsInfo[filtre].price*userCart[filtre].productQuantity;
                userCart[filtre].productQuantity = 1;
                this.value = 1;
                totalPriceCart += productsInfo[filtre].price*userCart[filtre].productQuantity;
                localStorage.setItem("cartProduct", JSON.stringify(userCart));
                displayTotalprice(totalPriceCart);
                }
        }

    }
    else{
        window.alert("Erreur : le produit n'existe pas dans le panier");
    }
}



// Envoie de la commande au serveur

function validateForm(e){
    e.preventDefault();

    // Vérification si le panier est vide

    if (userCart === null || userCart.length === 0){
        window.alert("Le panier est vide.");
    }
    else{

    // Récupération des infos de l'utilistateur



    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var address = document.getElementById('address').value;
    var city = document.getElementById('city').value;
    var email = document.getElementById('email').value;

    var validation = formCheck(firstName, lastName, city, address, email);

    if(validation==true){
    


    const products=[];
    const contact=
        {        
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        }
    ;

    for (const productCart of userCart){
        products.push(productCart.idProduct);
    }


    let request = {
        contact:contact,
        products:products
    };




    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers:{
            'Accept' : 'application/json',
            'Content-Type': 'application/json'
            
        },
        body: JSON.stringify(request)
    })
    .then((res)=>{

        if(res.ok){
            return res.json();
        }
    }
    )
    .then(function(confirm){

        window.location.href = `./confirmation.html?id=${confirm.orderId}`;
    })

}
    }
}



// Vérification du formulaire

function formCheck(firstName, lastName, city, address, mail){
    let formCheck;
    var firstNameCheck = /^[a-zA-Z]+$/i;
    var lastNameCheck = /^[a-zA-Z]+$/i;
    var cityCheck = /^[a-zA-Z]+$/i;
    var addressCheck = /^[a-z0-9 ]+$/i;
    var emailCheck = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;




    if(firstName.match(firstNameCheck)&&mail.match(emailCheck)&&lastName.match(lastNameCheck)&&city.match(cityCheck)&&address.match(addressCheck)){

        formCheck=true;
        return formCheck;
    }



    else{
        window.alert("Erreur dans le formulaire : veuillez vérifier vos informations");
        document.getElementById('firstNameErrorMsg').innerHTML="";
        document.getElementById('lastNameErrorMsg').innerHTML="";
        document.getElementById('cityErrorMsg').innerHTML="";
        document.getElementById('addressErrorMsg').innerHTML="";
        document.getElementById('emailErrorMsg').innerHTML="";


        if(firstNameCheck.test(firstName)!=true){

            document.getElementById('firstNameErrorMsg').innerHTML="Erreur dans le prénom";


        }

        if(lastNameCheck.test(lastName)!=true){

            document.getElementById('lastNameErrorMsg').innerHTML="Erreur dans le nom";
        }

        if(cityCheck.test(city)!=true){
            document.getElementById('cityErrorMsg').innerHTML="Erreur dans la ville";
        }

        if(addressCheck.test(address)!=true){
            document.getElementById('addressErrorMsg').innerHTML="Erreur dans l'adresse";
        }

        if(emailCheck.test(mail)!=true){
            document.getElementById('emailErrorMsg').innerHTML="Erreur dans le mail";
        }


        formCheck=false;
        return formCheck;
    }
}



// Affichage de l'identifiant de la commande

function showOrderID(){
    const idOrder_url = window.location.search;
    const urlSearch = new URLSearchParams(idOrder_url);
    const idOrder = urlSearch.get("id");
    const spanOrder = document.getElementById("orderId");
    spanOrder.insertAdjacentText('beforebegin', idOrder);
    localStorage.clear();

}


// Récupération de la page sur laquelle l'utilisateur se trouve

const nomPath = window.location.pathname;

// Si sur la page panier

if(nomPath.includes("cart") == true){
fetchCart()
    .then(() => { 

    }
    );

    document.getElementsByClassName("cart__order__form")[0].addEventListener("submit", validateForm);
}




// Si sur la page confirmation
  
    if(nomPath.includes("confirmation") == true){
        showOrderID()
    }
 
    




