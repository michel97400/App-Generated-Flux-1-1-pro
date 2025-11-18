import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Weight } from 'lucide-react';

function Profile() {
  const { user, refreshAuth } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    userLastname: '',
    userEmail: '',
    userIsadult: false,
    userContentFilter: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Synchroniser formData avec user quand user change
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || '',
        userLastname: user.userLastname || '',
        userEmail: user.userEmail || '',
        userIsadult: user.userIsadult || false,
        userContentFilter: user.userContentFilter || '',
      });
    }
  }, [user]);

  if (!user) {
    return <p>Utilisateur non connecté.</p>;
  }

  if (!user) {
    return <p>Utilisateur non connecté.</p>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      // Refresh the token first
      const refreshed = await refreshAuth();
      if (!refreshed) {
        setMessage('Session expirée, veuillez vous reconnecter');
        return;
      }

      const response = await fetch(`http://localhost:3000/users/${user.userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Update the auth context
        await refreshAuth();
        setIsEditing(false);
        setMessage('Profil mis à jour avec succès !');
      } else {
        const error = await response.json();
        setMessage(`Erreur: ${error.message || 'Erreur lors de la mise à jour'}`);
      }
    } catch (error) {
      setMessage('Erreur réseau lors de la mise à jour');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      userName: user.userName,
      userLastname: user.userLastname,
      userEmail: user.userEmail,
      userIsadult: user.userIsadult,
      userContentFilter: user.userContentFilter,
    });
    setIsEditing(false);
    setMessage('');
  };

  return (
    <>
      <h1>Mon Profil</h1>
      {message && (
        <p className={`message ${message.includes('succès') ? 'success-message' : 'error-message'}`}>
          {message}
        </p>
      )}
      <div className="profile-info">
        <h3>Informations personnelles</h3>
        {isEditing ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="profile-form">
            <div className="form-field">
              <label className="form-label">Prénom:</label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Nom:</label>
              <input
                type="text"
                name="userLastname"
                value={formData.userLastname}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Adulte:</label>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  name="userIsadult"
                  checked={formData.userIsadult}
                  onChange={handleInputChange}
                  disabled={user.userIsadult}
                  className="form-checkbox"
                />
                {user.userIsadult && <span className="confirmation-text">(Déjà confirmé)</span>}
              </div>
            </div>
            <div className="form-field">
              <label className="form-label">Filtre de contenu:</label>
              <select
                name="userContentFilter"
                value={formData.userContentFilter}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" disabled={loading} className="save-btn">
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button type="button" onClick={handleCancel} className="cancel-btn">Annuler</button>
            </div>
          </form>
        ) : (
          <div className="profile-display">
            <div className="profile-field">
              <span className="field-label">Prénom :</span>
              <span className="field-value">{user.userName}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Nom :</span>
              <span className="field-value">{user.userLastname}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Email :</span>
              <span className="field-value">{user.userEmail}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Adulte :</span>
              <span className="field-value">{user.userIsadult ? 'Oui' : 'Non'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Filtre de contenu :</span>
              <span className="field-value">{user.userContentFilter}</span>
            </div>
            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)}>Modifier</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;