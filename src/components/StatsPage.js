import React from "react";
import { 
  Box, 
  Typography,
  Paper
} from "@mui/material";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Янв', cars: 4, owners: 2 },
  { name: 'Фев', cars: 6, owners: 3 },
  { name: 'Маp', cars: 8, owners: 4 },
];

const StatsPage = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Статистика
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Новые добавления
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cars" fill="#8884d8" />
            <Bar dataKey="owners" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default StatsPage;