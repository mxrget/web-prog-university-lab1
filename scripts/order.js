const orderForm = document.querySelector("#order-form");
const orderMessage = document.querySelector("#order-message");
const firstNameInput = document.querySelector("#first-name");
const phoneInput = document.querySelector("#phone");
const orderInputs = orderForm.querySelectorAll("input");

checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
        return;
    }
    checkoutSection.hidden = false;
    checkoutButton.setAttribute("aria-expanded", "true");
    orderMessage.textContent = "";
    firstNameInput.focus();
});

document.querySelector("#cancel-order").addEventListener("click", function () {
    checkoutSection.hidden = true;
    checkoutButton.setAttribute("aria-expanded", "false");
    checkoutButton.focus();
});

for (const input of orderInputs) {
    input.addEventListener("input", function () {
        input.setCustomValidity("");
    });
}

orderForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (cart.length === 0) {
        return;
    }

    for (const input of orderInputs) {
        input.value = input.value.trim();
        input.setCustomValidity(input.value ? "" : "Заполните это поле.");
    }

    const phone = phoneInput.value;
    const digits = phone.replace(/\D/g, "");
    if (!/^[+\d\s()-]+$/.test(phone) || digits.length < 10 || digits.length > 15) {
        phoneInput.setCustomValidity("Введите номер телефона: от 10 до 15 цифр.");
    }

    if (!orderForm.reportValidity()) {
        return;
    }
    cart.length = 0;
    saveCart();
    renderCart();
    orderForm.reset();
    cartMessage.textContent = "";
    orderMessage.textContent = "Заказ создан!";
    orderMessage.focus();
});
