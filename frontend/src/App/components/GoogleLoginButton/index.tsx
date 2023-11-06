import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

export default function GoogleLoginButton({ isSignUp }) {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  globalThis.handleSignInWithGoogle = async (response) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential
    })

    if (data && data.session && data.user) {
      navigate('/');
    }
  }

  return (
    <>
      <div id="g_id_onload"
          //TODO: store client id in .env
          data-client_id="372459130014-qup0glhs412qcr1e63o29naalj5qk3kg.apps.googleusercontent.com"
          data-context={isSignUp? "login" : "signup"}
          data-ux_mode="popup"
          data-callback="handleSignInWithGoogle"
          data-itp_support="true">
      </div>

      <div className="g_id_signin"
          data-type="standard"
          data-shape="rectangular"
          data-theme="outline"
          data-text={isSignUp? "signup_with" : "signin_with"}
          data-size="large"
          data-logo_alignment="left"
          data-width="350">
      </div>
    </>
  )
}