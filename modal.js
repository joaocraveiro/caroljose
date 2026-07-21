    const modal = document.getElementById("website-modal");
    const openButton = document.getElementById("open-modal");
    const closeButtons = modal.querySelectorAll("[data-close-modal]");

    function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".modal__close").focus();
}

    function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    openButton.focus();
}

    openButton.addEventListener("click", openModal);

    closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
});

    document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
    closeModal();
}
});