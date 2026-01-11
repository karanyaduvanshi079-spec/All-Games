const cards = document.querySelectorAll(".card");


cards.forEach(card => {
  card.addEventListener("click", () => {

    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    

    const link = card.querySelector("a").href;
    setTimeout(() => {
      window.location.href = link;
    }, 200);
  });
});
