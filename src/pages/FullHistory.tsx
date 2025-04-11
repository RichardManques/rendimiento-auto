import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  TablePagination,
  Paper
} from '@mui/material';
import { FuelRecord } from '../types';
import { fuelService } from '../services/api';
import FuelRecordList from '../components/FuelRecordList';

const FullHistory: React.FC = () => {
  const [records, setRecords] = useState<FuelRecord[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRecords = records.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Historial Completo
        </Typography>
        <Paper elevation={3}>
          <FuelRecordList records={paginatedRecords} onDelete={handleDelete} />
          <TablePagination
            component="div"
            count={records.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Registros por página"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} de ${count}`
            }
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default FullHistory; 