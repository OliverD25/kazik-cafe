// Addresses and hours come from public directories (per the design); confirm them with the café.
const spots = [
  { addr: 'вул. Тернопільська, 7/1Б', area: 'Південно-Західний', hours: 'Цілодобово', ll: [49.40358, 26.95859] },
  { addr: 'вул. Шухевича (Курчатова), 118/8', area: 'Дальні Гречани · зуп. «Мед-Інвест»', hours: '05:00 – 23:00', ll: [49.45323, 26.92034] },
  { addr: 'вул. Шухевича (Курчатова), 90', area: 'Дальні Гречани · біля СКЦ «Плоскирів»', hours: 'Цілодобово', ll: [49.44614, 26.93169] },
  { addr: 'вул. Шухевича (Курчатова), 19', area: 'Гречани', hours: 'Цілодобово', ll: [49.43933, 26.94761] },
  { addr: 'вул. Соборна, 11', area: 'Центр', hours: 'Уточнюється', ll: [49.42872, 26.98215] },
  { addr: 'вул. Панаса Мирного, 1', area: 'ТЦ «Проспект» · Kazik Coffee & Foods', hours: 'Уточнюється', ll: [49.4407, 26.9999] },
];

const map = L.map('map', { scrollWheelZoom: false });
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const icon = (on) => L.divIcon({
  className: '',
  html: `<div class="pin${on ? ' on' : ''}"></div>`,
  iconSize: [18, 18], iconAnchor: [9, 9], popupAnchor: [0, -10],
});
const route = (s) => `https://www.google.com/maps/dir/?api=1&destination=${s.ll[0]},${s.ll[1]}`;
const list = document.getElementById('list');
let active = -1;

const markers = spots.map((s, i) => {
  const m = L.marker(s.ll, { icon: icon(false), title: s.addr }).addTo(map)
    .bindPopup(`<b>${s.addr}</b>${s.area}<br>${s.hours}<br><a href="${route(s)}" target="_blank" rel="noopener">Маршрут ↗</a>`);
  m.on('click', () => select(i, false));
  const li = document.createElement('li');
  li.innerHTML = `<button type="button" aria-pressed="false"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="addr">${s.addr}</span><span class="go">→</span><span class="meta">${s.area}<br>${s.hours}</span></button>`;
  li.firstChild.addEventListener('click', () => select(i, true));
  list.appendChild(li);
  return m;
});

function select(i, fly) {
  if (active > -1) {
    markers[active].setIcon(icon(false)).setZIndexOffset(0);
    list.children[active].firstChild.setAttribute('aria-pressed', 'false');
  }
  active = i;
  markers[i].setIcon(icon(true)).setZIndexOffset(1000);
  list.children[i].firstChild.setAttribute('aria-pressed', 'true');
  if (fly) {
    if (matchMedia('(max-width:820px)').matches) document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    map.flyTo(spots[i].ll, 16, { duration: 0.6 });
  }
  markers[i].openPopup();
}

map.fitBounds(L.latLngBounds(spots.map((s) => s.ll)), { padding: [40, 40] });
addEventListener('resize', () => map.invalidateSize());
