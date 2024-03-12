require("dotenv").config() ///.env
const {MongoClient,ObjectId} = require("mongodb")


function conectar(){
    return MongoClient.connect(process.env.DB_MONGO)
}

function leerColores(){
    return new Promise( async (ok,ko) => {
        try{
            const conexion =  await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let colores = await coleccion.find({}).toArray();

            conexion.close();

            ok(colores);

        }catch(error){

            ko({error : "error en BBDD"})
        }
    })
}
function crearColor(color){
    return new Promise( async (ok,ko) => {
        try{
            const conexion =  await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {insertedId} = await coleccion.insertOne(color);

            conexion.close();

            ok({id : insertedId});

        }catch(error){

            ko({error : "error en BBDD"})
        }
    })
}

function borrarColor(id){
    return new Promise( async (ok,ko) => {
        try{
            const conexion =  await conectar();

            let coleccion = conexion.db("colores").collection("colores");

            let {deletedCount} = await coleccion.deleteOne({_id : new ObjectId(id)});

            conexion.close();

            ok(deletedCount);

        }catch(error){

            ko({error : "error en BBDD"})
        }
    })
}

module.exports = {leerColores,crearColor,borrarColor}

// leerColores()
// .then(colores => console.log(colores));

// crearColor({r: "33", g : "132" , b : "21"})
// .then(algo => console.log(algo))

// borrarColor("65eef3088d61a327ed8e8bfb")
// .then(algo => console.log(algo))




// conectar()
// .then(conexion => console.log("conectado")) esto va a salir en el git bash
// .catch(error => console.log("error"))