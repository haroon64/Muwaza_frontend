"use client";

import { User, CreditCard, HelpCircle, Shield, Briefcase, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsTabs = [
  { id: "customer-profile", label: "Customer Profile", icon: User, href: "/settings/customer-profile" },
  { id: "payment", label: "Payment Methods", icon: CreditCard, href: "/settings/payment-methods" },
  { id: "help", label: "Help Center", icon: HelpCircle, href: "/settings/help-center" },
  { id: "privacy", label: "Privacy & Policy", icon: Shield, href: "/settings/privacy-policy" },
  { id: "vendor-profile", label: "Vendor Profile", icon: Briefcase, href: "/settings/vendor-profile" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar */}
        <aside className="lg:w-72">
          <div className="bg-white rounded-3xl p-4 shadow-xl border border-gray-100 space-y-2 sticky top-6">

            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname.includes(tab.href);

              return (
                <Link
                  style={{background: "#3730a3"}} 
                  key={tab.id}
                  href={tab.href}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold text-left transition-all group
                    ${isActive ? "bg-gradient-to-r  text-white shadow-lg scale-105" : "hover:bg-gray-50"}
                  `}
                >
                  <div   style={{background: "black"}} className="w-10 h-10 rounded-xl flex  items-center justify-center transition-transform group-hover:scale-110
                      ${activeTab === tab.id ">
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-white"}`} />
                  </div>

                  <span className="flex-1">{tab.label}</span>

                  {isActive && <ChevronRight className="w-5 h-5" />}
                </Link>
              );
            })}

          </div>
        </aside>

        {/* Children (Right side content) */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
