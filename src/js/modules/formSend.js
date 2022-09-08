export default () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = form.querySelector(".data");
    const results = form.querySelectorAll(".result");

    console.log(data.value);

    alert(`Результат: ${data.value}`);

    data.value = '';

    results.forEach( result => {
      result.remove();
    });

    document.querySelector(".js-result-group").classList.add("is-hidden");
    form.querySelector(".button").classList.add("disabled");
  });
};
