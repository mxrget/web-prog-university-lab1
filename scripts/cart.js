const cart = [];
const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const cartMessage = document.querySelector("#cart-message");

function addToCart(productId) {
    const item = cart.find(function (item) {
        return item.productId === productId;
    });

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    renderCart();
    const product = products.find(function (product) {
        return product.id === productId;
    });
    cartMessage.textContent = product.name + " — добавлено в корзину.";
}

function removeFromCart(productId) {
    const index = cart.findIndex(function (item) {
        return item.productId === productId;
    });

    cart.splice(index, 1);
    renderCart();
    cartMessage.textContent = "Товар удалён из корзины.";
    document.querySelector("#cart-title").focus();
}

function updateCartTotal() {
    let total = 0;
    let count = 0;

    for (const item of cart) {
        const product = products.find(function (product) {
            return product.id === item.productId;
        });
        total += product.price * item.quantity;
        count += item.quantity;
    }

    cartTotal.textContent = total.toLocaleString("ru-RU") + " ₽";
    cartCount.textContent = count;
    cartEmpty.hidden = cart.length > 0;
}

function renderCart() {
    cartList.replaceChildren();

    for (const item of cart) {
        const product = products.find(function (product) {
            return product.id === item.productId;
        });

        const row = document.createElement("li");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.width = 64;
        image.height = 64;

        const details = document.createElement("div");
        details.className = "cart-details";
        const name = document.createElement("h3");
        name.textContent = product.name;
        const unitPrice = document.createElement("p");
        unitPrice.textContent = product.price.toLocaleString("ru-RU") + " ₽ / шт.";
        details.append(name, unitPrice);

        const quantityLabel = document.createElement("label");
        quantityLabel.className = "cart-quantity";
        quantityLabel.textContent = "Количество";
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.step = "1";
        quantityInput.required = true;
        quantityInput.value = item.quantity;
        quantityInput.setAttribute("aria-label", "Количество: " + product.name);
        quantityLabel.append(quantityInput);

        const rowTotal = document.createElement("p");
        rowTotal.className = "cart-item-total";
        rowTotal.textContent = (product.price * item.quantity).toLocaleString("ru-RU") + " ₽";

        quantityInput.addEventListener("change", function () {
            const quantity = Number(quantityInput.value);
            if (!Number.isSafeInteger(quantity) || quantity < 1) {
                quantityInput.value = item.quantity;
                cartMessage.textContent = "Количество должно быть целым числом от 1.";
                return;
            }

            item.quantity = quantity;
            rowTotal.textContent = (product.price * quantity).toLocaleString("ru-RU") + " ₽";
            updateCartTotal();
            cartMessage.textContent = "Количество изменено. Итого: " + cartTotal.textContent;
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-button";
        removeButton.textContent = "Удалить";
        removeButton.setAttribute("aria-label", "Удалить: " + product.name);
        removeButton.addEventListener("click", function () {
            removeFromCart(product.id);
        });

        row.append(image, details, quantityLabel, rowTotal, removeButton);
        cartList.append(row);
    }

    updateCartTotal();
}
