"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";
import { handleSearch } from "@/lib/handleSearch";
import { useAuth } from "@/lib/authContext";
export default function DanuBooking() {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [departDate, setDepartDate] = useState<string>(today);
  const [returnDate, setReturnDate] = useState(today);
  const { user } = useAuth();

  const trips = [
    {
      route: "COX'S BAZAR – RANGPUR",
      price: "BDT 700",
      color: "bg-gradient-to-br from-teal-600 to-teal-700",
    },
    {
      route: "DHAKA – RANGPUR",
      price: "BDT 800",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
    {
      route: "RANGPUR – COMILLA",
      price: "BDT 1200",
      color: "bg-gradient-to-br from-teal-600 to-teal-700",
    },
    {
      route: "COMILLA – RANGPUR",
      price: "BDT 1300",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Frequent Traveler",
      text: "Best bus booking experience ever. The app is so easy to use!",
    },
    {
      name: "Mohammad Khan",
      role: "Business Commuter",
      text: "Reliable, comfortable, and great customer service. Highly recommended!",
    },
    {
      name: "Fatima Hassan",
      role: "Student",
      text: "Affordable prices and comfortable seats. Will definitely book again!",
    },
  ];

  return (
    <div className="w-full">
      <Toaster richColors position="top-right"></Toaster>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-teal-700 via-teal-600 to-teal-500 py-20 px-4 sm:py-32 text-center text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-balance">
            BOOK YOUR BUS TICKET
          </h1>
          <p className="text-lg sm:text-xl text-teal-50 mb-8">
            Choose Your Destinations And Dates To Reserve A Ticket
          </p>

          {/* <s-aj className="bg-coral-500 hover:bg-coral-600 text-white font-semibold px-8 py-3 rounded transition-colors mb-12">
            Book Now!
          </button> */}

          {/* Search Form */}
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                From
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Departure City"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                To
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Destination City"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                Depart
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                {/* <Calendar className="w-5 h-5 text-teal-600 flex-shrink-0" /> */}
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div>

            {/* <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-600 mb-2 text-left">
                Return date (Optional)
              </label>
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded">
                
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
                />
              </div>
            </div> */}

            <Button
              onClick={handleSearch}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-2 rounded transition-colors whitespace-nowrap"
            >
              Find Tickets
            </Button>
          </div>
        </div>
      </section>

      {/* Enjoy Trips Section */}
      <section className="py-16 px-4 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Enjoy your trips
            </h2>
            <p className="text-gray-600 text-lg">
              Select your trips to travel the places you want to visit
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trips.map((trip, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div
                  className={`${trip.color} h-40 flex items-center justify-center`}
                >
                  <div />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                    {trip.route}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-coral-600 font-bold">
                      Price: {trip.price}
                    </span>
                  </div>
                  <button className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded transition-colors text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Feedback Section */}
      <section className="py-16 px-4 sm:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Customer Feedback
            </h2>
            <p className="text-gray-600 text-lg">
              Read what our customers have to say about our fleet and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-coral-500 text-coral-500"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-teal-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:py-20 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Get More Out of Danu Booking with our Mobile App
          </h2>
          <p className="text-lg text-teal-50 mb-8 max-w-2xl mx-auto">
            Download our mobile app for exclusive deals, real-time updates, and
            seamless booking on the go.
          </p>
          <button className="bg-coral-500 hover:bg-coral-600 text-white font-semibold px-8 py-3 rounded inline-flex items-center gap-2 transition-colors">
            Download App
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
