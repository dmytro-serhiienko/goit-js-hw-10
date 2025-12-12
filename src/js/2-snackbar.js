//iziToast
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  // *
  const formData = new FormData(event.target);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  // старт поміса
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // обробка промісу
  promise
    .then(delay => {
      //успіх
      console.log(`✅ Fulfilled promise in ${delay}ms`);

      iziToast.success({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    })
    .catch(delay => {
      //ловимо
      console.log(`❌ Rejected promise in ${delay}ms`);

      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        timeout: 5000,
      });
    });

  //ресетимо
  event.target.reset();
});
