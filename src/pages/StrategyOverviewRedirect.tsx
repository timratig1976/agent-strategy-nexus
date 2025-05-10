
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const StrategyOverviewRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      navigate(`/strategy/${id}`, { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [id, navigate]);

  return <div className="p-8 text-center">Redirecting...</div>;
};

export default StrategyOverviewRedirect;
