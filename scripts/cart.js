const cart = [];
const cartList = document.querySelector("#cart-list");
const cartEmpty = document.querySelector("#cart-empty");
const cartTotal = document.querySelector("#cart-total");
const cartCount = document.querySelector("#cart-count");
const cartMessage = document.querySelector("#cart-message");
const storageMessage = document.querySelector("#storage-message");
const checkoutButton = document.querySelector("#checkout-button");
const checkoutSection = document.querySelector("#checkout");
const cartStorageKey = "kalinin-goalie-cart";

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
        if (!Array.isArray(savedCart)) {
            return;
        }

        for (const item of savedCart) {
            if (!item || !Number.isSafeInteger(item.quantity) || item.quantity < 1) {
                continue;
            }
            const product = products.find(function (product) {
                return product.id === item.productId;
            });
            const duplicate = cart.some(function (cartItem) {
                return cartItem.productId === item.productId;
            });
            if (product && !duplicate) {
                cart.push({ productId: item.productId, quantity: item.quantity });
            }
        }
    } catch {
        storageMessage.textContent = "Не удалось загрузить сохранённую корзину. Можно собрать её заново.";
    }
}

function saveCart() {
    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
        storageMessage.textContent = "";
    } catch {
        storageMessage.textContent = "Браузер не позволяет сохранить корзину. После обновления изменения могут потеряться.";
    }
}

function addToCart(productId) {
    const item = cart.find(function (item) {
        return item.productId === productId;
    });

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCart();
    renderCart();
    document.querySelector("#order-message").textContent = "";
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
    saveCart();
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
    checkoutButton.disabled = cart.length === 0;
    if (cart.length === 0) {
        checkoutSection.hidden = true;
        checkoutButton.setAttribute("aria-expanded", "false");
    }
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
            saveCart();
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

loadCart();
renderCart();
