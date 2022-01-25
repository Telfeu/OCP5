// Récupération ID du produit

const idProduct_url = window.location.search;
const urlSearch = new URLSearchParams(idProduct_url);
const idProduct = urlSearch.get("id");
let productLocalStorage = [];

// Récupération des informations du produit

fetch(`http://localhost:3000/api/products/${idProduct}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'

        },


    })

    .then((res) => res.json())


    // Affichage des éléments sur la page du produit

    .then((product) => {
        displayProduct(product);
    })



// Si l'utilisateur clique sur "Ajouter au panier"

var button = document.getElementById("addToCart");
button.onclick = addedCart;




// Event listener pour quantité

const quantityInput = document.getElementById("quantity");
quantityInput.addEventListener('input', updateQuantity);

// Fonction vérification quantité

function updateQuantity(){
    var newQuantity = this.value;


    if(newQuantity > 100){
        this.value = 100;
    }
    if(newQuantity < 1){
        this.value = 1;
    }
}

// Fonction d'ajout du produit au panier

function addedCart() {
    var idquantity = document.querySelector("#quantity");
    var quantity = idquantity.value;

    const inputColor = document.querySelector("#colors");
    const productColor = inputColor.value;

    
if((quantity>0 && quantity<= 100)&&(productColor!=="")){

    let productOptions = {
        idProduct : idProduct,
        color : productColor,
        productQuantity : quantity
    }


    addToLocalStorage(productOptions);
    
}

else{
    if(productColor==""){
        window.alert("Veuillez choisir une couleur");
    }
    if(quantity<=0 || quantity>= 100){
        window.alert("Veuillez saisir une quantité valide");
    }
}
}




// Fonction d'affichage des éléments

function displayProduct(product){
    let title = document.getElementById('title');
    let price = document.getElementById('price');
    let description = document.getElementById('description');
    const itemImg = document.createElement("img");

    title.insertAdjacentText('beforebegin', product.name);
    price.insertAdjacentText('beforebegin', product.price);
    description.insertAdjacentText('beforebegin', product.description);
    document.getElementsByClassName("item__img")[0].appendChild(itemImg);
    itemImg.src = product.imageUrl;
    let elt = document.getElementById('colors');
    for (let color of product.colors) {
        elt.innerHTML += `<option value="${color}">${color}</option>`
    }
}


// Fonction d'ajout dans le Local Storage
function addToLocalStorage(productOptions){


let productLocalStorage = JSON.parse(localStorage.getItem("cartProduct"));

if(productLocalStorage){

    
    let filtre = productLocalStorage.findIndex(x => (x.idProduct == productOptions.idProduct) && (x.color == productOptions.color));

    //Si ID + Couleur existe déjà
    if(filtre!=-1){

        // Si le panier contient moins de 100 fois le produit
        if(productLocalStorage[filtre].productQuantity < 100){
        // Calcul de la nouvelle quantité
        var storagequantity = parseFloat(productLocalStorage[filtre].productQuantity);
        var addquantity = parseFloat(productOptions.productQuantity);

        productLocalStorage[filtre].productQuantity = storagequantity + addquantity;


            // Si résultat en dessous de 100
            if(productLocalStorage[filtre].productQuantity <= 100){
                localStorage.setItem("cartProduct", JSON.stringify(productLocalStorage));
                window.alert("Produit ajouté au panier");
            }

            // Si résultat dépasse 100
            else{
                productLocalStorage[filtre].productQuantity = 100;
                localStorage.setItem("cartProduct", JSON.stringify(productLocalStorage));
                window.alert("Produit ajouté au panier - Quantité maximale atteinte");
            }

        }

        // Si le panier contient déjà la quantité max
        
        else{
            window.alert("Quantité maximum pour ce produit atteinte");
        }
        
    }

    else{
        // Créer nouvelle ligne dans le tableau
        productLocalStorage.push(productOptions);
        localStorage.setItem("cartProduct", JSON.stringify(productLocalStorage));
        window.alert("Produit ajouté au panier");
    }
}

else{
     productLocalStorage = [];
     productLocalStorage.push(productOptions);
     localStorage.setItem("cartProduct", JSON.stringify(productLocalStorage));
     window.alert("Produit ajouté au panier");
}

}