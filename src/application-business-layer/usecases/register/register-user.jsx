import {
    validateUserRegistration
} from "@/enterprise-business-rules/validation/register/regisUserValidation";
import User from "@/enterprise-business-rules/entities/register/User";

export async function registerUser({
    fullName,
    username,
    password,
    email,
    birthDate,
    phoneNumber,
    position
}) {
    // 1. Validate input
    const validationErrors = validateUserRegistration({
        fullName,
        username,
        password,
        email,
        birth: birthDate,
        phone: phoneNumber,
        jabatan: position
    });

    if (Object.keys(validationErrors).length > 0) {
        return {
            success: false,
            errors: validationErrors
        };
    }

    // 2. Create user entity (business object)
    const user = new User({
        fullName,
        username,
        email,
        password,
        birthDate: new Date(birthDate),
        phoneNumber,
        position
    });

    // 3. Business rule: User must be adult
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const month = today.getMonth() - birthDateObj.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }

    if (age < 18) {
        return {
            success: false,
            errors: {
                birth: "You must be at least 18 years old"
            }
        };
    }

    return {
        success: true,
        user: {
            fullName,
            username,
            email,
            birthDate,
            phoneNumber,
            position
        }
    };
}