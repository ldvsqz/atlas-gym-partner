import * as  FaIcons from "react-icons/fa"
import * as  AiIcons from "react-icons/ai"
import * as  IoIcons from "react-icons/io"

//https://react-icons.github.io/react-icons/icons?name=fa

export const MenuData = [
    {
        title: 'Inicio',
        path: '/',
        icon: <AiIcons.AiFillHome/>,
        cName: 'nav-text'
    },
    {
        title: 'Clientes',
        path: '/clients',
        icon: <IoIcons.IoIosPaper/>,
        cName: 'nav-text'
    },
    {
        title: 'Eventos',
        path: '/events',
        icon: <FaIcons.FaCartPlus/>,
        cName: 'nav-text'
    },
    {
        title: 'Mi perfil',
        path: '/perfil:id',
        icon: <FaIcons.FaCartPlus/>,
        cName: 'nav-text'
    }
]