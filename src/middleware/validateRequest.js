export const validateRequest = (schema) => {
    return (req, res, next) => {
        console.log(`[${req.method}] ${req.originalUrl} - Validation Body:`, req.body);
        const result = schema.safeParse(req.body);

        if (!result.success) {
            console.log("Validation Error:", JSON.stringify(result.error, null, 2));
            const formatted = result.error.format();
            const flatErrors = [];

            // Handle root errors
            if (formatted._errors && formatted._errors.length > 0) {
                flatErrors.push(...formatted._errors);
            }

            // Handle field errors
            Object.keys(formatted).forEach(key => {
                if (key !== '_errors') {
                    const fieldError = formatted[key];
                    if (fieldError && fieldError._errors && fieldError._errors.length > 0) {
                        flatErrors.push(...fieldError._errors);
                    }
                }
            });

            return res.status(400).json({ message: flatErrors.join(", ") });
        }

        next();
    }
}