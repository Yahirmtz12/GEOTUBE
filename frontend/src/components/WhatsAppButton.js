// frontend/src/components/WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa'; // Necesitarás instalar react-icons si no lo tienes
import '../styles/WhatsAppButton.css'; // Para los estilos CSS

const WhatsAppButton = ({ phoneNumber, message }) => {
  // Codifica el mensaje para que sea válido en la URL
  const encodedMessage = encodeURIComponent(message);
  // Construye la URL de WhatsApp
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-button-float"
      target="_blank" // Abre en una nueva pestaña
      rel="noopener noreferrer" // Mejora la seguridad
      aria-label="Enviar comentario por WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
      <span className="whatsapp-text">Comentar</span>
    </a>
  );
};

export default WhatsAppButton;