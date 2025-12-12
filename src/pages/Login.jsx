import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import fleetBg from '../assets/login-bg.png';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(email, password)) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-container">
            {/* Left Side - Image */}
            <div className="login-left">
                <div className="login-overlay"></div>
                <img
                    src={fleetBg}
                    alt="Fleet Background"
                    className="login-bg-image"
                />
                <div className="brand-area">
                    <h1>FrotaPro</h1>
                    <p>Gestão inteligente e completa para sua frota de caminhões e equipamentos.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="login-right">
                <div className="login-form-wrapper">
                    <div className="login-header">
                        <h2>Bem-vindo de volta</h2>
                        <p>Entre para acessar o painel de controle</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>E-mail</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input"
                                    placeholder="••••••••"
                                />
                                <div
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                />
                                <label htmlFor="remember-me">
                                    Lembrar de mim
                                </label>
                            </div>

                            <a href="#" className="forgot-password">
                                Esqueceu a senha?
                            </a>
                        </div>

                        <button type="submit" className="btn-submit">
                            Entrar
                        </button>
                    </form>

                    <div className="register-link">
                        Não tem uma conta? <a href="#">Cadastre-se</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
