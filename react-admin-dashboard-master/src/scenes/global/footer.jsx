import { Box, Typography, useTheme, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Footer section component for reusability
  const FooterSection = ({ title, links }) => (
    <Box mb={2} mx={2}>
      <Typography
        variant="h5"
        color={colors.grey[100]}
        fontWeight="bold"
        mb={1}
      >
        {title}
      </Typography>
      {links.map((link, index) => (
        <Link to={link.to} key={index} style={{ textDecoration: "none" }}>
          <Typography
            variant="body1"
            color={colors.grey[300]}
            mb={0.5}
            sx={{
              "&:hover": {
                color: colors.blueAccent[400],
                transition: "0.2s",
              },
            }}
          >
            {link.text}
          </Typography>
        </Link>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        width: "100%",
        padding: "1.5rem",
        marginTop: "auto", // Push to bottom
      }}
    >
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        mx={-2}
      >
    </Box> {/* <FooterSection
          title="Business"
          links={[
            { to: "/employer", text: "Employer" },
            { to: "/healthplan", text: "HealthPlan" },
            { to: "/individual", text: "Individual" },
          ]}
        />

        <FooterSection
          title="Resources"
          links={[
            { to: "/resources", text: "Call Center" },
            { to: "/resources", text: "Testimonials" },
            { to: "/resources", text: "TV" },
          ]}
        />

        <FooterSection
          title="Partners"
          links={[{ to: "/employer", text: "Swing Tech" }]}
        />

        <FooterSection
          title="Company"
          links={[
            { to: "/about", text: "About" },
            { to: "/press", text: "Press" },
            { to: "/resources", text: "Career" },
            { to: "/contact", text: "Contact" },
          ]}
        />

        <Box mb={2} mx={2}>
          <Typography
            variant="h5"
            color={colors.grey[100]}
            fontWeight="bold"
            mb={1}
          >
            Follow us
          </Typography>
          <Box>
            <IconButton sx={{ color: colors.blueAccent[400] }}>
              <FacebookIcon />
            </IconButton>
            <IconButton sx={{ color: colors.blueAccent[400] }}>
              <TwitterIcon />
            </IconButton>
            <IconButton sx={{ color: colors.blueAccent[400] }}>
              <LinkedInIcon />
            </IconButton>
            <IconButton sx={{ color: colors.blueAccent[400] }}>
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Box> */}

      {/* <Box
        sx={{
          borderTop: `1px solid ${colors.grey[500]}`,
          mt: 2,
          pt: 2,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
         </Box> */}
      
      {/* Conteneur principal pour aligner les éléments en ligne avec espace entre */}
      <Box 
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap"
        }}
      >
        {/* Copyright à gauche */}
        <Typography variant="body2" color={colors.grey[300]}>
          © {new Date().getFullYear()} All rights reserved 
        </Typography>

        {/* Liens à droite */}
        <Box 
          display="flex" 
          flexWrap="wrap"
          justifyContent="flex-end"
        >
          {[
            { to: "/terms", text: "Terms & Conditions" },
            { to: "/privacy", text: "Privacy" },
            { to: "/security", text: "Security" },
            { to: "/cookie", text: "Cookie Declaration" },
          ].map((link, index) => (
            <Link
              to={link.to}
              key={index}
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                color={colors.grey[300]}
                sx={{
                  mx: 1,
                  "&:hover": {
                    color: colors.blueAccent[400],
                    transition: "0.2s",
                  },
                }}
              >
                {link.text}
              </Typography>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;