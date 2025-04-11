import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography,
  Paper
} from '@mui/material';
import { FuelRecord } from '../types';

interface FuelRecordFormProps {
  onSubmit: (record: Omit<FuelRecord, 'id'>) => void;
}

const FuelRecordForm: React.FC<FuelRecordFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    pricePerLiter: '',
    liters: '',
    gasStation: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = Number(formData.pricePerLiter) * Number(formData.liters);
    
    const record: Omit<FuelRecord, 'id'> = {
      date: new Date(),
      liters: Number(formData.liters),
      pricePerLiter: Number(formData.pricePerLiter),
      totalCost,
      gasStation: formData.gasStation
    };

    onSubmit(record);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <TextField
        fullWidth
        label="Precio por Litro"
        name="pricePerLiter"
        type="number"
        value={formData.pricePerLiter}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Litros Cargados"
        name="liters"
        type="number"
        value={formData.liters}
        onChange={handleInputChange}
        margin="normal"
        required
      />
      
      <TextField
        fullWidth
        label="Nombre de la Estación"
        name="gasStation"
        value={formData.gasStation}
        onChange={handleInputChange}
        margin="normal"
        required
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        fullWidth
        sx={{ mt: 3 }}
      >
        Guardar Registro
      </Button>
    </Box>
  );
};

export default FuelRecordForm; 