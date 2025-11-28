import ReportIcon from '@mui/icons-material/Report';
import DangerousIcon from '@mui/icons-material/Dangerous';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


class Util {
    formatDate(_date) {
        const date = new Date(_date);
        const formattedDate = date.toLocaleString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate;
    };

    formatDateShort(_date) {
        const date = new Date(_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    };

    getDateFromFirebase(_date) {
        const milliseconds = _date.seconds * 1000 + Math.floor(_date.nanoseconds / 1e6);
        return new Date(milliseconds);
    };

    getAge(_date) {
        if (!isNaN(_date)) {
            const birthday = new Date(_date);
            const ageDiffMs = Date.now() - birthday.getTime();
            const ageDate = new Date(ageDiffMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            return age
        }
    };

    dateExpireColor(_date) {
        const daysLeft = new Date(_date) - new Date();
        if (daysLeft <= 0){
            return `red`;
        }else if (daysLeft <= 7) {
            return `orange`
        } else {
            return `green`
        } 
    };

    removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    calculateProximityColor(current, goal) {
        const diferencia = Math.abs(current - goal);
        const proximidad = diferencia === 0 ? 0 : (diferencia / 10);
        const verde = Math.round(255 * (1 - proximidad));
        const rojo = Math.round(255 * proximidad);
        const azul = 0;
        return proximidad === 0 ? `rgb(255, 0, 0)` : `rgb(${rojo}, ${verde}, ${azul})`;
    };

    calculateIMC(weight_kg, Height_cm) {
        const HeightMeters = Height_cm / 100;
        const imc = weight_kg / (HeightMeters ** 2);
        return imc.toFixed(2);
    }

    idealWeight(height, gender) {
        const idealWeight = gender === 0
            ? (height - 100) - ((height - 100) * 0.1)
            : gender === 1
                ? (height - 100) - ((height - 100) * 0.15)
                : null;

        return idealWeight;
    }


    idealBodyFat(IMC, age, gender) {
        return (1.2 * IMC) + (0.23 * age) - (10.8 * gender) - 5.4;
    }

    copyToClipboard(newClip) {
        if (!navigator.clipboard) {
            console.error('El navegador no admite la API del portapapeles.');
            return;
        }
        return navigator.clipboard.writeText(newClip);
    }



    genId(data) {
        const timestamp = Date.now().toString(36);
        const randomString = Math.random().toString(36).substr(2);
        const additionalData = data.toString();
        const uniqueId = `${timestamp}-${randomString}-${additionalData}`;
        return uniqueId;
    };


    openWAChat(phoneNumber) {
        const formattedNumber = encodeURIComponent(`506${phoneNumber}`);
        const url = "https://api.whatsapp.com/send?phone=" + formattedNumber;
        window.open(url);
    }

    openURL(url){
        window.open(url);
    }

    renewMembership(_date) {
        const oldUntil = new Date(this.getDateFromFirebase(_date));
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        // If membership expired more than 1 week ago, use today's date
        const baseDate = oldUntil < oneWeekAgo ? today : oldUntil;
        
        // Add 1 month to the base date
        const newUntil = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, baseDate.getDate());
        return newUntil;
    }

}


export default Util