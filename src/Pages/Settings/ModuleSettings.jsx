import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, TextField, Button, Stack, Tabs, Tab } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import moduleSettings from '../../config/moduleSettings';
import SettingsService from '../../../Firebase/settingsService';
import { useSnackbar } from '../../Components/snackbar/AtlasSnackbar';

const MODULE_LABELS = {
  cashbox: 'Arqueo de Caja',
};

const FIELD_LABELS = {
  cashbox: {
    fixedDebtAmount: 'Monto fijo de deudas',
    partsCount: 'Número de partes',
    maintenancePercentage: 'Porcentaje de mantenimiento',
  },
};

const PART_LABEL_PREFIX = 'Porcentaje parte';

function getCashboxPartKeys(settings = {}) {
  const count = Number(settings.partsCount || 0);
  if (!count || count <= 0) return [];
  return Array.from({ length: count }, (_, index) => `part${index + 1}`);
}

function formatPartLabel(key) {
  const match = key.match(/^part(\d+)$/);
  return match ? `${PART_LABEL_PREFIX} ${match[1]}` : key;
}

function ModuleSettings() {
  const [local, setLocal] = useState({});
  const [activeTab, setActiveTab] = useState('');

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

  const handleSaveModule = async (moduleName) => {
    const overrides = {};
    overrides[moduleName] = local[moduleName] || {};
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

            <Grid container spacing={2}>
              {Object.entries(activeSettings).map(([key, value]) => {
                if (activeTab === 'cashbox' && key === 'distributionPercentages') {
                  const partKeys = getCashboxPartKeys(activeSettings);
                  return (
                    <React.Fragment key={key}>
                      {partKeys.map((partKey) => (
                        <Grid item xs={12} md={6} key={partKey}>
                          <TextField
                            label={formatPartLabel(partKey)}
                            value={activeSettings.distributionPercentages?.[partKey] ?? ''}
                            fullWidth
                            type="number"
                            onChange={(e) => handleNestedChange(activeTab, key, partKey, e.target.value)}
                          />
                        </Grid>
                      ))}
                    </React.Fragment>
                  );
                }

                if (activeTab === 'cashbox' && key === 'partsCount') {
                  return (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        type="number"
                        inputProps={{ min: 1 }}
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'cashbox' && key === 'maintenancePercentage') {
                  return (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        type="number"
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'cashbox' && key === 'fixedDebtAmount') {
                  return (
                    <Grid item xs={12} md={6} key={key}>
                      <TextField
                        label={FIELD_LABELS[activeTab]?.[key] || key}
                        value={value ?? ''}
                        fullWidth
                        type="number"
                        onChange={(e) => handleChange(activeTab, key, Number(e.target.value))}
                      />
                    </Grid>
                  );
                }

                if (activeTab === 'cashbox') {
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
              <Button variant="contained" onClick={() => handleSaveModule(activeTab)}>
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
