import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import canUseWebp from '../helpers/canUseWebp';

export default () => {
  if (canUseWebp() === false) {
    const lazyBgItems = document.querySelectorAll('.lazy[data-bg-fallback]');

    lazyBgItems.forEach((item) => {
      const srcBgFallback = item.getAttribute('data-bg-fallback');

      item.setAttribute('data-bg', srcBgFallback);
    });
  };
};
