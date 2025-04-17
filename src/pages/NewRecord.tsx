import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { FuelRecord, Vehicle } from '../types';
import { fuelService } from '../services/api';
import { vehicleService } from '../services/vehicleService';
import FuelRecordForm from '../components/FuelRecordForm';

const NewRecord: React.FC = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles();
      setVehicles(response.data);
      if (response.data.length > 0) {
        // Seleccionar el primer vehículo por defecto
        setSelectedVehicleId(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  };

  const handleSubmit = async (record: Omit<FuelRecord, '_id' | 'userId'>) => {
    try {
      await fuelService.createRecord(record);
      navigate('/');
    } catch (error) {
      console.error('Error creating record:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Nuevo Registro
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Seleccionar Vehículo</InputLabel>
            <Select
              value={selectedVehicleId}
              label="Seleccionar Vehículo"
              onChange={(e) => setSelectedVehicleId(e.target.value)}
            >
              {vehicles.map((vehicle) => (
                <MenuItem key={vehicle._id} value={vehicle._id}>
                  {vehicle.brand} {vehicle.model}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedVehicleId && <FuelRecordForm onSubmit={handleSubmit} vehicleId={selectedVehicleId} />}
        </Paper>
      </Box>
    </Container>
  );
};

export default NewRecord; 