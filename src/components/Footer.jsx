// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#002a5c',
      color: 'white',
      padding: '20px',
      textAlign: 'center',
      fontSize: '0.9rem',
      marginTop: '40px'
    }}>
      <p><strong>Projet étudiant STM</strong> – Collège Teccart, Montréal</p>
      <p>Réalisé par JYsk</p>
      <p>© {new Date().getFullYear()} AlloTransport</p>
    </footer>
  );
};

export default Footer;
