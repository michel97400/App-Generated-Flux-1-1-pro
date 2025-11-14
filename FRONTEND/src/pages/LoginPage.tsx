import { useState } from 'react';
import LoaderCompteJeu from '../components/LoaderCompteJeu';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';

// Schéma de validation Zod
const loginSchema = z.object({
    userEmail: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Format d\'email invalide'),
    usersPassword: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .max(100, 'Le mot de passe est trop long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onBlur', // Valide au blur des champs
    });

    const onSubmit = async (data: LoginFormData) => {
        setApiError('');
        setLoading(true);

        const minDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // ✅ Envoie et reçoit les cookies
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erreur lors de la connexion');
            }

            // Attendre au moins 4 seconde pour le loader
            await minDelay(4500);

            // Sauvegarder uniquement l'utilisateur (les tokens sont dans les cookies)
            login(responseData.user);

            // Rediriger vers la page utilisateur
            navigate('/user', { state: { message: 'Connexion réussie !' } });
        } catch (err: any) {
            setApiError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <LoaderCompteJeu />;
    }

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Connexion</h1>
                    <p>Bienvenue ! Connectez-vous à votre compte</p>
                </div>

                {apiError && (
                    <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="form-group">
                        <label htmlFor="userEmail">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            Adresse email
                        </label>
                        <input
                            type="email"
                            id="userEmail"
                            {...register('userEmail')}
                            placeholder="exemple@email.com"
                            className={`form-input ${errors.userEmail ? 'input-error' : ''}`}
                        />
                        {errors.userEmail && (
                            <span className="field-error">{errors.userEmail.message}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="usersPassword">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            id="usersPassword"
                            {...register('usersPassword')}
                            placeholder="••••••••"
                            className={`form-input ${errors.usersPassword ? 'input-error' : ''}`}
                        />
                        {errors.usersPassword && (
                            <span className="field-error">{errors.usersPassword.message}</span>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Se souvenir de moi</span>
                        </label>
                        <a href="#" className="forgot-password">Mot de passe oublié ?</a>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-login"
                        disabled={loading}
                    >
                        Se connecter
                    </button>
                </form>

                <div className="login-footer">
                    <p>Vous n'avez pas de compte ? <a href="/register" className="link-register">Créer un compte</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;