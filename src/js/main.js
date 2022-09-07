// eslint-disable-next-line import/no-extraneous-dependencies
import 'focus-visible';
import lazyIMages from './modules/lazyIMages';
import documenReady from './helpers/documenReady';
import initModal from './modules/initModal';
import siteSlider from './modules/siteSlider';
import select from './modules/select';
import formSend from './modules/formSend';

documenReady(() => {
  window.___YOUR_PROJECT___API = { };

  lazyIMages();
  initModal();
  siteSlider();
  select();
  formSend();
});
