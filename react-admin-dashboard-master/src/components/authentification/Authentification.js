// Authentication.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ajout pour les appels API
import "./Authentification.css";

const Authentication = ({ onAuthenticate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
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
    } catch (err) {
      console.error("Erreur d'authentification:", err);
      setError(err.response?.data?.message || "Erreur lors de l'authentification");
    }
  };

  return (
    <div className="container" style={{ backgroundImage: "url('https://www.identitenumerique.ma/images/home/topBackground.png')" }}>
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
  );
};

export default Authentication;
