import arrayRemove from "../helpers/arrayRemove";
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

  // если нет уже выбранных то убираем поле
  if (resultsItem.length === 0) {
    resultContainer.classList.add("is-hidden");
  }

  // показываем поле с результатами
  function showResultContainer() {
    resultContainer.classList.remove("is-hidden");
  }

  // убираем поля результатов
  function closeResultContainer() {
    if (document.querySelectorAll(".result").length === 0) {
      resultContainer.classList.add("is-hidden");
      form.querySelector(".button").classList.add("disabled");
    };
  };

  // добавляем слушатели для очищения результата выброра селекта
  function initCloseResults() {
    const btns = Array.from(document.querySelectorAll(".result__clear"));

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        let result = btn.closest(".result");
        let items = result.querySelectorAll(".result__item");

        // проходимся по id и убираем из глобального массива те которые удалились
        items.forEach(item => {
          const filteredResult = arrayRemove(ids, item.dataset.optionId);
          ids = filteredResult;

          // подставляем результат массива с id в дату
          document.querySelector(".data").value = JSON.stringify(ids);
        });

        result.remove();
        closeResultContainer();
      })
    });
  };

  // закрытие селекта
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

  // создаем плашку с результатами селкта
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
      let layout = `<div class="result__item" data-option-id="${value.id}">${value.name}</div> ${arrow}`;

      result.innerHTML += layout;

      if (index === arr.length - 1) {
        result.insertAdjacentHTML('beforeend', '<button type="button" class="result__clear" aria-label="Очистить поле"></button>');

        resultContainer.append(result);
        optionsArr = [];

        // подставляем выбранные id в скрытй инпут для отправки данных
        document.querySelector(".data").value = JSON.stringify(ids);
        // дизейблим кнопку
        form.querySelector(".button").classList.remove("disabled");
      }
    };
  };

  // создаем options для селекта
  function optionItem(arr) {
    const optionsWrapper = document.createElement('ul');
    optionsWrapper.classList.add("my-select__options");
    optionsWrapper.classList.add("js-option-parent");
    let layout;
    let parentsArr = [];

    for (let [index, value] of arr.entries()) {
      parentsArr.push(value.name);
      // если есть вложенные группы у селекта
      if (value.groups.length !== 0) {
        optionsWrapper.setAttribute("data-value-parent", JSON.stringify(parentsArr));
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

  // создаем "детей" у options для селекта
  function optionItemChild(arr) {
    const optionsWrapper = document.createElement('ul');
    optionsWrapper.classList.add("my-select__options");
    optionsWrapper.classList.add("js-option-child");
    optionsWrapper.classList.add("my-select__options-child");
    optionsWrapper.setAttribute("data-value-child", arr.name);
    optionsWrapper.setAttribute("data-value-parent", arr.name);
    let layout;

    // селект возвращает к родителю
    optionsWrapper.insertAdjacentHTML('afterbegin', `
      <li class="my-select__option my-select__option--back js-option-back" data-value-back="${arr.name}">
        <svg class="icon icon-shevron-right my-select__option-icon" width="10" height="12">
          <use xlink:href="assets/images/sprites/sprite-mono.svg#shevron-right"></use>
        </svg><span class="my-select__option-label">${arr.name}</span>
      </li>
    `);

    for (let [index, option] of arr.groups.entries()) {

      // првоеряем вложенные гурппы
      if (option.groups.length !== 0) {
        optionsWrapper.setAttribute("data-value-parent2", option.name);
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

  // отправляем запрос на "бек" для получаения данных
  sendRequest("GET", url)
    .then((resp) => {
      const data = resp.groups;

      // генерируем селекты
      optionItem(data);

      // генерируем вложенные группы у селекта
      data.forEach(group => {
        optionItemChild(group);

        group.groups.forEach(grps => {
          if (grps.groups.length !== 0) {
            optionItemChild(grps);
          }
        });
      });
    })
    // добавляем слушатели для кнопок, селектов и тд, в общем оживляем все))
    .then((resp) => {
      const options = Array.from(document.querySelectorAll(".js-option"));
      const backOptions = Array.from(document.querySelectorAll(".js-option-back"));
      const chooseResultOptions = Array.from(document.querySelectorAll(".js-option-choose"));

      options.forEach(option => {
        option.addEventListener("click", () => {
          const value = option.dataset.value;
          const id = option.dataset.id;
          const obj = {id, name: value};
          let parentsValue = JSON.parse(document.querySelector("[data-value-parent]").dataset.valueParent);

          // здесь сохраняем id нашего выбора
          optionsArr.push(obj);
          ids.push(id);

          if (parentsValue.includes(value)) {
            document.querySelector(`[data-value-parent]`).classList.add("is-hidden");
          };

          option.closest(".my-select__options").classList.remove("is-open");
          document.querySelector(`.js-option-child[data-value-child="${value}"]`).classList.add("is-open");
        });
      });

      // клик по селекту для возврата к родителю
      backOptions.forEach(option => {
        option.addEventListener("click", () => {
          // удаляем последний выбранный id
          optionsArr.pop();
          ids.pop();
          let parentsValue = JSON.parse(document.querySelector("[data-value-parent]").dataset.valueParent);

          const value = option.dataset.valueBack;

          if (parentsValue.includes(value)) {
            document.querySelector(`[data-value-parent]`).classList.remove("is-hidden");
            document.querySelector(`.js-option-child[data-value-child="${value}"]`).classList.remove("is-open");
          } else {
            document.querySelector(`[data-value-parent2="${value}"]`).classList.add("is-open");
            document.querySelector(`.js-option-child[data-value-child="${value}"]`).classList.remove("is-open");
          }
        });
      });

      // генерируем рузультаты выбора
      chooseResultOptions.forEach(option => {
        option.addEventListener("click", () => {
          const value = option.querySelector(".my-select__option-label").innerHTML;
          const id = option.dataset.id;
          const obj = {id, name: value};

          // заполняем наш массив с id
          ids.push(id);
          optionsArr.push(obj);

          // см в начало
          resultItemLayout(optionsArr);
          showResultContainer();
          closeSelect();
          initCloseResults();
        });
      });
    })
    // обработка ошибок
    .catch(err => console.log(err));

  // открытие селекта
  select.addEventListener("click", () => {
    selectParent.querySelector(".my-select__options-wrapper").classList.add("is-active");
    isOpen = true;
  });

  // закрытие селекта вне окна
  document.addEventListener("click", (e) => {
    if (!e.target.closest('.js-select-parent') && isOpen === true) {
      closeSelect();
    }
  });

  // закпытие селкта на esc
  window.addEventListener('keydown', function (e) {
    if (e.keyCode == 27) {
      if (isOpen) {
        closeSelect();
      }
    }
  });

  // костыль очищаю массив id 😭😭
  form.querySelector(".button").addEventListener("click", () => ids = []);
};
