import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiFetch } from '../utils/api';
import './RegisterPage.css';

// Schéma de validation Zod
const registerSchema = z.object({
    userName: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, 'Le prénom est trop long')
        .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le prénom contient des caractères invalides'),
    userLastname: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(50, 'Le nom est trop long')
        .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, 'Le nom contient des caractères invalides'),
    userEmail: z
        .string()
        .min(1, 'L\'email est requis')
        .email('Format d\'email invalide'),
    userBirthdate: z
        .string()
        .min(1, 'La date de naissance est requise')
        .refine((date) => {
            const today = new Date();
            const birth = new Date(date);
            const age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
            return finalAge >= 18;
        }, 'Vous devez avoir au moins 18 ans'),
    usersPassword: z
        .string()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .max(100, 'Le mot de passe est trop long')
        .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
        .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
        .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
    userAcceptedPolicy: z
        .boolean()
        .refine((val) => val === true, 'Vous devez accepter les conditions d\'utilisation'),
}).refine((data) => data.usersPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data: RegisterFormData) => {
        setApiError('');
        setLoading(true);

        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    userName: data.userName,
                    userLastname: data.userLastname,
                    userEmail: data.userEmail,
                    usersPassword: data.usersPassword,
                    userBirthdate: data.userBirthdate,
                    userAcceptedPolicy: new Date().toISOString(),
                }),
                skipRefresh: true,
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erreur lors de l\'inscription');
            }

            // Rediriger vers la page de connexion
            navigate('/login', { state: { message: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' } });
        } catch (err: any) {
            setApiError(err.message || 'Une erreur est survenue');
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

                    {apiError && (
                        <div className="error-message">
                            ⚠️ {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="userName">Prénom *</label>
                                <input
                                    type="text"
                                    id="userName"
                                    {...register('userName')}
                                    placeholder="John"
                                    className={errors.userName ? 'input-error' : ''}
                                />
                                {errors.userName && (
                                    <span className="field-error">{errors.userName.message}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="userLastname">Nom *</label>
                                <input
                                    type="text"
                                    id="userLastname"
                                    {...register('userLastname')}
                                    placeholder="Doe"
                                    className={errors.userLastname ? 'input-error' : ''}
                                />
                                {errors.userLastname && (
                                    <span className="field-error">{errors.userLastname.message}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="userEmail">Email *</label>
                            <input
                                type="email"
                                id="userEmail"
                                {...register('userEmail')}
                                placeholder="john.doe@example.com"
                                className={errors.userEmail ? 'input-error' : ''}
                            />
                            {errors.userEmail && (
                                <span className="field-error">{errors.userEmail.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="userBirthdate">Date de naissance * (18+ requis)</label>
                            <input
                                type="date"
                                id="userBirthdate"
                                {...register('userBirthdate')}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                className={errors.userBirthdate ? 'input-error' : ''}
                            />
                            {errors.userBirthdate && (
                                <span className="field-error">{errors.userBirthdate.message}</span>
                            )}
                        </div>

                        <div className="form-group" style={{ position: 'relative' }}>
                            <label htmlFor="usersPassword">Mot de passe * (min. 8 caractères, 1 majuscule, 1 chiffre)</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="usersPassword"
                                {...register('usersPassword')}
                                placeholder="••••••••"
                                className={errors.usersPassword ? 'input-error' : ''}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '38px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13m3.1-2.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.37 4.98M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.39" /></svg>
                                )}
                            </button>
                            {errors.usersPassword && (
                                <span className="field-error">{errors.usersPassword.message}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmer le mot de passe *</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                {...register('confirmPassword')}
                                placeholder="••••••••"
                                className={errors.confirmPassword ? 'input-error' : ''}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '38px',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                }}
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.122-6.13m3.1-2.13A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10a9.96 9.96 0 01-1.37 4.98M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth={2} /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.857-.67 1.664-1.175 2.39" /></svg>
                                )}
                            </button>
                            {errors.confirmPassword && (
                                <span className="field-error">{errors.confirmPassword.message}</span>
                            )}
                        </div>

                        <div className="form-group-checkbox">
                            <input
                                type="checkbox"
                                id="userAcceptedPolicy"
                                {...register('userAcceptedPolicy')}
                            />
                            <label htmlFor="userAcceptedPolicy">
                                J'accepte les <Link to="/conditions" className="link">conditions d'utilisation</Link> et la <Link to="/policy" className="link">politique de confidentialité</Link> (RGPD)
                            </label>
                        </div>
                        {errors.userAcceptedPolicy && (
                            <span className="field-error">{errors.userAcceptedPolicy.message}</span>
                        )}

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