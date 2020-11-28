window.onload = function () {
  const cards = document.querySelectorAll('.ms-card');
  const figcaption = document.querySelectorAll(
    '.ms-cards__wrapper figure figcaption'
  );

  figcaption.forEach((e) => {
    e.addEventListener('click', function () {
      const parentCard = this.parentNode.parentNode;

      if (!parentCard.classList.contains('card-active')) {
        parentCard.classList.add('card-active');
      } else {
        // Everything that is not cardDetails should close and it's figure dimmed
        parentCard.classList.remove('card-active');
      }
    });
  });

  // Close non-clicked items
  document.addEventListener('click', function (e) {
    cards.forEach((c) => {
      if (c.target !== c && !c.contains(e.target)) {
        c.classList.remove('card-active');
      }
    });
  });
};
