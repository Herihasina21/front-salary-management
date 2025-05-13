import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { email, password } = credentials;
            const response = await AuthService.login(email, password);

            if (response.success) {
                if (rememberMe) {
                    localStorage.setItem('authToken', response.data.token);
                } else {
                    sessionStorage.setItem('authToken', response.data.token);
                }
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-main">
            <div className="auth-wrapper v3">
                <div className="auth-form">
                    <div className="auth-header">
                        <a href="#"><img src="../assets/images/logo-dark.svg" alt="logo" /></a>
                    </div>
                    <div className="card my-5">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-end mb-4">
                                <h3 className="mb-0"><b>Connexion</b></h3>
                                <a href="/register" className="link-primary">Pas de compte ?</a>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label className="form-label">Adresse Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Adresse Email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label className="form-label">Mot de passe</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="d-flex mt-1 justify-content-between">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input input-primary"
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                        />
                                        <label className="form-check-label text-muted" htmlFor="rememberMe">
                                            Rester connecté
                                        </label>
                                    </div>
                                    <h5 className="text-secondary f-w-400">Mot de passe oublié ?</h5>
                                </div>
                                <div className="d-grid mt-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Connexion en cours...' : 'Se connecter'}
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

export default Login;