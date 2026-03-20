import React from "react";
import { Container, Typography, Box, Grid, Card, CardContent } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Stack, IconButton, Tooltip } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';

export default function AboutUs({ menu }) {
    const contactData = [
        { icon: <EmailIcon />, label: 'ldvas24@gmail.com', url: 'mailto:ldvas24@gmail.com' },
        { icon: <WhatsAppIcon />, label: '+506 86221624', url: 'https://wa.me/50686221624' },
        { icon: <LinkedInIcon />, label: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/davidvas24/' },
    ];


    return (
        <div style={{ paddingBottom: '60px' }}>
            {menu}
            <Container maxWidth="lg" sx={{ py: 6 }}>
                {/* Header */}
                <Box textAlign="center" mb={6}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        Sobre Nosotros
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Atlas — La plataforma inteligente para administrar gimnasios
                    </Typography>
                </Box>

                {/* Mission Section */}
                <Grid container spacing={4} mb={6}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: "100%", p: 2 }}>
                            <CardContent>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Nuestra Misión
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    En Atlas buscamos simplificar la gestión de gimnasios mediante una
                                    plataforma moderna, intuitiva y poderosa. Ayudamos a propietarios,
                                    entrenadores y administradores a llevar un control claro de su
                                    negocio sin complicaciones.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: "100%", p: 2 }}>
                            <CardContent>
                                <Typography variant="h5" fontWeight="bold" gutterBottom>
                                    Nuestra Visión
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Convertirnos en la herramienta #1 en la industria fitness de
                                    Latinoamérica, ofreciendo soluciones digitales que optimicen el
                                    rendimiento de los gimnasios y potencien el crecimiento de sus
                                    comunidades.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Values Section */}
                <Box mb={6}>
                    <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
                        Nuestros Valores
                    </Typography>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, height: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Innovación
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Desarrollamos tecnología de vanguardia enfocada en mejorar la
                                        experiencia de gestión.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, height: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Simplicidad
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Creamos interfaces limpias, prácticas y fáciles de usar para
                                        cualquier tipo de usuario.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2, height: "100%" }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Confiabilidad
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Garantizamos estabilidad, seguridad y precisión en todas las
                                        funciones de la plataforma.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                {/* Final Message */}
                <Box textAlign="center" mt={8} mb={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        ¿Por qué Atlas?
                    </Typography>
                    <Typography variant="body1" color="text.secondary" maxWidth="600px" mx="auto">
                        Porque entendemos las necesidades reales de los gimnasios modernos. Atlas
                        nace para darte control total, mejorar la administración, impulsar la
                        retención de clientes y permitirte enfocarte en lo que realmente importa:
                        construir una comunidad fuerte.
                    </Typography>
                </Box>

                {/* Contact Section */}
                <Box textAlign="center" mt={8} mb={8}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Contáctanos
                    </Typography>
                    <Stack direction="row"
                        spacing={1}
                        justifyContent="center" // Centers the icons horizontally
                        alignItems="center"     // Centers them vertically
                        sx={{ width: '100%' }}>

                        {contactData.map((item, index) => (
                            <Tooltip key={index} title={item.label} arrow>
                                <IconButton
                                    component="a"
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                >
                                    {item.icon}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Stack>
                </Box>
            </Container>
        </div>
    );
}
