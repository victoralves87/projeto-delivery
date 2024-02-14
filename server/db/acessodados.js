const mysql = require('mysql2/promise');

module.exports = class AcessoDados {

    async Query(SqlQuery, parametros) {

        try {
            
            var SqlQueryUp = SqlQuery;
            var retorno;

            // Note que 'createConnection' foi substituído por 'createPool'
            var pool = mysql.createPool(global.config.database);

            // percorre os parametros
            if (parametros && parametros != undefined) {

                let p = parametros;

                for (let key in p) {

                    if (p.hasOwnProperty(key)) {

                        let campo = key;
                        let valor = p[key];

                        // Usamos placeholders em vez de concatenar strings
                        SqlQueryUp = SqlQueryUp.replace('@' + campo, '?');

                    }

                }

            }

            // Utilize a função 'execute' para evitar SQL injection
            const [rows, fields] = await pool.execute(SqlQueryUp, Object.values(parametros));

            // O resultado agora está em 'rows'
            retorno = rows;

            return retorno;

        } catch (error) {
            console.log(error);
            return error;
        }

    }

}
