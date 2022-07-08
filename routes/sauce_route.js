const express = require("express");
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

/* AFFICHER TOUTES LES SAUCES*/
 router.get('/', auth, sauceCtrl.getAllSauce);
 /* RECUPERER UNE SEUL SAUCE */
router.get('/:id', auth, sauceCtrl.getOneSauce);
 /* CRÉER UNE SAUCE*/
router.post('/', auth, multer, sauceCtrl.createSauce); 
/* MODIFIER UNE SAUCE */
router.put('/:id', auth, multer, sauceCtrl.modifySauce); 
/* SUPPRIMER UNE SAUCE*/
router.delete('/:id', auth, multer, sauceCtrl.deleteSauce); 
/*LIKE/DISLIKE SAUCE */
router.post('/:id/like', auth, sauceCtrl.likeSauce); 



module.exports = router;