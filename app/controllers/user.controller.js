const db = require('../models')
const bcrypt = require('bcryptjs');

const hashPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(pass, salt);
  return hash
}

const User = db.users

exports.register = async (req, res) => {
    try {
        const { username, email, password, confirmpass } = req.body;

        if (!username || !email || !password || !confirmpass) {
            return res.status(400).json({
                message: 'Data tidak boleh kosong'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                message: 'format email tidak valid'
            });
        }

        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
            return res.status(400).json({
                message: "password harus minimal 8 karakter, mengandung minimal 1 huruf besar, 1 angka, dan 1 karakter khusus."
            });
        }

        if (password !== confirmpass) {
            return res.status(400).send({
                message: 'password dan konfirmasi password tidak cocok.'
            });
        }
        
        const hashedPassword = await hashPassword(password);

        const isUserInDB = await User.findOne({ name: username })
        if (isUserInDB) {
            return res.status(404).send({
                message: 'username sudah dipakai',
            });
        }

        const isEmailInDb = await User.findOne({ email: email })
        if (isEmailInDb) {
            return res.status(404).send({
                message: 'email sudah pernah dipakai',
            });
        }
        
        const userData = {
            name: String(username),
            email: String(email),
            password: String(hashedPassword),
        };
        
        const resultUser = await User.create(userData);
        
        req.session.user_id = resultUser._id

        res.status(201).send({
            message: 'User registered successfully',
            user: resultUser
        });
    } catch (err) {
        res.status(409).send({
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cari user berdasarkan username
        const getUser = await User.findOne({ email });

        // Jika user tidak ditemukan
        if (!getUser) {
            return res.status(404).send({
                message: 'Email not found',
            });
        }

        // Jika user menggunakan Google OAuth (tidak ada password)
        if (!getUser.password) {
            return res.status(400).send({
                message: 'This account uses Google OAuth. Please login using Google.',
            });
        }

        // Hanya lakukan bcrypt.compare jika user memiliki password
        const comparePassword = await bcrypt.compare(password, getUser.password);

        if (!comparePassword) {
            return res.status(401).send({
                message: 'Invalid password',
            });
        }

        // Jika login berhasil
        req.session.user_id = getUser._id;
        res.status(200).send({
            message: 'Login successfully',
            user: getUser,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send({
            message: err.message,
        });
    }
};



exports.getUser = async (req, res) => {
    try {
        const userId = req.session.user_id || req.user
        const getUser = await User.findOne({ _id: userId });

        res.status(200).send({
            message: 'Get User Successfully',
            user: getUser
        });
    } catch(err) {
        console.error('Error during login:', err);
        res.status(500).send({
            message: err.message
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.session.user_id || req.user;
        const { username } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: No session found' });
        }

        const findUserByName = await User.findOne({ name: username });

        // Jika username sama
        if (findUserByName) {
            return res.status(404).json({ message: 'sudah terpakai!'})
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId, // ID user yang diambil dari session
            {
              name: username,
            },
            { new: true, runValidators: true }
        );

        // Jika user tidak ditemukan
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Kirim data user yang telah diperbarui sebagai response
        res.status(200).send({
            message: 'Get User Successfully',
            user: updatedUser.name
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.logout = async (req, res) => {
    req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ message: 'Logout failed' });
    }
    
    // Hapus cookie session di client
    res.clearCookie('connect.sid'); // Sesuaikan dengan nama cookie session yang digunakan
    return res.status(200).json({ message: 'Logged out successfully' });
    });
}