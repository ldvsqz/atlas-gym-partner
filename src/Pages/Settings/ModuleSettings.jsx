import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, TextField, Button, Stack, Tabs, Tab, Alert } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import moduleSettings from '../../config/moduleSettings';
import SettingsService from '../../../Firebase/settingsService';
import { useSnackbar } from '../../Components/snackbar/AtlasSnackbar';

const MODULE_LABELS = {
  cashbox: 'Arqueo de Caja',
  gymLayout: 'Layout de Gimnasio',
};

const FIELD_LABELS = {
  cashbox: {
    fixedDebtAmount: 'Monto fijo de deudas',
    partsCount: 'Número de partes',
    maintenancePercentage: 'Porcentaje de mantenimiento',
  },
  gymLayout: {
    rows: 'Filas',
    cols: 'Columnas',
  },
};

const PART_LABEL_PREFIX = 'Parte';

function getCashboxPartKeys(settings = {}) {
  const count = Number(settings.partsCount || 0);
  if (!count || count <= 0) return [];
  return Array.from({ length: count }, (_, index) => `part${index + 1}`);
}

function formatPartLabel(key) {
  const match = key.match(/^part(\d+)$/);
  return match ? `${PART_LABEL_PREFIX} ${match[1]}` : key;
}

function getDistributablePercentageTotal(settings = {}) {
  const percentages = settings.distributionPercentages || {};
  const total = Object.values(percentages).reduce((sum, value) => sum + Number(value || 0), 0);
  return Number.isFinite(total) ? total : 0;
}

