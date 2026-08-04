import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled application error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', gap: 2 }}>
            <Typography variant="h5" component="h1">
              Algo salió mal
            </Typography>
            <Typography color="text.secondary">
              Ocurrió un error inesperado. Intenta recargar la página.
            </Typography>
            <Button variant="contained" onClick={this.handleReload}>
              Recargar
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
