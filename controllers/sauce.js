const Sauce = require('../models/Sauce');
const fs = require('fs');

//Création de sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
  });

  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//Affichage d'une seul sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

//Affichage de toutes les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error }));
  };

//Modification sauce
exports.modifySauce = (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

//SUPPRESSION SAUCE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Non authorisé'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'image supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

//LIKE/DISLIKE SAUCE
exports.likeSauce = (req, res, next) => {
  const userId = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id;
  Sauce.findOne({ _id: sauceId })
      .then(sauce => {
          // nouvelles valeurs à modifier
          const newValues = {
              usersLiked: sauce.usersLiked,
              usersDisliked: sauce.usersDisliked,
              likes: 0,
              dislikes: 0
          }
          // Différents cas:
          switch (like) {
              case 1:  // CAS: sauce liked
                  newValues.usersLiked.push(userId);
                  break;
              case -1:  // CAS: sauce disliked
                  newValues.usersDisliked.push(userId);
                  break;
              case 0:  // CAS: Annulation du like/dislike
                  if (newValues.usersLiked.includes(userId)) {
                      // si on annule le like
                      const index = newValues.usersLiked.indexOf(userId);
                      newValues.usersLiked.splice(index, 1);
                  } else {
                      // si on annule le dislike
                      const index = newValues.usersDisliked.indexOf(userId);
                      newValues.usersDisliked.splice(index, 1);
                  }
                  break;
          };
          // Calcul du nombre de likes / dislikes
          newValues.likes = newValues.usersLiked.length;
          newValues.dislikes = newValues.usersDisliked.length;
          // Mise à jour de la sauce avec les nouvelles valeurs
          Sauce.updateOne({ _id: sauceId }, newValues )
              .then(() => res.status(200).json({ message: 'Sauce notée !' }))
              .catch(error => res.status(400).json({ error }))  
      })
      .catch(error => res.status(500).json({ error }));
};