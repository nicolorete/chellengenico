const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const mongodbUrl = 'mongodb+srv://nico:nico123@cluster0.fjfgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' 

mongoose.connect(mongodbUrl,{


})  
    .then(db=>console.log('Dadata base is connected'))
    .catch(err=> console.log(err));

var schema = new Schema({
    posicion: Number,
    escudo: String,
    nombre: String,
    pj: String,
    pg: String,
    pe: String,
    pp: String,
    gf: String,
    gc: String,
    diferencia: String,
    puntos: String
});

var Equipo = mongoose.model("Equipo", schema);

module.exports.Equipo = Equipo;