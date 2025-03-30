import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminContacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint to fetch admin data
    axios.get('http://localhost:3000/api/admins')
      .then(response => {
        setAdmins(response.data.admins);
      })
      .catch(error => {
        console.error("Error fetching admin data:", error);
        // For development, you could use mock data here
      });
  }, []);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "nom",
      headerName: "Nom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "prenom",
      headerName: "Prénom",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "superAdmin",
      headerName: "Super Admin",
      type: "boolean",
      flex: 0.75,
      renderCell: ({ row: { superAdmin } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              superAdmin === true
                ? colors.greenAccent[600]
                : colors.redAccent[700]
            }
            borderRadius="4px"
          >
            {superAdmin ? "Oui" : "Non"}
          </Box>
        );
      },
    },
  ];

  return (
    <Box 
      sx={{
        height: "100vh", 
        overflow: "auto", 
      }}
    >
      <Box m="20px">
        <Header title="PERSONNELS" subtitle="Liste des personnels du système" />
        
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={admins}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminContacts;