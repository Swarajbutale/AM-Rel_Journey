window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('splash').style.display = 'flex';
  }, 3400);
});

const viewedChapters = new Set();
let pendingChapter = null;

function openChapter(chapter) {
  if (!viewedChapters.has(chapter)) {
    pendingChapter = chapter;
    document.getElementById('subOverlay').classList.add('active');
    return;
  }
  loadChapter(chapter);
}

document.getElementById('subBtn').addEventListener('click', () => {
  document.getElementById('subOverlay').classList.remove('active');
  viewedChapters.add(pendingChapter);
  loadChapter(pendingChapter);
  pendingChapter = null;
});

function loadChapter(chapter) {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('memoriesPage').style.display = 'block';

  const chapterNames = {
    '1-3months':  '1 – 3 Months',
    '3-6months':  '3 – 6 Months',
    '6-12months': '6 – 12 Months',
    '1year+':     '1 Year +'
  };

  document.getElementById('chapterTitle').textContent = chapterNames[chapter];

  fetch(`/api/memories/${chapter}`)
    .then(r => r.json())
    .then(memories => {
      const grid = document.getElementById('memoryGrid');
      grid.innerHTML = '';

      if (memories.length === 0) {
        grid.innerHTML = '<p class="empty-msg">No memories added yet... 🌙</p>';
        return;
      }

      memories.forEach(m => {
        const isVideo = m.type === 'video';

        const media = isVideo
          ? `<video style="width:100%; height:200px; object-fit:cover;">
               <source src="/static/${m.image}" type="video/mp4">
             </video>`
          : `<img src="/static/${m.image}" alt="${m.caption}">`;

        const card = document.createElement('div');
        card.className = 'memory-card';
        card.innerHTML = `
          ${media}
          <div class="memory-info">
            <p>${m.caption}</p>
            <span>${m.date}</span>
          </div>
        `;

        card.addEventListener('click', () => openOverlay(m));
        grid.appendChild(card);
      });
    });
}

function openOverlay(m) {
  const overlay = document.getElementById('overlay');
  const isVideo = m.type === 'video';

  document.getElementById('overlayMedia').innerHTML = isVideo
    ? `<video controls autoplay style="max-height:80vh; max-width:60vw; border-radius:12px;">
         <source src="/static/${m.image}" type="video/mp4">
       </video>`
    : `<img src="/static/${m.image}" alt="${m.caption}">`;

  document.getElementById('overlayDate').textContent = m.date;
  document.getElementById('overlayCaption').textContent = m.caption;
  document.getElementById('overlayNote').textContent = m.note || '';

  overlay.classList.add('active');
}

function closeOverlay() {
  document.getElementById('overlay').classList.remove('active');
  document.getElementById('overlayMedia').innerHTML = '';
}

function goBack() {
  document.getElementById('memoriesPage').style.display = 'none';
  document.getElementById('splash').style.display = 'flex';
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'overlay') closeOverlay();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeOverlay();
});