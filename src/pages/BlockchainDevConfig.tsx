import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BlockchainDevConfig() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/docs/config/node-config', { replace: true }); }, [navigate]);
  return null;
}
