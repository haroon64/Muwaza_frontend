"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Header from "@/components/shared/header";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/shared/footer";
import ServiceCard from "@/components/customer/service_card";
import ServiceIcons from "@/components/customer/service_icons"
import { Tag, ChevronLeft, ChevronRight, Star } from "lucide-react";
import axios from "axios";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
}

interface ServiceIcon {
  id: number;
  service_name: string;
  icon_url: string;
}


export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [icons, setIcons] = useState<ServiceIcon[]>([]);

  const services: Service[] = [
        {
        id: 1,
        name: "Home Cleaning",
        image: "/featured_image.png",
        description: "Professional home cleaning service with eco-friendly products.",
        price: 2500,
        rating: 4.5,
        },
        {
        id: 2,
        name: "Electrician Services",
        image: "/featured_image.png",
        description: "Certified electricians available for repairs and installations.",
        price: 1800,
        rating: 4.8,
        },
        {
        id: 3,
        name: "Plumbing Services",
        image: "/featured_image.png",
        description: "Expert plumbers for all your plumbing needs.",
        price: 2200,
        rating: 4.6,
        },
        {
        id: 4,
        name: "Gardening Services",
        image: "/featured_image.png",
        description: "Professional gardening and lawn care services.",
        price: 1500,
        rating: 4.4,
        },
        {
        id: 5,
        name: "AC Repair",
        image: "/featured_image.png",
        description: "AC maintenance and repair services.",
        price: 3000,
        rating: 4.7,
        },
        {
        id: 6,
        name: "Painting Services",
        image: "/featured_image.png",
        description: "Professional painting for homes and offices.",
        price: 4000,
        rating: 4.9,
        },
  ];




  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:3300/api/v1/services/service_icons"
        );
        
        // Extract only required fields
        const formatted = response.data.map((item: any) => ({
          id: item.id,
          service_name: item.service_name,
          icon_url: item.icon_url,
        }));

        setIcons(formatted);
        console.log("Success:", formatted);

      } catch (error) {
        console.error("Error fetching icons:", error);
      }
    };

    fetchServices();
  }, []);



  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setItemsPerView(1);
      else if (width < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = Math.ceil(services.length / itemsPerView);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  // Auto-slide
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused, totalSlides]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) nextSlide();
    else if (diff < -threshold) prevSlide();
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) nextSlide();
    else if (diff < -threshold) prevSlide();
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const getTransform = () => {
    return `translateX(-${currentIndex * (100 / itemsPerView)}%)`;
  };

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < fullStars
                ? "fill-yellow-400 text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "fill-yellow-400 text-yellow-400 opacity-50"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };



  const heroImages = ["/featured_image.png", "/featured_image_2.png"];
  // console.log("token: ",localStorage.getItem("authToken"))
   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 8000); // 10 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">


      {/* Hero Section */}
       <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between px-6 py-16 lg:py-24 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Connecting <span className="text-blue-600">Customers</span> with
            Trusted <span className="text-indigo-600">Service Providers</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Find the right experts for your needs or showcase your skills to
            reach thousands of customers. All in one platform.
          </p>
         
        </motion.div>

       <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9 }}
        className="flex-1 flex justify-center items-center relative w-[500px] h-[400px]"
      >
        <Image
          key={currentIndex} // forces re-render for animation
          src={heroImages[currentIndex]}
          alt="Service Connection"
          fill
          className="object-contain rounded-2xl shadow-lg"
        />
</motion.div>
      </div>
    </section>
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
          Our Services
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-items-center">

          {icons.map((icon) => (
            <div
          key={icon.id}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow hover:shadow-lg transition-all cursor-pointer border border-gray-100"
            >
            

       <ServiceIcons service_icons={icon} />

       </div>
          ))}

        </div>
      </div>
    </section>
    <section className="py-16 bg-gradient-to-br from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12">
          Featured <span className="text-blue-600">Services</span>
        </h2>
        
        <div 
        style={{borderRadius:"20px"}}
          className="relative bg-blue-200 p-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
       
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all hover:scale-110 -ml-4 sm:-ml-6"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 sm:p-3 transition-all hover:scale-110 -mr-4 sm:-mr-6"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Carousel */}
          <div 
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
               
                transform: getTransform(),
                width: `${(services.length / itemsPerView) * 100}%` 
              }}
            >
              {services.map((service) => (
                

             <div
                  key={service.id}
                  className="flex-shrink-0 px-2 sm:px-3"
                   style={{ width: `${50 / itemsPerView}%` }}
                >
            
                <ServiceCard service={service} />
             </div>
             ))}

       </div>
        </div>

          {/* Dot Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "bg-blue-600 w-8 h-3"
                      : "bg-gray-300 hover:bg-gray-400 w-3 h-3"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-gray-800 mb-10">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Professionals",
                desc: "Every service provider is verified to ensure you get top-quality work.",
              },
              {
                title: "Secure Payments",
                desc: "Pay safely through our trusted payment system with full transparency.",
              },
              {
                title: "24/7 Support",
                desc: "Our team is available around the clock to assist you anytime.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 bg-white rounded-2xl shadow-md border"
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
