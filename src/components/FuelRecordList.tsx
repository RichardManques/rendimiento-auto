import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { FuelRecord } from '../types';

interface FuelRecordListProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
}

const FuelRecordList: React.FC<FuelRecordListProps> = ({ records, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(number);
  };

  if (!records || records.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" align="center" color="text.secondary">
          No hay registros disponibles
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Historial de Cargas
      </Typography>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Estación</TableCell>
              <TableCell>Precio/Litro</TableCell>
              <TableCell>Litros</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                <TableCell>{formatDate(record.date)}</TableCell>
                <TableCell>{record.gasStation}</TableCell>
                <TableCell>{formatCurrency(record.pricePerLiter)}</TableCell>
                <TableCell>{formatNumber(record.liters)}</TableCell>
                <TableCell>{formatCurrency(record.totalCost)}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => record._id && onDelete(record._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default FuelRecordList; 