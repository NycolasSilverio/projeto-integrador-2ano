const destinations = [
  { name: 'Paris', country: 'França', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80', description: 'A Cidade da Luz oferece arte, arquitetura e romance em cada esquina.', rating: '4.8', type: 'temperado' },
  { name: 'Tóquio', country: 'Japão', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=80', description: 'Uma metrópole vibrante onde tradição e modernidade se encontram.', rating: '4.7', type: 'temperado' },
  { name: 'Bali', country: 'Indonésia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80', description: 'Paraíso tropical com praias, templos e paisagens de tirar o fôlego.', rating: '4.9', type: 'tropical' },
  { name: 'Roma', country: 'Itália', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=80', description: 'História viva, gastronomia inesquecível e monumentos grandiosos.', rating: '4.8', type: 'temperado' },
  { name: 'Dubai', country: 'Emirados Árabes', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80', description: 'Arranha-céus, compras de luxo e experiências surpreendentes.', rating: '4.6', type: 'deserto' },
  { name: 'Reykjavik', country: 'Islândia', image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=900&q=80', description: 'Auroras boreais, paisagens vulcânicas e natureza selvagem.', rating: '4.7', type: 'ártico' }
];

const grid = document.querySelector('#destination-grid');
const search = document.querySelector('#search');
const climate = document.querySelector('#climate');
const modal = document.querySelector('#modal-backdrop');
const authModal = document.querySelector('#auth-backdrop');
const authForm = document.querySelector('#auth-form');
const signupFields = document.querySelectorAll('.signup-only');
const loginTab = document.querySelector('#login-tab');
const signupTab = document.querySelector('#signup-tab');
const contactForm = document.querySelector('#contact-form');
const profileSection = document.querySelector('#profile');
const profileButton = document.querySelector('#profile-button');
const savedGrid = document.querySelector('#saved-grid');
const savedCount = document.querySelector('#saved-count');
const savedStorageKey = 'geodiscover-saved-destinations';
let savedDestinations = JSON.parse(localStorage.getItem(savedStorageKey) || '["Bali", "Roma"]');
let authMode = 'login';

function renderDestinations() {
  const term = search.value.toLowerCase().trim();
  const selectedClimate = climate.value;
  const filtered = destinations.filter((destination) => {
    const matchesText = `${destination.name} ${destination.country}`.toLowerCase().includes(term);
    return matchesText && (!selectedClimate || destination.type === selectedClimate);
  });

  grid.innerHTML = filtered.length ? filtered.map((destination, index) => `
    <article class="destination-card" style="animation-delay: ${index * 80}ms">
      <img src="${destination.image}" alt="Paisagem de ${destination.name}" loading="lazy">
      <div class="card-body">
        <div class="card-top"><div><h3>${destination.name}</h3><div class="country">${destination.country}</div></div><span class="rating">★ ${destination.rating}</span></div>
        <p>${destination.description}</p>
        <div class="card-actions">
          <button class="card-link" data-destination="${destination.name}">Ver detalhes</button>
          <button class="save-button ${savedDestinations.includes(destination.name) ? 'saved' : ''}" data-save-destination="${destination.name}" type="button" aria-pressed="${savedDestinations.includes(destination.name)}">
            ${savedDestinations.includes(destination.name) ? 'Salvo' : 'Salvar destino'}
          </button>
        </div>
      </div>
    </article>`).join('') : '<p class="no-results">Nenhum destino encontrado. Tente outra busca.</p>';

  document.querySelectorAll('[data-destination]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.destination));
  });
  document.querySelectorAll('[data-save-destination]').forEach((button) => {
    button.addEventListener('click', () => toggleSavedDestination(button.dataset.saveDestination));
  });
}

function renderSavedDestinations() {
  const saved = destinations.filter((destination) => savedDestinations.includes(destination.name));
  savedCount.textContent = saved.length;
  savedGrid.innerHTML = saved.length ? saved.map((destination) => `
    <article class="saved-trip">
      <img src="${destination.image}" alt="Paisagem de ${destination.name}" loading="lazy">
      <div><strong>${destination.name}</strong><span>${destination.country} · ${destination.type}</span></div>
    </article>`).join('') : '<p class="empty-saved">Você ainda não salvou nenhum destino.</p>';
}

function toggleSavedDestination(name) {
  savedDestinations = savedDestinations.includes(name)
    ? savedDestinations.filter((savedName) => savedName !== name)
    : [...savedDestinations, name];
  localStorage.setItem(savedStorageKey, JSON.stringify(savedDestinations));
  renderDestinations();
  renderSavedDestinations();
}

function setProfileView(isOpen) {
  document.body.classList.toggle('profile-view', isOpen);
  profileButton.textContent = isOpen ? 'Voltar' : 'Meu perfil';
  if (isOpen) {
    profileSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function openModal(name) {
  const destination = destinations.find((item) => item.name === name);
  document.querySelector('#modal-title').textContent = `${destination.name}, ${destination.country}`;
  document.querySelector('#modal-text').textContent = `${destination.description} Prepare uma jornada personalizada com experiências locais, gastronomia e momentos que ficam na memória.`;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function setAuthMode(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  document.querySelector('#auth-title').textContent = isSignup ? 'Crie sua conta' : 'Entrar na sua conta';
  document.querySelector('#auth-intro').textContent = isSignup ? 'Salve seus destinos favoritos e organize a próxima aventura.' : 'Acesse seus destinos salvos e continue planejando.';
  document.querySelector('#auth-submit').textContent = isSignup ? 'Criar minha conta' : 'Entrar';
  signupFields.forEach((field) => {
    field.hidden = !isSignup;
    field.querySelector('input').required = isSignup;
  });
  loginTab.classList.toggle('active', !isSignup);
  signupTab.classList.toggle('active', isSignup);
  loginTab.setAttribute('aria-selected', String(!isSignup));
  signupTab.setAttribute('aria-selected', String(isSignup));
  document.querySelector('#form-message').textContent = '';
}

function openAuth(mode) {
  setAuthMode(mode);
  authModal.classList.add('open');
  authModal.setAttribute('aria-hidden', 'false');
  document.querySelector(isAuthSignup(mode) ? '#name' : '#email').focus();
}

function isAuthSignup(mode) {
  return mode === 'signup';
}

function closeAuth() {
  authModal.classList.remove('open');
  authModal.setAttribute('aria-hidden', 'true');
  authForm.reset();
  setAuthMode('login');
}

document.querySelector('#explore-button').addEventListener('click', () => document.querySelector('#destinations').scrollIntoView());
document.querySelector('#journey-button').addEventListener('click', () => document.querySelector('#search').focus());
document.querySelector('#menu-toggle').addEventListener('click', () => document.querySelector('#nav-links').classList.toggle('open'));
profileButton.addEventListener('click', () => setProfileView(!document.body.classList.contains('profile-view')));
document.querySelector('#profile-back').addEventListener('click', () => setProfileView(false));
document.querySelector('#profile-edit').addEventListener('click', () => alert('A edição do perfil estará disponível em breve.'));
document.querySelector('#see-destinations').addEventListener('click', () => {
  setProfileView(false);
  document.querySelector('#destinations').scrollIntoView({ behavior: 'smooth' });
});
document.querySelectorAll('.nav-links a, .logo').forEach((link) => {
  link.addEventListener('click', () => setProfileView(false));
});
document.querySelector('#close-modal').addEventListener('click', closeModal);
document.querySelector('#login-button').addEventListener('click', () => openAuth('login'));
document.querySelector('#signup-button').addEventListener('click', () => openAuth('signup'));
document.querySelector('#close-auth-modal').addEventListener('click', closeAuth);
loginTab.addEventListener('click', () => setAuthMode('login'));
signupTab.addEventListener('click', () => setAuthMode('signup'));
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
authModal.addEventListener('click', (event) => { if (event.target === authModal) closeAuth(); });
authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const password = document.querySelector('#password').value;
  const confirmPassword = document.querySelector('#confirm-password').value;
  const message = document.querySelector('#form-message');
  if (authMode === 'signup' && password !== confirmPassword) {
    message.textContent = 'As senhas precisam ser iguais.';
    message.className = 'form-message error';
    return;
  }
  message.textContent = authMode === 'signup' ? 'Conta criada! Sua próxima aventura espera por você.' : 'Login realizado! Bom planejamento.';
  message.className = 'form-message success';
  authForm.reset();
});
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  document.querySelector('#contact-feedback').textContent = 'Mensagem enviada! Responderemos em breve.';
  contactForm.reset();
});
search.addEventListener('input', renderDestinations);
climate.addEventListener('change', renderDestinations);
renderDestinations();
renderSavedDestinations();
