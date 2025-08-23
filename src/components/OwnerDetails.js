import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, Paper, Button, Chip } from "@mui/material";
import { SERVER_URL } from "../constants";

export default function OwnerDetails() {
  const { ownerId } = useParams();
  const [owner, setOwner] = useState(null);
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerDetails = () => {
      const token = sessionStorage.getItem("jwt");


      // Загружаем данные владельца
      fetch(`${SERVER_URL}api/owners/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((ownerData) => {
          setOwner(ownerData);

          // Загружаем автомобили этого владельца
          return fetch(`${SERVER_URL}api/cars?ownerId=${ownerId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        })
        .then((response) => response.json())
        .then((carsData) => {
          setCars(carsData);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    };
    fetchOwnerDetails();
  }, [ownerId]); // ← Теперь зависимостей достаточно

  if (isLoading) return <div>Loading...</div>;
  if (!owner) return <div>Owner not found</div>;

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
      <Button component={Link} to="/cars" variant="outlined" sx={{ mb: 3 }}>
        ← Back to Cars
      </Button>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {owner.firstName} {owner.lastName}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            <strong>Phone:</strong> {owner.phone || "Not specified"}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {owner.email || "Not specified"}
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {owner.address || "Not specified"}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Cars ({cars.length})
        </Typography>

        {cars.length === 0 ? (
          <Typography variant="body2">No cars found</Typography>
        ) : (
          <Box>
            {cars.map((car) => (
              <Chip
                key={car.id}
                label={`${car.brand} ${car.model} (${car.color}) (${car.price})`}
                variant="outlined"
                sx={{ m: 0.5 }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
