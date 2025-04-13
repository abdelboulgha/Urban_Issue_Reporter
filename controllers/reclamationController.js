const reclamationService = require('../services/reclamationService'); // Ensure correct path
const { regionSchema } = require('../models/regionSchema'); // Adjust path if needed

// Controller to handle creation of a reclamation
const createReclamation = async (req, res) => {
  try {
    const { titre, description, statut, localisation, nombre_de_votes, citoyenId, categorieId,regionId } = req.body;

    // Call the service to create a reclamation
    const newReclamation = await reclamationService.createReclamation({
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes,
      citoyenId, // Optional, depending on your logic
      categorieId,
      regionId, // Optional, depending on your logic
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

// Controller to get all reclamations
const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await reclamationService.getAllReclamations();
    res.status(200).json({
      message: 'Réclamations récupérées avec succès',
      reclamations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réclamations',
      error: error.message,
    });
  }
};

// Controller to get a specific reclamation by ID
const getReclamationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reclamation = await reclamationService.getReclamationById(id);

    if (!reclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation récupérée avec succès',
      reclamation: {
        reclamation,
        categorie: reclamation.categorie ? reclamation.categorie.libelle : 'Non défini',
        region: reclamation.region ? reclamation.region.libelle : 'Non définie',
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de la réclamation',
      error: error.message,
    });
  }
};



// Controller to update a reclamation
const updateReclamation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request URL
    const { titre, description, statut, localisation, nombre_de_votes, citoyenId, categorieId,regionId } = req.body;

    // Call the service to update the reclamation
    const updatedReclamation = await reclamationService.updateReclamation(id, {
      titre,
      description,
      statut,
      localisation,
      nombre_de_votes,
      citoyenId,
      categorieId,
      regionId
    });

    if (!updatedReclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation mise à jour avec succès',
      reclamation: updatedReclamation,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de la réclamation',
      error: error.message,
    });
  }
};

// Controller to delete a reclamation
const deleteReclamation = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request URL

    const deletedReclamation = await reclamationService.deleteReclamation(id);

    if (!deletedReclamation) {
      return res.status(404).json({
        message: 'Réclamation non trouvée',
      });
    }

    res.status(200).json({
      message: 'Réclamation supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de la réclamation',
      error: error.message,
    });
  }
};

const getReclamationsByStatus = async (req, res) => {
  try {
    const adminId = req.params.adminId; // Get adminId from the URL parameter

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Fetch reclamations by status based on admin's region or all regions if superAdmin
    const statusData = await reclamationService.getReclamationsByStatus(adminId);

    res.status(200).json({ message: 'Données des réclamations par statut récupérées', data: statusData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

const getReclamationsByYear = async (req, res) => {
  const { adminId, year } = req.params; // Get adminId first, then year
  try {
    // Fetch the reclamations by month, considering the admin's region or all regions if superAdmin
    const reclamations = await reclamationService.getReclamationsByMonth(adminId, year);

    res.status(200).json({
      message: 'Réclamations par mois récupérées avec succès',
      data: reclamations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réclamations',
      error: error.message,
    });
  }
};

const getReclamationsCount = async (req, res) => {
  try {
    // Get adminId from the URL parameter
    const adminId = req.params.adminId;

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Call the service to get the reclamation count
    const countData = await reclamationService.getReclamationsCount(adminId);

    res.status(200).json({ message: 'Nombre total de réclamations récupéré', data: countData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du nombre total de réclamations', error: error.message });
  }
};

const getReclamationsOfRegion = async (req, res) => {
  try {
    const data = await reclamationService.getReclamationsOfRegion();

    // Formater les données pour l'affichage
    const formattedData = data.map(item => ({
      region: item.dataValues.region.nom, // Récupération du nom de la région
      count: item.dataValues.count
    }));

    res.status(200).json({ message: 'Réclamations par région récupérées', data: formattedData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

const getReclamationsByRegion = async (req, res) => {
  try {
    const selectedRegion = req.params.selectedRegion;
    const data = await reclamationService.getReclamationsByRegion(selectedRegion);

    // Formater les données pour l'affichage
    const formattedData = data.map(item => ({
      region: item.dataValues.region.nom, // Récupération du nom de la région
      count: item.dataValues.count
    }));

    res.status(200).json({ message: 'Réclamations par région récupérées', data: formattedData });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des données', error: error.message });
  }
};

const getReclamationByRegion = async (req, res) => {
  try {
    const { regionId } = req.params; // Get the region from the request URL
    const reclamations = await reclamationService.getReclamationByRegion(regionId);

    if (!reclamations) {
      return res.status(404).json({
        message: 'Aucune réclamation trouvée pour cette région',
      });
    }

    res.status(200).json({
      message: 'Réclamations récupérées avec succès',
      reclamations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réclamations',
      error: error.message,
    });
  }
}

const getTopThreeUrgentsReclamations = async (req, res) => {
  try {
    const adminId = req.params.adminId; // Get adminId from the URL parameter

    if (!adminId) {
      return res.status(400).json({ message: 'Admin ID is required' });
    }

    // Fetch top 3 urgent reclamations based on admin's region or all regions if superAdmin
    const topReclamations = await reclamationService.getTopThreeUrgentsReclamations(adminId);

    // Function to format the date in "jour mois année" format (in French)
    const formatDate = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('fr-FR', options);
    };

    // Formatting data to include region name properly and formatted date
    const formattedData = topReclamations.map(item => ({
      id: item.id,
      titre: item.titre,
      description: item.description,
      statut: item.statut,
      nombre_de_votes: item.nombre_de_votes,
      localisation: item.localisation,
      date_de_creation: formatDate(item.date_de_creation),
      region: item.region.nom, // Assuming region name is stored in 'nom' column
    }));

    res.status(200).json({ message: 'Top 3 reclamations fetched successfully', data: formattedData });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top 3 reclamations', error: error.message });
  }
};

const getAllReclamationsByRegion = async (req, res) => {
  const { adminId } = req.params; // Get adminId from the request URL
  try {
    const reclamations = await reclamationService.getAllReclamationsByRegion(adminId);
    res.status(200).json({
      message: 'Réclamations récupérées avec succès',
      reclamations: reclamations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des réclamations',
      error: error.message,
    });
  }
};




module.exports = {
  createReclamation,
  getAllReclamations,
  getReclamationById,
  updateReclamation,
  deleteReclamation,
  getReclamationsByStatus,
  getReclamationsByYear,
  getReclamationsCount,
  getReclamationsByRegion,
  getReclamationsOfRegion,
  getTopThreeUrgentsReclamations,
  getReclamationByRegion,
  getAllReclamationsByRegion
};
