
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignalerIncident.css';



const SignalerIncident = () => {
  const [form, setForm] = useState({
    type: '',
    ligne: '',
    station: '',
    description: '',
    gravite: '',
    contact: 'non',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Données soumises :", form);
    alert("Incident signalé avec succès !");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="text-center mb-4 text-primary"> Signaler un incident</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Type d'incident</label>
                  <select className="form-select" name="type" onChange={handleChange} required>
                    <option value="">Sélectionnez le type</option>
                    <option value="retard">Retard</option>
                    <option value="panne">Panne</option>
                    <option value="securite">Problème de sécurité</option>
                    <option value="accessibilite">Accessibilité</option>
                    <option value="proprete">Propreté</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Ligne concernée</label>
                  <select className="form-select" name="ligne" onChange={handleChange} required>
                    <option value="">Sélectionnez la ligne</option>
                    <option value="orange">Orange</option>
                    <option value="verte">Verte</option>
                    <option value="bleue">Bleue</option>
                    <option value="jaune">Jaune</option>
                    <option value="bus">Bus</option>
                    <option value="train">Train de banlieue</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Station ou arrêt / Bus</label>
                  <input
                    type="text"
                    className="form-control"
                    name="station"
                    placeholder="Ex: Berri-UQAM, Bus 80"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    placeholder="Décrivez les circonstances, heure, etc."
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Niveau de gravité</label>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="gravite" value="faible" onChange={handleChange} required />
                    <label className="form-check-label">Faible - Inconvénient mineur</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="gravite" value="modere" onChange={handleChange} />
                    <label className="form-check-label">Modéré - Impact significatif</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="gravite" value="eleve" onChange={handleChange} />
                    <label className="form-check-label">Élevé - Situation urgente</label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Souhaitez-vous un suivi ?</label>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="contact" value="oui" onChange={handleChange} />
                    <label className="form-check-label">Oui, je souhaite être contacté</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="contact" value="non" onChange={handleChange} defaultChecked />
                    <label className="form-check-label">Non, rapport anonyme</label>
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Soumettre le rapport d'incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalerIncident;
