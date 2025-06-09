// src/pages/SignalerIncident.jsx
import React, { useState } from 'react';
import './SignalerIncident.css'; // ✅ Styles dédiés pour cette page

const SignalerIncident = () => {
  // 🔽 État local pour stocker les données saisies par l'utilisateur
  const [form, setForm] = useState({
    type: '',
    description: '',
    localisation: '',
    niveau: 'faible',
  });

  // 🔄 Mettre à jour les champs du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔁 TODO BACKEND :
    // ➤ Envoyer ces données à une API POST (ex: /api/incidents)
    // ➤ Sauvegarder les incidents dans la base de données
    // ➤ Associer l'incident à un agent STM pour traitement
    console.log('Données envoyées à l’agent STM :', form);

    alert("L'incident a été signalé avec succès !");
  };

  return (
    <div className="incident-container">
      <h2>🚨 Signaler un incident</h2>

      {/* 📝 Formulaire à remplir par l'utilisateur */}
      <form className="incident-form" onSubmit={handleSubmit}>
        {/* Type de l'incident (ex: Retard, Accident) */}
        <label>Type d’incident :</label>
        <input
          type="text"
          name="type"
          value={form.type}
          onChange={handleChange}
          placeholder="Ex : Panne, Retard, Accident"
          required
        />

        {/* Description détaillée du problème */}
        <label>Description :</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Décrivez ce qui s’est passé..."
          required
        />

        {/* Lieu ou station concernée */}
        <label>Localisation :</label>
        <input
          type="text"
          name="localisation"
          value={form.localisation}
          onChange={handleChange}
          placeholder="Station, arrêt ou ligne"
          required
        />

        {/* Gravité de l'incident (pour prioriser côté backend) */}
        <label>Niveau de gravité :</label>
        <select name="niveau" value={form.niveau} onChange={handleChange}>
          <option value="faible">Faible</option>
          <option value="moyen">Moyen</option>
          <option value="élevé">Élevé</option>
        </select>

        {/* Bouton de soumission */}
        <button type="submit">Envoyer à un agent</button>
      </form>
    </div>
  );
};

export default SignalerIncident;
