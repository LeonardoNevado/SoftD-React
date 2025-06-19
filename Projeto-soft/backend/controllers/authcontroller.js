const { mockUsers } = require('../data/mockData');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    // Buscar usuário nos dados mock
    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    // Retornar dados do usuário (sem a senha)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name
    };

    res.json({
      message: 'Login realizado com sucesso',
      user: userResponse
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Erro interno do servidor' 
    });
  }
};

module.exports = {
  login
};