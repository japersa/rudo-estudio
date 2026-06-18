document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const WHATSAPP_NUMBER = '573053300303';
  const submitBtn = form.querySelector('.contact-form__submit');

  const fields = {
    nombre: form.querySelector('#contact-nombre'),
    email: form.querySelector('#contact-email'),
    telefono: form.querySelector('#contact-telefono'),
    servicio: form.querySelector('#contact-servicio'),
    proyecto: form.querySelector('#contact-proyecto'),
  };

  let isExpanded = false;

  function validateName() {
    const name = fields.nombre.value.trim();
    if (name.length < 2) {
      fields.nombre.setCustomValidity('Escribe al menos 2 caracteres.');
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
      submitBtn.textContent = 'Enviar por WhatsApp';
      submitBtn.classList.remove('is-expanding');
      void submitBtn.offsetWidth;
      submitBtn.classList.add('is-expanding');
    }

    requestAnimationFrame(() => fields.email.focus());
  }

  function buildWhatsAppMessage() {
    return [
      '¡Hola Rudo Estudio! Quiero conocer más sobre sus servicios.',
      '',
      `*Nombre:* ${fields.nombre.value.trim()}`,
      `*Email:* ${fields.email.value.trim()}`,
      `*Teléfono / WhatsApp:* ${fields.telefono.value.trim()}`,
      `*Servicio de interés:* ${fields.servicio.value}`,
      '',
      '*Sobre mi proyecto:*',
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
});
