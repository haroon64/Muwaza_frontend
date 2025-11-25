"use client";
import React from "react";
import Image from "next/image";
import { MapPin,  User,  Users } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl">
          We provide reliable home services to make your life easier. From cleaning
          and plumbing to AC repair and carpentry, our trained professionals are
          here to help you.
        </p>
      </section>

      {/* Company Info */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Who We Are</h2>
        <p className="text-gray-700 text-lg md:text-xl max-w-4xl mx-auto text-center">
          At Home Services Co., we aim to connect homeowners with trusted service
          providers. Our mission is to ensure high-quality, timely, and affordable
          services for everyone. We value trust, transparency, and professionalism.
        </p>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <User className="text-blue-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Plumbing & AC Repair</h3>
            <p className="text-gray-600">
              Expert plumbers and AC technicians to keep your home running smoothly.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <MapPin className="text-purple-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Cleaning Services</h3>
            <p className="text-gray-600">
              Home and office cleaning done by professionals you can trust.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition">
            <Users className="text-green-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">Carpentry & Handyman</h3>
            <p className="text-gray-600">
              Skilled carpenters and handymen for all your repair and furniture needs.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-4">
              <Image
                src="/team1.jpg"
                alt="Team Member 1"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Ali Khan</h3>
            <p className="text-gray-600">Founder & CEO</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-4">
              <Image
                src="/team2.jpg"
                alt="Team Member 2"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Sara Ahmed</h3>
            <p className="text-gray-600">Operations Manager</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="relative w-40 h-40 mb-4">
              <Image
                src="/team3.jpg"
                alt="Team Member 3"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Omar Raza</h3>
            <p className="text-gray-600">Lead Technician</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Need Home Services?</h2>
        <p className="mb-6">Get in touch with us and hire a trusted professional today.</p>
        <a
          href="/contact"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:shadow-lg transition"
        >
          Contact Us
        </a>
      </section>
    </div>
  );
};

export default About;
