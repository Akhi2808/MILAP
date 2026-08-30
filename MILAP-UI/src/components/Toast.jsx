import React from 'react';
import { useApp } from '../manufacturing/context/AppContext.jsx';

export default function Toast() {
  const { toast } = useApp();
  return (
    <div
      id="toast"
      className={`toast${toast.show ? ' show' : ''}`}
      dangerouslySetInnerHTML={{ __html: toast.message }}
    />
  );
}
