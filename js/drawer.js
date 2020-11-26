window.onload = function () {
  const figcaption = document.querySelectorAll(
    '.ms-cards__wrapper figure figcaption'
  );
  const details = document.querySelectorAll(
    '.ms-cards__container > .ms-cards__wrapper .ms-card-details'
  );

  let isOpen = false;

  figcaption.forEach((e) => {
    e.addEventListener('click', function () {
      const itsDeets = this.parentNode.parentNode.querySelector(
        '.ms-card-details'
      );
      if (!isOpen) {
        isOpen = true;
        itsDeets.style.display = 'block';
      } else {
        isOpen = false;
        // Everything that is not itsDeets should close and it's figure dimmed
        details.forEach((i) => (i.style.display = 'none'));
      }
    });
  });

  // Hide the nav bar if you click outside of it

  //     document.addEventListener('click', function (e) {
  //         if (e.target !== details && !details.contains(e.target)) {
  //             alert('wooo');
  //         }
  //     });
};
