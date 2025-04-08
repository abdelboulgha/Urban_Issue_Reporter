import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Box, TextField } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChar = ({ isDashboard = false }) => {
    const [chartData, setChartData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [totalReclamations, setTotalReclamations] = useState(0);
    const userData = JSON.parse(localStorage.getItem("userData"));// Add state for total reclamations

    // French month names
    const frenchMonths = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Fetch data when the selected year changes
    const fetchData = async (year) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/reclamations-by-year/${userData.id}/${year}`);
            const data = response.data.data;

            // Calculate total reclamations
            const total = data.reduce((acc, item) => acc + parseInt(item.count, 10), 0); // Convert count to number
            setTotalReclamations(total); // Update total reclamations state

            // Format data for the chart
            const months = Array.from({ length: 12 }, (_, i) => i + 1);
            const counts = months.map(month => {
                const monthData = data.find(item => parseInt(item.month, 10) === month); // Convert month to number
                return monthData ? parseInt(monthData.count, 10) : 0; // Convert count to number
            });

            setChartData({
                labels: months.map(month => frenchMonths[month - 1]),
                datasets: [
                    {
                        label: `Réclamations pour l'année ${year}`,
                        data: counts,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.1
                    }
                ]
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(selectedYear);
    }, [selectedYear]);

    return (
        <Box sx={{
            width: '100%',
            height: isDashboard ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    width: '100%',
                    mb: 1
                }}
            >
                <h3 style={{ margin: isDashboard ? '0 0 8px 0' : '0' }}>
                    Réclamations pour {selectedYear}
                </h3>

                {/* Total Reclamations Subtitle */}
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    Total réclamations: {totalReclamations}
                </p>

                <TextField
                    label="Année"
                    type="number"
                    value={selectedYear}
                    id="standard-basic"
                    onChange={(e) => setSelectedYear(e.target.value)}
                    size="small"
                    sx={{
                        width: isDashboard ? '100px' : '150px',
                        '& .MuiInputBase-input': {
                            padding: isDashboard ? '8px 10px' : '10px 14px',
                        }
                    }}
                />
            </Box>

            {/* Loading Indicator */}
            {loading ? <p>Chargement...</p> : null}

            {/* Line Chart Container */}
            <Box sx={{
                width: '100%',
                height: isDashboard ? 'calc(100% - 40px)' : '300px', // Adjust for header height
                flex: '1',
                position: 'relative'
            }}>
                {chartData && !loading ? (
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: !isDashboard || window.innerWidth > 600,
                                    position: 'bottom',
                                    labels: {
                                        boxWidth: 10,
                                        padding: 10,
                                        font: {
                                            size: isDashboard ? 10 : 12
                                        }
                                    }
                                },
                                title: {
                                    display: false
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        maxRotation: 45,
                                        minRotation: 45,
                                        font: {
                                            size: isDashboard ? 9 : 11
                                        }
                                    },
                                    grid: {
                                        display: !isDashboard
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    grid: {
                                        display: !isDashboard
                                    },
                                    ticks: {
                                        font: {
                                            size: isDashboard ? 10 : 12
                                        }
                                    }
                                }
                            }
                        }}
                    />
                ) : null}
            </Box>
        </Box>
    );
};

export default LineChar;
