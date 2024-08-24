const jwt = require('jsonwebtoken');
const { Operator } = require("../models/Owners");
const asyncHandler = require('express-async-handler');

const OperatorAuthMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('This is decode token', decoded);
        const userOperator = await Operator.findById(decoded?.id)
        if (!userOperator) {
          return res.status(401).json({ message: 'userOperator not found' });
        }
        req.userOperator = userOperator;
        console.log('THis is userOperator', userOperator);
        next();
      }
    } catch (error) {
      return res
        .status(403)
        .json({ message: 'Token expired, please login again' });
    }
  } else {
    return res
      .status(401)
      .json({ message: 'No Bearer token attached to header' });
  }
});



// const isAdmin = asyncHandler(async (req, res, next) => {
//   const { email } = req.admin;
//   const adminUser = await prisma.Admin.findUnique({
//     where: {
//       email: email,
//     },
//   });
//   if (adminUser.role !== 'ADMIN') {
//     throw new Error('Only admin can access this route');
//   } else {
//     next();
//   }
// });

module.exports = { OperatorAuthMiddleware };
