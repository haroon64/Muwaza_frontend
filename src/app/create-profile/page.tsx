"use client";
import React, { useState } from 'react';
import { Heart, Share2, ArrowLeft, Check, Star, MapPin, Phone, Copy, CheckCircle } from 'lucide-react';

const ServiceDetailPage = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const service = {
    id: 4,
    sub_service_name: "washroom fix",
    description: "wadjawdmwa dkawbd kkdwa boa idjhbad",
    price: 1231,
    price_bargain: 0,
    active_status: true,
    created_at: "2025-11-20T14:01:20.943Z",
    updated_at: "2025-11-20T14:01:21.208Z",
    cover_image_url: "http://localhost:3300/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsiZGF0YSI6NDAsInB1ciI6ImJsb2JfaWQifX0=--57efb6e9b8cf8c9cb63caf97ac69436ee1fcfb94/Gemini_Generated_Image_qqm987qqm987qqm9%20(1).png",
    service_name: "Cleaning",
    service_id: 1,
    vendor_profile: {
      id: 1,
      business_name: "Pro Clean Services",
      location: "Johar Town, Lahore",
      phone_number: "+92 300 1234567",
      rating: 4.8,
      total_reviews: 127,
      profile_image_url: null
    }
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(service.vendor_profile.phone_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const images = [service.cover_image_url];
  
  const features = [
    "Professional service guarantee",
    "Quick turnaround time",
    "Quality materials used",
    "Experienced technicians"
  ];

  const reviews = [
    { name: "Ahmed K.", rating: 5, comment: "Excellent service! Very professional.", date: "2 days ago" },
    { name: "Fatima S.", rating: 4, comment: "Good work, would recommend.", date: "1 week ago" },
    { name: "Ali M.", rating: 5, comment: "Fast and efficient service.", date: "2 weeks ago" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      {/* <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsFavorited(!isFavorited)}
              className={`p-2 rounded-full transition-all ${isFavorited ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header> */}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-white shadow-lg aspect-square">
              <img 
                src={images[0]} 
                alt={service.sub_service_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1584622781867-b5c8e4d5c3c6?w=800&q=80';
                }}
              />
              {service.active_status && (
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Available
                </span>
              )}
            </div>

          </div>

          {/* Service Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span>{service.service_name}</span>
                <span>•</span>
                <span>Service ID: #{service.id}</span>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-3 capitalize">
                {service.sub_service_name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-slate-600">4.8 (127 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">Rs {service.price}</span>
                {service.price_bargain > 0 && (
                  <span className="text-xl line-through opacity-75">Rs {service.price_bargain}</span>
                )}
              </div>
              <p className="mt-2 opacity-90">Professional service included</p>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed">{service.description}</p>
            </div>

            {/* Vendor Information */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 shadow-sm border-2 border-indigo-100">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Star size={20} className="text-white" fill="white" />
                </div>
                Service Provider
              </h2>
              
              <div className="space-y-4">
                {/* Provider Name & Rating */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {service.vendor_profile.business_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">
                        {service.vendor_profile.rating} ({service.vendor_profile.total_reviews} reviews)
                      </span>
                    </div>
                  </div>
                  
                  {service.vendor_profile.profile_image_url && (
                    <img 
                      src={service.vendor_profile.profile_image_url} 
                      alt={service.vendor_profile.business_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200"
                    />
                  )}
                </div>

                {/* Location */}
                <div className="flex items-start gap-3 bg-white rounded-xl p-4">
                  <MapPin size={20} className="text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Service Location</p>
                    <p className="text-slate-600">{service.vendor_profile.location}</p>
                  </div>
                </div>

                {/* Phone Number - Clickable to Copy */}
                <button
                  onClick={handleCopyPhone}
                  className="w-full flex items-center justify-between gap-3 bg-white hover:bg-indigo-50 rounded-xl p-4 transition-all border-2 border-transparent hover:border-indigo-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 group-hover:bg-indigo-200 p-2 rounded-lg transition">
                      <Phone size={20} className="text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900 mb-1">Contact Number</p>
                      <p className="text-lg font-bold text-indigo-600">
                        {service.vendor_profile.phone_number}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {copied ? (
                      <>
                        <CheckCircle size={20} className="text-green-600" />
                        <span className="text-sm font-semibold text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={20} className="text-slate-400 group-hover:text-indigo-600 transition" />
                        <span className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition">
                          Click to copy
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">What's Included</h2>
              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-green-100 p-1 rounded-full">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Booking */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-slate-900">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition font-bold"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition transform hover:scale-[1.02] active:scale-[0.98]">
                Book Now - Rs {service.price * quantity}
              </button>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review, idx) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900">{review.name}</span>
                      <span className="text-sm text-slate-500">{review.date}</span>
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage;