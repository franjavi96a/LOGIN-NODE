import { userRepository } from "../database/db.js";

//Metodo de Prueba
const prueba = (req, res) => {
    try {
        res.render('example', { username: 'Javier' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Renderizar la vista de login
const renderLogin = (req, res) => {
    res.render('login', {
        title: 'Login',
        heading: 'Sistema de Login',
        errorMessage: null
    });
};

// Renderizar la vista de registro
const renderRegister = (req, res) => {
    res.render('register', {
        title: 'Registro',
        heading: 'Crear una Cuenta',
        errorMessage: null
    });
};

// Renderizar el dashboard
const renderDashboard = (req, res) => {
    const { username } = req.session;
    if (username) {
        res.render('dashboard', {
            title: 'Dashboard',
            heading: 'Panel de Control',
            username
        });
    } else {
        res.redirect('/api/login');
    }
};

// Método para registrar usuario
const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        await userRepository.create({ username, password });
        res.redirect('/api/login');
    } catch (error) {
        res.render('register', {
            title: 'Registro',
            heading: 'Crear una Cuenta',
            errorMessage: error.message
        });
    }
};

// Método para iniciar sesión
const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userRepository.login({ username, password });
        // Establecer sesión
        req.session.username = user.username;
        res.redirect('/api/dashboard');
    } catch (error) {
        res.render('login', {
            title: 'Login',
            heading: 'Sistema de Login',
            errorMessage: error.message
        });
    }
};

// Método para cerrar sesión
const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: "Error al cerrar sesión" });
        }
        res.redirect('/api/login');
    });
};

export const metodos = {
    prueba,
    renderLogin,
    renderRegister,
    renderDashboard,
    register,
    login,
    logout
};