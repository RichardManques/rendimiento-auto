import React, { useState } from 'react';
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
  Container,
  InputAdornment,
  TextField,
  TableSortLabel,
  Stack,
  Button,
  Menu,
  MenuItem,
  Divider,
  Pagination
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import { FuelRecord } from '../types';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatCurrency, formatNumber } from '../utils/formatters';

interface FuelRecordTableProps {
  records: FuelRecord[];
  onDelete: (id: string) => void;
}

const FuelRecordTable: React.FC<FuelRecordTableProps> = ({ records, onDelete }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBy, setOrderBy] = useState<keyof FuelRecord>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [page, setPage] = useState(1);
  const recordsPerPage = 10;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSort = (property: keyof FuelRecord) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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

  const filteredRecords = records.filter(record =>
    record.gasStation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (orderBy === 'date') {
      return order === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedRecords.length / recordsPerPage);
  const paginatedRecords = sortedRecords.slice(
    (page - 1) * recordsPerPage,
    page * recordsPerPage
  );

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

  const TableHeader = ({ label, property }: { label: string; property: keyof FuelRecord }) => (
    <TableCell 
      sx={{ 
        py: 2.5,
        px: 3,
        background: alpha(theme.palette.background.paper, 0.98),
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        position: 'sticky',
        top: 0,
        zIndex: 1,
        '&:first-of-type': {
          borderTopLeftRadius: 16,
        },
        '&:last-of-type': {
          borderTopRightRadius: 16,
        },
      }}
    >
      <TableSortLabel
        active={orderBy === property}
        direction={orderBy === property ? order : 'asc'}
        onClick={() => handleSort(property)}
        IconComponent={SortIcon}
        sx={{
          '& .MuiTableSortLabel-icon': {
            opacity: 0.5,
            transition: 'all 0.2s',
            fontSize: '1.1rem',
          },
          '&.Mui-active': {
            color: theme.palette.primary.main,
            '& .MuiTableSortLabel-icon': {
              opacity: 1,
              color: theme.palette.primary.main,
            },
          },
        }}
      >
        <Typography sx={{
          fontWeight: 600,
          color: orderBy === property ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.9),
          letterSpacing: '-0.01em',
          transition: 'color 0.2s',
          fontSize: '0.875rem',
        }}>
          {label}
        </Typography>
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Box sx={{ mt: 6, mb: 6 }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' }, 
          justifyContent: 'space-between',
          gap: 3,
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
                {sortedRecords.length} registros encontrados
              </Typography>
            </Box>
          </Box>

          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            sx={{ 
              width: { xs: '100%', md: 'auto' },
              alignItems: 'center'
            }}
          >
            <TextField
              placeholder="Buscar por estación o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                minWidth: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  },
                  '&.Mui-focused': {
                    backgroundColor: theme.palette.background.paper,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: alpha(theme.palette.text.primary, 0.5) }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              startIcon={<TuneIcon />}
              onClick={handleMenuOpen}
              sx={{
                height: 40,
                px: 2,
                borderRadius: '12px',
                backgroundColor: alpha(theme.palette.primary.main, 0.9),
                '&:hover': {
                  backgroundColor: theme.palette.primary.main,
                },
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Filtros
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '16px',
                  minWidth: 180,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
                  background: alpha(theme.palette.background.paper, 0.9),
                  backdropFilter: 'blur(10px)',
                }
              }}
            >
              <MenuItem onClick={handleMenuClose}>
                <DownloadIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Exportar datos
              </MenuItem>
              <Divider sx={{ my: 1, opacity: 0.1 }} />
              <MenuItem onClick={handleMenuClose}>
                <FilterListIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Últimos 30 días
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <FilterListIcon sx={{ mr: 1.5, fontSize: 20 }} />
                Este mes
              </MenuItem>
            </Menu>
          </Stack>
        </Box>
        
        {/* Table Container */}
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
            maxHeight: 'calc(100vh - 340px)',
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
                <TableHeader label="Fecha" property="date" />
                <TableHeader label="Estación" property="gasStation" />
                <TableHeader label="Precio/L" property="pricePerLiter" />
                <TableHeader label="Litros" property="liters" />
                <TableHeader label="Total" property="totalCost" />
                <TableCell sx={{ 
                  py: 2.5,
                  px: 3,
                  width: 100,
                  background: alpha(theme.palette.background.paper, 0.98),
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
                    fontSize: '0.875rem',
                  }}>
                    Acciones
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.map((record, index) => (
                <TableRow 
                  key={record._id}
                  sx={{ 
                    position: 'relative',
                    backgroundColor: index % 2 === 0 ? 'transparent' : alpha(theme.palette.primary.main, 0.02),
                    '&:hover': { 
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      '& .action-button': {
                        opacity: 1,
                        transform: 'translateX(0)',
                      }
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
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
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.primary.main, 0.06)})`,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)}, ${alpha(theme.palette.primary.main, 0.08)})`,
                        }
                      }}>
                        <LocalGasStationIcon 
                          sx={{ 
                            color: theme.palette.primary.main,
                            fontSize: 22,
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                          }} 
                        />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" sx={{ 
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
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600,
                      color: theme.palette.warning.main,
                      letterSpacing: '-0.01em'
                    }}>
                      {formatCurrency(record.pricePerLiter)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ 
                    py: 2.5,
                    px: 3,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                  }}>
                    <Chip
                      label={`${formatNumber(record.liters)}L`}
                      size="small"
                      sx={{
                        backgroundColor: alpha(theme.palette.info.main, 0.12),
                        color: theme.palette.info.main,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 24,
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
                  }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.success.main,
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
                  }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Eliminar registro">
                        <IconButton
                          onClick={() => record._id && onDelete(record._id)}
                          className="action-button"
                          size="small"
                          sx={{ 
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            color: theme.palette.error.main,
                            backgroundColor: alpha(theme.palette.error.main, 0.08),
                            opacity: { xs: 1, md: 0.8 },
                            transform: { xs: 'none', md: 'translateX(10px)' },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.12),
                              transform: 'translateX(0) scale(1.05)',
                            }
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Más opciones">
                        <IconButton
                          size="small"
                          className="action-button"
                          sx={{ 
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            color: alpha(theme.palette.text.primary, 0.7),
                            backgroundColor: alpha(theme.palette.text.primary, 0.04),
                            opacity: { xs: 1, md: 0.8 },
                            transform: { xs: 'none', md: 'translateX(10px)' },
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.text.primary, 0.08),
                              transform: 'translateX(0) scale(1.05)',
                            }
                          }}
                        >
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mt: 4,
            pb: 2
          }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '12px',
                  margin: '0 4px',
                  minWidth: 40,
                  height: 40,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  },
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.9),
                    color: '#fff',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                },
                '& .MuiPaginationItem-ellipsis': {
                  borderRadius: '12px',
                  height: 40,
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FuelRecordTable;