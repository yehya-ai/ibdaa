
const filterButtons=document.querySelectorAll('.filter-btn');
const cards=Array.from(document.querySelectorAll('.work-card'));
const searchInput=document.getElementById('searchInput');
const loadTrigger=document.getElementById('loadMoreTrigger');
const loadMoreBtn=document.getElementById('loadMoreBtn');
const modalElement=document.getElementById('previewModal');
const previewModal=modalElement?new bootstrap.Modal(modalElement):null;
const modalImage=document.getElementById('modalImage');
const modalVideo=document.getElementById('modalVideo');
const modalTitle=document.getElementById('modalTitle');
const modalCategory=document.getElementById('modalCategory');
let activeFilter='all';let visibleCount=16;const step=12;
function setActiveFilter(filter){filterButtons.forEach(btn=>btn.classList.toggle('active',btn.dataset.filter===filter));}
function cardMatches(card){const searchValue=(searchInput?.value||'').trim().toLowerCase();const category=(card.dataset.category||'').toLowerCase();const title=(card.dataset.title||'').toLowerCase();const categoryMatch=activeFilter==='all'||category===activeFilter;const searchMatch=!searchValue||title.includes(searchValue)||category.includes(searchValue);return categoryMatch&&searchMatch;}
function applyFilters(reset=true){
  if(reset)visibleCount=16;
  let visibleIndex=0;
  cards.forEach(card=>{
    const match=cardMatches(card);
    card.classList.toggle('hide',!match);
    if(match){
      card.classList.toggle('hidden-card',visibleIndex>=visibleCount);
      visibleIndex++;
    }
  });
  const remaining=visibleIndex>visibleCount;
  if(loadMoreBtn){
    loadMoreBtn.classList.toggle('is-hidden',!remaining);
  }
}
filterButtons.forEach(button=>{button.addEventListener('click',()=>{const filter=button.dataset.filter;setActiveFilter(filter);if(filter==='ai'){document.getElementById('aiVideos')?.scrollIntoView({behavior:'smooth',block:'start'});return;}if(filter==='beforeafter'){document.getElementById('beforeAfter')?.scrollIntoView({behavior:'smooth',block:'start'});return;}activeFilter=filter;applyFilters(true);document.getElementById('portfolio')?.scrollIntoView({behavior:'smooth',block:'start'});});});
searchInput?.addEventListener('input',()=>applyFilters(true));
const loadObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;visibleCount+=step;applyFilters(false);const totalMatching=cards.filter(cardMatches).length;if(visibleCount>=totalMatching)loadObserver.unobserve(entry.target);});},{rootMargin:'450px'});if(loadTrigger)loadObserver.observe(loadTrigger);applyFilters(true);
loadMoreBtn?.addEventListener('click',()=>{visibleCount+=step;applyFilters(false);});
const lazyMedia=document.querySelectorAll('.lazy-img,.lazy-video');const mediaObserver=new IntersectionObserver((entries,observer)=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const media=entry.target;if(media.classList.contains('lazy-img')&&media.dataset.src){media.src=media.dataset.src;media.removeAttribute('data-src');}if(media.classList.contains('lazy-video')&&media.dataset.src){media.src=media.dataset.src;media.load();media.removeAttribute('data-src');media.loop=true;media.muted=true;}observer.unobserve(media);});},{rootMargin:'350px',threshold:.01});lazyMedia.forEach(media=>mediaObserver.observe(media));
let currentPreviewIndex=0;
let activePreviewType='gallery';
const previewCounter=document.getElementById('previewCounter');
const previewPrev=document.querySelector('.preview-prev');
const previewNext=document.querySelector('.preview-next');
function getPreviewCards(){
  return cards.filter(card=>!card.classList.contains('hide')&&!card.classList.contains('hidden-card'));
}
function openPreviewByIndex(index){
  activePreviewType='gallery';
  const list=getPreviewCards();
  if(!list.length)return;
  currentPreviewIndex=(index+list.length)%list.length;
  const card=list[currentPreviewIndex];
  modalElement?.querySelector('.preview-content')?.classList.remove('video-open');
  const img=card.querySelector('img');
  const categoryLabel=card.querySelector('.work-overlay span')?.textContent||card.dataset.category;
  if(modalVideo){
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.style.display='none';
  }
  if(modalImage){
    modalImage.style.display='block';
    modalImage.src=img?.dataset.src||img?.src||'';
    modalImage.alt=img?.alt||'';
  }
  if(modalTitle)modalTitle.textContent=card.dataset.title||'';
  if(modalCategory)modalCategory.textContent=categoryLabel;
  if(previewCounter)previewCounter.textContent=`${currentPreviewIndex+1} / ${list.length}`;
  previewModal?.show();
}
cards.forEach(card=>{
  card.addEventListener('click',()=>{
    const list=getPreviewCards();
    const index=Math.max(0,list.indexOf(card));
    openPreviewByIndex(index);
  });
});
previewPrev?.addEventListener('click',(e)=>{e.stopPropagation();if(activePreviewType==='video')return;openPreviewByIndex(currentPreviewIndex-1);});
previewNext?.addEventListener('click',(e)=>{e.stopPropagation();if(activePreviewType==='video')return;openPreviewByIndex(currentPreviewIndex+1);});
let previewTouchStartX=0;
modalElement?.addEventListener('touchstart',(e)=>{previewTouchStartX=e.touches[0].clientX;},{passive:true});
modalElement?.addEventListener('touchend',(e)=>{
  if(activePreviewType==='video')return;
  const dx=e.changedTouches[0].clientX-previewTouchStartX;
  if(Math.abs(dx)<45)return;
  if(dx>0)openPreviewByIndex(currentPreviewIndex-1);
  else openPreviewByIndex(currentPreviewIndex+1);
},{passive:true});
document.querySelectorAll('.ai-video-card').forEach(card=>{card.addEventListener('click',()=>{activePreviewType='video';modalElement?.querySelector('.preview-content')?.classList.add('video-open');const video=card.querySelector('video');const src=video?.dataset.src||video?.currentSrc||video?.getAttribute('src');const poster=video?.getAttribute('poster')||'';if(!src)return;if(modalImage){modalImage.removeAttribute('src');modalImage.style.display='none';}if(modalVideo){modalVideo.pause();modalVideo.src=src;modalVideo.poster=poster;modalVideo.muted=false;modalVideo.controls=true;modalVideo.style.display='block';modalVideo.load();}if(modalTitle)modalTitle.textContent=card.dataset.title||card.querySelector('h3')?.textContent||'فيديو AI';if(modalCategory)modalCategory.textContent='AI Product Video';if(previewCounter)previewCounter.textContent='فيديو';previewModal?.show();setTimeout(()=>modalVideo?.play?.().catch(()=>{}),250);});});
modalElement?.addEventListener('hidden.bs.modal',()=>{activePreviewType='gallery';modalElement?.querySelector('.preview-content')?.classList.remove('video-open');if(modalVideo){modalVideo.pause();modalVideo.removeAttribute('src');modalVideo.load();modalVideo.style.display='none';}if(modalImage)modalImage.style.display='block';});
const themeToggle=document.getElementById('themeToggle');const savedTheme=localStorage.getItem('ebdaa-theme');if(savedTheme==='dark'){document.body.classList.add('dark-mode');if(themeToggle)themeToggle.innerHTML='<i class="fa-solid fa-sun"></i>';}themeToggle?.addEventListener('click',()=>{document.body.classList.toggle('dark-mode');const darkEnabled=document.body.classList.contains('dark-mode');localStorage.setItem('ebdaa-theme',darkEnabled?'dark':'light');themeToggle.innerHTML=darkEnabled?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';});
const navItems=document.querySelectorAll('.nav-link-item');
const navMap={home:'#home',portfolio:'#portfolio',beforeAfter:'#beforeAfter',aiVideos:'#aiVideos'};
function setActiveNavByHash(hash){
  navItems.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===hash));
}
navItems.forEach(item=>{
  item.addEventListener('click',()=>{
    setActiveNavByHash(item.getAttribute('href'));
  });
});
const observedSections=['home','portfolio','beforeAfter','aiVideos','reviews']
  .map(id=>document.getElementById(id)).filter(Boolean);
const sectionObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const id=entry.target.id;
    const targetHash=navMap[id];
    if(targetHash){setActiveNavByHash(targetHash);}
    else{navItems.forEach(link=>link.classList.remove('active'));}
  });
},{rootMargin:'-42% 0px -42% 0px',threshold:0});
observedSections.forEach(sec=>sectionObserver.observe(sec));
document.querySelectorAll('.compare-range').forEach(range=>{const wrap=range.closest('.compare-slider');const set=()=>wrap?.style.setProperty('--position',range.value+'%');range.addEventListener('input',set);set();});
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -50px 0px'});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const counters=document.querySelectorAll('[data-count]');const counterObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const end=Number(el.dataset.count||0);const suffix=el.dataset.suffix;let start=0;const duration=1300;const t0=performance.now();function tick(now){const p=Math.min((now-t0)/duration,1);const val=Math.floor(end*(1-Math.pow(1-p,3)));el.textContent=suffix==='K'?(val>=1000?'2K':val):'+'+val;if(p<1)requestAnimationFrame(tick);else el.textContent=suffix==='K'?'2K':'+'+end;}requestAnimationFrame(tick);counterObserver.unobserve(el);});},{threshold:.4});counters.forEach(c=>counterObserver.observe(c));
const header=document.getElementById('topHeader');window.addEventListener('scroll',()=>header?.classList.toggle('scrolled',window.scrollY>25),{passive:true});
const cursor=document.querySelector('.cursor-dot');window.addEventListener('mousemove',e=>{if(cursor){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';}});
document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.16;const y=(e.clientY-r.top-r.height/2)*.16;el.style.transform=`translate(${x}px,${y}px)`;});el.addEventListener('mouseleave',()=>{el.style.transform='';});});
window.addEventListener('scroll',()=>{document.querySelectorAll('.parallax-card').forEach(el=>{const r=el.getBoundingClientRect();const offset=(window.innerHeight/2-r.top)*0.015;el.style.transform=`translateY(${Math.max(-8,Math.min(8,offset))}px)`;});},{passive:true});


