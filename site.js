document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-button');
const navigation = document.querySelector('#primary-navigation');
if (menu && navigation) {
  const closeMenu = () => {
    menu.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const opened = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!opened));
    navigation.classList.toggle('is-open', !opened);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
}

const filters = [...document.querySelectorAll('[data-filter]')];
const papers = [...document.querySelectorAll('.research-paper')];
const researchGroups = [...document.querySelectorAll('.research-group')];
const count = document.querySelector('.results-count');
function filterResearch(selected) {
  filters.forEach(button => {
    const active = button.dataset.filter === selected;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  papers.forEach(paper => {
    paper.hidden = selected !== 'all' && paper.dataset.category !== selected;
    if (!paper.hidden) visible += 1;
  });
  researchGroups.forEach(group => {
    group.hidden = ![...group.querySelectorAll('.research-paper')].some(paper => !paper.hidden);
  });
  if (count) count.textContent = `${visible} ${visible === 1 ? 'paper' : 'papers'}`;
}
filters.forEach(button => button.addEventListener('click', () => filterResearch(button.dataset.filter)));

function revealLinkedPaper() {
  if (!location.hash || !papers.length) return;
  let target;
  try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
  if (!target?.classList.contains('research-paper')) return;
  filterResearch('all');
  const overview = target.querySelector('details');
  if (overview) overview.open = true;
  requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
}
revealLinkedPaper();
window.addEventListener('hashchange', revealLinkedPaper);

document.querySelectorAll('.copy-email').forEach(button => {
  button.addEventListener('click', async () => {
    const status = button.parentElement.querySelector('.copy-status');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(button.dataset.email);
      button.textContent = 'Copied ✓';
      status.textContent = 'Email address copied.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(button.parentElement.querySelector('a'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      status.textContent = 'Select and copy the email address above.';
    }
  });
});
