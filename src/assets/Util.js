class Util {
    formatDate(_date) {
        const date = new Date(_date);
        const formattedDate = date.toLocaleString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' });
        return formattedDate;
    }

    getAge(birthdayString) {
        const birthday = new Date(birthdayString);
        const ageDiffMs = Date.now() - birthday.getTime();
        const ageDate = new Date(ageDiffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
}


export default Util