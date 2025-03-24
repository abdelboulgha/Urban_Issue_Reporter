const reclamationServiceon  = require('../services/reclamationService');

// Controller to handle creation of a reclamation
const createReclamation = async (req, res) => {
  try {
    const { titre, description, statut, localisation, nombre_de_votes } = req.body;

    // Appel du service pour créer une réclamation
    const newReclamation = await reclamationServiceon.createReclamation({
      titre,
      description,
      statut, // peut être "en_attente", "en_cours", "résolue", "rejetée"
      localisation,
      nombre_de_votes // facultatif
    });

    res.status(201).json({
      message: 'Réclamation créée avec succès',
      reclamation: newReclamation
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de la réclamation',
      error: error.message
    });
  }
};

module.exports = { createReclamation };
