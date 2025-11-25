"use client";
import { useState } from 'react';
import { 
  User, CreditCard, HelpCircle, Shield, Briefcase,
  Camera, Mail, Phone, MapPin, Edit2, Plus, Trash2, 
  Check, ChevronRight, Star, Calendar, Clock, FileText,
  Building, MessageSquare, Bell, Lock, Eye
} from 'lucide-react';
import CustomerProfileSettings from "@/components/customer/customer_profile_settings"
import PaymentMethodsSettings from "@/components/customer/payment_methods_settings"
import VendorProfileSettings from "@/components/vendor/Vender_profile_settings"

import { notificationService } from "@/service/NotificationService";

const settingsTabs = [
  { id: "customer", label: "Customer Profile", icon: User, color: "#02bba8", gradient: "from-blue-500 to-cyan-500" },
  { id: "payment", label: "Payment Methods", icon: CreditCard, color: "#02bba8", gradient: "from-green-500 to-emerald-500" },
  { id: "help", label: "Help Center", icon: HelpCircle, color: "#02bba8", gradient: "from-yellow-500 to-orange-500" },
  { id: "privacy", label: "Privacy & Policy", icon: Shield, color: "#02bba8", gradient: "from-red-500 to-pink-500" },
  { id: "vendor", label: "Vendor Profile", icon: Briefcase, color: "#02bba8", gradient: "from-purple-500 to-indigo-500" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("customer");
  const [isEditing, setIsEditing] = useState(false);

 


  const renderHelpCenter = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Help Center</h2>
        <p className="text-gray-500">Get assistance and find answers to your questions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'FAQs', desc: 'Common questions answered', icon: HelpCircle, color: 'from-yellow-500 to-orange-500', iconBg: 'from-yellow-100 to-orange-100' },
          { title: 'Contact Support', desc: '24/7 customer support', icon: MessageSquare, color: 'from-blue-500 to-cyan-500', iconBg: 'from-blue-100 to-cyan-100' },
          { title: 'Video Tutorials', desc: 'Learn with video guides', icon: Eye, color: 'from-purple-500 to-pink-500', iconBg: 'from-purple-100 to-pink-100' },
          { title: 'Documentation', desc: 'Detailed user guides', icon: FileText, color: 'from-green-500 to-emerald-500', iconBg: 'from-green-100 to-emerald-100' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 cursor-pointer group hover:-translate-y-1">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.iconBg} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`} style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.desc}</p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Learn More
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-4">Popular Topics</h3>
        <div className="space-y-3">
          {[
            'How do I book a service?',
            'How to cancel or reschedule?',
            'Payment and refund policy',
            'Vendor verification process'
          ].map((topic, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer group">
              <p className="text-gray-700 font-medium">{topic}</p>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacyPolicy = () => (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Privacy & Policy</h2>
        <p className="text-gray-500">Your data security and privacy matters to us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Data Encrypted', icon: Lock, color: 'from-green-500 to-emerald-500' },
          { label: 'GDPR Compliant', icon: Shield, color: 'from-blue-500 to-cyan-500' },
          { label: 'Secure Storage', icon: FileText, color: 'from-purple-500 to-pink-500' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <p className="font-bold text-gray-900">{item.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 space-y-6">
        {[
          { title: 'Data Collection', content: 'We collect information you provide including name, email, and payment details to deliver our services effectively.' },
          { title: 'How We Use Data', content: 'Your data helps us process transactions, improve services, and communicate important updates about your account.' },
          { title: 'Data Security', content: 'Industry-standard encryption protects your information. We implement strict security measures to prevent unauthorized access.' },
          { title: 'Your Rights', content: 'Access, update, or delete your data anytime. Request a copy of your information or opt-out of communications easily.' }
        ].map((section, idx) => (
          <div key={idx}>
            <h3 className="font-bold text-lg text-gray-900 mb-3">{section.title}</h3>
            <p className="text-gray-600 leading-relaxed">{section.content}</p>
          </div>
        ))}

        <div className="pt-6 border-t flex gap-3">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
            Download My Data
          </button>
          <button className="flex-1 border-2 border-red-500 text-red-500 px-6 py-3 rounded-full font-semibold hover:bg-red-50 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderVendorProfile = () => (
    <VendorProfileSettings/>

     );

 const renderTabContent = () => {
  switch (activeTab) {
    case "customer":
      return <CustomerProfileSettings />;

    case "payment":
      return <PaymentMethodsSettings />;

    case "help":
      return renderHelpCenter(); // This one is still fine since it’s static JSX

    case "privacy":
      return renderPrivacyPolicy();

    case "vendor":
      return <VendorProfileSettings />;

    default:
      return null;
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Enhanced Tabs */}
          <div className="lg:w-72">
            <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 space-y-2 sticky top-6">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold text-left transition-all group
                      ${activeTab === tab.id 
                        ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105` 
                        : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                      ${activeTab === tab.id 
                        ? 'bg-white bg-opacity-20' 
                        : `bg-gradient-to-br ${tab.gradient} bg-opacity-10`
                      }
                    `}>
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : ''}`} />
                    </div>
                    <span className="flex-1">{tab.label}</span>
                    {activeTab === tab.id && (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;S
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}