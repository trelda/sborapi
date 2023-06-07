import mysql from "mysql2";
import crypto from "crypto";

import 'dotenv/config';

const { DB_NAME, DB_USER, DB_PASS } = process.env;

const connection = mysql.createPool({
        host: "127.0.0.1",
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS
});

class usersPath {

    async getAllUsers (req, res) {
        try {
            let query = "SELECT * FROM ptgc_users ORDER BY idu DESC";
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

    async getUser (req, res) {
        try {
            const {id} = req.params
            if (!id) {
                res.status(400).json({message: 'user id is not defined.'})
            } else {
                let query = "SELECT * FROM ptgc_users WHERE idu='"+id+"'";
                connection.query(query, (err, result)=> {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        if (result.length > 0) {
                            res.status(200).json(result);
                        } else {
                            res.status(400).json('user with id '+id+' not found.');
                        }
                    }
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async createUser (req, res) {
        try {
            const {chat_id, idr, fio, login, pass} = req.body;
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy+'-'+mm+'-'+dd;
            let check = (/^\d+$/.test(chat_id) === true) ? 
                        (/^\d+$/.test(idr) === true) ? 
                        (/^[a-zA-Z ]+$/.test(fio) === true) ? 
                        (/^[a-zA-Z0-9]+$/.test(login) === true) ? 
                            true : false : false : false : false;
            if (check === true) {
                var password = crypto.createHash('md5').update(pass).digest('hex');
                let query = "INSERT INTO ptgc_users (`chat_id`, `idr`, `fio`, `datar`, `login`, `pass`, `del`)  VALUES ('" + chat_id + "', '" + idr + "', '" + fio + "', '"+  today +"' , '" + login + "', '"+ password + "', '0')";
                connection.query(query, (err, result) => {
                    if (err) {
                        res.status(400).json(err);
                    } else if (result) {
                        res.status(200).json(result);
                    } else {
                        res.status(400).json('user not created');
                    }
                });
            } else {
                res.status(400).json('incorrect data');
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async updateUser (req, res) {
        var params = [];
        try {
            const {id, chat_id, idr, fio, login, pass} = req.body;
            if (!id) {
                res.status(400).json({message: 'id is not defined.'})
            } else {

                (chat_id) ? (/^\d+$/.test(chat_id) === true) ? params['chat_id'] = chat_id : '' : '';

                (idr) ? (/^\d+$/.test(idr) === true) ? params['idr'] = idr : '' : '';

                (fio) ? (/^[a-zA-Z ]+$/.test(fio) === true) ? params['fio'] = fio : '' : '';

                (login) ? (/^[a-zA-Z0-9]+$/.test(login) === true) ? params['login'] = login : '' : '';

                (pass) ? params['pass'] = crypto.createHash('md5').update(pass).digest('hex') : '';

                let updateFields = '';

                var comm = '';
                Object.entries(params).forEach(entry => {
                    const [key, value] = entry;
                    updateFields += comm+ '`' + key + '`=' + '"' + value + '"';
                    comm = ', ';
                });

                let query = "UPDATE ptgc_users SET " + updateFields + " WHERE idu='"+id+"'";

                connection.query(query, (err, result)=> {
                    if (err) {
                        res.status(400).json(err);
                    } else if (result) {
                        res.status(200).json(result);
                    } else {
                        res.status(400).json('user not updated');
                    };
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async deleteUser (req, res) {
        try {
            const {id} = req.params
            if (!id) {
                res.status(400).json({message: 'id is not defined.'})
            } else {
                let query = "UPDATE ptgc_users SET del='1' WHERE idu='"+id+"'";
                connection.query(query, (err, result)=> {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(result);
                    }
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }

    async restoreUser (req, res) {
        try {
            const {id} = req.params
            if (!id) {
                res.status(400).json({message: 'user id is not defined.'})
            } else {
                let query = "UPDATE ptgc_users SET del='0' WHERE idu='"+id+"'";
                connection.query(query, (err, result)=> {
                    if (err) {
                        res.status(400).json(err);
                    } else {
                        res.status(200).json(result);
                    }
                })
            }
        } catch (e) {
            res.status(500).json(e);
        }
    }
}

export default new usersPath();