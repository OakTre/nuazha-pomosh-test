export default () => {
  const select = document.querySelector(".js-select");
  const selectParent = document.querySelector(".js-select-parent");
  const options = Array.from(document.querySelectorAll(".js-option"));
  const backOptions = Array.from(document.querySelectorAll(".js-option-back"));
  let isOpen;

  function closeSelect () {
    selectParent.querySelector(".my-select__options-wrapper").classList.remove("is-active");
    setTimeout(() => {
      document.querySelectorAll(".my-select__options").forEach(opt => {
        opt.classList.remove("is-hidden");
        opt.classList.remove("is-open");
      });
    }, 200);
    isOpen = false;
  }

  select.addEventListener("click", () => {
    selectParent.querySelector(".my-select__options-wrapper").classList.add("is-active");
    isOpen = true;
  });

  options.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      document.querySelector(".js-option-parent").classList.add("is-hidden");
      document.querySelector(`.js-option-child[data-value-child=${value}]`).classList.add("is-open");
    });
  });

  backOptions.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.dataset.valueBack;
      document.querySelector(".js-option-parent").classList.remove("is-hidden");
      document.querySelector(`.js-option-child[data-value-child=${value}]`).classList.remove("is-open");
    });
  });


  document.addEventListener("click", (e) => {
    if (!e.target.closest('.js-select-parent') && isOpen === true) {
      closeSelect();
    }
  });

  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 27) {
      if (isOpen) {
        closeSelect();
      }
    }
  });
};
