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
  Typography,
  Tooltip,
  Box,
  useTheme,
  Chip,
  alpha,
  Container
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FuelRecord } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

interface FuelRecordListProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
}

const FuelRecordList: React.FC<FuelRecordListProps> = ({ records, onDelete }) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    const distanceString = formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: es 
    });
    
    const fullDate = format(new Date(date), "d 'de' MMMM 'de' yyyy, HH:mm", { 
      locale: es 
    });

    return (
      <Tooltip title={fullDate} placement="top">
        <Chip
          label={distanceString}
          size="small"
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            fontWeight: 500,
            fontSize: '0.8125rem',
            height: 24,
            borderRadius: '8px',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
            },
            transition: 'all 0.2s ease-in-out',
          }}
        />
      </Tooltip>
    );
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
      <Paper 
        elevation={0} 
        sx={{ 
          p: 8,
          mt: 6,
          textAlign: 'center',
          background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.94)})`,
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
          boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.06)}`,
        }}
      >
        <Box sx={{
          width: 80,
          height: 80,
          margin: '0 auto',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.04)})`,
        }}>
          <LocalGasStationIcon sx={{ 
            fontSize: 36,
            color: theme.palette.primary.main,
            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))'
          }} />
        </Box>
        <Typography variant="h5" sx={{ 
          mb: 1.5,
          fontWeight: 700,
          background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.7)})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.02em'
        }}>
          No hay registros disponibles
        </Typography>
        <Typography variant="body1" sx={{ 
          color: alpha(theme.palette.text.primary, 0.6),
          maxWidth: 400,
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Los registros de tus recargas de combustible aparecerán aquí una vez que comiences a agregarlos
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 4,
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.85)})`,
              boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
            }}>
              <LocalGasStationIcon sx={{ 
                color: '#fff',
                fontSize: 24,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.text.primary, 0.8)})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                  mb: 0.5
                }}
              >
                Historial de Cargas
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: alpha(theme.palette.text.primary, 0.6),
                  fontWeight: 500
                }}
              >
                Registro detallado de tus ultimas 5 recargas de combustible
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`${records.length} registros`}
            size="medium"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.9),
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              height: 32,
              px: 1.5,
              borderRadius: '10px',
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
              transition: 'all 0.2s ease-in-out',
            }}
          />
        </Box>
        
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{ 
            borderRadius: '24px',
            background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.paper, 0.94)})`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
            overflow: 'auto',
            boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.06)}`,
            maxHeight: 'calc(100vh - 200px)',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '4px',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Fecha
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Estación
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Precio/Litro
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Litros
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Total
                  </Typography>
                </TableCell>
                <TableCell sx={{ 
                  py: 3,
                  px: 3,
                  width: 100,
                  background: `linear-gradient(165deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                  backdropFilter: 'blur(20px)',
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                }}>
                  <Typography sx={{
                    fontWeight: 600,
                    color: alpha(theme.palette.text.primary, 0.9),
                    letterSpacing: '-0.01em',
                  }}>
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow 
                  key={record._id}
                  sx={{ 
                    position: 'relative',
                    backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.01),
                    '&:hover': { 
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
                        pointerEvents: 'none',
                      }
                    },
                    '&:hover .action-button': {
                      opacity: 1,
                      transform: 'translateX(0)',
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    {formatDate(record.date)}
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      minWidth: { xs: '200px', sm: '250px' }
                    }}>
                      <Box sx={{
                        width: 44,
                        height: 44,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`,
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        }
                      }}>
                        <LocalGasStationIcon 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: 24,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }} 
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body1" sx={{ 
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                          mb: 0.5,
                          letterSpacing: '-0.01em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {record.gasStation}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            color: alpha(theme.palette.text.primary, 0.6),
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 14, flexShrink: 0 }} />
                          {record.location}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <Typography variant="body1" sx={{ 
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                      letterSpacing: '-0.01em'
                    }}>
                      {formatCurrency(record.pricePerLiter)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <Chip
                      label={`${formatNumber(record.liters)}L`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.12),
                        color: theme.palette.info.main,
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        height: 28,
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.info.main, 0.16),
                          transform: 'translateY(-1px)',
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.01em'
                      }}
                    >
                      {formatCurrency(record.totalCost)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                    whiteSpace: 'nowrap',
                  }}>
                    <Tooltip title="Eliminar registro">
                      <IconButton
                        onClick={() => record._id && onDelete(record._id)}
                        className="action-button"
                        sx={{ 
                          width: 36,
                          height: 36,
                          borderRadius: '10px',
                          color: theme.palette.error.main,
                          backgroundColor: alpha(theme.palette.error.main, 0.08),
                          opacity: 0.8,
                          transform: 'translateX(10px)',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.12),
                            transform: 'translateX(0) scale(1.05)',
                          }
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default FuelRecordList; 