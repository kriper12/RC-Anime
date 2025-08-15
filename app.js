// BlossomFlix Logic
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const animeData = [
  {
    id: 'kaguya',
    title: 'Kaguya‑sama: Love Is War',
    year: 2019,
    rating: 9.0,
    genres: ['Rom‑Com','School'],
    poster: 'https://image.tmdb.org/t/p/w500/2lHLa87Z2J1YXhYzu3PV6PvJEaG.jpg',
    trailer: 'https://www.youtube.com/embed/PHJYjQ5-9aQ',
    desc: 'Two geniuses wage a hilarious battle to make the other confess first.'
  },
  {
    id: 'horimiya',
    title: 'Horimiya',
    year: 2021,
    rating: 8.3,
    genres: ['Romance','School','Slice‑Of‑Life'],
    poster: 'https://image.tmdb.org/t/p/w500/aEclEBev5nYeD1yfknhkXaoCA8G.jpg',
    trailer: 'https://www.youtube.com/embed/8P8R2S9o35E',
    desc: 'A heart‑warming story of two classmates discovering each other’s hidden sides.'
  },
  {
    id: 'my-dress-up-darling',
    title: 'My Dress‑Up Darling',
    year: 2022,
    rating: 8.1,
    genres: ['Rom‑Com','Slice‑Of‑Life'],
    poster: 'https://image.tmdb.org/t/p/w500/5vUuxLk6xPD58x35H5TADaBrZEc.jpg',
    trailer: 'https://www.youtube.com/embed/7xw2B8G2S1A',
    desc: 'A shy doll artisan and a popular girl bond over cosplay and creativity.'
  },
  {
    id: 'komi',
    title: 'Komi Can’t Communicate',
    year: 2021,
    rating: 8.2,
    genres: ['Rom‑Com','School'],
    poster: 'https://image.tmdb.org/t/p/w500/8yZqabuX41sJLdnOjFkWDXLI4sd.jpg',
    trailer: 'https://www.youtube.com/embed/0DgF6lS5b0E',
    desc: 'Komi wants to make 100 friends despite her extreme social anxiety—cue wholesome chaos.'
  },
  {
    id: 'toradora',
    title: 'Toradora!',
    year: 2008,
    rating: 8.4,
    genres: ['Romance','School','Shoujo'],
    poster: 'https://image.tmdb.org/t/p/w500/uQ2J1zsa3R7UytzszbmWzxjaIOs.jpg',
    trailer: 'https://www.youtube.com/embed/9qVZq49AjcY',
    desc: 'A fierce tiny tiger and a gentle delinquent learn what love really means.'
  },
  {
    id: 'wotakoi',
    title: 'Wotakoi: Love Is Hard For Otaku',
    year: 2018,
    rating: 8.0,
    genres: ['Rom‑Com','Slice‑Of‑Life'],
    poster: 'https://image.tmdb.org/t/p/w500/8QBYwygJyI07212HaxDTXiiMHDL.jpg',
    trailer: 'https://www.youtube.com/embed/MYjRNfA9H9E',
    desc: 'Office romance with otaku flair—adorably awkward and painfully relatable.'
  },
  {
    id: 'uzaki',
    title: 'Uzaki‑chan Wants To Hang Out!',
    year: 2020,
    rating: 7.5,
    genres: ['Rom‑Com','School'],
    poster: 'https://image.tmdb.org/t/p/w500/gj9UceShUMHbOWcZHhGXLiCFYI8.jpg',
    trailer: 'https://www.youtube.com/embed/dt2zVwBEm90',
    desc: 'A bubbly underclassman is determined to drag a loner upperclassman into fun.'
  },
  {
    id: 'kimini',
    title: 'Kimi Ni Todoke',
    year: 2009,
    rating: 8.0,
    genres: ['Romance','Shoujo','School'],
    poster: 'https://image.tmdb.org/t/p/w500/8z1Cdm42Hcps225y7sY9qsJh0kT.jpg',
    trailer: 'https://www.youtube.com/embed/D9q8U1N1IhI',
    desc: 'A sweet slow‑burn between a misunderstood girl and the class sunshine.'
  }
];

const state = {
  query: '',
  filter: 'all',
  sort: 'trending',
  favorites: new Set(JSON.parse(localStorage.getItem('bf-favs') || '[]'))
};

function saveFavs(){
  localStorage.setItem('bf-favs', JSON.stringify([...state.favorites]));
}

