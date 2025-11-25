import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, AlertCircle, Navigation, Users, DollarSign, Filter, Star } from 'lucide-react';

interface MapViewProps {
    city: string;
    selectedService: string;
    searchName: string;
    priceMax: string;
    priceMin: string;
}

interface VendorProfile {
    id: number;
    full_name: string;
    phone_number: string;
}

interface Address {
    city?: string;
    latitude: string;
    longitude: string;
    address?: string;
}

export interface SubService {
    id: number;
    service_name: string;
    sub_service_name: string;
    description: string;
    price: number;
    price_bargain: string;
    active_status: boolean;
    created_at: string;
    updated_at: string;
    cover_image_url: string;
    vendor_profile: VendorProfile;
    address: Address | null;
}

const MapView: React.FC<MapViewProps> = ({
    city,
    selectedService,
    searchName,
    priceMax,
    priceMin,
}) => {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [services, setServices] = useState<SubService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedServiceItem, setSelectedServiceItem] = useState<SubService | null>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const [leafletLoaded, setLeafletLoaded] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);

    // Get user's current location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setUserLocation({ lat, lng });

                    // Build query params with filters
                    const paramsObj: Record<string, string> = {
                        latitude: lat.toString(),
                        longitude: lng.toString(),
                    };

                    if (city) paramsObj.city = city;
                    if (selectedService) paramsObj.service_name = selectedService;
                    if (searchName) paramsObj.sub_service_name = searchName;
                    if (priceMin) paramsObj.price_min = priceMin;
                    if (priceMax) paramsObj.price_max = priceMax;

                    const params = new URLSearchParams(paramsObj);

                    try {
                        const token = localStorage.getItem("token");
                        const res = await fetch(
                            `http://127.0.0.1:3300/api/v1/services/sub_services?${params.toString()}`,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                        );
                        const data = await res.json();
                        setServices(data.sub_services);
                    } catch (err) {
                        console.error(err);
                        setError("Failed to fetch services.");
                    }

                    setLoading(false);
                },
                () => {
                    setError("Unable to get your location. Using default (Lahore).");
                    setUserLocation({ lat: 31.5204, lng: 74.3587 });
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation not supported.");
            setUserLocation({ lat: 31.5204, lng: 74.3587 });
            setLoading(false);
        }
    }, [city, selectedService, searchName, priceMin, priceMax]);

    // Load Leaflet CSS + JS dynamically
    useEffect(() => {
        if (!document.getElementById("leaflet-css")) {
            const link = document.createElement("link");
            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }
        const script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => setLeafletLoaded(true);
        document.body.appendChild(script);
    }, []);

    // Initialize map and add markers
    useEffect(() => {
        if (!leafletLoaded || !userLocation || !mapRef.current || mapInstanceRef.current) return;

        const L = (window as any).L;
        const map = L.map(mapRef.current).setView([userLocation.lat, userLocation.lng], 14);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // User location marker
        const userIcon = L.divIcon({
            html: `<div style="
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                width: 32px; height: 32px; border-radius: 50%;
                border: 4px solid white;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                animation: pulse 2s infinite;
            "><div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div></div>
            <style>
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
            </style>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup("<div class='p-2'><strong class='text-blue-600'>📍 Your Location</strong></div>");

        // Add markers for fetched services
        services.forEach((service) => {
            if (service.address?.latitude && service.address?.longitude) {
                const lat = parseFloat(service.address.latitude);
                const lng = parseFloat(service.address.longitude);
                
                const serviceIcon = L.divIcon({
                    html: `<div style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
                        border: 3px solid white;
                        transform: rotate(-45deg);
                        display: flex; align-items: center; justify-content: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    "><div style="transform: rotate(45deg); color: white; font-size: 12px;">💼</div></div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 28],
                });

                const marker = L.marker([lat, lng], { icon: serviceIcon })
                    .addTo(map)
                    .bindPopup(`
                        <div class="w-64 p-3">
                            <h3 class="font-bold text-gray-900 mb-2">${service.sub_service_name}</h3>
                            <p class="text-sm text-gray-600 mb-2">${service.service_name}</p>
                            <p class="text-sm text-gray-700 mb-3">${service.address.address || 'Address not available'}</p>
                            <div class="flex justify-between items-center">
                                <span class="text-green-600 font-bold">${service.price_bargain}</span>
                                <button onclick="window.selectService(${service.id})" 
                                    class="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    `);

                marker.on('click', () => {
                    setSelectedServiceItem(service);
                });
            }
        });

        // Add window function for popup buttons
        (window as any).selectService = (serviceId: number) => {
            const service = services.find(s => s.id === serviceId);
            if (service) {
                setSelectedServiceItem(service);
            }
        };

    }, [leafletLoaded, userLocation, services]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR'
        }).format(price);
    };

    const getRandomRating = () => {
        return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <Navigation className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                    Service Map
                                </h1>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" />
                                    {userLocation ? 'Viewing services near you' : 'Locating services...'}
                                </p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="flex items-center gap-2 text-blue-600 bg-white border border-gray-300 px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <Filter size={18} />
                            {showSidebar ? 'Hide List' : 'Show List'}
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex items-center gap-6 mt-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users size={16} className="text-blue-500" />
                            <span>{services.length} Services Found</span>
                        </div>
                        {city && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="text-green-500" />
                                <span>Location: {city}</span>
                            </div>
                        )}
                        {(priceMin || priceMax) && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <DollarSign size={16} className="text-purple-500" />
                                <span>
                                    Price: {priceMin && `From ${priceMin}`} {priceMax && `Up to ${priceMax}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Services Sidebar */}
                    {showSidebar && (
                        <div className="w-80 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="text-blue-500" size={20} />
                                    Available Services ({services.length})
                                </h2>
                                
                                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                                    {services.map((service) => (
                                        <div
                                            key={service.id}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                                                selectedServiceItem?.id === service.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedServiceItem(service)}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                                    {service.sub_service_name}
                                                </h3>
                                                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                                                    <Star size={12} className="text-green-600 fill-green-600" />
                                                    <span className="text-xs font-medium text-green-700">
                                                        {/* {getRandomRating()} */}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <p className="text-xs text-gray-500 mb-2 capitalize">
                                                {service.service_name}
                                            </p>
                                            
                                            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                                {service.description}
                                            </p>
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-green-600 font-bold text-sm">
                                                    {service.price_bargain}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                                                    {service.vendor_profile.full_name}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {services.length === 0 && !loading && (
                                        <div className="text-center py-8">
                                            <AlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
                                            <p className="text-gray-500">No services found matching your criteria.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Map Container */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/60 overflow-hidden">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center h-96">
                                    <div className="relative">
                                        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl rounded-full"></div>
                                    </div>
                                    <p className="text-gray-600 font-medium">Loading your location and services...</p>
                                    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                                </div>
                            ) : error && !userLocation ? (
                                <div className="flex flex-col items-center justify-center h-96 p-8">
                                    <div className="bg-red-100 p-4 rounded-full mb-4">
                                        <AlertCircle className="text-red-500" size={48} />
                                    </div>
                                    <p className="text-gray-900 font-semibold text-lg mb-2">Location Access Required</p>
                                    <p className="text-gray-600 text-center mb-4">{error}</p>
                                    <button 
                                        onClick={() => window.location.reload()}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            ) : (
                                <div ref={mapRef} className="w-full h-[600px] rounded-2xl" />
                            )}
                        </div>

                        {/* Selected Service Details */}
                        {selectedServiceItem && (
                            <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200/60 p-6 animate-in fade-in duration-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                                            {selectedServiceItem.sub_service_name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full capitalize">
                                                {selectedServiceItem.service_name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                                {getRandomRating()} Rating
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedServiceItem(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3">Service Details</h4>
                                        <p className="text-gray-600 mb-4 leading-relaxed">
                                            {selectedServiceItem.description}
                                        </p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <DollarSign size={16} className="text-green-500" />
                                                <span className="text-green-600 font-bold text-lg">
                                                    {selectedServiceItem.price_bargain}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Users size={16} className="text-blue-500" />
                                                <span className="text-gray-700">
                                                    Vendor: {selectedServiceItem.vendor_profile.full_name}
                                                </span>
                                            </div>
                                            {selectedServiceItem.address?.address && (
                                                <div className="flex items-start gap-3">
                                                    <MapPin size={16} className="text-red-500 mt-0.5" />
                                                    <span className="text-gray-700">
                                                        {selectedServiceItem.address.address}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Contact Vendor</h4>
                                        <div className="">
                                            <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors duration-200">
                                                Call Vendor
                                            </button>
                                            {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200">
                                                Send Message
                                            </button> */}
                                            {/* <button className="w-full border border-green-500 text-green-600 py-3 rounded-xl font-medium hover:bg-green-50 transition-colors duration-200">
                                                Book Service
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;