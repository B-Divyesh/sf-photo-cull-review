const routeFocusKey = 'photo-cull-review:route-focus';

function focusRouteHeading() {
  const heading = document.querySelector('main h1');
  const status = document.querySelector('#route-status');
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus();
  if (status) status.textContent = `${heading.textContent.replace(/\s+/g, ' ').trim()} opened.`;
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(link.href, location.href);
  if (destination.origin === location.origin && (destination.pathname !== location.pathname || destination.search !== location.search)) {
    sessionStorage.setItem(routeFocusKey, '1');
  }
});

const navigation = performance.getEntriesByType('navigation')[0];
if (sessionStorage.getItem(routeFocusKey) === '1' || navigation?.type === 'back_forward') {
  sessionStorage.removeItem(routeFocusKey);
  requestAnimationFrame(focusRouteHeading);
}

window.addEventListener('pageshow', (event) => {
  if (event.persisted) focusRouteHeading();
});