// AI videos carousel controls
const aiVideoCarousel = document.getElementById('aiVideoCarousel');
document.querySelectorAll('[data-carousel]').forEach((btn)=>{
  btn.addEventListener('click',()=>{
    if(!aiVideoCarousel) return;
    const direction = btn.dataset.carousel === 'next' ? 1 : -1;
    const amount = Math.min(aiVideoCarousel.clientWidth * 0.85, 360);
    aiVideoCarousel.scrollBy({ left: direction * amount, behavior: 'smooth' });
  });
});


// Final requested fix: Arabic before/after slider follows the finger exactly.
// Before stays on the right, after stays on the left, and dragging right moves the handle right.
document.querySelectorAll('.compare-slider').forEach((slider) => {
  const range = slider.querySelector('.compare-range');
  const updateFromClientX = (clientX) => {
    const rect = slider.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    const value = Math.max(0, Math.min(100, raw));
    slider.style.setProperty('--position', value + '%');
    if (range) range.value = String(value);
  };

  slider.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    slider.setPointerCapture?.(event.pointerId);
    updateFromClientX(event.clientX);
  });

  slider.addEventListener('pointermove', (event) => {
    if (event.buttons !== 1 && event.pointerType !== 'touch') return;
    updateFromClientX(event.clientX);
  });

  if (range) {
    range.addEventListener('input', () => {
      slider.style.setProperty('--position', range.value + '%');
    });
  }
});


// UX: back to top button
const backToTop=document.getElementById('backToTop');
function updateBackToTop(){
  backToTop?.classList.toggle('show',window.scrollY>650);
}
window.addEventListener('scroll',updateBackToTop,{passive:true});
updateBackToTop();
backToTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));


// Premium UX: scroll progress bar
const scrollProgressBar=document.getElementById('scrollProgressBar');
function updateScrollProgress(){
  if(!scrollProgressBar)return;
  const doc=document.documentElement;
  const max=doc.scrollHeight-window.innerHeight;
  const progress=max>0?(window.scrollY/max)*100:0;
  scrollProgressBar.style.width=Math.max(0,Math.min(100,progress))+'%';
}
window.addEventListener('scroll',updateScrollProgress,{passive:true});
window.addEventListener('resize',updateScrollProgress);
updateScrollProgress();
