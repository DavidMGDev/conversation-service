const errorHandler = (err, req, res, next) => {

  console.error('❌ Error:', {

    message: err.message,

    stack: err.stack,

    path: req.path,

    method: req.method

  });

  if (err.name === 'ValidationError') {

    return res.status(400).json({

      success: false,

      message: 'Validation error',

      errors: Object.values(err.errors).map(e => e.message)

    });

  }

  if (err.code === 11000) {

    return res.status(409).json({

      success: false,

      message: 'Duplicate key error',

      field: Object.keys(err.keyPattern)[0]

    });

  }

  res.status(err.status || 500).json({

    success: false,

    message: err.message || 'Internal server error'

  });

};

module.exports = errorHandler;
