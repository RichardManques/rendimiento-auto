import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  useTheme,
  alpha,
} from '@mui/material';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import FuelRecordTable from '../components/FuelRecordTable';

const FullHistory: React.FC = () => {
  const theme = useTheme();
  const [records, setRecords] = useState<FuelRecord[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await fuelService.getAllRecords();
      // Ordenar por fecha
      const sortedRecords = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecords(sortedRecords);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fuelService.deleteRecord(id);
      loadRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        </Box>
        <FuelRecordTable records={records} onDelete={handleDelete} />
      </Container>
    </Box>
  );
};

export default FullHistory; 