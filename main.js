// ========================================
// 1. TYPING EFFECT
// ========================================
const roles = [
  'UI/UX Designer',
  'Web Developer',
  'RPL Student',
  'Tech Enthusiast'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing');

function typeEffect() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typingElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentRole.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 500;
  }

  setTimeout(typeEffect, delay);
}

typeEffect();

// ========================================
// 2. NAVBAR SCROLL EFFECT
// ========================================
const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ========================================
// 3. HAMBURGER MENU
// ========================================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close menu when link clicked
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ========================================
// 4. CONTACT FORM WITH COMMENTS
// ========================================
const sendBtn = document.getElementById('sendMessageBtn');
const viewCommentsBtn = document.getElementById('viewCommentsBtn');
const notification = document.getElementById('notification');
const notifMessage = document.getElementById('notifMessage');
const commentsList = document.getElementById('commentsList');
const commentCount = document.getElementById('commentCount');

// Load comments from localStorage
let comments = JSON.parse(localStorage.getItem('portfolioComments')) || [];

function renderComments() {
  if (comments.length === 0) {
    commentsList.innerHTML = '<div class="empty-comments">Belum ada komentar. Jadilah yang pertama!</div>';
    commentCount.textContent = '0';
    return;
  }

  commentCount.textContent = comments.length;
  commentsList.innerHTML = comments.map((c) => `
    <div class="comment-item">
      <div class="comment-name">${escapeHtml(c.name)}</div>
      <div class="comment-msg">${escapeHtml(c.message)}</div>
      <div class="comment-time">${c.time}</div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, isSuccess = true) {
  notifMessage.textContent = message;
  notification.style.background = isSuccess 
    ? 'linear-gradient(135deg, #6c63ff, #5a52d5)' 
    : 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Send Message
sendBtn.addEventListener('click', () => {
  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('emailAddress').value.trim();
  const message = document.getElementById('messageContent').value.trim();

  if (!name || !email || !message) {
    showNotification('⚠️ Harap isi semua field!', false);
    return;
  }

  // Add comment
  const now = new Date();
  const timeStr = now.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  comments.push({
    name: name,
    email: email,
    message: message,
    time: timeStr
  });

  localStorage.setItem('portfolioComments', JSON.stringify(comments));
  renderComments();

  // Reset form
  document.getElementById('fullName').value = '';
  document.getElementById('emailAddress').value = '';
  document.getElementById('messageContent').value = '';

  showNotification('✅ Pesan berhasil dikirim! Terima kasih.');
});

// View Comments toggle
let commentsVisible = false;
viewCommentsBtn.addEventListener('click', () => {
  const section = document.querySelector('.comments-section');
  if (commentsVisible) {
    section.style.display = 'none';
    commentsVisible = false;
    viewCommentsBtn.innerHTML = `<i class="fas fa-comments"></i> Lihat Komentar (<span id="commentCount">${comments.length}</span>)`;
  } else {
    section.style.display = 'block';
    commentsVisible = true;
    viewCommentsBtn.innerHTML = `<i class="fas fa-times"></i> Tutup Komentar (<span id="commentCount">${comments.length}</span>)`;
    renderComments();
  }
});

// Hide comments section initially
document.querySelector('.comments-section').style.display = 'none';

// Enter key support
document.querySelectorAll('.contact-right input, .contact-right textarea').forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      sendBtn.click();
    }
  });
});

// ========================================
// 5. SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 70;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// 6. SCROLL REVEAL ANIMATION
// ========================================
const revealElements = document.querySelectorAll('.card, #about p, .contact-left, .contact-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, index * 100);
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `all 0.6s ease ${i * 0.1}s`;
  revealObserver.observe(el);
});

console.log('🚀 Portfolio Muhammad Hafidz - Loaded successfully!');