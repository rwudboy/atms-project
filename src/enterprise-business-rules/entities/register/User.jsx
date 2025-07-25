export default class User {
    constructor({
        id,
        fullName,
        username,
        email,
        password,
        birthDate,
        phoneNumber,
        position
    }) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.birthDate = birthDate;
        this.phoneNumber = phoneNumber;
        this.position = position;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    isAdult() {
        const today = new Date();
        const age = today.getFullYear() - this.birthDate.getFullYear();
        const diffMonths = today.getMonth() - this.birthDate.getMonth();
        return age > 18 || (age === 18 && diffMonths >= 0);
    }
}