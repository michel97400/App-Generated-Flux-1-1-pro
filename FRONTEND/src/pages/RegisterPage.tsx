import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './RegisterPage.css';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userName: '',
        userLastname: '',
        userEmail: '',
        usersPassword: '',
        confirmPassword: '',
        userBirthdate: '',
        userAcceptedPolicy: false,
    });
    
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const calculateAge = (birthdate: string): number => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validations
        if (!formData.userName || !formData.userLastname || !formData.userEmail || 
            !formData.usersPassword || !formData.userBirthdate) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        if (formData.usersPassword !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.usersPassword.length < 8) {
            setError('Le mot de passe doit contenir au moins 8 caractères');
            return;
        }

        const age = calculateAge(formData.userBirthdate);
        if (age < 18) {
            setError('Vous devez avoir au moins 18 ans pour vous inscrire');
            return;
        }

        if (!formData.userAcceptedPolicy) {
            setError('Vous devez accepter les conditions d\'utilisation');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    userLastname: formData.userLastname,
                    userEmail: formData.userEmail,
                    usersPassword: formData.usersPassword,
                    userBirthdate: formData.userBirthdate,
                    userAcceptedPolicy: new Date().toISOString(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de l\'inscription');
            }

            // Rediriger vers la page de connexion
            navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <h1 className="register-title">Créer un compte</h1>
                    <p className="register-subtitle">Rejoignez Good Pics pour générer des images avec IA</p>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="userName">Prénom *</label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="userLastname">Nom *</label>
                                <input
                                    type="text"
                                    id="userLastname"
                                    name="userLastname"
                                    value={formData.userLastname}
                                    onChange={handleChange}
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="userEmail">Email *</label>
                            <input
                                type="email"
                                id="userEmail"
                                name="userEmail"
                                value={formData.userEmail}
                                onChange={handleChange}
                                placeholder="john.doe@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="userBirthdate">Date de naissance * (18+ requis)</label>
                            <input
                                type="date"
                                id="userBirthdate"
                                name="userBirthdate"
                                value={formData.userBirthdate}
                                onChange={handleChange}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="usersPassword">Mot de passe * (min. 8 caractères)</label>
                            <input
                                type="password"
                                id="usersPassword"
                                name="usersPassword"
                                value={formData.usersPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="form-group-checkbox">
                            <input
                                type="checkbox"
                                id="userAcceptedPolicy"
                                name="userAcceptedPolicy"
                                checked={formData.userAcceptedPolicy}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="userAcceptedPolicy">
                                J'accepte les <Link to="/terms" className="link">conditions d'utilisation</Link> et la <Link to="/privacy" className="link">politique de confidentialité</Link> (RGPD)
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Création en cours...' : 'Créer mon compte'}
                        </button>
                    </form>

                    <div className="register-footer">
                        <p>Vous avez déjà un compte ? <Link to="/login" className="link">Se connecter</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;