import { Link, Outlet } from 'react-router-dom';
import '../pages/UserAccountPage.css';
import { User, Images, Settings, History, Sparkles, MessageCircleMore } from 'lucide-react';

function UserLayout() {
  return (
    <div className="user-account">
      <aside className="user-sidebar">
        <h2>Mon Compte</h2>
        <nav>
          <ul>
            <li>
              <Link to="" className="menu-link" title="Profil">
                <User size={24} />
              </Link>
            </li>
            <li>
              <Link to="generation" className="menu-link" title="Génération">
                <Sparkles size={24} />
              </Link>
            </li>
            <li>
              <Link to="galery" className="menu-link" title="Ma Galerie">
                <Images size={24} />
              </Link>
            </li>
            <li>
              <Link to="chat" className="menu-link" title="Chat IA">
                <MessageCircleMore size={24}/>
              </Link>
            </li>
            <li>
              <Link to="setting" className="menu-link" title="Paramètres">
                <Settings size={24} />
              </Link>
            </li>
            
            <li>
              <Link to="history" className="menu-link" title="Historique">
                <History size={24} />
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="user-content">
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;