function ModuleSettings() {
  const [local, setLocal] = useState({});
  const [activeTab, setActiveTab] = useState('');
  const [selectedReservedCell, setSelectedReservedCell] = useState(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    moduleSettings.restoreOverrides();
    const s = moduleSettings.getAllSettings();
    setLocal(s);
    const keys = Object.keys(s);
    if (keys.length) setActiveTab(keys[0]);

    async function loadDbSettings() {
      try {
        const savedSettings = await SettingsService.getAllModuleSettings();
        if (savedSettings && Object.keys(savedSettings).length) {
          const dbOverrides = Object.fromEntries(
            Object.entries(savedSettings).map(([moduleName, record]) => [
              moduleName,
              record?.overrides || {},
            ])
          );
          moduleSettings.loadOverrides(dbOverrides);
          moduleSettings.persistOverrides();
          const refreshed = moduleSettings.getAllSettings();
          setLocal(refreshed);
          showSnackbar('Ajustes cargados desde la base de datos', 'success');
        }
      } catch (error) {
        console.error('Error loading settings from DB:', error);
        showSnackbar('No se pudieron cargar los ajustes desde la base de datos', 'warning');
      }
    }

    loadDbSettings();
  }, []);

  useEffect(() => {
    const keys = Object.keys(local);
    if (!activeTab && keys.length) setActiveTab(keys[0]);
    if (activeTab && !keys.includes(activeTab) && keys.length) setActiveTab(keys[0]);
  }, [local, activeTab]);

  useEffect(() => {
    if (activeTab !== 'gymLayout') {
      setSelectedReservedCell(null);
    }
  }, [activeTab]);

  const handleChange = (moduleName, key, value) => {
    setLocal((prev) => ({
      ...prev,
      [moduleName]: {
        ...(prev[moduleName] || {}),
        [key]: value,
      },
    }));
  };

  const handleNestedChange = (moduleName, parentKey, childKey, value) => {
    setLocal((prev) => ({
      ...prev,
      [moduleName]: {
        ...(prev[moduleName] || {}),
        [parentKey]: {
          ...((prev[moduleName] || {})[parentKey] || {}),
          [childKey]: value,
        },
      },
    }));
  };

  const handleReservedCellMetaChange = (moduleName, x, y, field, value) => {
    setLocal((prev) => {
      const current = Array.isArray(prev[moduleName]?.reservedCells) ? prev[moduleName].reservedCells : [];
      const next = current.map((cell) => {
        const cellX = Number(cell.x || 0);
        const cellY = Number(cell.y || 0);
        if (cellX !== x || cellY !== y) return cell;

        if (field === 'label' || field === 'description' || field === 'color') {
          return { ...cell, [field]: value };
        }

        return { ...cell, [field]: Number(value) || 0 };
      });

      return {
        ...prev,
        [moduleName]: {
          ...(prev[moduleName] || {}),
          reservedCells: next,
        },
      };
    });
  };

  const handleToggleReservedCell = (moduleName, x, y) => {
    setLocal((prev) => {
      const current = Array.isArray(prev[moduleName]?.reservedCells) ? prev[moduleName].reservedCells : [];
      const normalized = current.filter((cell) => {
        const cellX = Number(cell.x || 0);
        const cellY = Number(cell.y || 0);
        return cellX >= 0 && cellY >= 0;
      });

      const key = `${x}-${y}`;
      const next = normalized.filter((cell) => `${Number(cell.x || 0)}-${Number(cell.y || 0)}` !== key);

      const isRemoving = next.length !== normalized.length;
      if (isRemoving) {
        setSelectedReservedCell((currentSelection) => (
          currentSelection && currentSelection.x === x && currentSelection.y === y ? null : currentSelection
        ));
        return {
          ...prev,
          [moduleName]: {
            ...(prev[moduleName] || {}),
            reservedCells: next,
          },
        };
      }

      const createdCell = {
        id: `__reserved_${Date.now()}__`,
        label: 'Bloqueado',
        description: 'bloqueado',
        x,
        y,
        w: 1,
        h: 1,
        color: '#64748B',
      };

      setSelectedReservedCell({ x, y });
      return {
        ...prev,
        [moduleName]: {
          ...(prev[moduleName] || {}),
          reservedCells: [...normalized, createdCell],
        },
      };
    });
  };

  const handleSaveModule = async (moduleName) => {
    const normalized = {
      ...(local[moduleName] || {}),
    };

    if (moduleName === 'gymLayout' && Array.isArray(normalized.reservedCells)) {
      normalized.reservedCells = normalized.reservedCells.map((cell) => ({
        ...cell,
        x: Number(cell.x || 0),
        y: Number(cell.y || 0),
        w: Math.max(1, Number(cell.w || 1)),
        h: Math.max(1, Number(cell.h || 1)),
      }));
    }

    const overrides = {};
    overrides[moduleName] = normalized;
    moduleSettings.loadOverrides(overrides);
    moduleSettings.persistOverrides();

    try {
      await SettingsService.saveModuleSettings(moduleName, overrides[moduleName]);
      showSnackbar('Configuración guardada localmente y en la base de datos', 'success');
    } catch (error) {
      console.error('Error saving settings to DB:', error);
      showSnackbar('Configuración guardada localmente, pero no se pudo guardar en la base de datos', 'warning');
    }

    const refreshed = moduleSettings.getAllSettings();
    setLocal(refreshed);
  };

  const handleRestore = () => {
    moduleSettings.restoreOverrides();
    const refreshed = moduleSettings.getAllSettings();
    setLocal(refreshed);
  };

  const moduleNames = Object.keys(local);
  const activeSettings = activeTab ? local[activeTab] || {} : {};
  const cashboxDistributionTotal = getDistributablePercentageTotal(activeSettings);
  const isCashboxSettingsInvalid = activeTab === 'cashbox' && cashboxDistributionTotal !== 100;

  return (
    <Container fixed>
      <Box sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <SettingsIcon sx={{ fontSize: 40 }} />
          <Typography variant="h5">Configuración de Módulos</Typography>
          <Button variant="outlined" onClick={handleRestore} sx={{ ml: 'auto' }}>Restaurar valores guardados</Button>
        </Stack>

        {moduleNames.length === 0 ? (
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">No hay módulos registrados para configuración.</Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(event, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              {moduleNames.map((moduleName) => (
                <Tab
                  key={moduleName}
                  value={moduleName}
                  label={MODULE_LABELS[moduleName] || moduleName}
                />
              ))}
            </Tabs>

            <Typography variant="h6" gutterBottom>
              {MODULE_LABELS[activeTab] || activeTab}
            </Typography>

            {activeTab === 'cashbox' && isCashboxSettingsInvalid && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                La suma de los porcentajes del monto distribuible es {cashboxDistributionTotal}%. Debe ser 100% y no incluye el fondo de mantenimiento.
              </Alert>
            )}
 
            <Grid container spacing={2}>
              {Object.entries(activeSettings).map(([key, value]) => {
                if (activeTab === 'cashbox' && key === 'distributionPercentages') {
                  const partKeys = getCashboxPartKeys(activeSettings);
                  return (
                    <React.Fragment key={key}>
                      {partKeys.map((partKey, index) => (
                        <Grid item xs={12} sm={6} md={4} key={partKey}>
                          <TextField
                            label={formatPartLabel(partKey)}
                            value={activeSettings.distributionPercentages?.[partKey] ?? ''}
                            fullWidth
                            size="small"
                            type="number"
                            onChange={(e) => handleNestedChange(activeTab, key, partKey, e.target.value)}
                            InputProps={{
                              inputProps: { min: 0, step: 1 },
                            }}
                          />
                        </Grid>
                      ))}
                    </React.Fragment>
                  );
                }
 
                if (activeTab === 'cashbox' && key === 'partsCount') {
                  return (
                    <Grid item xs={12} md={4} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }
  
                if (activeTab === 'cashbox' && key === 'maintenancePercentage') {
                  return (
                    <Grid item xs={12} md={4} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        size="small"
                        type="number"
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }
  
                if (activeTab === 'cashbox' && key === 'fixedDebtAmount') {
                  return (
                    <Grid item xs={12} md={4} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        size="small"
                        type="number"
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'gymLayout' && key === 'rows') {
                  return (
                    <Grid item xs={12} md={4} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'gymLayout' && key === 'cols') {
                  return (
                    <Grid item xs={12} md={4} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        size="small"
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'gymLayout' && key === 'reservedCells') {
                  const rows = Math.max(1, Number(activeSettings.rows || 1));
                  const cols = Math.max(1, Number(activeSettings.cols || 1));
                  const reservedCells = Array.isArray(value) ? value : [];
                  const reservedSet = new Set(
                    reservedCells
                      .filter((cell) => Number(cell.x || 0) >= 0 && Number(cell.y || 0) >= 0)
                      .map((cell) => `${Number(cell.x || 0)}-${Number(cell.y || 0)}`)
                  );
                  const selectedReservedDefinition = selectedReservedCell
                    ? reservedCells.find((cell) => Number(cell.x || 0) === selectedReservedCell.x && Number(cell.y || 0) === selectedReservedCell.y)
                    : null;

                  return (
                    <Grid item xs={12} key={key}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>Celdas reservadas</Typography>
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${Math.min(cols, 12)}, minmax(16px, 1fr))`,
                            gap: 0.5,
                            maxWidth: Math.min(290, cols * 24 + (cols - 1) * 4),
                            width: '100%',
                            overflowX: 'auto',
                          }}
                        >
                          {Array.from({ length: rows * cols }, (_, index) => {
                            const x = index % cols;
                            const y = Math.floor(index / cols);
                            const isReserved = reservedSet.has(`${x}-${y}`);
                            const isSelected = Boolean(
                              selectedReservedCell && selectedReservedCell.x === x && selectedReservedCell.y === y
                            );

                            return (
                              <Button
                                key={`${x}-${y}`}
                                variant={isReserved ? 'contained' : 'outlined'}
                                color={isReserved ? (isSelected ? 'secondary' : 'warning') : 'primary'}
                                onClick={() => {
                                  if (isReserved) {
                                    setSelectedReservedCell({ x, y });
                                    return;
                                  }
                                  handleToggleReservedCell(activeTab, x, y);
                                }}
                                sx={{
                                  minWidth: 0,
                                  width: '100%',
                                  aspectRatio: '1 / 1',
                                  p: 0,
                                  fontSize: '0.55rem',
                                  borderRadius: 1,
                                  borderWidth: isSelected ? 2 : 1,
                                  lineHeight: 1,
                                  minHeight: 18,
                                }}
                              >
                                {isReserved ? 'X' : ''}
                              </Button>
                            );
                          })}
                        </Box>

                        {selectedReservedDefinition && (
                          <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1 }}>
                              <TextField
                                label="Etiqueta"
                                size="small"
                                value={selectedReservedDefinition.label || ''}
                                onChange={(e) => handleReservedCellMetaChange(activeTab, Number(selectedReservedDefinition.x || 0), Number(selectedReservedDefinition.y || 0), 'label', e.target.value)}
                                fullWidth
                              />
                              <TextField
                                label="Descripción"
                                size="small"
                                value={selectedReservedDefinition.description || ''}
                                onChange={(e) => handleReservedCellMetaChange(activeTab, Number(selectedReservedDefinition.x || 0), Number(selectedReservedDefinition.y || 0), 'description', e.target.value)}
                                fullWidth
                              />
                              <TextField
                                label="Color"
                                size="small"
                                type="color"
                                value={selectedReservedDefinition.color || '#64748B'}
                                onChange={(e) => handleReservedCellMetaChange(activeTab, Number(selectedReservedDefinition.x || 0), Number(selectedReservedDefinition.y || 0), 'color', e.target.value)}
                                sx={{ minWidth: 100 }}
                              />
                            </Stack>

                            <Button
                              size="small"
                              color="warning"
                              variant="outlined"
                              onClick={() => handleToggleReservedCell(activeTab, Number(selectedReservedDefinition.x || 0), Number(selectedReservedDefinition.y || 0))}
                            >
                              Quitar reserva
                            </Button>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  );
                }
  
                if (activeTab === 'cashbox' || activeTab === 'gymLayout') {
                  return null;
                }
 
                return (
                  <Grid item xs={12} md={6} key={key}>
                    <TextField
                      label={FIELD_LABELS[activeTab]?.[key] || key}
                      value={value ?? ''}
                      fullWidth
                      type={typeof value === 'number' ? 'number' : 'text'}
                      onChange={(e) => handleChange(activeTab, key, e.target.value)}
                    />
                  </Grid>
                );
              })}
            </Grid>
 
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                onClick={() => handleSaveModule(activeTab)}
                disabled={isCashboxSettingsInvalid}
              >
                Guardar configuración
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default ModuleSettings;
