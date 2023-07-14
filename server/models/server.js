let express = require("express");
let sha1 = require("sha1");
let session=require("express-session");
let cookie=require("cookie-parser");

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.middlewares();
        this.routes();

    }
    middlewares(){
        //paginas estaticas
        this.app.use(express.static('public'));
        //View engine
        this.app.set('view engine', 'ejs');
        //sesiones//////////////////
        this.app.use(cookie());

        this.app.use(session({
            secret: "amar",
            saveUninitialized: true,
            resave: true
        }));
        ////////////////////////////
    }
    routes(){
      this.app.get("/hola",(req,res)=>{
        if(req.session.user){
            if(req.session.user.rol == 'admin'){
                res.send("Iniciaste como admin");
            }
            else{
                res.send('Iniciaste como Usuario');
            }
        }
        else{
            res.send("No has iniciado sesion!!!");
        }

    });

       this.app.get('/login',(req,res)=>{
        let usuario = req.query.usuario;
        let contrasena = req.query.pswd;
        let passSha1 = sha1(contrasena)
                     

        let mysql = require('mysql');
        let con = mysql.createConnection({
        
          host: "localhost",
        
          user: "root",
        
          password: "123456789Juan",
        
          database: "escuela"


    });

    con.connect(function(err) {
        
      if (err) throw err;
    
      console.log("Connected!");
      let sql = "select * from usuarios where nombre_usuario= '"+usuario+ "'";
      con.query(sql, function (err, result) {
        
        if (err) throw err;
        if (result.length > 0){

          if(result[0].contrasena == passSha1){
            let user = {
              nam: usuario,
              psw: contrasena,
              rol: result[0].rol
            };
            req.session.user = user;
            req.session.save();
            res.render("inicio",{nombre:result[0].nombre_usuario});
          }
          else{
            
            res.render ("login", {error: "contraseña incorrecta!!!"});//camnbiar sender por render para llamar a la vista
          } 
        }
      else{

        res.render ("login", {error: "usuario no existe!!!"});
      } 
      });
    });
  });
       
       this.app.get("/registrar", (req, res) => {
        let mat = req.query.matricula;
        let nombre = req.query.nombre;
        let cuatri = req.query.cuatrimestre;
        res.render("registrado", {mat: mat, nombre: nombre, cuatri: cuatri});
       
        let mysql = require('mysql');

        let con = mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "123456789Juan",
          database: "escuela"
        });
        
        
        con.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
          let sql = "INSERT INTO Alumno values ("+ mat +",'" + nombre +"','"+ cuatri +"')"; 
          con.query(sql, function (err, result) {
            if (err) throw err;
            res.render("registrado",{mat:mat,nombre:nombre,cuatri:cuatri})
            console.log("1 record inserted");
          });
        });
        });
        this.app.get("/registrarcurso", (req, res) => {
            let curso = req.query.curso;
            let nombre = req.query.nombre;
            res.render("registradocurso", {curso: curso, nombre: nombre});
           
           
            let mysql = require('mysql');
    
            let con = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "123456789Juan",
              database: "escuela"
            });
            
            
            con.connect(function(err) {
              if (err) throw err;
              console.log("Connected!");
              let sql = "INSERT INTO curso values ('"+ curso +"','" + nombre +"')"; 
              con.query(sql, function (err, result) {
                if (err) throw err;
                res.render("registradocurso",{curso:curso,nombre:nombre})
                console.log("1 record inserted");
              });
            });
            });
            this.app.get("/inscribiralumnos", (req, res) => {
              let matricula = req.query.matricula;
              let curso = req.query.curso;
              res.render("inscritoalumno", {matricula: matricula, curso: curso});
             
             
              let mysql = require('mysql');
      
              let con = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "123456789Juan",
                database: "escuela"
              });
              
              
              con.connect(function(err) {
                if (err) throw err;
                console.log("Connected!");
                let sql = "INSERT INTO inscrito values ('"+ matricula +"','" + curso +"')"; 
                con.query(sql, function (err, result) {
                  if (err) throw err;
                  res.render("inscritoalumno",{matricula:matricula,curso:curso})
                  console.log("1 record inserted");
                });
              });
              });
        }
        
       
    listen(){
        this.app.listen(this.port, () => {
            console.log("http://127.0.0.1:" + this.port);
        });
    }
}

module.exports = Server;