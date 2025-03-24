const { reclamationSchema } = require('../models/reclamationSchema'); // Assure-toi du bon chemin

// Service to handle creating a reclamation
const createReclamation = async ({ titre, description, statut, localisation, nombre_de_votes = 0 }) => {
  try {
    const reclamation = await reclamationSchema.create({
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes
    });

    return reclamation;
  } catch (error) {
    throw new Error('Error creating reclamation: ' + error.message);
  }
};

module.exports = { createReclamation };
