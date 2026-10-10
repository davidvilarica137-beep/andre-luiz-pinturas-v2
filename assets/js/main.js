/* ============================================================
   ANDRÉ LUIZ | ARTE E PINTURAS
   JavaScript puro
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURAÇÃO CENTRALIZADA — altere aqui o telefone do WhatsApp
  // ============================================================
  const CONFIG = {
    // Número no formato brasileiro (DDD + número, sem espaços/parênteses/traços)
    // Ex.: 5513996398129
    whatsappNumber: '5513996398129',

    // Texto inicial do WhatsApp ao clicar no botão
    whatsappText: 'Olá, André! Encontrei seu site e gostaria de solicitar um orçamento para um serviço de pintura.'
  };

  // ============================================================
  // DOM REFS
  // ============================================================
  const menuToggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  const menuLinks = menu ? menu.querySelectorAll('a') : null;

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxLegenda = document.getElementById('lightbox-legenda');

  // ============================================================
  // MENU HAMBURGUER (celulares)
  // ============================================================
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () {
      const isActive = menuToggle.classList.toggle('active');
      menu.classList.toggle('ativo');
      menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Fechar menu ao clicar em um link
    if (menuLinks) {
      menuLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          menuToggle.classList.remove('active');
          menu.classList.remove('ativo');
          menuToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  }

  // ============================================================
  // LIGHTBOX (ampliar galeria)
  // ============================================================
  const galeriaItems = document.querySelectorAll('.galeria-item');

  function openLightbox(img, legenda) {
    lightboxImg.setAttribute('src', img.src);
    lightboxImg.alt = legenda;
    lightboxLegenda.textContent = legenda;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
  }

  galeriaItems.forEach(function (item) {
    const img = item.querySelector('img');
    const legenda = item.querySelector('figcaption') ? item.querySelector('figcaption').textContent.trim() : '';

    // Clique
    item.addEventListener('click', function () {
      if (lightbox.classList.contains('active')) return;
      openLightbox(img, legenda);
    });

    // Teclado (Enter / Espaço)
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (lightbox.classList.contains('active')) return;
        openLightbox(img, legenda);
      }
    });
  });

  // Botão fechar
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  // Clique fora da imagem (fundo)
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Teclado (Esc)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // ============================================================
  // SCROLL SUAVE (navegação por âncoras)
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const targetId = href.slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // espaço para o cabeçalho fixo
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });

  // Ativar classe "active" no menu conforme a seção visível
  const sections = document.querySelectorAll('main section, section');
  const menuAnchorLinks = document.querySelectorAll('.menu a[href^="#"]');

  function setActiveLink() {
    let current = '';
    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (window.pageYOffset >= top - 120) {
        current = section.getAttribute('id') || '';
      }
    });

    if (menuAnchorLinks) {
      menuAnchorLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', setActiveLink);
  window.addEventListener('load', setActiveLink);

  // ============================================================
  // VERIFICAÇÃO INICIAL DO NÚMERO DO WHATSAPP
  // ============================================================
  function logWhatsappConfig() {
    const links = document.querySelectorAll('a[href^="https://wa.me"]');
    let count = 0;
    let allMatch = true;

    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href.includes(CONFIG.whatsappNumber)) {
        count++;
      } else {
        allMatch = false;
      }
    });

    if (count === links.length && links.length > 0) {
      console.log('[André Luiz] Todos os links do WhatsApp estão configurados com o número ' + CONFIG.whatsappNumber + '.');
    } else if (links.length > 0) {
      console.warn('[André Luiz] ALERTA: alguns links do WhatsApp não correspondem ao número configurado. ' +
        'Verifique o "whatsappNumber" no inicio do main.js.');
    }

    if (links.length === 0) {
      console.warn('[André Luiz] Nenhum link do WhatsApp encontrado no HTML.');
    }
  }

  // Executa logo na carga
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    logWhatsappConfig();
  } else {
    window.addEventListener('load', logWhatsappConfig);
  }
})();
