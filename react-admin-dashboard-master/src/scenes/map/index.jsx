import { Box, useTheme } from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const containerStyle = {
    width: '100%',
    height: '100%',  // Ensure it matches parent height
};

// List of locations
const locations = [
    { lat: 31.611403, lng: -8.091628, title: "Location 1" },
    { lat: 31.612403, lng: -8.092628, title: "Location 2" },
    { lat: 31.613403, lng: -8.093628, title: "Location 3" },
];

const center = {
    lat: 31.611403,
    lng: -8.091628,
};

const Map = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Header
                title="CARTE DES RÉCLAMATIONS"
                subtitle="Visualisation géographique des réclamations"
            />

            <Box
                m="40px 0 0 0"
                height="75vh" // Keep consistent with containerStyle
                sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${colors.grey[200]}`,
                }}
            >
                <LoadScript googleMapsApiKey="AIzaSyAJKMagO0Asw6OgccvD_PcdJxvOWLuE3Vc">
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={12} // Adjust zoom level
                    >
                        {locations.map((location, index) => (
                            <Marker
                                key={index}
                                position={{ lat: location.lat, lng: location.lng }}
                                title={location.title}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </Box>
        </Box>
    );
};

export default Map;
