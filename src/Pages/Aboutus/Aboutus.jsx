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

function Aboutus() {
    const util = new Util();
    const coaches = [
        {
            id: 1,
            name: "Alex Ruiz",
            phone: "12345678",
            gym: "Mae póngale gym center"
        },
        {
            id: 2,
            name: "Jessica Ruiz",
            phone: "12345678",
            gym: "Mae póngale gym center"
        },
        {
            id: 3,
            name: "Sandra ",
            phone: "12345678",
            gym: "Mae póngale gym center"
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
            <Menu header={"Sobre nosotros"} />
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
                    <ListItemButton onClick={() => handleOnOpenInstagram("https://www.instagram.com/maepongale/")}>
                        <ListItemIcon>
                            <InstagramIcon />
                        </ListItemIcon>
                        <ListItemText primary="Mae póngale gym center" />
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
