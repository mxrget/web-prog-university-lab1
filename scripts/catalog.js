const productList = document.querySelector("#product-list");

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.width = 320;
    image.height = 320;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = product.price.toLocaleString("ru-RU") + " ₽";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Добавить в корзину";
    button.addEventListener("click", function () {
        addToCart(product.id);
    });

    card.append(image, name, description, price, button);
    return card;
}

for (const product of products) {
    const card = createProductCard(product);
    productList.append(card);
}
