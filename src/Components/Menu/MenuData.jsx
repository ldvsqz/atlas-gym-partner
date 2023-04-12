import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
export const MenuData = [
    {
        title: 'Inicio',
        path: '/',
        icon: <HomeIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Usuarios',
        path: '/users',
        icon: <GroupIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Eventos',
        path: '/events',
        icon: <EmojiEventsIcon/>,
        cName: 'nav-text'
    },
    {
        title: 'Mi perfil',
        path: '/user/:uid',
        icon: <AccountBoxIcon/>,
        cName: 'nav-text'
    }
]