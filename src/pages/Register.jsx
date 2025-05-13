import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';

function Register() {
    const [userData, setUserData] = useState({
        username: '', 
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { username, email, password } = userData;
            const response = await AuthService.register(
                username,
                email,
                password
            );

            if (response.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.message || "Erreur lors de l'inscription");
            }
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-main">
            <div className="auth-wrapper v3">
                <div className="auth-form">
                    <div className="auth-header">
                        <Link to="/"><img src="../assets/images/logo-dark.svg" alt="logo" /></Link>
                    </div>
                    <div className="card my-5">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <h3 className="mb-0"><b>Inscription</b></h3>
                                <Link to="/login" className="link-primary">Déjà un compte ?</Link>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">Inscription réussie ! Vous allez être redirigé vers la page de connexion...</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Nom d'utilisateur*</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username" 
                                        placeholder="Nom d'utilisateur"
                                        value={userData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Adresse Email*</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Adresse Email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="form-label">Mot de passe*</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={userData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <p className="mt-4 text-sm text-muted">
                                    En vous inscrivant, vous acceptez nos
                                    <Link to="/terms" className="text-primary"> Conditions d'utilisation </Link>
                                    et notre
                                    <Link to="/privacy" className="text-primary"> Politique de confidentialité</Link>
                                </p>

                                <div className="d-grid mt-3">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Inscription en cours...' : 'Créer un compte'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="auth-footer row">
                        <div className="col my-1">
                            <p className="m-0">Copyright ©<a href="#">Izy M'Lay Entreprise</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;