import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/", { replace: true });
    } else {
      setError("No JWT token was returned by the authentication server.");
    }
  }, [searchParams, navigate]);

  return (
    <div className="container text-center py-5">
      {error ? (
        <>
          <div className="alert alert-danger">{error}</div>
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </>
      ) : (
        <h4>Login successful. Redirecting...</h4>
      )}
    </div>
  );
};

export default OAuthSuccess;
