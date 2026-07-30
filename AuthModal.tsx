import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  RefreshCw,
  Building2,
  Key
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthService } from '../services/authService';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalInitialTab, 
    currentUser, 
    setUserRole, 
    showToast,
    isLoggedIn,
    logoutUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'phone' | 'reset' | 'roles'>(
    authModalInitialTab === 'profile' ? 'login' : authModalInitialTab
  );

  useEffect(() => {
    if (authModalInitialTab === 'profile') {
      setActiveTab('roles');
    } else {
      setActiveTab(authModalInitialTab);
    }
  }, [authModalInitialTab, isAuthModalOpen]);

  // Email Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCity, setRegCity] = useState('Lahore');
  const [regRole, setRegRole] = useState<UserRole>('Customer');

  // Phone OTP Form State
  const [phoneNum, setPhoneNum] = useState('03001234567');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpName, setOtpName] = useState('');
  const [otpCity, setOtpCity] = useState('Lahore');
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot Password State
  const [resetEmail, setResetEmail] = useState('');

  // Status & Error
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Resend OTP Countdown Timer
  useEffect(() => {
    let timer: any = null;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    setIsAuthModalOpen(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // 1. Handle Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }
    try {
      setLoading(true);
      await AuthService.loginWithEmail(loginEmail, loginPassword);
      showToast('Welcome back! Successfully logged in.');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle User Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!regName || !regEmail || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    try {
      setLoading(true);
      await AuthService.registerWithEmail({
        email: regEmail,
        pass: regPassword,
        name: regName,
        phone: regPhone || '+92 300 0000000',
        city: regCity,
        role: regRole
      });
      showToast(`Account created successfully as ${regRole}!`);
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Send Phone OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!phoneNum || phoneNum.length < 10) {
      setErrorMessage('Please enter a valid Pakistan mobile number (e.g., 03001234567).');
      return;
    }
    try {
      setLoading(true);
      await AuthService.sendPhoneOtp(phoneNum);
      setOtpSent(true);
      setResendTimer(45);
      setSuccessMessage('OTP Code sent to ' + phoneNum + '. Check SMS!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Verify Phone OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otpCode || otpCode.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent via SMS.');
      return;
    }
    try {
      setLoading(true);
      await AuthService.verifyPhoneOtp(otpCode, {
        name: otpName || 'Phone Verified Patron',
        city: otpCity,
        role: 'Customer'
      });
      showToast('Phone number verified! Welcome to IQBAL WOODCRAFT.');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    try {
      setLoading(true);
      await AuthService.loginWithGoogle();
      showToast('Google Sign-In successful!');
      handleClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Forgot Password
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!resetEmail) {
      setErrorMessage('Please enter your account email address.');
      return;
    }
    try {
      setLoading(true);
      await AuthService.sendPasswordReset(resetEmail);
      setSuccessMessage('Password reset instructions sent to ' + resetEmail + '. Please check your inbox.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      {/* Container for Firebase Recaptcha */}
      <div id="recaptcha-container"></div>

      <div className="relative w-full max-w-lg bg-stone-900 border border-[#d4af37]/40 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-stone-950 via-amber-950/50 to-stone-950 p-6 border-b border-stone-800 relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-800/80 text-stone-400 hover:text-stone-100 hover:bg-stone-700 transition"
            aria-label="Close authentication window"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-100">IQBAL WOODCRAFT</h2>
              <p className="text-xs text-[#d4af37] tracking-wider uppercase">Authentication & Account Services</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Secure login & order management for Chinioti solid wood patrons across Pakistan.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 p-1 text-xs font-medium">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg transition text-center font-bold ${activeTab === 'login' ? 'bg-[#d4af37] text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Email Login
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg transition text-center font-bold ${activeTab === 'register' ? 'bg-[#d4af37] text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Register
          </button>
          <button
            onClick={() => { setActiveTab('phone'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg transition text-center font-bold ${activeTab === 'phone' ? 'bg-[#d4af37] text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
          >
            +92 OTP
          </button>
          <button
            onClick={() => { setActiveTab('roles'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2.5 rounded-lg transition text-center font-bold ${activeTab === 'roles' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400 hover:text-stone-200'}`}
          >
            Role & Profile
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6">
          
          {/* TAB 1: EMAIL LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. patron@gmail.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('reset'); setErrorMessage(null); setSuccessMessage(null); }}
                    className="text-xs text-[#d4af37] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#d4af37] text-stone-950 hover:bg-[#c59e2b] font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow-md"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Sign In to Account
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-800"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-stone-900 px-2 text-stone-500">Or continue with</span></div>
              </div>

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-stone-950 hover:bg-stone-800 text-stone-200 border border-stone-700 font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-3 text-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Google One-Tap Sign In
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Mian Hassan Raza"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="hassan@gmail.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Phone (+92)</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="03001234567"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">City</label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Chiniot">Chiniot</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Gujranwala">Gujranwala</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">Confirm</label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
                  Account Type (Role)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('Customer')}
                    className={`py-2 px-1 text-xs rounded border font-medium ${regRole === 'Customer' ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]' : 'border-stone-800 bg-stone-950 text-stone-400'}`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('Manager')}
                    className={`py-2 px-1 text-xs rounded border font-medium ${regRole === 'Manager' ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'border-stone-800 bg-stone-950 text-stone-400'}`}
                  >
                    Manager
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('Admin')}
                    className={`py-2 px-1 text-xs rounded border font-medium ${regRole === 'Admin' ? 'bg-red-500/20 border-red-500 text-red-300' : 'border-stone-800 bg-stone-950 text-stone-400'}`}
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-[#d4af37] text-stone-950 hover:bg-[#c59e2b] font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Create Account
              </button>
            </form>
          )}

          {/* TAB 3: PAKISTAN PHONE OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <p className="text-xs text-stone-400">
                    Enter your 11-digit Pakistan mobile number (e.g. <span className="text-[#d4af37]">03001234567</span>). We will send an official 6-digit SMS OTP verification code.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                      Mobile Number (Pakistan +92)
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        placeholder="03001234567 or +923001234567"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37] font-mono"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#d4af37] text-stone-950 hover:bg-[#c59e2b] font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                    Send 6-Digit SMS Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-xs text-amber-200">
                    OTP sent to <span className="font-mono font-bold text-[#d4af37]">{phoneNum}</span>. Enter code below (Default test code: <span className="font-mono font-bold">123456</span>).
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                      Enter 6-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-stone-950 border border-[#d4af37] rounded-lg text-center tracking-[0.5em] py-3 text-lg font-mono text-amber-300 focus:outline-none shadow-inner"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={otpName}
                        onChange={(e) => setOtpName(e.target.value)}
                        placeholder="Mian Tariq"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-stone-400 mb-1">City</label>
                      <input
                        type="text"
                        value={otpCity}
                        onChange={(e) => setOtpCity(e.target.value)}
                        placeholder="Lahore"
                        className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-100"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-stone-400 hover:text-stone-200 underline"
                    >
                      Change Phone Number
                    </button>
                    {resendTimer > 0 ? (
                      <span className="text-stone-500">Resend in {resendTimer}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#d4af37] hover:underline font-bold"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm shadow"
                  >
                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Verify OTP & Login
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {activeTab === 'reset' && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <p className="text-xs text-stone-400">
                Enter your registered email address below. We will send a secure password reset link to your inbox.
              </p>
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                  Account Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="e.g. patron@gmail.com"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="w-1/3 bg-stone-800 text-stone-300 hover:bg-stone-700 py-2.5 px-3 rounded-lg text-xs font-medium"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-[#d4af37] text-stone-950 hover:bg-[#c59e2b] font-bold py-2.5 px-4 rounded-lg transition text-xs shadow flex items-center justify-center gap-1.5"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  Send Reset Link
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: ROLE BASED LOGIN SWITCHER & PROFILE OVERVIEW */}
          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-stone-400">Current Logged In User</div>
                  <div className="text-sm font-bold text-stone-100 flex items-center gap-2">
                    {currentUser.name}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${currentUser.role === 'Admin' ? 'bg-red-500/20 text-red-300 border border-red-500/40' : currentUser.role === 'Manager' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-700 text-stone-300'}`}>
                      {currentUser.role || 'Customer'}
                    </span>
                  </div>
                  <div className="text-xs text-stone-400 font-mono">{currentUser.email || currentUser.phone}</div>
                </div>
                {isLoggedIn && (
                  <button
                    onClick={logoutUser}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 rounded text-xs font-bold transition"
                  >
                    Logout
                  </button>
                )}
              </div>

              <div className="border-t border-stone-800 pt-3">
                <h3 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Instant Role Based Access Switcher (Demo / Testing)
                </h3>
                <p className="text-xs text-stone-400 mb-3">
                  Select a role below to instantly simulate permissions across the Chinioti Woodcraft ecosystem:
                </p>

                <div className="space-y-2">
                  <button
                    onClick={() => setUserRole('Customer')}
                    className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${currentUser.role === 'Customer' ? 'bg-[#d4af37]/15 border-[#d4af37] text-stone-100' : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'}`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-stone-200">
                        <User className="w-3.5 h-3.5 text-[#d4af37]" />
                        Customer Role
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Browse solid wood catalog, place 100% advance orders, submit custom requests, manage saved delivery addresses.
                      </div>
                    </div>
                    {currentUser.role === 'Customer' && <CheckCircle2 className="w-5 h-5 text-[#d4af37] shrink-0" />}
                  </button>

                  <button
                    onClick={() => setUserRole('Manager')}
                    className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${currentUser.role === 'Manager' ? 'bg-amber-500/15 border-amber-500 text-stone-100' : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'}`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
                        <Building2 className="w-3.5 h-3.5 text-amber-400" />
                        Workshop & Sales Manager Role
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Access Admin Panel, manage Wood Workshop assembly stages, issue Cargo Bilty tracking numbers, review custom quotes.
                      </div>
                    </div>
                    {currentUser.role === 'Manager' && <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />}
                  </button>

                  <button
                    onClick={() => setUserRole('Admin')}
                    className={`w-full p-3 rounded-lg border text-left transition flex items-center justify-between ${currentUser.role === 'Admin' ? 'bg-red-500/15 border-red-500 text-stone-100' : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'}`}
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5 text-red-300">
                        <Key className="w-3.5 h-3.5 text-red-400" />
                        Super Admin Executive Role
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        Full administrative authority: update bank/JazzCash accounts, edit AI knowledge FAQs, manage catalog products & sales reports.
                      </div>
                    </div>
                    {currentUser.role === 'Admin' && <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-950 px-6 py-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-500">
          <span>Protected by Firebase Auth & SSL</span>
          <span className="text-[#d4af37] font-serif">IQBAL WOODCRAFT • Chiniot</span>
        </div>

      </div>
    </div>
  );
};
