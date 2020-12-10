const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')//1-Utiliser mongoose
//Pour lire les requetes envoyés via le post (pour convertir en JSON utilisable par le serveur)

//visualiser le css, placé dans /public
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());//pour le post pour comprendre l'objet JSON du front end

function myFunction() {
    var x = document.getElementById("*passwordbox-id*");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}


//2- Connection à la bd
mongoose.connect('mongodb://localhost/my_databaseMongoDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

//3-Création du model
const userSchema = mongoose.Schema({
    nom: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    }
});

//4- Pour accéder model
const User = mongoose.model('User', userSchema);

//5- Créer l'objet et le sauvgarder
/* const instance = new Thing();
instance.title = 'Vente de mon bureau';//la propriété de votre schéma
instance.description = 'chercher a vendre le bureau';
instance.imageUrl = '...';
instance.price = '600';
instance.save(function (err) {
    //console.log()
}); */


//lire: Get
app.get('/', function (req, res) {
    // res.send('Hello World')
    res.sendFile(__dirname + '/index.html')
})

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ nom: req.body.nom });
        console.log(user);

        if (!user) {
            return res.status(400).send('Nom utilisateur incorrect')
        }

        if (req.body.password == user.password) {
            res.status(200).send('Connexion réussi');
        }
        else {
            res.status(400).send('Mot de passe incorrect')
        }

    } catch (error) {
        return res.status(400).send({
            error: true,
            reason: err.message
        })
    }
});

//Créer un utilisateur
app.post('/api/stuff', async (req, res) => {

    try {
        const findUser = await User.findOne({ nom: req.body.nom }).exec();

        if (findUser !== null) {
            throw new Error('Cet utilisateur existe déjà')
        }
        console.log("Nom d'utilisateur vérifié")

        const user = new User({
            nom: req.body.nom,
            password: req.body.password
        })

        console.log(user);
        user.save();
        res.send('Compte sauvgardé');

    } catch (err) {
        return res.status(400).send({
            error: true,
            reason: err.message
        })
    }



    /* console.log(req.body);
    res.status(201).json({
        message: 'Objet créé !'
    });
}); */
    //on va créer un nouveau objet
    /*() thing = new Thing({
         //prends tous les champs de la req
         nom: req.body.nom,
         password: req.body.password,
     });
 
 
     thing.save()
         .then(() => res.status(200).json({ message: 'Objet enregistré!' }))
         .catch(error => res.status(400).json({ error })); //dans le catch on recupere l'erreur
 
     console.log(req.body);*/


    //sauvegarde: dans le then on envoie une reponse au front end
    //sinon expiration de la requete


});


//pour aller chercher les items qui sont dans ma bd
app.get('/api/stuff', function (req, res) {

    User.find()
        .then(users => res.status(200).json(users)) //Promise. Dans le then :on va lui retourner tous les objets dans la base
        .catch(error => res.status(400).json({ error }));
})



app.listen(3002, function () {
    console.log("connecter au serveur sur le port 3002")
})
