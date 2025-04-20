import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ isDashboard = false }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://urbanissuereporter-86jk0m0e.b4a.run/api/reclamations-of-region"
        );
        const data = response.data.data;

        const labels = data.map((item) => item.region);
        const counts = data.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Réclamations par région",
              data: counts,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: isDashboard ? "100%" : "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3
        style={{
          margin: isDashboard ? "0 0 10px 0" : "0 0 15px 0",
          textAlign: "center",
        }}
      >
        Répartition des Réclamations par Région
      </h3>

      <Box
        sx={{
          width: "100%",
          height: isDashboard ? "calc(100% - 40px)" : "400px",
          position: "relative",
        }}
      >
        {loading ? (
          <p>Chargement...</p>
        ) : chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                  display: !isDashboard || window.innerWidth > 600,
                  labels: {
                    boxWidth: isDashboard ? 10 : 15,
                    padding: isDashboard ? 8 : 15,
                    font: {
                      size: isDashboard ? 10 : 12,
                    },
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: isDashboard ? 9 : 11,
                    },
                  },
                  grid: {
                    display: !isDashboard,
                  },
                },
                y: {
                  beginAtZero: true,
                  grid: {
                    display: !isDashboard,
                  },
                  ticks: {
                    font: {
                      size: isDashboard ? 10 : 12,
                    },
                  },
                },
              },
            }}
          />
        ) : (
          <p>Aucune donnée disponible</p>
        )}
      </Box>
    </Box>
  );
};

export default BarChart;
