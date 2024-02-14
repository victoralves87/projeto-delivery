var mysql = require('mysql');

module.exports = class AcessoDados {

    async Query(SqlQuery, parametros) {

        try {
            
            var SqlQueryUp = SqlQuery;
            var retorno;
            var connection = mysql.createConnection(global.config.database);

            // percorre os parametros
            if (parametros && parametros != undefined) {

                let p = parametros;

                for (let key in p) {

                    if (p.hasOwnProperty(key)) {

                        let campo = key;
                        let valor = p[key];

                        SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);

                    }

                }

            }

            connection.connect();

            await new Promise((resolve, reject) => {

                connection.query(SqlQueryUp, function (error, results, fields) {
                    if (error) {
                        reject();
                        throw error;
                    }
                    retorno = results;
                    resolve();
                });

            });

            connection.end();
            return retorno;

        } catch (error) {
            console.log(error);
            return error;
        }

    }

}