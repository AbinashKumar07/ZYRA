import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Mail, Phone, Lock, KeyRound, Globe } from "lucide-react"; // Imported Globe icon
import { Wordmark } from "@/components/Primitives";

export default function AuthPage() {
  const { role } = useParams();
  const [isLogin, setIsLogin] = useState(true);
  
  // Track the flow (default, email, phone, otp)
  const [authMethod, setAuthMethod] = useState("default");

  const displayRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User";

  // Handle the different submission types
  const handleEmailAuth = (e) => {
    e.preventDefault();
    console.log(`Executing ${isLogin ? "Login" : "Signup"} via Email for ${displayRole}`);
    // Real FastAPI API call goes here
  };

  const handlePhoneAuth = (e) => {
    e.preventDefault();
    console.log(`Requesting OTP for Phone: ${e.target.phone.value}`);
    setAuthMethod("otp"); // Move to OTP entry screen
    // Real FastAPI API call to request SMS goes here
  };

  const handleOtpAuth = (e) => {
    e.preventDefault();
    console.log(`Submitting OTP Code for ${displayRole}`);
    // Real FastAPI API call to verify code goes here
  };

  // This is the function that will launch the real Google popup
  const loginWithGoogle = () => {
    console.log(`Starting real Google OAuth flow for ${displayRole}`);
    // The implementation of this requires the @react-oauth/google library and a Client ID.
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center px-5 py-20 bg-[var(--z-bg)]">
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40">
         <div className="h-[400px] w-[400px] rounded-full bg-[var(--z-purple)] blur-[150px]" />
      </div>

      <div className="z-card w-full max-w-md rounded-3xl p-8 sm:p-10 shadow-2xl transition-all duration-300">
        
        <div className="flex flex-col items-center mb-8 text-center">
          <Wordmark className="mb-6 scale-110" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-[var(--z-text)]">
            {displayRole} {isLogin ? "Sign In" : "Sign Up"}
          </h1>
          <p className="mt-2 text-sm text-[var(--z-text-2)]">
            {isLogin 
              ? `Welcome back to your ${displayRole} portal.` 
              : `Create your ZYRA ${displayRole} account today.`}
          </p>
        </div>

        {/* Dynamic Auth View based on authMethod */}
        {authMethod === "default" && (
          <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
            {/* GOOGLE BUTTON */}
            <button 
              onClick={loginWithGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--z-border)] bg-transparent py-3.5 text-sm font-semibold transition-all hover:bg-white/5 text-[var(--z-text)]"
            >
               <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
               </svg>
               Continue with Google
            </button>

            {/* PHONE BUTTON */}
            <button 
              onClick={() => setAuthMethod("phone")} 
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--z-border)] bg-transparent py-3.5 text-sm font-semibold transition-all hover:bg-white/5 text-[var(--z-text)]"
            >
               <Phone size={18} />
               Continue with Phone Number
            </button>

            {/* EMAIL BUTTON */}
            <button 
              onClick={() => setAuthMethod("email")} 
              className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--z-border)] bg-transparent py-3.5 text-sm font-semibold transition-all hover:bg-white/5 text-[var(--z-text)]"
            >
               <Mail size={18} />
               Continue with Email
            </button>
          </div>
        )}

        {/* EMAIL LOGIN/SIGNUP FORM */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--z-text-3)]"/>
                <input type="email" placeholder="Email address" className="z-input pl-11" required />
            </div>
            <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--z-text-3)]"/>
                <input type="password" placeholder="Password" className="z-input pl-11" required />
            </div>
            {!isLogin && (
              <div className="relative">
                <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--z-text-3)]"/>
                <input type="password" placeholder="Confirm Password" className="z-input pl-11" required />
              </div>
            )}
            <button type="submit" className="z-btn z-btn-primary w-full py-3 mt-2 whitespace-nowrap">
              {isLogin ? "Sign In" : "Create Account"}
            </button>
            <button type="button" onClick={() => setAuthMethod("default")} className="mt-3 text-sm font-semibold text-[var(--z-text-2)] hover:text-[var(--z-text)]">← Back to options</button>
          </form>
        )}

        {/* PHONE INPUT FORM (Completely modified layout) */}
        {authMethod === "phone" && (
          <form onSubmit={handlePhoneAuth} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex gap-2">
                {/* 
                  THE LARGER BOX NOW (Country Code):
                  Changed to flex-1 so it takes up available space.
                  Added Globe icon for context.
                */}
                <div className="relative flex-1">
                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--z-text-3)]"/>
                    <input 
                      type="text" 
                      placeholder="Country Code" 
                      className="z-input pl-11" 
                      defaultValue="+1"
                    />
                </div>

                {/* 
                  THE SMALLER BOX NOW (Phone input container):
                  Removed flex-1 and added a fixed width (w-24).
                */}
                <div className="relative w-24">
                    <input 
                      name="phone" 
                      type="tel" 
                      placeholder="000..." 
                      className="z-input text-center" // Centered text for better look in small box
                      required 
                    />
                </div>
            </div>
            <p className="text-xs text-[var(--z-text-3)] mt-1 px-1">We will send a 6-digit verification code via SMS.</p>
            <button type="submit" className="z-btn z-btn-primary w-full py-3 mt-2 whitespace-nowrap">
              Send Verification Code
            </button>
            <button type="button" onClick={() => setAuthMethod("default")} className="mt-3 text-sm font-semibold text-[var(--z-text-2)] hover:text-[var(--z-text)]">← Back to options</button>
          </form>
        )}

        {/* OTP CODE ENTRY FORM */}
        {authMethod === "otp" && (
          <form onSubmit={handleOtpAuth} className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <input type="text" maxLength="6" placeholder="000000" className="z-input text-center text-3xl tracking-[0.4em] font-mono py-4" required />
            <p className="text-xs text-[var(--z-text-3)] mt-1 px-1 text-center">Enter the 6-digit code sent to your phone.</p>
            <button type="submit" className="z-btn z-btn-primary w-full py-3 mt-2 whitespace-nowrap">
              Verify Code & Login
            </button>
            <button type="button" onClick={() => setAuthMethod("phone")} className="mt-3 text-sm font-semibold text-[var(--z-text-2)] hover:text-[var(--z-text)]">← Change phone number</button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-[var(--z-text-2)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setAuthMethod("default"); }} 
            className="font-bold text-[var(--z-purple-soft)] hover:underline"
          >
            {isLogin ? "Sign up here" : "Sign in here"}
          </button>
        </div>

      </div>
    </section>
  );
}