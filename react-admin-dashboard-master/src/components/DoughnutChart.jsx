import React, { useEffect, useState } from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, useTheme } from "@mui/material";
import {tokens} from "../theme";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ isDashboard = false }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/reclamations-by-status');
        const data = response.data.data;

        const labels = data.map(item => item.statut);
        const counts = data.map(item => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Réclamations par statut',
              data: counts,
              backgroundColor: [
                  colors.redAccent[700],
                  'rgba(54, 162, 235, 0.5)',
                colors.greenAccent[500],
                'rgba(255, 206, 86, 0.5)'
              ],
              borderColor: [
                  colors.redAccent[700],
                  'rgba(54, 162, 235, 0.5)',
                  colors.greenAccent[500],
                  'rgba(255, 206, 86, 0.5)'
              ],
              borderWidth: 1
            }
          ]
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
      <Box
          sx={{
            width: '100%',
            height: isDashboard ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
      >
        <h3 style={{ margin: isDashboard ? '0 0 10px 0' : '0 0 15px 0' }}>
          Répartition des Réclamations
        </h3>

        <Box
            sx={{
              width: '100%',
              height: isDashboard ? 'calc(100% - 40px)' : '300px',
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
        >
          {loading ? (
              <p>Chargement...</p>
          ) : chartData ? (
              <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '80%',
                    plugins: {
                      legend: {
                        position: isDashboard ? 'right' : 'bottom',
                        labels: {
                          boxWidth: isDashboard ? 10 : 15,
                          padding: isDashboard ? 8 : 15,
                          font: {
                            size: isDashboard ? 10 : 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || '';
                            const value = context.formattedValue;
                            const dataset = context.dataset;
                            const total = dataset.data.reduce((acc, data) => acc + data, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
              />
          ) : (
              <p>Aucune donnée disponible</p>
          )}
        </Box>
      </Box>
  );
};

export default DoughnutChart;