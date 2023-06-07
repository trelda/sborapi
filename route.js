/*
todo: err, subscribers, topics
*/
import Router from 'express';
import usersPath from "./usersPath.js";
import heatMapPath from "./heatMapPath.js";
import graphsPath from "./graphsPath.js";

const routeSborus = new Router();

routeSborus.get('/users', usersPath.getAllUsers);
routeSborus.get('/users/:id', usersPath.getUser);
routeSborus.post('/users', usersPath.createUser);
routeSborus.put('/users', usersPath.updateUser);
routeSborus.delete('/users/:id',  usersPath.deleteUser);
routeSborus.put('/users/:id', usersPath.restoreUser);

routeSborus.get('/heatmap', heatMapPath.getHeatMap);

routeSborus.get('/circle', graphsPath.getCircleDiagram);

routeSborus.get('/err', graphsPath.getErrDiagram);
routeSborus.get('/subscribers', graphsPath.getSubscribersDiagram);
routeSborus.get('/topics', graphsPath.getTopicsDiagram);


export default routeSborus;