function renderGrid(list, mount){
  mount.innerHTML = '';
  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img class="thumb" src="${item.poster}" alt="${item.title} poster"/>
      <div class="badges">
        ${item.genres.slice(0,2).map(g=>`<span class="badge">${g}</span>`).join('')}
        <span class="badge">★ ${item.rating}</span>
      </div>
      <div class="card-info">
        <h3 class="title">${item.title}</h3>
        <div class="meta-line"><span>${item.year}</span><span>${item.genres[0]}</span></div>
        <div class="action-row">
          <button class="play-btn" data-id="${item.id}">Play</button>
          <button class="fav-btn" data-id="${item.id}">${state.favorites.has(item.id) ? '♥' : '♡'} Fav</button>
        </div>
      </div>
    `;
    mount.appendChild(card);
  });
}

function getFiltered(){
  let list = animeData.slice();

  // search
  if(state.query){
    const q = state.query.toLowerCase();
    list = list.filter(a => a.title.toLowerCase().includes(q) || a.genres.join(' ').toLowerCase().includes(q));
  }

  // filter
  if(state.filter !== 'all'){
    list = list.filter(a => a.genres.includes(state.filter));
  }

  // sort
  if(state.sort === 'az'){
    list.sort((a,b)=> a.title.localeCompare(b.title));
  } else if(state.sort === 'rating'){
    list.sort((a,b)=> b.rating - a.rating);
  } else if(state.sort === 'new'){
    list.sort((a,b)=> b.year - a.year);
  } else {
    // trending pseudo: rating + recency
    list.sort((a,b)=> (b.rating + b.year/10000) - (a.rating + a.year/10000));
  }
  return list;
}

function openPlayer(item){
  const dlg = $('#playerModal');
  $('#playerFrame').src = item.trailer;
  $('#playerTitle').textContent = item.title;
  $('#playerDesc').textContent = item.desc;
  dlg.showModal();
}

function closePlayer(){
  const dlg = $('#playerModal');
  $('#playerFrame').src = '';
  dlg.close();
}

function wireUI(){
  // search
  $('#searchInput').addEventListener('input', (e)=>{
    state.query = e.target.value.trim();
    render();
  });
  $('#clearSearch').addEventListener('click', ()=>{
    $('#searchInput').value = '';
    state.query = '';
    render();
  });

  // filters
  $$('.pill[data-filter]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.pill[data-filter]').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      render();
    });
  });

  // sort
  $('#sortSelect').addEventListener('change', (e)=>{
    state.sort = e.target.value;
    render();
  });

  // favorites quick view
  $('#favoritesBtn').addEventListener('click', ()=>{
    const favs = animeData.filter(a => state.favorites.has(a.id));
    renderGrid(favs.length ? favs : [], $('#grid'));
    if(!favs.length){
      $('#grid').innerHTML = '<p style="opacity:.8;margin:.6rem 0;">No favorites yet. Click ♡ on a show to save it!</p>';
    }
  });

  // theme
  $('#themeToggle').addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
  });

  // hero
  const slides = $$('.hero-slide');
  const dots = $$('.dot');
  let idx = 0;
  setInterval(()=>{
    slides[idx].classList.remove('current'); dots[idx].classList.remove('active');
    idx = (idx + 1) % slides.length;
    slides[idx].classList.add('current'); dots[idx].classList.add('active');
  }, 6000);

  $('[data-hero-play]').addEventListener('click', ()=>{
    // pick a random rom‑com
    const picks = animeData.filter(a => a.genres.includes('Rom‑Com'));
    openPlayer(picks[Math.floor(Math.random()*picks.length)]);
  });

  // close modal
  $('.close-btn').addEventListener('click', closePlayer);
  $('#playerModal').addEventListener('click', (e)=>{
    if(e.target.id === 'playerModal') closePlayer();
  });

  // delegate play/fav
  document.addEventListener('click', (e)=>{
    const play = e.target.closest('.play-btn');
    if(play){
      const item = animeData.find(a => a.id === play.dataset.id);
      openPlayer(item);
    }
    const fav = e.target.closest('.fav-btn');
    if(fav){
      const id = fav.dataset.id;
      if(state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id);
      saveFavs();
      render();
    }
  });

  // year
  $('#year').textContent = new Date().getFullYear();
}

function render(){
  renderGrid(getFiltered(), $('#grid'));
  // recently added = newest sort top 6
  const recent = animeData.slice().sort((a,b)=> b.year - a.year).slice(0,6);
  renderGrid(recent, $('#recentGrid'));

  // refresh fav labels
  $$('.fav-btn').forEach(btn=>{
    btn.textContent = `${state.favorites.has(btn.dataset.id) ? '♥' : '♡'} Fav`;
  });
}
// theme
const themeToggle = $('#themeToggle');
const themeIcon = themeToggle.querySelector('svg');

function setThemeIcon() {
  if (document.documentElement.classList.contains('light')) {
    // Sun icon for light mode
    themeIcon.innerHTML = `<circle cx="12" cy="12" r="5" class="theme-icon" /> 
                           <g class="theme-icon">
                             <line x1="12" y1="1" x2="12" y2="3" />
                             <line x1="12" y1="21" x2="12" y2="23" />
                             <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                             <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                             <line x1="1" y1="12" x2="3" y2="12" />
                             <line x1="21" y1="12" x2="23" y2="12" />
                             <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                             <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                           </g>`;
  } else {
    // Moon icon for dark mode
    themeIcon.innerHTML = `<path class="theme-icon" d="M21 12.79A9 9 0 1 1 11.21 3 
                           a7 7 0 0 0 9.79 9.79z"/>`;
  }
}

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  setThemeIcon();
});

setThemeIcon();

// Init
document.addEventListener('DOMContentLoaded', ()=>{
  wireUI();
  render();
});
