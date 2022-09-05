import { sendRequest } from "./sendRequest";

export default () => {
  const select = document.querySelector(".js-select");
  const selectParent = document.querySelector(".js-select-parent");
  const resultContainer = document.querySelector(".js-result-group");
  const selectOptionsContainer = document.querySelector('.my-select__options-wrapper');
  const resultsItem = document.querySelectorAll(".result");
  const url = '/assets/include/gruops.json';
  let isOpen;

  if (resultsItem.length === 0) {
    resultContainer.classList.add("is-hidden");
  }

  function showResultContainer() {
    resultContainer.classList.remove("is-hidden");
  }

  function closeSelect() {
    selectParent.querySelector(".my-select__options-wrapper").classList.remove("is-active");
    setTimeout(() => {
      document.querySelectorAll(".my-select__options").forEach(opt => {
        opt.classList.remove("is-hidden");
        opt.classList.remove("is-open");
      });
    }, 200);
    isOpen = false;
  };

  function resultItemLayout(arr) {
    const result = document.createElement('div');
    result.classList.add("result");

    for (let [index, value] of arr.entries()) {
      let arrow =
        index !== arr.length - 1
          ?
          `
          <div class="result__arrow">
            <svg class="icon icon-arrow-right result__arrow-icon" width="20" height="20">
              <use xlink:href="assets/images/sprites/sprite-mono.svg#arrow-right"></use>
            </svg>
          </div>
        `
          : '';
      let layout = `<div class="result__item">${value}</div> ${arrow}`;

      result.innerHTML += layout;

      if (index === arr.length - 1) {
        result.insertAdjacentHTML('beforeend', '<button class="result__clear" aria-label="Очистить поле"></button>');

        resultContainer.append(result);
      }
    };
  };

  function optionItem(arr) {
    const optionsWrapper = document.createElement('ul');
    optionsWrapper.classList.add("my-select__options");
    optionsWrapper.classList.add("js-option-parent");

    for (let [index, value] of arr.entries()) {
      let layout = `
        <li class="my-select__option js-option" data-value="${value}">
          <span class="my-select__option-label">${value}</span>
          <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
            <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
          </svg>
        </li>
      `;

      optionsWrapper.innerHTML += layout;

      if (index === arr.length - 1) {
        selectOptionsContainer.append(optionsWrapper);
      }
    }
  };

  function optionItemChild(arr) {
    const optionsWrapper = document.createElement('ul');
    optionsWrapper.classList.add("my-select__options");
    optionsWrapper.classList.add("js-option-child");
    optionsWrapper.classList.add("my-select__options-child");
    optionsWrapper.setAttribute("data-value-child", arr.name);

    optionsWrapper.insertAdjacentHTML('afterbegin', `
      <li class="my-select__option my-select__option--back js-option-back" data-value-back="Дети">
        <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
          <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
        </svg><span class="my-select__option-label">${arr.name}</span>
      </li>
    `);

    for (let [index, option] of arr.groups.entries()) {
      let layout = `
        <li class="my-select__option js-option-choose">
          <span class="my-select__option-label">${option.name}</span>
        </li>
      `;

      optionsWrapper.innerHTML += layout;

      if (index === arr.groups.length - 1) {
        selectOptionsContainer.append(optionsWrapper);
      }
    };
  };

  sendRequest("GET", url)
    .then((resp) => {
      const data = resp.groups;
      let nameArr = [];

      data.forEach(group => {
        nameArr.push(group.name);
      });

      optionItem(nameArr);

      data.forEach(group => {
        optionItemChild(group);
      });

    })
    .then((resp) => {
      const options = Array.from(document.querySelectorAll(".js-option"));
      const backOptions = Array.from(document.querySelectorAll(".js-option-back"));
      const chooseResultOptions = Array.from(document.querySelectorAll(".js-option-choose"));

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

      chooseResultOptions.forEach(option => {
        option.addEventListener("click", () => {
          let arr = [];
          const value = option.querySelector(".my-select__option-label").innerHTML;
          arr.push(value);

          resultItemLayout(arr);
          showResultContainer();
          closeSelect();
        });
      });
    });

  // resultItemLayout(["Дети", "Имеюшие тяжелые заболевания"]);

  // const btns = Array.from(document.querySelectorAll(".result__clear"));

  // btns.forEach(btn => {
  //   btn.addEventListener("click", () => {
  //     let result = btn.closest(".result");

  //     result.remove();
  //   })
  // });


  select.addEventListener("click", () => {
    selectParent.querySelector(".my-select__options-wrapper").classList.add("is-active");
    isOpen = true;
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
