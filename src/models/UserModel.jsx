import { Timestamp } from 'firebase/firestore';

class UserModel {
    constructor(
        birthday = Timestamp.now(),
        dni = '',
        email = '',
        name = '',
        phone = '',
        uid = '',
        until = Timestamp.now()
    ) {
        this.birthday = birthday;
        this.dni = dni;
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.rol = 1;
        this.uid = uid;
        this.until = until;
    }
}

export default UserModel;

