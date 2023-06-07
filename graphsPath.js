import mysql from "mysql2";
import 'dotenv/config';

const { DB_NAME, DB_USER, DB_PASS } = process.env;

const connection = mysql.createPool({
        host: "127.0.0.1",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS
});
class graphsPath {

    async getCircleDiagram (req, res) {
        try {
            console.log('circle diagram');
            let query = "SELECT tema AS title, count(*) AS count, round(count(*) / (SELECT COUNT(*) FROM ptgc_channels AS c WHERE (1=1) )*100,0) AS percent FROM ptgc_channels c WHERE (1=1) GROUP BY tema";
            connection.query(query, (err, result)=> {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(result);
                }
            })
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getErrDiagram (req, res) {
        try {
            console.log('err diagram');
            let query = "";
            connection.query(query, (err, result)=> {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(result);
                }
            })
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getSubscribersDiagram (req, res) {
        try {
            console.log('users count diagram');
            let query = "";
            connection.query(query, (err, result)=> {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(result);
                }
            })
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async getTopicsDiagram (req, res) {
        try {
            console.log('topics diagram');
            let query = "";
            connection.query(query, (err, result)=> {
                if (err) {
                    res.status(400).json(err);
                } else {
                    res.status(200).json(result);
                }
            })
        } catch (e) {
            res.status(500).json(e);
        }
    }

}

export default new graphsPath();