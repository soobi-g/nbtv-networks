/* ==
   NBTV Networks — Noor-Al-Bawadi | main.js v2
   */
(function(){
  'use strict';

  /*  Mobile Nav */
  const toggle    = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if(toggle && mobileNav){
    toggle.addEventListener('click',()=>{
      const open = mobileNav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    mobileNav.querySelectorAll('a').forEach(l=>l.addEventListener('click',()=>{
      mobileNav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  /* ──  Link */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a=>{
    if(a.getAttribute('href')===page||(page===''&&a.getAttribute('href')==='index.html'))
      a.classList.add('active');
  });

  /* ── scroll */
  const fadeEls = document.querySelectorAll('.fade-up');
  if('IntersectionObserver' in window && fadeEls.length){
    const obs = new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); obs.unobserve(e.target); }});
    },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
    fadeEls.forEach(el=>obs.observe(el));
  } else { fadeEls.forEach(el=>el.classList.add('in-view')); }

  /* ── Contact Form ─────────────────────────────────────── */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name    = document.getElementById('name')?.value.trim();
      const email   = document.getElementById('email')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      if(!name||!email||!message){ showErr('Please fill in all required fields.'); return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showErr('Please enter a valid email address.'); return; }
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.textContent;
      btn.textContent='Sending…'; btn.disabled=true;
      setTimeout(()=>{ btn.textContent=orig; btn.disabled=false; form.reset();
        if(success){ success.classList.add('visible'); setTimeout(()=>success.classList.remove('visible'),5000); }
      },1400);
    });
  }
  function showErr(msg){
    let el=document.getElementById('formError');
    if(!el){ el=document.createElement('p'); el.id='formError'; el.style.cssText='color:#E8347A;font-size:.88rem;margin-top:10px;'; document.getElementById('contactForm')?.appendChild(el); }
    el.textContent=msg; setTimeout(()=>{el.textContent=''},4000);
  }

  /* ── Portfolio Filter  */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  if(filterBtns.length && portfolioCards.length){
    filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      portfolioCards.forEach(card=>{
        const show = f==='all' || card.dataset.category===f;
        card.style.transition='opacity .3s ease,transform .3s ease';
        if(show){ card.style.opacity='1'; card.style.transform='scale(1)'; card.style.display=''; }
        else { card.style.opacity='0'; card.style.transform='scale(0.96)';
          setTimeout(()=>{ if(card.dataset.category!==btn.dataset.filter && btn.dataset.filter!=='all') card.style.display='none'; },300);
        }
      });
    }));
  }

  /* ── Navbar shadow on scroll  */
  const navbar = document.querySelector('.navbar');
  if(navbar) window.addEventListener('scroll',()=>{ navbar.style.boxShadow=window.scrollY>20?'0 4px 30px rgba(0,0,0,.5)':'none'; },{passive:true});

  /* ── Animated counters */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if(statNums.length){
    const cObs = new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ animateCounter(e.target); cObs.unobserve(e.target); }}),{threshold:.5});
    statNums.forEach(el=>cObs.observe(el));
  }
  function animateCounter(el){
    const target=parseFloat(el.dataset.target), suffix=el.dataset.suffix||'', prefix=el.dataset.prefix||'';
    const isFloat=String(target).includes('.'), dur=1600, start=performance.now();
    (function update(now){ const p=Math.min((now-start)/dur,1), e=1-Math.pow(1-p,3), v=target*e;
      el.textContent=prefix+(isFloat?v.toFixed(1):Math.round(v))+suffix;
      if(p<1) requestAnimationFrame(update);
    })(start);
  }
})();
