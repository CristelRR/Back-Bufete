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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAlumno = exports.alumnoController = void 0;
const database_1 = __importDefault(require("../database"));
class AlumnoController {
    //Seleccionar a todos los registros de la tabla
    getAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const resul = yield database_1.default.query('SELECT idAlumno, nombreAlu, apPaternoAlu, apMaternoAlu, telefono, correo, password, idCarrera FROM tb_alumno');
            res.json(resul[0]);
        });
    }
    //Seleccionar a un registro en especial de la tabla "idAlumno"
    getByIdCarrera(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.params.idAlumno;
            const resul = yield database_1.default.query('SELECT idAlumno, nombreAlu, apPaternoAlu, apMaternoAlu, telefono, correo, password, idCarrera FROM tb_alumno WHERE idAlumno=?', [idAlumno]);
            res.json(resul[0]);
        });
    }
    //Insertar nuevo registro en la tabla
    createAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO tb_alumno SET ?', [req.body]);
            res.json({ message: 'Registro guardado' });
        });
    }
    //Eliminar un registro de la tabla por el "idAlumno"
    deleteAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const idAlumno = req.params.idAlumno;
            yield database_1.default.query('DELETE FROM tb_alumno WHERE idAlumno=?', [idAlumno]);
            res.json({ message: 'Registro Eliminado' });
        });
    }
    updateAlumno(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idAlumno } = req.params;
            yield database_1.default.query('UPDATE tb_alumno SET ? WHERE idAlumno = ?', [req.body, idAlumno]);
            res.json({ message: 'Registro Actualizado' });
        });
    }
}
exports.alumnoController = new AlumnoController();
const createAlumno = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newAlumno = req.body;
});
exports.createAlumno = createAlumno;
