const express = require('express');
const router = express.Router();
const { listAllCategory } = require('../controllers/category')
const { listAllCountry } = require('../controllers/country')
const { handleQuery, getTourDeatail, getRecommend, getAllTours,
        getListby, searchFilters, getPackageAvailable  } = require('../controllers/tourpackage')

router.get('/category', listAllCategory)
router.get('/country', listAllCountry)
router.get('/recommend', getRecommend);
router.get('/tourdetail/:id', getTourDeatail); 
router.get('/title', handleQuery);
router.get('/alltours', getAllTours);
router.post('/search', searchFilters); 
router.post('/listby', getListby); // โชว์ทัวร์ทั้งหมดเรียงตามราคาจากถูกสุด 
router.get('/:id/available', getPackageAvailable); // จำนวนแพ็คเกตคงเหลือnpmn

module.exports = router;