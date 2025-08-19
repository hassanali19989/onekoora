// تفعيل القائمة المتجاوبة
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // إغلاق القائمة عند النقر على رابط
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // تفعيل فلاتر المباريات (ديناميكي)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const leagueButtons = document.querySelectorAll('[data-league]');
    let currentFilter = localStorage.getItem('matchFilter') || 'all';
    let currentLeague = localStorage.getItem('leagueFilter') || 'all';
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentFilter = this.getAttribute('data-filter');
                localStorage.setItem('matchFilter', currentFilter);
                applyCombinedFilter();
            });
        });
    }

    if (leagueButtons.length > 0) {
        leagueButtons.forEach(button => {
            button.addEventListener('click', function() {
                leagueButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                currentLeague = this.getAttribute('data-league');
                localStorage.setItem('leagueFilter', currentLeague);
                applyCombinedFilter();
            });
        });
    }

    // تأثير التمرير السلس
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // تأثير الظهور عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // مراقبة العناصر للتأثير
    const animatedElements = document.querySelectorAll('.news-card, .stat-card, .match-card, .achievement-card, .value-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // مساعد: تنسيق شعار الفريق (إيموجي أو صورة)
    function formatLogo(logo) {
        if (!logo) return '';
        const s = String(logo).trim();
        const isImage = /\.(png|svg|jpg|jpeg|webp)$/i.test(s) || s.startsWith('assets/') || s.startsWith('http');
        return isImage ? `<img src="${s}" alt="" loading="lazy">` : s;
    }

    // تحميل المباريات من JSON وبناء البطاقات
    async function loadMatches() {
        const upcomingContainer = document.getElementById('upcomingMatches');
        const completedContainer = document.getElementById('completedMatches');
        if (!upcomingContainer && !completedContainer) return;
        try {
            const res = await fetch('assets/data/matches.json', { cache: 'no-store' });
            const data = await res.json();

            if (upcomingContainer) {
                upcomingContainer.innerHTML = '';
                (data.upcoming || []).forEach(m => {
                    const card = document.createElement('div');
                    card.className = 'match-card upcoming';
                    card.setAttribute('data-date', m.datetime);
                    if (m.league) card.setAttribute('data-league', m.league);
                    card.innerHTML = `
                        <div class="match-date">
                            <span class="day">${m.day}</span>
                            <span class="date">${m.date}</span>
                            <span class="time">${m.time}</span>
                        </div>
                        <div class="match-league">${m.league ? '🏆 ' + m.league : ''}</div>
                        <div class="match-teams">
                            <div class="team home">
                                <span class="team-logo">${formatLogo(m.home.logo)}</span>
                                <span class="team-name">${m.home.name}</span>
                            </div>
                            <div class="vs">VS</div>
                            <div class="team away">
                                <span class="team-name">${m.away.name}</span>
                                <span class="team-logo">${formatLogo(m.away.logo)}</span>
                            </div>
                        </div>
                        <div class="match-venue">
                            <span>${m.venue || ''}</span>
                        </div>`;
                    upcomingContainer.appendChild(card);
                });
            }

            if (completedContainer) {
                completedContainer.innerHTML = '';
                (data.completed || []).forEach(m => {
                    const card = document.createElement('div');
                    card.className = `match-card completed ${m.result || ''}`;
                    if (m.league) card.setAttribute('data-league', m.league);
                    card.innerHTML = `
                        <div class="match-date">
                            <span class="day">${m.day}</span>
                            <span class="date">${m.date}</span>
                            <span class="time">${m.time}</span>
                        </div>
                        <div class="match-league">${m.league ? '🏆 ' + m.league : ''}</div>
                        <div class="match-teams">
                            <div class="team home">
                                <span class="team-logo">${formatLogo(m.home.logo)}</span>
                                <span class="team-name">${m.home.name}</span>
                            </div>
                            <div class="score">${m.score || ''}</div>
                            <div class="team away">
                                <span class="team-name">${m.away.name}</span>
                                <span class="team-logo">${formatLogo(m.away.logo)}</span>
                            </div>
                        </div>
                        <div class="match-result">
                            <span class="result-badge ${m.result}">${m.result === 'win' ? 'فوز' : m.result === 'loss' ? 'خسارة' : 'تعادل'}</span>
                        </div>`;
                    completedContainer.appendChild(card);
                });
            }

            updateMatchTimes();
            // استعادة الفلاتر
            currentFilter = localStorage.getItem('matchFilter') || 'all';
            currentLeague = localStorage.getItem('leagueFilter') || 'all';
            applyCombinedFilter();
        } catch (e) {
            console.error('فشل تحميل المباريات', e);
        }
    }

    // تطبيق فلتر الحالة + فلتر الدوري معًا
    function applyCombinedFilter() {
        const cards = document.querySelectorAll('.match-card');
        cards.forEach(card => {
            const byStatus =
                currentFilter === 'all' ? true : card.classList.contains(currentFilter);
            const league = card.getAttribute('data-league') || 'غير محدد';
            const byLeague = currentLeague === 'all' ? true : league === currentLeague;
            card.style.display = byStatus && byLeague ? 'grid' : 'none';
        });
    }

    // تشغيل تحميل البيانات
    loadMatches();

    // تحميل الأخبار
    async function loadNews() {
        const grid = document.getElementById('newsGrid');
        if (!grid) return;
        try {
            const res = await fetch('assets/data/news.json', { cache: 'no-store' });
            const data = await res.json();
            const render = (items) => {
                grid.innerHTML = '';
                items.forEach(n => {
                    const card = document.createElement('article');
                    card.className = 'news-card';
                    card.innerHTML = `
                        <div class="news-image">${n.emoji || '📰'}</div>
                        <div class="news-content">
                            <span class="news-category">${n.category || ''}</span>
                            <h3>${n.title}</h3>
                            <p>${n.summary || ''}</p>
                            <div class="news-meta">
                                <span class="news-date">📅 ${n.date || ''}</span>
                                <span class="news-author">🔗 ${n.source || ''}</span>
                            </div>
                            ${n.link ? `<div style="margin-top:.6rem"><a class="btn btn-secondary" target="_blank" rel="noopener" href="${n.link}">قراءة المزيد</a></div>` : ''}
                        </div>`;
                    grid.appendChild(card);
                });
            };
            // افتراضي: العربية
            render(data.arabic || []);
            // ربط أزرار الفلترة للأخبار
            document.querySelectorAll('[data-news-filter]')?.forEach(btn => {
                btn.addEventListener('click', () => {
                    document.querySelectorAll('[data-news-filter]').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const type = btn.getAttribute('data-news-filter');
                    render((type === 'international' ? data.international : data.arabic) || []);
                });
            });
        } catch (e) {
            console.error('فشل تحميل الأخبار', e);
        }
    }
    loadNews();

    // عدّ تنازلي حي للمباريات القادمة (يتطلب data-date في البطاقة)
    function updateMatchTimes() {
        const upcomingMatches = document.querySelectorAll('.match-card.upcoming');
        const now = new Date();
        upcomingMatches.forEach(match => {
            // حاول القراءة من data-date وإلا من النص
            const attr = match.getAttribute('data-date');
            let target;
            if (attr) {
                target = new Date(attr);
            } else {
                const dateText = match.querySelector('.date')?.textContent || '';
                const timeText = match.querySelector('.time')?.textContent || '00:00';
                target = new Date(`${dateText} ${timeText}`);
            }
            const timeEl = match.querySelector('.time');
            if (!timeEl || isNaN(target)) return;

            const diff = target - now;
            if (diff <= 0) {
                timeEl.textContent = 'بدأت';
                match.classList.remove('upcoming');
                match.classList.add('live');
                return;
            }
            const d = Math.floor(diff / (1000*60*60*24));
            const h = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
            const m = Math.floor((diff % (1000*60*60))/(1000*60));
            timeEl.textContent = d > 0 ? `${d}ي ${h}س ${m}د` : `${h}س ${m}د`;
        });
    }

    // تشغيل تحديث الأوقات كل دقيقة + تشغيل فوري
    setInterval(updateMatchTimes, 60000);

    // تأثير النقر على البطاقات
    const clickableCards = document.querySelectorAll('.news-card, .achievement-card, .value-card');
    clickableCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // تأثير التحويم على الأزرار
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // إضافة تأثير الكتابة للعنوان الرئيسي
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // بدء التأثير بعد تحميل الصفحة
        setTimeout(typeWriter, 500);
    }

    // تم تعطيل قسم الإحصائيات بناءً على طلب المستخدم

    // إضافة تأثير الجسيمات للخلفية (اختياري)
    function createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = '#28a745';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.opacity = '0.3';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        particle.style.zIndex = '-1';
        
        document.body.appendChild(particle);
        
        // تحريك الجسيم
        let position = window.innerHeight;
        const speed = Math.random() * 3 + 1;
        
        const moveParticle = setInterval(() => {
            position -= speed;
            particle.style.top = position + 'px';
            
            if (position < -10) {
                clearInterval(moveParticle);
                document.body.removeChild(particle);
            }
        }, 20);
    }

    // إنشاء جسيمات بشكل دوري
    setInterval(createParticle, 3000);

    // تأثير النقر على شعار الفريق
    const teamLogo = document.querySelector('.logo-circle');
    if (teamLogo) {
        teamLogo.addEventListener('click', function() {
            this.style.animation = 'bounce 1s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    }

    // حفظ تفضيلات المستخدم في localStorage
    const filterPreference = localStorage.getItem('matchFilter');
    if (filterPreference) {
        const preferredButton = document.querySelector(`[data-filter="${filterPreference}"]`);
        if (preferredButton) {
            preferredButton.click();
        }
    }

    // حفظ التفضيل عند تغيير الفلتر
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            localStorage.setItem('matchFilter', this.getAttribute('data-filter'));
        });
    });

    // تبديل الوضع الداكن/الفاتح مع حفظ التفضيل
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') root.setAttribute('data-theme', 'dark');
    if (savedTheme === 'light') root.setAttribute('data-theme', 'light');

    if (themeToggle) {
        const updateToggleLabel = () => {
            const isDark = root.getAttribute('data-theme') === 'dark' || (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
            themeToggle.querySelector('.icon').textContent = isDark ? '🌞' : '🌙';
            themeToggle.querySelector('.text').textContent = isDark ? 'الوضع الفاتح' : 'الوضع الداكن';
        };
        updateToggleLabel();

        themeToggle.addEventListener('click', () => {
            const current = root.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateToggleLabel();
        });
    }

    // إضافة تأثير الضوء المتحرك
    function addGlowEffect() {
        const glowElements = document.querySelectorAll('.btn-primary, .logo-circle');
        glowElements.forEach(element => {
            element.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.5)';
            setTimeout(() => {
                element.style.boxShadow = '';
            }, 2000);
        });
    }

    // تشغيل تأثير الضوء كل 10 ثوان
    setInterval(addGlowEffect, 10000);

    console.log('🟢 موقع كرة القدم تم تحميله بنجاح! ⚽');
});
