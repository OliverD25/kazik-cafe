// Where form requests go. Any endpoint that accepts a JSON POST works
// (for example a free Formspree form: "https://formspree.io/f/<id>").
// Empty = not connected yet: the form tells the visitor to write on Instagram instead.
const FORM_ENDPOINT = '';

const TYPES = {
  table:  { guests: 'Гостей',          hint: 'Побажання до столика' },
  event:  { guests: 'Гостей на події', hint: 'Що за подія, де, які напої' },
  collab: { guests: '',                hint: 'Розкажіть коротко про пропозицію' },
};

document.querySelectorAll('.photo img').forEach((img) => {
  const fig = img.closest('.photo');
  const markEmpty = () => {
    fig.dataset.placeholder = img.dataset.placeholder || '';
    fig.classList.add('is-empty');
    img.remove();
  };
  if (img.complete && img.naturalWidth === 0) markEmpty();
  else img.addEventListener('error', markEmpty);
});

const form = document.getElementById('request-form');
const done = document.getElementById('done');
const errorBox = document.getElementById('form-error');
const booking = document.getElementById('booking');
const tabs = form.querySelectorAll('.tabs button');

function selectType(id) {
  const t = TYPES[id];
  form.elements.type.value = id;
  tabs.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.type === id)));
  booking.hidden = id === 'collab';
  document.getElementById('guests-label').textContent = t.guests;
  form.elements.comment.placeholder = t.hint;
}
tabs.forEach((b) => b.addEventListener('click', () => selectType(b.dataset.type)));

function showError(html) {
  errorBox.innerHTML = html;
  errorBox.hidden = false;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorBox.hidden = true;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  if (!FORM_ENDPOINT) {
    showError('Онлайн-заявки ще не підключені. Напишіть нам в Instagram: <a href="https://www.instagram.com/kazik_coffee/" target="_blank" rel="noopener">@kazik_coffee</a>');
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  if (data.type === 'collab') { delete data.date; delete data.time; delete data.guests; }
  const submit = form.querySelector('.submit');
  submit.disabled = true;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(res.status);
    const name = (data.name || '').trim();
    document.getElementById('done-name').textContent = name ? `, ${name}` : '';
    form.hidden = true;
    done.hidden = false;
  } catch {
    showError('Не вдалося надіслати заявку. Спробуйте ще раз або напишіть нам в Instagram: <a href="https://www.instagram.com/kazik_coffee/" target="_blank" rel="noopener">@kazik_coffee</a>');
  } finally {
    submit.disabled = false;
  }
});

document.getElementById('reset').addEventListener('click', () => {
  form.reset();
  selectType('table');
  done.hidden = true;
  form.hidden = false;
});
