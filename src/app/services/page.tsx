"use client";

import { useState, useEffect } from "react";
import ServiceCard from "@/components/customer/service_card";
import {
  Search,
  MapPin,
  DollarSign,
  Loader2,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import  MapView  from '@/components/service/serviceMapTab';
import { notificationService } from "@/service/NotificationService";

interface ServiceAPI {
  id: number;
  sub_service_name: string;
  description: string;
  price: number;
  price_bargain: string;
  active_status: boolean;
  cover_image_url: string | null;
  service_name: string;
  address: {
    city: string;};
}

interface Service {
  id: number;
  service_name: string;
}


export default function ServicesPage() {
  const searchParams = useSearchParams();

  const [allServices, setAllServices] = useState<ServiceAPI[]>([]);
  const [activeTab, setActiveTab] = useState<"grid" | "map">("grid");
  const [services, setServices] = useState<Service[]>([]);
  const [totalSubService, setTotalSubService] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [priceMin, setPriceMin] = useState("0");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 12;
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://127.0.0.1:3300/api/v1/services/service_icons",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
        
          setServices(data);
        } else if (Array.isArray((data as any).data)) {
          setServices((data as any).data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        // notificationService.notify({ message: error, type:  "error" });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const serviceFromParams = searchParams.get("service_name");
    if (serviceFromParams) {
      setSelectedService(serviceFromParams);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSubServices = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
      });

      if (priceMin) params.append("price_min", priceMin);
      if (priceMax) params.append("price_max", priceMax);
      if (city) params.append("city", city);
      if (searchName.trim()) params.append("sub_service_name", searchName.trim());
      if (selectedService) params.append("service_name", selectedService);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://127.0.0.1:3300/api/v1/services/sub_services?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) {
           notificationService.notify({ message: data.message, type: "error" });
        }

        const servicesData = data.sub_services || [];
        const totalCount = data.total_sub_services || 0;

        console.log("Fetched sub-services data:", servicesData);

        setTotalSubService(totalCount);
        setAllServices(servicesData);
     
        setAddress(servicesData?.aadress?.address);
    
        

        const totalPages = Math.ceil(totalCount / perPage);
        setTotalPages(totalPages > 0 ? totalPages : 1);
      } catch (error) {
        console.error("Error fetching sub-services:", error);
        setAllServices([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSubServices, 500);
    return () => clearTimeout(timeoutId);
  }, [searchName, city, selectedService, priceMin, priceMax, page]);

  const handleResetFilters = () => {
    setSearchName("");
    setCity("");
    setSelectedService("");
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  const paginatedServices = allServices;

  useEffect(() => {
    const total = Math.ceil(totalSubService / perPage);
    setTotalPages(total > 0 ? total : 1);

    if (page > total && total > 0) {
      setPage(1);
    }
  }, [totalSubService, page]);

  useEffect(() => {
    // console.log("All Services:", allServices.address.address);
    // setAddress(address);

  }, [allServices]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find the Best Home Services
          </h1>
          <p className="text-lg md:text-xl text-center opacity-90 mb-8">
            Professional services at your doorstep. Quality guaranteed.
          </p>

          {/* Quick Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services (e.g., Cleaning, AC Repair...)"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setPage(1);
                }}
                className="w-full text-black bg-white pl-12 pr-4 py-4 rounded-2xl text-gray-800 text-lg shadow-lg focus:ring-4 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-white shadow-md rounded-xl p-4 font-semibold text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <SlidersHorizontal /> Filters
                </h2>
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-indigo-600 font-semibold"
                >
                  Reset
                </button>
              </div>

              <hr />

              {/* SERVICE CATEGORY */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                  <Layers className="text-indigo-600" /> Service Category
                </label>

                <select
                  value={selectedService}
                  onChange={(e) => {
                    setSelectedService(e.target.value);
                    setPage(1);
                  }}
                  disabled={loadingServices}
                  className="w-full text-black  p-3 border-2 border-gray-200 rounded-xl"
                >
                  <option value="">All Services</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.service_name}>
                      {service.service_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                  <MapPin className="text-indigo-600" /> Location
                </label>

                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                  className="w-full text-black p-3 border-2 border-gray-200 rounded-xl"
                >
                  <option value="">All Cities</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>

              {/* PRICE RANGE */}
              <div>
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
                  <DollarSign className="text-indigo-600" /> Price Range
                </label>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Min Price (Rs)
                    </label>
                    <input
                      type="number"
                      value={priceMin}
                      onChange={(e) => {
                        setPriceMin(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Min"
                      className="w-full text-black p-3 border-2 border-gray-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">
                      Max Price (Rs)
                    </label>
                    <input
                      type="number"
                      value={priceMax}
                      onChange={(e) => {
                        setPriceMax(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Max"
                      className="w-full text-black p-3 border-2 border-gray-200 rounded-xl"
                    />
                  </div>
                </div>

                {(priceMin || priceMax) && (
                  <div className="mt-3 text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg">
                    Rs {priceMin || "0"} - Rs {priceMax || "∞"}
                  </div>
                )}
              </div>

              {/* FILTER SUMMARY */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">
                    {totalSubService}
                  </span>{" "}
                  services found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Showing {paginatedServices.length} of {totalSubService} total
                  services
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex flex-row mb-6">
              <button
                onClick={() => setActiveTab("grid")}
                className={`px-6 py-2 rounded-xl font-semibold ${
                  activeTab === "grid"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab("map")}
                className={`px-6 py-2 rounded-xl font-semibold ${
                  activeTab === "map"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Map View
              </button>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-gray-600 text-lg">Loading services...</p>
              </div>
            ) : paginatedServices.length === 0 ? (
              /* NO DATA */
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    No services found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            ) : activeTab === "grid" ? (
              <>
                <div   style={{minWidth:"1100px",width:"auto"}}  className=" bg-amber-50 max-h-[1200px] overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
                    {paginatedServices.map((service) => (
                      <div
                        key={service.id}
                       style={{width:"auto"}} 
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                      >
                        <ServiceCard
                          service={{
                            id: service.id,
                            name: service.sub_service_name,
                            image:
                              service.cover_image_url || "/placeholder.png",
                            price: service.price,
                            rating: 4.5,
                            description: service.description,
                            price_bargain: service.price_bargain,
                            city_name: service.address.city,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* PAGINATION */}
                {totalSubService > 0 && (
                  <div className="flex justify-center items-center gap-4 mt-8 bg-white rounded-2xl p-6 shadow-md">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-300"
                    >
                      Previous
                    </button>

                    {/* PAGE NUMBERS */}
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => {
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= page - 1 && pageNum <= page + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-10 h-10 rounded-xl font-semibold ${
                                  page === pageNum
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            pageNum === page - 2 ||
                            pageNum === page + 2
                          ) {
                            return (
                              <span key={pageNum} className="text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        }
                      )}
                    </div>

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <MapView  priceMin={priceMin}
                        priceMax={priceMax}
                        city={city} 
                        searchName={searchName}
                        selectedService={selectedService}
                        
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
