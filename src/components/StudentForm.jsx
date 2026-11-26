import { useState } from 'react'
import { FILIERES, NIVEAUX, STATUTS, VILLES } from '../data/options.js'

function today() {
  return new Date().toISOString().slice(0, 10)
}

const EMPTY = {
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  dateNaissance: '',
  filiere: FILIERES[0],
  niveau: NIVEAUX[0],
  ville: VILLES[0],
  statut: STATUTS[0],
  dateInscription: today(),
}

function validate(values) {
  const errors = {}

  if (!values.nom.trim()) errors.nom = 'Le nom est obligatoire.'
  if (!values.prenom.trim()) errors.prenom = 'Le prénom est obligatoire.'

  if (!values.email.trim()) {
    errors.email = "L'email est obligatoire."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Le format de l'email est invalide."
  }

  if (values.telephone.trim() && !/^[0-9+\s]{8,15}$/.test(values.telephone.trim())) {
    errors.telephone = 'Le téléphone doit contenir entre 8 et 15 chiffres.'
  }

  if (!values.dateNaissance) {
    errors.dateNaissance = 'La date de naissance est obligatoire.'
  } else if (values.dateNaissance >= today()) {
    errors.dateNaissance = 'La date de naissance doit être dans le passé.'
  }

  if (!values.filiere) errors.filiere = 'La filière est obligatoire.'
  if (!values.niveau) errors.niveau = 'Le niveau est obligatoire.'
  if (!values.dateInscription) errors.dateInscription = "La date d'inscription est obligatoire."

  return errors
}

export default function StudentForm({ initialValues, submitLabel, onSubmit, onCancel, submitting = false, error = '' }) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues })
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit({
      ...values,
      nom: values.nom.trim(),
      prenom: values.prenom.trim(),
      email: values.email.trim().toLowerCase(),
      telephone: values.telephone.trim(),
    })
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {error && <p className="alert alert-error">{error}</p>}
      <div className="form-grid">
        <div className="field">
          <label htmlFor="prenom">Prénom *</label>
          <input id="prenom" name="prenom" value={values.prenom} onChange={handleChange} placeholder="Yasmine" />
          {errors.prenom && <small className="field-error">{errors.prenom}</small>}
        </div>

        <div className="field">
          <label htmlFor="nom">Nom *</label>
          <input id="nom" name="nom" value={values.nom} onChange={handleChange} placeholder="El Amrani" />
          {errors.nom && <small className="field-error">{errors.nom}</small>}
        </div>

        <div className="field">
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={values.email} onChange={handleChange} placeholder="nom@ecole.ma" />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <div className="field">
          <label htmlFor="telephone">Téléphone</label>
          <input id="telephone" name="telephone" value={values.telephone} onChange={handleChange} placeholder="0612345678" />
          {errors.telephone && <small className="field-error">{errors.telephone}</small>}
        </div>

        <div className="field">
          <label htmlFor="dateNaissance">Date de naissance *</label>
          <input id="dateNaissance" name="dateNaissance" type="date" value={values.dateNaissance} onChange={handleChange} />
          {errors.dateNaissance && <small className="field-error">{errors.dateNaissance}</small>}
        </div>

        <div className="field">
          <label htmlFor="ville">Ville</label>
          <select id="ville" name="ville" value={values.ville} onChange={handleChange}>
            {VILLES.map((ville) => <option key={ville} value={ville}>{ville}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="filiere">Filière *</label>
          <select id="filiere" name="filiere" value={values.filiere} onChange={handleChange}>
            {FILIERES.map((filiere) => <option key={filiere} value={filiere}>{filiere}</option>)}
          </select>
          {errors.filiere && <small className="field-error">{errors.filiere}</small>}
        </div>

        <div className="field">
          <label htmlFor="niveau">Niveau *</label>
          <select id="niveau" name="niveau" value={values.niveau} onChange={handleChange}>
            {NIVEAUX.map((niveau) => <option key={niveau} value={niveau}>{niveau}</option>)}
          </select>
          {errors.niveau && <small className="field-error">{errors.niveau}</small>}
        </div>

        <div className="field">
          <label htmlFor="statut">Statut</label>
          <select id="statut" name="statut" value={values.statut} onChange={handleChange}>
            {STATUTS.map((statut) => <option key={statut} value={statut}>{statut}</option>)}
          </select>
        </div>

        <div className="field">
          <label htmlFor="dateInscription">Date d'inscription *</label>
          <input id="dateInscription" name="dateInscription" type="date" value={values.dateInscription} onChange={handleChange} />
          {errors.dateInscription && <small className="field-error">{errors.dateInscription}</small>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>Annuler</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Enregistrement…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
