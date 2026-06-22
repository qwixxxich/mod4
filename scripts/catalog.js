document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".catalog-card");
    const dialog = document.querySelector("#catalog-dialog");
    const closeButton = dialog?.querySelector(".catalog-dialog__close");
    const title = dialog?.querySelector(".catalog-dialog__title");
    const image = dialog?.querySelector(".catalog-dialog__media");

    if (!dialog || !closeButton || !title || !image) return;

    const openDialog = (card) => {
        const productImage = card.querySelector(".catalog-card__media");

        title.textContent = card.dataset.product;
        image.src = productImage.src;
        image.alt = productImage.alt;
        dialog.showModal();
    };

    cards.forEach((card) => {
        card.addEventListener("click", (event) => {
            if (event.target.closest(".catalog-card__add")) return;

            openDialog(card);
        });

        card.addEventListener("keydown", (event) => {
            if (event.target.closest(".catalog-card__add")) return;
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            openDialog(card);
        });
    });

    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
});
