// ── Scroll-based section reveal ──
const sections = document.querySelectorAll('.section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });
sections.forEach(s => observer.observe(s));

// ── Progress bar ──
const progressFill = document.querySelector('.progress-fill');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressFill.style.width = pct + '%';
});

// ── Active nav link highlight ──
const navLinks = document.querySelectorAll('.nav-bar a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ── Copy code button ──
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.code-block').querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    });
  });
});

// ── Try-it: run code in a sandboxed console ──
document.querySelectorAll('.try-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.card');
    const code = card.querySelector('.code-block code').textContent;
    const consoleEl = card.querySelector('.live-console');
    consoleEl.classList.add('show');

    let output = '';
    const fakeConsole = {
      log: (...args) => { output += args.join(' ') + '\n'; },
      warn: (...args) => { output += '⚠ ' + args.join(' ') + '\n'; },
      error: (...args) => { output += '✖ ' + args.join(' ') + '\n'; }
    };

    try {
      const fn = new Function('console', code);
      fn(fakeConsole);
      consoleEl.textContent = output || '(no output)';
    } catch (err) {
      consoleEl.textContent = '✖ Error: ' + err.message;
    }
  });
});
