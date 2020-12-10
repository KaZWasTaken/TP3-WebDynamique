const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')//1-Utiliser mongoose
//Pour lire les requetes envoyés via le post (pour convertir en JSON utilisable par le serveur)

//visualiser le css, placé dans /public
app.use('/', express.static(__dirname + '/public'));
app.use(bodyParser.json());//pour le post pour comprendre l'objet JSON du front end

function myFunction() {                 //hash le mot de passe à l'écran
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


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.post('/api/login', async (req, res) => {
    try {
        const user = await User.findOne({ nom: req.body.nom }); //s'en va chercher une correspondance entre le nom entré et cherche la BD pour ce nom
        console.log(user);

        if (!user) {
            return res.status(400).send('Nom utilisateur incorrect')    //Si l'utilisateur n'existe pas dans la BD, retourne cette erreur
        }

        if (req.body.password == user.password) {   //Vérification du mot de passe (non-hashé donc pas de sécurité whatsoever mais c'était pas demandé dans l'énoncé)
            res.status(200).send('Connexion réussi');
        }
        else {
            res.status(400).send('Mot de passe incorrect')
        }

    } catch (error) {                           //Si ce qui se passe dans le try ne marche pas, il attrape l'erreur et la renvoie au index.html
        return res.status(400).send({
            error: true,
            reason: err.message
        })
    }
    //Notion de code repris d'un post sur StackOverflow qui mène vers un GitHub
    //Lien du forum: https://stackoverflow.com/questions/57112012/model-findone-in-mongoose-not-working
    //Lien du GitHub: https://github.com/boseprasanta/Login-API/blob/master/loginAPI.js
});

//Créer un utilisateur (reprend la même notion que dans le forum)
app.post('/api/stuff', async (req, res) => {
    const errorCode = 200;
    try {
        const findUser = await User.findOne({ nom: req.body.nom }).exec();  //S'en va chercher le nom entré et le chercher dans la BD, retourne null s'il n'existe pas dans la BD

        if (findUser !== null) {                                //si l'utilisateur existe, on retourne une erreur disant que l'utilisateur existe déjà
            throw new Error('Cet utilisateur existe déjà')
        }

        if (findUser.length < nom.minlength) {
            throw new Error('Nom trop court')       //renvoie une erreur si notre username ou mot de passe est trop court. Parce que sinon on arrive à rentrer dans le dashboard, 
            //mais le compte n'est pas enregistré sur la BD
        }
        console.log("Nom d'utilisateur vérifié")

        if (req.body.password.length < password.minlength) {
            throw new Error('Mot de passe trop court')
        }

        const user = new User({                 //Instancie un nouvel utilisateur à partir des données entrées dans les champs
            nom: req.body.nom,
            password: req.body.password
        })

        console.log(user);
        user.save();    //sauvegarde l'utilisateur dans la BD
        res.send('Compte sauvgardé');

    } catch (err) {
        return res.status(400).send({
            error: true,
            reason: err.message
        })
    }


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
