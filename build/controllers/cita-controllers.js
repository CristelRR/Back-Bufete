"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.citaController = void 0;
const db_1 = require("../config/db");
class CitaController {
    obtenerCitas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const query = `
                SELECT 
                    c.idCita,
                    c.motivo,
                    c.estado AS estadoCita,
                    cl.nombreCliente,
                    cl.aPCliente,
                    cl.aMCliente,
                    cl.telefono AS telefonoCliente,
                    a.fecha AS fechaAgenda,
                    a.horaInicio,
                    a.horaFinal,
                    s.nombreServicio,
                    s.descripcion,
                    s.costo
                FROM 
                    tblCita c
                LEFT JOIN 
                    tblCliente cl ON c.idClienteFK = cl.idCliente
                LEFT JOIN 
                    tblAgenda a ON c.idAgendaFK = a.idAgenda
                LEFT JOIN 
                    tblCita_Servicio cs ON c.idCita = cs.idCita
                LEFT JOIN 
                    tblServicio s ON cs.idServicio = s.idServicio
            `;
                const result = yield pool.request().query(query);
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener citas:', error);
                res.status(500).json({ message: 'Error al obtener citas' });
            }
        });
    }
}
exports.citaController = new CitaController();
