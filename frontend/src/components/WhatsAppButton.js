// frontend/src/components/WhatsAppButton.js
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppButton.css';

const WhatsAppButton = ({ phoneNumber, message }) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      className="whatsapp-button-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enviar comentario por WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" /> {/* El icono siempre estará aquí */}
      <span className="whatsapp-text">FeedBack</span> {/* El texto aparecerá en hover */}
    </a>
  );
};

export default WhatsAppButton;