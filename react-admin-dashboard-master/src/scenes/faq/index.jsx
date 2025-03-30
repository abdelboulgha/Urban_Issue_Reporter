import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const faqItems = [
    {
      question: "Comment créer une nouvelle réclamation ?",
      answer: "Pour créer une réclamation, rendez-vous dans l'onglet 'Nouvelle réclamation' du menu principal. Remplissez le formulaire avec les détails du problème et soumettez-le. Vous recevrez un numéro de suivi."
    },
    {
      question: "Comment suivre l'état de ma réclamation ?",
      answer: "Toutes vos réclamations apparaissent dans votre tableau de bord. Le statut est mis à jour en temps réel (En attente, En cours, Résolu, Rejeté). Vous pouvez aussi filtrer par statut."
    },
    {
      question: "Combien de temps prend le traitement d'une réclamation ?",
      answer: "Le délai varie selon la complexité du problème. Les réclamations urgentes sont traitées sous 48h. Vous recevrez des notifications à chaque étape du processus."
    },
    {
      question: "Puis-je modifier une réclamation après l'avoir soumise ?",
      answer: "Oui, tant que la réclamation est en statut 'En attente'. Utilisez le bouton 'Modifier' dans votre liste de réclamations. Une fois en cours de traitement, contactez le support."
    },
    {
      question: "Comment fonctionne le système de votes ?",
      answer: "Les citoyens peuvent voter pour les réclamations qui les concernent. Plus une réclamation reçoit de votes, plus elle est priorisée dans notre système de traitement."
    },
    {
      question: "Que faire si ma réclamation est rejetée ?",
      answer: "Consultez les motifs de rejet dans les détails de la réclamation. Si vous n'êtes pas d'accord, vous pouvez faire appel en cliquant sur 'Contester' et fournir des informations supplémentaires."
    }
  ];

  return (
    <Box m="20px">
      <Header 
        title="FOIRE AUX QUESTIONS" 
        subtitle="Trouvez des réponses à vos questions sur la gestion des réclamations"
        icon={<HelpOutlineOutlinedIcon sx={{ fontSize: "26px", mr: 1 }} />}
      />

      {faqItems.map((item, index) => (
        <Accordion 
          key={index} 
          defaultExpanded={index === 0}
          sx={{ 
            backgroundColor: colors.primary[400],
            mb: "10px",
            "&:before": {
              backgroundColor: "transparent !important"
            }
          }}
        >
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon sx={{ color: colors.greenAccent[500] }} />}
            sx={{
              "& .MuiAccordionSummary-content": {
                alignItems: "center"
              }
            }}
          >
            <Typography 
              color={colors.greenAccent[500]} 
              variant="h5"
              sx={{ fontWeight: 600 }}
            >
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}

      <Box mt={4} textAlign="center">
        <Typography variant="h6" color={colors.grey[300]}>
          Vous ne trouvez pas réponse à votre question ?
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Contactez notre support technique à <span style={{ color: colors.greenAccent[400] }}>support@reclamations.gov</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default FAQ;