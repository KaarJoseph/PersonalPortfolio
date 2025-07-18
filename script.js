const btn = document.getElementById('button');
const sectionAll = document.querySelectorAll('section[id]');
const flagsElement = document.getElementById('flags');
const textsToChange = document.querySelectorAll('[data-section]');

/* ===== Loader ===== */
window.addEventListener('load', () => {
    const contenedorLoader = document.querySelector('.container--loader');
    contenedorLoader.style.opacity = 0;
    contenedorLoader.style.visibility = 'hidden';
});

/* ===== Header ===== */
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('abajo', window.scrollY > 0);
});

/* ===== Botón Menú ===== */
btn.addEventListener('click', function() {
    this.classList.toggle('active');
    this.classList.toggle('not-active');
    document.querySelector('.nav_menu').classList.toggle('active');
    document.querySelector('.nav_menu').classList.toggle('not-active');
});

/* ===== Cambio de idioma ===== */
let currentLanguage = 'es'; // Idioma por defecto
let languageData = {}; // Almacenar datos de idioma cargados

const changeLanguage = async (language) => {
    try {
        const requestJson = await fetch(`./languages/${language}.json`);
        const texts = await requestJson.json();
        currentLanguage = language;
        languageData[language] = texts; // Guardar los textos cargados

        // Actualizar textos estáticos
        textsToChange.forEach(element => {
            const section = element.dataset.section;
            const value = element.dataset.value;
            
            if (texts[section] && texts[section][value]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = texts[section][value];
                } else {
                    element.textContent = texts[section][value];
                }
            }
        });

        // Actualizar botones de proyectos
        updateProjectButtons(texts);
        
    } catch (error) {
        console.error('Error loading language file:', error);
    }
};

// Función para actualizar botones de proyectos
function updateProjectButtons(texts) {
    if (!texts?.proyectos?.buttons) return;
    
    // Botones Ver Imagen/Repositorio
    document.querySelectorAll('.btn_viewImage span').forEach(span => {
        span.textContent = texts.proyectos.buttons.view_image;
    });

    document.querySelectorAll('.btn_repo span').forEach(span => {
        span.textContent = texts.proyectos.buttons.view_repo;
    });

    // Botones Ver más/menos
    document.querySelectorAll('.view-more-btn').forEach(btn => {
        const span = btn.querySelector('span');
        if (span) {
            const isExpanded = btn.classList.contains('expanded');
            span.dataset.section = "proyectos";
            span.dataset.value = isExpanded ? "buttons.view_less" : "buttons.view_more";
            span.textContent = isExpanded 
                ? texts.proyectos.buttons.view_less 
                : texts.proyectos.buttons.view_more;
        }
    });
}

// Inicializar botones Ver más/menos
function initViewMoreButtons() {
    document.querySelectorAll('.container_textCard--proyectos p').forEach(parrafo => {
        // Solo si el texto es largo (más de 4 líneas aprox)
        if (parrafo.scrollHeight > parrafo.clientHeight * 1.2) {
            // Verificar si el botón ya existe
            const existingBtn = parrafo.nextElementSibling;
            if (existingBtn && existingBtn.classList.contains('view-more-btn')) {
                return;
            }

            // Crear botón nuevo
            const boton = document.createElement('button');
            boton.className = 'view-more-btn';
            
            // Texto del botón
            const textSpan = document.createElement('span');
            textSpan.dataset.section = "proyectos";
            textSpan.dataset.value = "buttons.view_more";
            textSpan.textContent = "Ver más";
            
            // Icono flecha
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down';
            
            boton.appendChild(textSpan);
            boton.appendChild(icon);
            
            // Evento click
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                const parrafo = e.currentTarget.previousElementSibling;
                parrafo.classList.toggle('expanded');
                e.currentTarget.classList.toggle('expanded');
                
                // Actualizar texto e icono
                const isExpanded = parrafo.classList.contains('expanded');
                textSpan.dataset.value = isExpanded ? "buttons.view_less" : "buttons.view_more";
                icon.className = isExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
                
                // Actualizar traducción
                if (languageData[currentLanguage]) {
                    textSpan.textContent = isExpanded 
                        ? languageData[currentLanguage].proyectos.buttons.view_less 
                        : languageData[currentLanguage].proyectos.buttons.view_more;
                }
            });
            
            // Insertar botón después del párrafo
            parrafo.parentNode.insertBefore(boton, parrafo.nextSibling);
        }
    });
}

/* ===== Navegación por secciones ===== */
window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sectionAll.forEach((current) => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`nav a[href*=${sectionId}]`);

        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
});

/* ===== Botón ir arriba ===== */
window.addEventListener('scroll', () => {
    const goTopBtn = document.querySelector('.go-top-container');
    if (document.documentElement.scrollTop > 100) {
        goTopBtn.classList.add('show');
    } else {
        goTopBtn.classList.remove('show');
    }
});

document.querySelector('.go-top-container').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ===== Slider ===== */
function initSlider() {
    let currentIndex = 0;
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const staircaseImages = document.querySelectorAll(".staircase-images img");
    const slider = document.querySelector(".slider");

    function updateActiveImage(index) {
        staircaseImages.forEach(img => img.classList.remove("active"));
        if (staircaseImages[index]) {
            staircaseImages[index].classList.add("active");
        }
    }

    function goToSlide(index) {
        currentIndex = (index < 0) ? slides.length - 1 : 
                     (index >= slides.length) ? 0 : index;

        slider.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateActiveImage(currentIndex);
        
        dots.forEach(dot => dot.classList.remove("active"));
        dots[currentIndex]?.classList.add("active");
    }

    function moveSlide(step) {
        goToSlide(currentIndex + step);
    }

    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => goToSlide(index));
    });

    document.querySelector(".prev")?.addEventListener("click", () => moveSlide(-1));
    document.querySelector(".next")?.addEventListener("click", () => moveSlide(1));

    // Iniciar
    goToSlide(0);
    setInterval(() => moveSlide(1), 3000);
}

/* ===== Modal de imágenes ===== */
function initImageModal() {
    function openModal(imgId) {
        const modal = document.getElementById('modal');
        const modalImg = document.getElementById('modal-img');
        const img = document.getElementById(imgId);
        
        if (modal && modalImg && img) {
            modal.style.display = "block";
            modalImg.src = img.src;
        }
    }

    function closeModal() {
        const modal = document.getElementById('modal');
        if (modal) modal.style.display = "none";
    }

    // Event listeners
    window.addEventListener('click', (event) => {
        if (event.target === document.getElementById('modal')) {
            closeModal();
        }
    });

    document.querySelector('.close-btn')?.addEventListener('click', closeModal);
}

/* ===== Animaciones ===== */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.cards--proyectos').forEach(card => {
        observer.observe(card);
    });
}

/* ===== Inicialización ===== */
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar idioma por defecto
    await changeLanguage('es');
    
    // Inicializar componentes
    initSlider();
    initImageModal();
    initAnimations();
    initViewMoreButtons();
    
    // Event listener para banderas de idioma
    flagsElement.addEventListener('click', (e) => {
        const language = e.target.parentElement.dataset.language;
        if (language) changeLanguage(language);
    });
});

/* ===== Modal de imágenes ===== */
// Mover estas funciones al ámbito global
function openModal(imgId) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const img = document.getElementById(imgId);
    
    if (modal && modalImg && img) {
        modal.style.display = "block";
        modalImg.src = img.src;
        document.body.style.overflow = 'hidden'; // Evitar scroll cuando el modal está abierto
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
}

