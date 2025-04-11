import React, { useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import FuelRecordForm from '../components/FuelRecordForm';

const NewRecord: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (record: Omit<FuelRecord, 'id'>) => {
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
        <Paper elevation={3}>
          <FuelRecordForm onSubmit={handleSubmit} />
        </Paper>
      </Box>
    </Container>
  );
};

export default NewRecord; 