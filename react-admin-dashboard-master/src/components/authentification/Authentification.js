// Authentication.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ajout pour les appels API
import "./Authentification.css";

const Authentication = ({ onAuthenticate }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      // Appel API pour l'authentification
      if (isSignUp) {
        // Logique d'inscription - à adapter selon votre API
        // const response = await axios.post("http://localhost:3000/api/auth/register", {
        //   name,
        //   email,
        //   password
        // });
        // Traiter la réponse d'inscription ici
      } else {
        // Connexion
        const response = await axios.post("http://localhost:3000/api/auth/login", {
          email,
          password
        });
        
        // Stocker les informations d'utilisateur et le token dans localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.admin.superAdmin);
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("userData", JSON.stringify(response.data.admin));
        
        // Appel de la fonction onAuthenticate avec les données utilisateur
        onAuthenticate(response.data);
        
        // Redirection vers la page d'accueil
        navigate("/");
      }
    } catch (err) {
      console.error("Erreur d'authentification:", err);
      setError(err.response?.data?.message || "Erreur lors de l'authentification");
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError("");
  };

  return (
    <div className={`container ${isSignUp ? "active" : ""}`}>
      <div className="form-container sign-in">
        <form onSubmit={handleSubmit}>
          <h1>Connexion</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>ou utilisez votre email et mot de passe</span>
          {error && <p className="error-message">{error}</p>}
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="#">Mot de passe oublié?</a>
          <button type="submit">Se connecter</button>
        </form>
      </div>

      <div className="form-container sign-up">
        <form onSubmit={handleSubmit}>
          <h1>Créer un compte</h1>
          <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
          </div>
          <span>ou utilisez votre email pour vous inscrire</span>
          {error && <p className="error-message">{error}</p>}
          <input 
            type="text" 
            placeholder="Nom" 
            required 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" 
            placeholder="Email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">S'inscrire</button>
        </form>
      </div>

      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Bon retour !</h1>
            <p>Entrez vos informations personnelles pour accéder à toutes les fonctionnalités</p>
            <button className="hidden" onClick={toggleForm}>Se connecter</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Bonjour !</h1>
            <p>Inscrivez-vous avec vos détails personnels pour accéder à toutes les fonctionnalités</p>
            <button className="hidden" onClick={toggleForm}>S'inscrire</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;