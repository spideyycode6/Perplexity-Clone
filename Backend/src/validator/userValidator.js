import { body, validationResult } from 'express-validator';


// Validation middleware - handles errors
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    next();
};

// Register validation rules
export const registerValidationRules = () => {
    return [
        body('email')
            .isEmail()
            .normalizeEmail()
            .withMessage('Please provide a valid email address'),

        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .withMessage('Password must contain uppercase, lowercase, and number'),

        body('confirmPassword')
            .custom((value, { req }) => value === req.body.password)
            .withMessage('Passwords do not match'),

        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('Username must be between 3 and 30 characters')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
            validate
    ];
};

