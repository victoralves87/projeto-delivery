global.config = require('./config').get('dev');


const restify = require("restify");
const path = require("path");
const recursiveReaddir = require("recursive-readdir");

//cria o servidor
const server = restify.createServer({
    name: 'Delivery',
    version: '1.0.0'
});

//adicionando as extensões restify
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

//adiciona todas as rotas dentro do server
const pathFiles = path.resolve(path.resolve('./').concat('/server/routes'));


recursiveReaddir(pathFiles, ['!*.js'], (err, files)=>{
    if(err){
        console.log(err);
        process.exit(1);
    }
    files.forEach(element => {require(element)(server) })
});

//utilizado para não da problema de requisição no chrome
server.use(
    function nocache(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept");
        res.header("pragma", "no-cache");
        next();
    }
)

//modifica o array de erro e mostra para o usuario uma mensagem personalizada
server.on('restifyError', function(req, res, err, callback){
    err.toJSON = function customToJSON(){
        return{
            Erro: 'Pagina não encontrada :('
        }
    };
    return callback();
})


module.exports = Object.assign({server, restify, config})