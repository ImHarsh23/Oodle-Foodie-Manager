export default function missingFieldArray(body, requiredFields) {
    const incomingFields = Object.keys(body);
    const missingFields = requiredFields.filter((field) => (
        !incomingFields.includes(field) || body[field].trim().length === 0
    ))
    return missingFields;
}