import { sendRequest } from "./sendRequest";

export default () => {
  const select = document.querySelector(".js-select");
  const selectParent = document.querySelector(".js-select-parent");
  const resultContainer = document.querySelector(".js-result-group");
  const selectOptionsContainer = document.querySelector('.my-select__options-wrapper');
  const resultsItem = document.querySelectorAll(".result");
  const form = document.querySelector("form");
  const url = './assets/include/gruops.json';
  let isOpen;
  let optionsArr = [];
  let ids = [];

  if (resultsItem.length === 0) {
    resultContainer.classList.add("is-hidden");
  }

  function showResultContainer() {
    resultContainer.classList.remove("is-hidden");
  }

  function closeResultContainer() {
    if (document.querySelectorAll(".result").length === 0) {
      resultContainer.classList.add("is-hidden");
    };
  };

  function initCloseResults() {
    const btns = Array.from(document.querySelectorAll(".result__clear"));

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        let result = btn.closest(".result");

        result.remove();
        closeResultContainer();
      })
    });
  };

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
        optionsArr = [];
        ids = [];
      }
    };
  };

  function optionItem(arr) {
    const optionsWrapper = document.createElement('ul');
    optionsWrapper.classList.add("my-select__options");
    optionsWrapper.classList.add("js-option-parent");
    let layout;

    for (let [index, value] of arr.entries()) {
      if (value.groups.length !== 0) {
        optionsWrapper.setAttribute("data-value-parent", value.name);
        layout = `
          <li class="my-select__option js-option" data-value="${value.name}" data-id="${value.id}">
            <span class="my-select__option-label">${value.name}</span>
            <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
              <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
            </svg>
          </li>
        `;
      } else {
        layout = `
          <li class="my-select__option js-option-choose" data-id="${value.id}">
            <span class="my-select__option-label">${value.name}</span>
          </li>
        `;
      }

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
    optionsWrapper.setAttribute("data-value-parent", arr.name);
    let layout;

    optionsWrapper.insertAdjacentHTML('afterbegin', `
      <li class="my-select__option my-select__option--back js-option-back" data-value-back="${arr.name}">
        <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
          <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
        </svg><span class="my-select__option-label">${arr.name}</span>
      </li>
    `);

    for (let [index, option] of arr.groups.entries()) {

      if (option.groups.length !== 0) {
        optionsWrapper.setAttribute("data-value-parent", option.name);
        layout = `
          <li class="my-select__option js-option" data-has-childs data-value="${option.name}" data-id="${option.id}">
            <span class="my-select__option-label">${option.name}</span>
            <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
              <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
            </svg>
          </li>
        `;
      } else {
        layout = `
          <li class="my-select__option js-option-choose" data-id="${option.id}">
            <span class="my-select__option-label">${option.name}</span>
          </li>
        `;
      }

      optionsWrapper.innerHTML += layout;

      if (index === arr.groups.length - 1) {
        selectOptionsContainer.append(optionsWrapper);
      }
    };
  };

  sendRequest("GET", url)
    .then((resp) => {
      const data = resp.groups;

      optionItem(data);

      data.forEach(group => {
        optionItemChild(group);

        group.groups.forEach(grps => {
          if(grps.groups.length !== 0) {
            optionItemChild(grps);
          }
        });
      });

    })
    .then((resp) => {
      const options = Array.from(document.querySelectorAll(".js-option"));
      const backOptions = Array.from(document.querySelectorAll(".js-option-back"));
      const chooseResultOptions = Array.from(document.querySelectorAll(".js-option-choose"));

      options.forEach(option => {
        option.addEventListener("click", () => {
          const value = option.dataset.value;
          const id = option.dataset.id;

          optionsArr.push(value);
          ids.push(id);

          document.querySelector(`[data-value-parent="${value}"]`).classList.add("is-hidden");
          document.querySelector("[data-has-childs]").closest(".my-select__options").classList.remove("is-open");
          document.querySelector(`.js-option-child[data-value-child="${value}"]`).classList.add("is-open");
        });
      });

      backOptions.forEach(option => {
        option.addEventListener("click", () => {
          optionsArr.pop();
          ids.pop();
          const value = option.dataset.valueBack;

          document.querySelector(`[data-value-parent="${value}"]`).classList.remove("is-hidden");
          document.querySelector(`[data-value-parent="${value}"]`).classList.add("is-open");
          document.querySelector(`.js-option-child[data-value-child="${value}"]`).classList.remove("is-open");
        });
      });

      chooseResultOptions.forEach(option => {
        option.addEventListener("click", () => {
          const value = option.querySelector(".my-select__option-label").innerHTML;
          const id = option.dataset.id;
          ids.push(id);
          optionsArr.push(value);
          const input = document.createElement('input');
          input.setAttribute("type", "hidden");
          input.setAttribute("name", "options");
          input.setAttribute("value", JSON.stringify(ids));

          form.append(input);

          resultItemLayout(optionsArr);
          showResultContainer();
          closeSelect();
          initCloseResults();
        });
      });
    });

  // resultItemLayout(["Дети", "Имеюшие тяжелые заболевания"]);


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
