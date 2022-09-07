export default () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const inpts = form.querySelectorAll("input[type=hidden]");

    inpts.forEach( inpt => console.log(inpt.value));
  });
};
