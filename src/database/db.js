import dbLocal from "db-local";
import crypto from "crypto";
// import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import config from "../config.js";

const { Schema } = new dbLocal({ path: "./src/database" });

const Users_login = Schema("Users_login", {
    _id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
})



//Clase pricipal del login
export class userRepository {

    //Metodo para Crear un nuevo usuario
    static async create({ username, password }) {

        Validacion.username(username);
        Validacion.password(password);

        //Validar que el usuario no exista
        const user = Users_login.findOne({ username })
        if (user) throw new Error('Username already exists')

        const id = crypto.randomUUID() //Crear id con randonUID
        const hashedPassword = await bcrypt.hash(password, config.saltRounds); //hashSync -> Bloquea el thread principal //hashear password

        //Crear usuario
        Users_login.create({
            _id: id,
            username,
            password: hashedPassword,
        }).save();

        return id

    }


    //Metodo de Login
    static async login({ username, password }) {
        Validacion.username(username);
        Validacion.password(password);

        const user = Users_login.findOne({ username })
        if (!user) throw new Error('Username does not exist')

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error('Password is incorrect')

        /* Evitar la vista el campo password al logearce de manera explicita
        solo  sirve para eliminar un campo si se quiere eliminar mas capos de
        la vista al momento de logerce se recomienda crear un nuevo objeto como
        se muestra en return*/

        // const { password: _, ...publicUser } = user

        const { ...publicUser } = user
        return {
            username: publicUser.username,
            id: publicUser._id
        }
    }
}


//Clase de validacion de datos
class Validacion {

    //Validar username
    static username(username) {
        //Validacion de password (opcional utilizar zod)
        if (typeof username !== 'string') throw new Error('Username must be a string')
        if (username.length < 3) throw new Error('Username must be at least 3 characters long')
    }

    //Validar password
    static password(password) {
        //Validacion de password (opcional utilizar zod)
        if (typeof password !== 'string') throw new Error('Password must be a string')
        if (password.length < 6) throw new Error('Password must be at least 6 characters long')
    }
}