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
const db_1 = require("../lib/db");
const crypto_1 = require("crypto");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = '#*(#&@(!(@&JKADASHKDKJAHKJD';
class UserService {
    static generateHash(salt, password) {
        const hashedPassword = (0, crypto_1.createHmac)('sha256', salt).update(password).digest("hex");
        return hashedPassword;
    }
    static getUserById(id) {
        return db_1.primsaClient.user.findUnique({ where: { id: id } });
    }
    static createUser(payload) {
        const { firstName, lastName, email, password } = payload;
        const salt = (0, crypto_1.randomBytes)(32).toString('hex');
        const hashedPassword = UserService.generateHash(salt, password);
        return db_1.primsaClient.user.create({
            data: { firstName, lastName, email, salt, password: hashedPassword },
        });
    }
    static getUserByEmail(email) {
        return db_1.primsaClient.user.findUnique({ where: { email: email } });
    }
    static getUserToken(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield UserService.getUserByEmail(email);
            if (!user) {
                throw new Error(`User not found`);
            }
            const userSalt = user.salt;
            const usersHashPassword = UserService.generateHash(userSalt, password);
            if (usersHashPassword !== user.password) {
                throw new Error(`Incorrect password`);
            }
            // gen token
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                email: user.email,
            }, JWT_SECRET);
            return token;
        });
    }
    static decodeJwtToken(token) {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
}
exports.default = UserService;
