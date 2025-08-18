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

    // تفعيل فلاتر المباريات
    const filterButtons = document.querySelectorAll('.filter-btn');
    const matchCards = document.querySelectorAll('.match-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة الكلاس النشط من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // إضافة الكلاس النشط للزر المضغوط
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                matchCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'grid';
                    } else if (filter === 'upcoming' && card.classList.contains('upcoming')) {
                        card.style.display = 'grid';
                    } else if (filter === 'completed' && card.classList.contains('completed')) {
                        card.style.display = 'grid';
                    } else {
                        card.style.display = 'none';
                    }
                });
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
    updateMatchTimes();
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

    // تأثير العد للإحصائيات
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalNumber = parseInt(stat.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50; // تقسيم العدد على 50 خطوة
        
        const counter = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                stat.textContent = finalNumber;
                clearInterval(counter);
            } else {
                stat.textContent = Math.floor(currentNumber);
            }
        }, 50);
    });

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
