
import React from "react";
import { Info } from "lucide-react";

interface FormLayoutProps {
  title: string;
  description?: string;
  infoMessage?: string;
  children: React.ReactNode;
}

export const FormLayout: React.FC<FormLayoutProps> = ({ 
  title, 
  description, 
  infoMessage, 
  children 
}) => {
  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h1 className="form-page-title">{title}</h1>
        {description && <p className="form-page-description">{description}</p>}
        
        {infoMessage && (
          <div className="form-info-alert">
            <div className="form-info-alert-icon">
              <Info size={22} />
            </div>
            <p className="form-info-alert-text">{infoMessage}</p>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
