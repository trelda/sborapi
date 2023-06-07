import mysql from "mysql2";
import 'dotenv/config';

const { DB_NAME, DB_USER, DB_PASS } = process.env;

const connection = mysql.createPool({
        host: "127.0.0.1",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS
});

class heatMapPath {

    async getHeatMap (req, res) {
        var paramsHash = '';
        var hashs = [];
        var startDate = new Date();
        var endDate = new Date();
        var tkParam = '';
        try {
            console.log('heat map');
            const {datestart, dateend, hash, tk} = req.body;

            (hash) ? (/^[а-яА-Я0-9\s]+$/.test(hash) === true) ? hashs = hash.split(" ") : '' : '' ;
            (datestart) ? (/^\d{4}[./-]\d{2}[./-]\d{2}\s\d{2}:\d{2}$/.test(datestart) === true) ? startDate = datestart : startDate.setDate(startDate.getDate() - 14) : startDate.setDate(startDate.getDate() - 14) ;
            (dateend) ? (/^\d{4}[./-]\d{2}[./-]\d{2}\s\d{2}:\d{2}$/.test(dateend) === true) ? endDate = dateend : '' : '' ;

            (tk) ? (/^\d{1}/.test(tk) === true) ? (tk === 1) ? tkParam = ' and top10=1' : (tk === 2) ? tkParam = ' and afisha=1' : '' : '' : '';

            Object.entries(hashs).forEach(entry => {
                const [key, value] = entry;
                paramsHash += " and text like '%" + value + "%'";
            });

            let currentdate = new Date();
            endDate = currentdate.getFullYear() + '-0' + (currentdate.getMonth()+1).toString().slice(-2) + '-0' + currentdate.getDate().toString().slice(-2) + 'T' + ('0' + currentdate.getHours()).slice(-2) + ':' + ('0' + currentdate.getMinutes()).slice(-2);
            startDate = startDate.getFullYear() + '-0' + (startDate.getMonth()+1).toString().slice(-2) + '-0' + startDate.getDate().toString().slice(-2) + 'T' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2);

            let query = "SELECT c.idr, r.okrug, r.region, sum(kolvop) AS srkolvop, sum(kolvoposts) AS kposts, avg(ifnull(round(sumohvat/kolvoposts,0),0)) AS srohvat, sum(sumohvat) AS sumohvat, avg(ifnull(round(round(sumohvat/kolvoposts,0)/kolvop*100,2),0)) AS srerr FROM ptgc_channels AS c LEFT JOIN ptgc_region AS r ON c.idr=r.idr " +
" LEFT JOIN ( " +
" SELECT idchannel, count(g) AS kolvoposts, sum(vi2) AS sumohvat FROM (" +
" SELECT p2.idchannel, if(group_id=0,p2.idpost,group_id) AS g,max(viewsp) AS vi2 FROM ptgc_posts AS p2 WHERE DATE_ADD(p2.date, interval '0T3' DAY_HOUR) " +
" between '" + startDate +"' AND '" + endDate + "' AND p2.delp=0 AND forward=0  " + paramsHash + " GROUP BY p2.idchannel, if(group_id=0,p2.idpost,group_id) " +
" ) podschet GROUP BY idchannel " +
" ) AS posti ON c.id=posti.idchannel " +
" LEFT JOIN (SELECT t1.* FROM ptgc_stat t1 INNER JOIN ( SELECT id, MAX(data) AS data FROM `ptgc_stat` WHERE DATE_ADD(data, interval '0T3' DAY_HOUR) <='" + endDate + "' GROUP BY id ) " +
" t2 ON t1.id = t2.id AND t1.data = t2.data) s ON c.id=s.id " +
" WHERE c.del=0 AND ifnull(c.typechan,0)=0 " + tkParam + " GROUP BY c.idr";

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

export default new heatMapPath();