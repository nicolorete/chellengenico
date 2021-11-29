const express = require('express');
const app = express();
const cheerio = require('cheerio');
const port = process.env.PORT  || 3000;
const axios = require('axios');
const mongoose = require('mongoose')
var Equipo = require('./mongoose').Equipo;
const mongodbUrl = 'mongodb+srv://nico:nico123@cluster0.fjfgr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' 
const handlebars = require('express-handlebars');
var cron = require('node-cron');
const uri = process.env.MONGODB_URI;

const equiposArray = new Array();




// settings
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
    defaultLayout: "index",
    runtimeOptions: {
        // allowedProtoMethods: true,
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true, }, 
}));
app.use(express.static('public'));

// Routes
app.get('/', async (req,res)=>{
    
    await mongoose.connect(mongodbUrl);
    Equipo.find({}).sort({posicion: 1}).lean()
    .exec(function(error,equiposList){
        equiposList.forEach(eachEquipo=>{
            equiposArray.push(eachEquipo)
        })
        res.render('main', { data: equiposArray });
        // console.log(equiposArray)
    })
});

app.listen(port, ()=>{
    console.log(`app listening to port ${port}`);
});
// Equipo.remove({}, function(err) { 
//     console.log('collection removed') 
//  });

axios.get('https://www.futbolargentino.com/primera-division/tabla-de-posiciones')
.then(response => {
    const $ = cheerio.load(response.data);
    const items = $('tr') .toArray()
    .map(item => {
        const $item = $(item);
        return{
            posicion: $item.find('tr > td:nth-child(1)').text(),
            escudo :$item.find('img').attr('data-src'),
            nombre: $item.find('.d-md-inline').text(),
            pj: $item.find('tr > td:nth-child(3)').text(),
            pg: $item.find('tr > td:nth-child(4)').text(),
            pe: $item.find('tr > td:nth-child(5)').text(),
            pp: $item.find('tr > td:nth-child(6)').text(),
            gf: $item.find('tr > td:nth-child(7)').text(),
            gc: $item.find('tr > td:nth-child(8)').text(),
            diferencia: $item.find('tr > td:nth-child(9)').text(),
            puntos: $item.find('tr > td:nth-child(10)').text()
            
            
        };
    });
    // console.log(items);

    
    cron.schedule('00 01 * * *', function(){
            
        Equipo.deleteMany({}, function(err) { 
           console.log('dalete meny') 
       });
    });

    cron.schedule('42 10 * * *', function(){
        
        // items.forEach(equipos => {    
            
        // let equipo = new Equipo({
        //     posicion:equipos.posicion,            
        //     escudo:equipos.escudo,
        //     nombre:equipos.nombre,
        //     pj:equipos.pj,
        //     pg:equipos.pg,
        //     pe:equipos.pe,
        //     pp:equipos.pp,
        //     gf:equipos.gf,
        //     gc:equipos.gc,
        //     diferencia:equipos.diferencia,
        //     puntos:equipos.puntos
        // })
        // borrarNull();
        // equipo.save(function(err){
        //     if(err){
        //         console.log(String(err))}
        //     console.log("Cargados Correctamente")
           
        //     })
        // });  
            eliminarTabla();
            console.log('running a task every hour');
            
      });
    
        return items;
});


const borrarNull = async () => {
    const resultado = await Equipo.deleteMany(
        {
            nombre: ''
        }
    )    
}

const eliminarTabla = async () => {

              
        Equipo.deleteMany({}, function(err) { 
           console.log('dalete meny') 
     
    });
}
