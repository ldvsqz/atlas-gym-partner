import React from 'react';
import Menu from '../../Components/Menu/Menu';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import Util from '../../assets/Util';

function Aboutus({ menu }) {
    const util = new Util();
    const coaches = [
        {
            id: 1,
            name: "Luis Carlos Vásquez Arce",
            phone: "85856916",
            gym: "Pulgas boxing"
        },
        {
            id: 2,
            name: "Luis Diego Vásquez Arce",
            phone: "85045886",
            gym: "Pulgas boxing"
        },
        {
            id: 3,
            name: "Luis David Vásquez Arce",
            phone: "86221624",
            gym: "Pulgas boxing"
        },
        {
            id: 4,
            name: "Pulgas boxing",
            phone: "71699673",
            gym: "Pulgas boxing"
        }
    ];


    function handleOnOpenWhatsapp(number) {
        util.openWAChat(number);
    }

    function handleOnOpenInstagram(number) {
        util.openURL(number);
    }

    return (
        <div style={{ paddingBottom: '60px' }}>
            {menu}
            <Container fixed sx={{ mt: 4 }}>
                <Grid container spacing={2} direction="row">
                    {coaches.map((c) => (
                        <Grid item xs={12} sm={6} md={4} key={c.id}>
                            <List>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar />
                                    </ListItemAvatar>
                                    <ListItemText primary={c.name} secondary={c.gym} />
                                </ListItem>
                                {
                                    c.phone &&
                                    <ListItemButton onClick={() => handleOnOpenWhatsapp(c.phone)}>
                                        <ListItemIcon>
                                            <WhatsAppIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={c.phone} />
                                    </ListItemButton>
                                }
                            </List>
                        </Grid>
                    ))}
                    <ListItemButton onClick={() => handleOnOpenInstagram("https://www.instagram.com/pulgasboxingcr/")}>
                        <ListItemIcon>
                            <InstagramIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pulgas boxing CR" />
                    </ListItemButton>
                </Grid>

            </Container>

            <Box component="footer" sx={{ background: 'gray', padding: '20px', position: 'fixed', bottom: 0, width: '100%', textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'white' }}>
                    © {new Date().getFullYear()} Atlas. Todos los derechos reservados.
                </Typography>
            </Box>
        </div>
    );
}

export default Aboutus;
