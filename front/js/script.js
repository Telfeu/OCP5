// Récupération de tout les produits

fetch("http://localhost:3000/api/products", {
    method: "GET",
    headers:{
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'

    },

   
}
)


.then((res) => res.json())

// Affichage des produits sur la page d'accueil


.then((products) =>{
    let elt = document.getElementById('items');

    for(let product of products)
    elt.innerHTML +=`
    <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>
    `
}
)




