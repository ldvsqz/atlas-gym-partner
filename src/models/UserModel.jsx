import { Timestamp } from 'firebase/firestore';
import { DEFAULT_GYM_ID } from '../../Firebase/tenant';

class UserModel {
    constructor(
        birthday = Timestamp.now(),
        dni = '',
        email = '',
        name = '',
        phone = '',
        uid = '',
        until = Timestamp.now(),
        gymId = null
    ) {
        this.birthday = birthday;
        this.dni = dni;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.rol = 1;
        this.uid = uid;
        this.until = until;
        this.gymId = gymId;
    }
}

export default UserModel;
