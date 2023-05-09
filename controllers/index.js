const router = require('express').Router();
const homeRoutes = require('./homeRoutes');
const dashboardRoutes = require('./dashboard-routes');

router.use('/', homeRoutes);

router.use('/dashboard', dashboardRoutes);//! should dashboard go before API


module.exports = router;
