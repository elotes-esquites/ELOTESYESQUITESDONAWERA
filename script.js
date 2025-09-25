// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Estado de la música
    let isMusicPlaying = false;
    let audioContext = null;
    let musicInterval = null;

    // Inicialización
    initializeAnimations();
    setupMusicControl();
    setupNavigation();
    setupScrollEffects();
    setupProductCards();
    createFloatingElements();
    setupInteractiveSchedule();

    // Control de música de fondo simplificado
    function setupMusicControl() {
        musicToggle.addEventListener('click', function() {
            if (isMusicPlaying) {
                stopAmbientSound();
                musicToggle.innerHTML = '<i class="fas fa-music"></i>';
                musicToggle.style.animationPlayState = 'paused';
            } else {
                playAmbientSound();
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                musicToggle.style.animationPlayState = 'running';
            }
            isMusicPlaying = !isMusicPlaying;
        });
    }

    // Control consistente de sonido ambiente
    function playAmbientSound() {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            function createTone(frequency, duration, volume = 0.05) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            }

            function playAmbientLoop() {
                if (isMusicPlaying && audioContext && audioContext.state === 'running') {
                    // Tonos suaves que evocan ambiente mexicano
                    createTone(440, 0.5, 0.03); // La
                    setTimeout(() => createTone(523, 0.3, 0.02), 200); // Do
                    setTimeout(() => createTone(659, 0.4, 0.025), 400); // Mi
                }
            }
            
            // Reproducir cada 12 segundos
            playAmbientLoop();
            musicInterval = setInterval(playAmbientLoop, 12000);
            
        } catch (error) {
            console.log('Audio context not supported');
        }
    }

    function stopAmbientSound() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.suspend();
        }
    }

    // Navegación móvil
    function setupNavigation() {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Animar las barras del hamburger
            const spans = hamburger.querySelectorAll('span');
            if (hamburger.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                
                // Resetear hamburger
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });

        // Smooth scroll para enlaces de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Ajuste para header fijo
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Efectos de scroll
    function setupScrollEffects() {
        // Cambiar header en scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            const scrolled = window.scrollY > 100;
            
            if (scrolled) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 5px 30px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            }
        });

        // Animaciones al hacer scroll (Intersection Observer)
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos para animaciones
        const animatedElements = document.querySelectorAll('.product-card, .about-card, .testimonial-card');
        animatedElements.forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // Interacciones de las tarjetas de productos
    function setupProductCards() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            // Efecto de inclinación 3D
            card.addEventListener('mousemove', function(e) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-10px)';
            });

            // Click en botón overlay
            const overlayBtn = card.querySelector('.btn-overlay');
            if (overlayBtn) {
                overlayBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    showProductModal(card);
                });
            }
        });
    }

    // Modal de producto (simulado)
    function showProductModal(productCard) {
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        // Crear modal dinámico
        const modal = document.createElement('div');
        modal.className = 'product-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${productName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>¡Delicioso ${productName.toLowerCase()} preparado con los mejores ingredientes!</p>
                    <div class="modal-price">${productPrice}</div>
                    <div class="modal-buttons">
                        <button class="btn btn-primary">🛒 Agregar al carrito</button>
                        <button class="btn btn-secondary">📞 Llamar ahora</button>
                    </div>
                </div>
            </div>
        `;
        
        // Estilos del modal
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 400px;
            width: 90%;
            text-align: center;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(modal);
        
        // Animar entrada
        setTimeout(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
        
        // Cerrar modal
        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => modal.remove(), 300);
        }
        
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeModal();
        });
        
        // Funcionalidad de botones
        modal.querySelector('.btn-primary').addEventListener('click', function() {
            alert(`¡${productName} agregado al carrito! 🛒`);
            closeModal();
        });
        
        modal.querySelector('.btn-secondary').addEventListener('click', function() {
            alert('📞 ¡Llámanos al +52 55 1234-5678 para ordenar!');
            closeModal();
        });
    }

    // Crear elementos flotantes decorativos
    function createFloatingElements() {
        const hero = document.querySelector('.hero');
        const elementsToCreate = ['🌽', '🎉', '⭐', '🌶️', '🍋'];
        
        elementsToCreate.forEach((emoji, index) => {
            setTimeout(() => {
                createFloatingElement(hero, emoji);
            }, index * 2000);
        });
        
        // Crear nuevos elementos cada 10 segundos
        setInterval(() => {
            const randomEmoji = elementsToCreate[Math.floor(Math.random() * elementsToCreate.length)];
            createFloatingElement(hero, randomEmoji);
        }, 10000);
    }

    function createFloatingElement(container, emoji) {
        const element = document.createElement('div');
        element.textContent = emoji;
        element.style.cssText = `
            position: absolute;
            font-size: ${Math.random() * 2 + 1}rem;
            pointer-events: none;
            z-index: 1;
            opacity: 0.7;
            left: ${Math.random() * 90}%;
            top: ${Math.random() * 80 + 10}%;
            animation: floatAndFade 6s ease-in-out infinite;
        `;
        
        container.appendChild(element);
        
        // Remover después de la animación
        setTimeout(() => {
            if (element.parentNode) {
                element.remove();
            }
        }, 6000);
    }

    // Inicializar animaciones principales
    function initializeAnimations() {
        // Animar elementos del hero al cargar
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');
        
        setTimeout(() => {
            if (heroTitle) heroTitle.style.opacity = '1';
        }, 500);
        
        setTimeout(() => {
            if (heroSubtitle) heroSubtitle.style.opacity = '1';
        }, 1000);
        
        setTimeout(() => {
            if (heroButtons) heroButtons.style.opacity = '1';
        }, 1500);
    }

    // Efectos especiales en botones
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Efecto de ondas
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Agregar animación CSS para elementos flotantes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatAndFade {
            0% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.7;
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-40px) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Configurar horarios súper interactivos
    function setupInteractiveSchedule() {
        const statusElement = document.querySelector('.current-status');
        if (!statusElement) return;

        function updateScheduleStatus() {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinutes = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinutes;
            
            // Horarios: 3:30 PM - 8:30 PM (15:30 - 20:30)
            const openTime = 15 * 60 + 30; // 15:30 = 930 minutos
            const closeTime = 20 * 60 + 30; // 20:30 = 1230 minutos
            const soonTime = 15 * 60; // 15:00 = 900 minutos (30 min antes)
            const closingSoonTime = 20 * 60; // 20:00 = 1200 minutos (30 min antes del cierre)

            statusElement.className = 'current-status';

            if (currentTime >= openTime && currentTime <= closingSoonTime) {
                // Abierto normalmente
                statusElement.classList.add('open');
                const remainingMinutes = closingSoonTime - currentTime;
                const hours = Math.floor(remainingMinutes / 60);
                const minutes = remainingMinutes % 60;
                statusElement.innerHTML = `🟢 ¡ABIERTO AHORA!<br><small>Cerramos en ${hours}h ${minutes}min</small>`;
            } else if (currentTime > closingSoonTime && currentTime <= closeTime) {
                // Cerrando pronto
                statusElement.classList.add('closing-soon');
                const remainingMinutes = closeTime - currentTime;
                statusElement.innerHTML = `🟠 ¡CERRANDO PRONTO!<br><small>Solo quedan ${remainingMinutes} minutos</small>`;
            } else if (currentTime >= soonTime && currentTime < openTime) {
                // Abrimos pronto
                statusElement.classList.add('soon');
                const remainingMinutes = openTime - currentTime;
                statusElement.innerHTML = `🟡 ABRIMOS PRONTO<br><small>En ${remainingMinutes} minutos</small>`;
            } else {
                // Cerrado
                statusElement.classList.add('closed');
                let nextOpenTime;
                if (currentTime < soonTime) {
                    // Mismo día
                    nextOpenTime = openTime - currentTime;
                } else {
                    // Día siguiente (24 horas - tiempo actual + tiempo de apertura)
                    nextOpenTime = (24 * 60) - currentTime + openTime;
                }
                
                const hours = Math.floor(nextOpenTime / 60);
                const minutes = nextOpenTime % 60;
                
                if (hours < 1) {
                    statusElement.innerHTML = `🔴 CERRADO<br><small>Abrimos en ${minutes} minutos</small>`;
                } else if (hours < 24) {
                    statusElement.innerHTML = `🔴 CERRADO<br><small>Abrimos en ${hours}h ${minutes}min</small>`;
                } else {
                    const remainingHours = hours - 24;
                    statusElement.innerHTML = `🔴 CERRADO<br><small>Abrimos mañana en ${remainingHours}h ${minutes}min</small>`;
                }
            }

            // Añadir efecto pulsante cada 2 segundos
            statusElement.style.animation = 'none';
            setTimeout(() => {
                statusElement.style.animation = 'statusBlink 2s ease-in-out infinite';
            }, 100);
        }

        // Crear indicador visual adicional
        function createTimeIndicator() {
            const scheduleContainer = document.querySelector('.schedule-interactive');
            if (!scheduleContainer) return;

            const indicator = document.createElement('div');
            indicator.className = 'time-indicator';
            indicator.innerHTML = `
                <div class="time-progress">
                    <div class="progress-bar"></div>
                    <div class="time-markers">
                        <span class="marker start">3:30 PM</span>
                        <span class="marker current"></span>
                        <span class="marker end">8:30 PM</span>
                    </div>
                </div>
            `;
            scheduleContainer.appendChild(indicator);

            // Actualizar barra de progreso
            function updateProgressBar() {
                const now = new Date();
                const currentTime = now.getHours() * 60 + now.getMinutes();
                const openTime = 15 * 60 + 30;
                const closeTime = 20 * 60 + 30;
                
                const progressBar = document.querySelector('.progress-bar');
                const currentMarker = document.querySelector('.marker.current');
                
                if (!progressBar || !currentMarker) return;

                if (currentTime >= openTime && currentTime <= closeTime) {
                    const progress = ((currentTime - openTime) / (closeTime - openTime)) * 100;
                    progressBar.style.width = `${progress}%`;
                    progressBar.style.background = 'linear-gradient(90deg, #4CAF50, #81C784)';
                    currentMarker.textContent = now.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        hour12: true 
                    });
                    currentMarker.style.color = '#4CAF50';
                } else {
                    progressBar.style.width = '0%';
                    currentMarker.textContent = 'CERRADO';
                    currentMarker.style.color = '#F44336';
                }
            }

            updateProgressBar();
            setInterval(updateProgressBar, 30000); // Actualizar cada 30 segundos
        }

        // Inicializar
        updateScheduleStatus();
        createTimeIndicator();
        
        // Actualizar cada 30 segundos para más precisión
        setInterval(updateScheduleStatus, 30000);
    }

    // Mensajes de bienvenida
    setTimeout(() => {
        console.log('🌽 ¡Bienvenido a Elotes y Esquites Doña Wera! 🌽');
        console.log('🎉 Página web creada con amor y mucho sabor mexicano 🇲🇽');
    }, 2000);
});

// Funciones auxiliares globales
window.orderNow = function() {
    alert('🌽 ¡Gracias por tu interés! Llámanos al +52 55 1234-5678 para hacer tu pedido. ¡Te esperamos! 🎉');
};

window.showMenu = function() {
    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
};