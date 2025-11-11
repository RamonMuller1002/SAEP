import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
 user: 'postgres',
 host: 'localhost',
 database: 'VETCLINIC',
 password: 'senai',
 port: 5432,
});
pool.connect()
 .then(client => {
 console.log('Conexão com PostgreSQL estabelecida!');
 client.release();
 })
 .catch(err => console.error(' Erro ao conectar ao PostgreSQL:', err));
export default pool;
