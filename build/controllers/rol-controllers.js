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
exports.rolController = void 0;
const db_1 = require("../config/db");
class RolController {
    getRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pool = yield (0, db_1.connectDB)();
                const result = yield pool.request().query('SELECT * FROM tblRol');
                res.json(result.recordset);
            }
            catch (error) {
                console.error('Error al obtener roles:', error);
                res.status(500).json({ message: 'Error al obtener roles' });
            }
        });
    }
}
exports.rolController = new RolController();
