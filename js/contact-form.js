document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP_NUMBER = '573053300303';
  const submitBtn = form.querySelector('.contact-form__submit');
  const t = (key) => window.RudoI18n?.t(key) ?? key;

  const fields = {
    nombre: form.querySelector('#contact-nombre'),
    email: form.querySelector('#contact-email'),
    telefono: form.querySelector('#contact-telefono'),
    servicio: form.querySelector('#contact-servicio'),
    proyecto: form.querySelector('#contact-proyecto'),
  };

  let isExpanded = false;

  function updateSubmitLabel() {
    if (!submitBtn) return;
    submitBtn.textContent = t(isExpanded ? 'contact.submitWhatsApp' : 'contact.continue');
  }

  function validateName() {
    const name = fields.nombre.value.trim();
    if (name.length < 2) {
      fields.nombre.setCustomValidity(t('contact.nameError'));
      fields.nombre.reportValidity();
      fields.nombre.setCustomValidity('');
      return false;
    }
    return true;
  }

  function validateRest() {
    const restFields = [fields.email, fields.telefono, fields.servicio, fields.proyecto];
    for (const field of restFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function expandForm() {
    const rest = form.querySelector('.contact-form__rest');
    isExpanded = true;
    form.classList.add('is-expanded');

    if (rest) {
      rest.style.maxHeight = 'none';
      const height = rest.scrollHeight;
      rest.style.maxHeight = '0';
      requestAnimationFrame(() => {
        rest.style.maxHeight = `${height}px`;
      });
    }

    if (submitBtn) {
      updateSubmitLabel();
      submitBtn.classList.remove('is-expanding');
      void submitBtn.offsetWidth;
      submitBtn.classList.add('is-expanding');
    }

    requestAnimationFrame(() => fields.email.focus());
  }

  function buildWhatsAppMessage() {
    return [
      t('contact.whatsappIntro'),
      '',
      `*${t('contact.whatsappName')}:* ${fields.nombre.value.trim()}`,
      `*${t('contact.whatsappEmail')}:* ${fields.email.value.trim()}`,
      `*${t('contact.whatsappPhone')}:* ${fields.telefono.value.trim()}`,
      `*${t('contact.whatsappService')}:* ${fields.servicio.value}`,
      '',
      `*${t('contact.whatsappProject')}:*`,
      fields.proyecto.value.trim(),
    ].join('\n');
  }

  function sendToWhatsApp() {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isExpanded) {
      if (!validateName()) return;
      expandForm();
      return;
    }

    if (!validateRest()) return;
    sendToWhatsApp();
  });

  window.addEventListener('rudo:langchange', updateSubmitLabel);
});
