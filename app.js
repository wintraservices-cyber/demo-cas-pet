(function () {
  var WA = '6738612882';
  var EMAIL = 'enquiries@caspetservices.com';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* animated hero */
  var words = ['Australia', 'New Zealand', 'the UK', 'the USA', 'Kuala Lumpur', 'Trinidad & Tobago'];
  var w = document.getElementById('destWord');
  var map = document.querySelector('.flightmap');
  if (reduce && map && map.pauseAnimations) { map.pauseAnimations(); map.setCurrentTime(0); }
  if (w && !reduce) {
    var wi = 0;
    setInterval(function () {
      w.classList.add('out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        w.textContent = words[wi];
        w.classList.remove('out'); w.classList.add('pre');
        void w.offsetWidth;
        w.classList.remove('pre');
      }, 450);
    }, 2600);
  }
  var pols = Array.prototype.slice.call(document.querySelectorAll('#polaroids .pol'));
  if (pols.length) {
    var top = 0;
    var lay = function () {
      pols.forEach(function (p, k) {
        var pos = (k - top + pols.length) % pols.length;
        p.classList.remove('s0', 's1', 's2', 's3', 'leave');
        p.classList.add(pos < 3 ? 's' + pos : 's3');
      });
    };
    lay();
    if (!reduce) {
      var stack = document.getElementById('polaroids');
      var paused = false;
      stack.addEventListener('mouseenter', function () { paused = true; });
      stack.addEventListener('mouseleave', function () { paused = false; });
      setInterval(function () {
        if (paused || document.hidden) return;
        var cur = pols[top];
        cur.classList.remove('s0'); cur.classList.add('leave');
        setTimeout(function () { top = (top + 1) % pols.length; lay(); }, 380);
      }, 3200);
    }
  }

  /* reveal on scroll */
  var els = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* multi-step request form */
  var form = document.getElementById('reqForm');
  if (form) {
    var steps = form.querySelectorAll('fieldset');
    var bars = form.querySelectorAll('.progress span');
    var cur = 0;
    var show = function (i) {
      cur = i;
      steps.forEach(function (s, k) { s.classList.toggle('active', k === i); });
      bars.forEach(function (b, k) { b.classList.toggle('on', k <= i); });
      var first = steps[i].querySelector('input,select,textarea');
      if (first && !reduce) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    var valid = function (fs) {
      var ok = true;
      fs.querySelectorAll('[required]').forEach(function (f) {
        if (f.type === 'radio') {
          if (!form.querySelector('input[name="' + f.name + '"]:checked')) { ok = false; f.closest('label').parentElement.style.outline = '2px solid #b14a3a'; }
        } else if (!f.value.trim()) { ok = false; f.style.borderColor = '#b14a3a'; }
        else f.style.borderColor = '';
      });
      return ok;
    };
    form.addEventListener('change', function (e) {
      if (e.target.name === 'type') e.target.closest('.chips').style.outline = '';
    });
    form.querySelectorAll('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () { if (valid(steps[cur])) show(cur + 1); });
    });
    form.querySelectorAll('[data-prev]').forEach(function (b) {
      b.addEventListener('click', function () { show(cur - 1); });
    });
    var toSel = document.getElementById('toSel');
    var call = document.getElementById('auCallout');
    toSel.addEventListener('change', function () {
      call.classList.toggle('show', toSel.value === 'Australia' || toSel.value === 'New Zealand');
    });
    var summary = document.getElementById('summary');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valid(steps[cur])) return;
      var d = new FormData(form);
      var g = function (k) { return (d.get(k) || '').toString().trim(); };
      var txt = 'Hi CAS Pet Services, I\'d like a relocation quote.\n\n' +
        'Pet: ' + g('count') + ' × ' + g('type') + (g('breed') ? ' (' + g('breed') + ')' : '') + (g('age') ? ', ' + g('age') : '') + '\n' +
        'Microchipped: ' + g('chip') + ' · Rabies vaccine: ' + g('rabies') + '\n' +
        'Route: ' + g('from') + ' → ' + g('to') + '\n' +
        'Target date: ' + (g('date') || 'flexible') + ' · Owner travelling: ' + g('travel') + '\n' +
        'Boarding needed: ' + g('board') + '\n\n' +
        'Name: ' + g('name') + '\nWhatsApp: ' + g('phone') + (g('email') ? '\nEmail: ' + g('email') : '') +
        (g('notes') ? '\n\nNotes: ' + g('notes') : '');
      document.getElementById('sumText').textContent = txt;
      document.getElementById('sendWa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
      document.getElementById('sendMail').href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Relocation request: ' + g('from') + ' to ' + g('to')) + '&body=' + encodeURIComponent(txt);
      steps.forEach(function (s) { s.classList.remove('active'); });
      form.querySelector('.progress').style.display = 'none';
      summary.classList.add('show');
    });
    document.getElementById('editReq').addEventListener('click', function () {
      summary.classList.remove('show');
      form.querySelector('.progress').style.display = '';
      show(0);
    });
  }

  /* scripted after-hours chat */
  var fab = document.getElementById('chatFab');
  var chat = document.getElementById('chat');
  if (!fab) return;
  var body = document.getElementById('chatBody');
  var waLink = '<a href="https://wa.me/' + WA + '" target="_blank" rel="noopener">WhatsApp +673 861 2882</a>';
  var reqLink = '<a href="#request" data-close>relocation request form</a>';
  var A = [
    { k: ['australia', 'aus', 'sydney', 'melbourne', 'perth', 'brisbane'], a: 'Australia is our specialty. Pets can\'t fly to Australia directly from a non-approved country, so they first live in an approved country for a residency period (usually at least 6 months) and then complete Australia\'s import steps. We plan the whole route. Start with the ' + reqLink + ' and the team will map out your timeline.' },
    { k: ['new zealand', 'nz', 'auckland', 'wellington', 'christchurch'], a: 'New Zealand works much like Australia: pets from non-approved countries step through an approved country first. It\'s one of our two specialty routes. Send us the details via the ' + reqLink + '.' },
    { k: ['cost', 'price', 'how much', 'fee', 'quote', 'budget', 'expensive'], a: 'Every move is quoted individually: it depends on the route, airline, pet size, crate and whether a stepping country or boarding is involved. The quickest way to a quote is the ' + reqLink + ', or message us on ' + waLink + '.' },
    { k: ['how long', 'timeline', 'time', 'months', 'weeks', 'when should'], a: 'It depends on the destination. Some routes take a few weeks of prep; Australia and New Zealand from non-approved countries take many months because of the residency period. The earlier you contact us, the more options you have.' },
    { k: ['document', 'paper', 'vaccin', 'rabies', 'microchip', 'chip', 'permit', 'certificate', 'titre', 'titer'], a: 'Most moves need a microchip, up-to-date rabies vaccination, a vet health certificate and an import permit for the destination. Some routes also need a rabies blood (titre) test. We check your pet\'s records and tell you exactly what\'s missing.' },
    { k: ['usa', 'america', 'united states', 'us '], a: 'Yes, we\'ve flown cats from Brunei to the USA, including a four-cat move where we housed the cats until the family was settled and coordinated with the US receivers.' },
    { k: ['uk', 'united kingdom', 'england', 'london', 'britain', 'scotland'], a: 'Yes, we\'ve moved dogs from Brunei to the United Kingdom, including Monty and Annie. Send your details through the ' + reqLink + ' and we\'ll map out the requirements.' },
    { k: ['malaysia', 'kuala lumpur', 'kl', 'miri', 'sabah', 'sarawak'], a: 'Yes, we\'ve moved whole households of dogs and cats from Brunei to Kuala Lumpur. Send your details through the ' + reqLink + '.' },
    { k: ['board', 'housing', 'stay', 'kennel', 'look after', 'hotel'], a: 'If you need to fly ahead and get settled, ask us about looking after your pet in the meantime. We\'ve done this for past clients. Tick "boarding" in the ' + reqLink + '.' },
    { k: ['arrive', 'arrival', 'quarantine', 'landing', 'customs', 'pick up', 'collect'], a: 'On arrival your pet goes to the animal holding area with food and water, documents are reviewed, a vet may inspect, then customs clears and your pet is handed over to you or to quarantine if the destination requires it. See "What happens on arrival" above.' },
    { k: ['crate', 'stress', 'scared', 'anxious', 'calm', 'blanket', 'prepare'], a: 'Get your pet used to the crate early, keep routines steady, and give us a familiar blanket or a thin T-shirt with your smell for the journey. Familiar scents really help.' },
    { k: ['update', 'video', 'photo', 'track'], a: 'We keep in touch throughout the move with updates, and past clients have received videos and updates every day.' },
    { k: ['where', 'address', 'located', 'office', 'location', 'visit'], a: 'We\'re at Unit 1 Block A, Salambigar Industry, Simpang 85 Jalan Utama Tanah Jambu, BC1515, Bandar Seri Begawan, Brunei.' },
    { k: ['hour', 'open', 'contact', 'call', 'phone', 'whatsapp', 'email', 'talk', 'human'], a: 'You can reach the team on ' + waLink + ', call +673 723 5599, or email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. Messages sent after hours are answered as soon as the team is back.' },
    { k: ['cat', 'dog', 'puppy', 'kitten', 'breed', 'snub', 'flat'], a: 'We move cats and dogs. Some airlines have extra rules for certain breeds (for example, snub-nosed breeds), so tell us the breed in the ' + reqLink + ' and we\'ll check.' }
  ];
  var quick = ['Moving to Australia', 'How much does it cost?', 'What documents do I need?', 'What happens on arrival?', 'Talk to a person'];
  var add = function (html, who) {
    var m = document.createElement('div');
    m.className = 'msg ' + who;
    m.innerHTML = html;
    body.appendChild(m);
    body.scrollTop = body.scrollHeight;
    return m;
  };
  var addQuick = function () {
    var q = document.createElement('div'); q.className = 'quick';
    quick.forEach(function (t) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = t;
      b.onclick = function () { ask(t); }; q.appendChild(b);
    });
    body.appendChild(q);
  };
  var answer = function (t) {
    var s = ' ' + t.toLowerCase() + ' ';
    for (var i = 0; i < A.length; i++) for (var j = 0; j < A[i].k.length; j++) if (s.indexOf(A[i].k[j]) > -1) return A[i].a;
    return 'Good question. That one is best answered by the team directly. Message us on ' + waLink + ' or use the ' + reqLink + ' and we\'ll get back to you.';
  };
  var ask = function (t) {
    if (!t.trim()) return;
    add(t.replace(/</g, '&lt;'), 'me');
    var typing = add('…', 'bot');
    setTimeout(function () { typing.innerHTML = answer(t); }, reduce ? 0 : 550);
  };
  var started = false;
  var toggle = function (open) {
    chat.classList.toggle('open', open);
    fab.setAttribute('aria-expanded', open);
    if (open && !started) {
      started = true;
      add('Hi! 🐾 I\'m the CAS Pet Services assistant. Ask me about relocating your cat or dog, anytime. For a quote, the team replies on WhatsApp.', 'bot');
      addQuick();
    }
    if (open) document.getElementById('chatIn').focus();
  };
  var ob = document.getElementById('openChatBtn'); if (ob) ob.addEventListener('click', function () { toggle(true); });
  fab.addEventListener('click', function () { toggle(!chat.classList.contains('open')); });
  document.getElementById('chatClose').addEventListener('click', function () { toggle(false); });
  document.getElementById('chatForm').addEventListener('submit', function (e) {
    e.preventDefault(); var i = document.getElementById('chatIn'); ask(i.value); i.value = '';
  });
  body.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) toggle(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') toggle(false); });
})();
