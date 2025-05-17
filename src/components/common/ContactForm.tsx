import React, { useState } from 'react';
import Button from './Button';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous submission errors
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        const response = await fetch('https://rreusch2.app.n8n.cloud/webhook/75eedc48-8e96-494c-9e4d-b4eef76af621', { // Replace with your actual n8n webhook URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (!response.ok) {
          // Attempt to get error message from n8n if possible, otherwise generic
          let errorMessage = 'Failed to submit form. Please try again later.';
          try {
            const errorData = await response.json();
            if (errorData && errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // Ignore if response isn't JSON or doesn't have a message
            console.error('Could not parse error response from n8n:', parseError);
          }
          throw new Error(errorMessage);
        }
        
        setIsSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          inquiryType: '',
          message: ''
        });
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors(prev => ({ ...prev, submit: error instanceof Error ? error.message : 'An unknown error occurred' }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-semibold text-teal-700 mb-2">Message Sent Successfully!</h3>
        <p className="text-teal-600 mb-4">
          Thank you for reaching out to us. We'll get back to you within 24 hours.
        </p>
        <Button
          variant="primary"
          onClick={() => setIsSubmitted(false)}
        >
          Send Another Message
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-base font-medium text-slate-300 mb-1.5">
            First Name*
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:outline-none placeholder-slate-400 shadow-inner ${
              errors.firstName 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'focus:ring-teal-500 focus:border-teal-500'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName" className="block text-base font-medium text-slate-300 mb-1.5">
            Last Name*
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:outline-none placeholder-slate-400 shadow-inner ${
              errors.lastName 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'focus:ring-teal-500 focus:border-teal-500'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-base font-medium text-slate-300 mb-1.5">
            Email Address*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:outline-none placeholder-slate-400 shadow-inner ${
              errors.email 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'focus:ring-teal-500 focus:border-teal-500'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-base font-medium text-slate-300 mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:ring-teal-500 focus:border-teal-500 focus:outline-none placeholder-slate-400 shadow-inner"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="inquiryType" className="block text-base font-medium text-slate-300 mb-1.5">
          Inquiry Type*
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          value={formData.inquiryType}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:outline-none placeholder-slate-400 shadow-inner appearance-none ${
            errors.inquiryType 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'focus:ring-teal-500 focus:border-teal-500'
          }`}
        >
          <option value="" className="bg-slate-700 text-slate-100">Select an option</option>
          <option value="consultation" className="bg-slate-700 text-slate-100">Free AI Opportunity Consultation</option>
          <option value="automation" className="bg-slate-700 text-slate-100">AI Automation Build Inquiry</option>
          <option value="general" className="bg-slate-700 text-slate-100">General Question</option>
        </select>
        {errors.inquiryType && (
          <p className="mt-1 text-sm text-red-500">{errors.inquiryType}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="message" className="block text-base font-medium text-slate-300 mb-1.5">
          Your Message*
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 bg-slate-700/50 text-slate-100 border border-slate-600 rounded-md shadow-sm focus:ring-1 focus:outline-none placeholder-slate-400 shadow-inner ${
            errors.message 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'focus:ring-teal-500 focus:border-teal-500'
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message}</p>
        )}
      </div>
      
      <div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full md:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        {errors.submit && (
          <p className="mt-2 text-sm text-red-600 text-center">{errors.submit}</p>
        )}
      </div>

      {/* What Happens Next Section */}
      <div className="pt-2 text-center">
        {/* <h4 className="text-sm font-semibold text-slate-300 mb-1">What Happens Next?</h4> */}
        <p className="text-xs text-slate-400 leading-relaxed">
          Your inquiry is important to us. We'll review your message and aim to get back to you within one business day. 
          We respect your privacy and your information will be kept confidential.
        </p>
      </div>

    </form>
  );
};

export default ContactForm;