const ErrorWrapper = (cb) => {
    return async function (req, res, next) {
        try {
            await cb(req, res, next);
        } catch (error) {
            console.log(error);
            // if (error.statusCode === undefined) {           //for production
            //     error.message = "Internal Server Error";
            // }
            res.status(error.statusCode || 500).json({
                status: error.statusCode || 500,
                message: error.message,
                success: error.success || false
            })
        }
    }
}

export default ErrorWrapper;