class Util {
    formatDate(_date) {
        const date = new Date(_date);
        const formattedDate = date.toLocaleString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate;
    }

    formatDateShort(_date) {
        const date = new Date(_date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    }

    getDateFromFirebase(_date) {
        const milliseconds = _date.seconds * 1000 + Math.floor(_date.nanoseconds / 1e6);
        return new Date(milliseconds);
    }

    getAge(birthdayString) {
        const birthday = new Date(birthdayString);
        const ageDiffMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDiffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    removeAccents(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };


    genId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}


export default Util