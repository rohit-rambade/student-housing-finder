import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../slices/listingsSlice";
import Map from "../components/map/Map";

const AllListings = () => {
  const listings = useSelector((state) => state.listings.listings);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    roomType: "",
    minRent: 0,
    maxRent: Infinity,
    amenities: "",
    proximityToCampus: "",
    city: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/users/listings");
        dispatch(setListings(response.data.data));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch]);
  console.log(listings);
  const filteredListings = listings.filter((listing) => {
    const meetsRoomType =
      !filters.roomType || listing.roomType === filters.roomType;
    const meetsRent =
      listing.rent >= filters.minRent && listing.rent <= filters.maxRent;

    const meetsProximity =
      !filters.proximityToCampus ||
      listing.proximityToCampus <= parseInt(filters.proximityToCampus);
    const meetsLocation =
      !filters.city ||
      listing.city.toLowerCase() === filters.city.toLowerCase();
    return meetsRoomType && meetsRent && meetsProximity && meetsLocation;
  });
  return (
    <div className="font-poppins md:flex">
      <div className="w-full">
        <div>
          <Map listings={listings} />
        </div>
        <div className="md:flex p-2 ">
          <div className="text-xl p-5 w-fit flex flex-col gap-y-6 bg-slate-50">
            <div className="flex flex-col w-fit">
              <label htmlFor="roomType">Room Type:</label>
              <select
                id="roomType"
                value={filters.roomType}
                onChange={(e) =>
                  setFilters({ ...filters, roomType: e.target.value })
                }
                className="p-2 "
              >
                <option value="">Any</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Common for 5 to 6 students">
                  Common for 5 to 6 students
                </option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>
            <div className="flex flex-col w-fit">
              <label htmlFor="minRent">Min Rent:</label>
              <input
                className="border p-2 shadow"
                type="number"
                id="minRent"
                value={filters.minRent}
                onChange={(e) =>
                  setFilters({ ...filters, minRent: e.target.valueAsNumber })
                }
              />
            </div>
            <div className="flex flex-col w-fit">
              <label htmlFor="maxRent">Max Rent:</label>
              <input
                className="border p-2"
                type="number"
                id="maxRent"
                value={filters.maxRent}
                onChange={(e) =>
                  setFilters({ ...filters, maxRent: e.target.valueAsNumber })
                }
              />
            </div>

            <div className="flex flex-col w-fit">
              <label htmlFor="proximityToCampus">Proximity to Campus:</label>
              <select
                id="proximityToCampus"
                value={filters.proximityToCampus}
                onChange={(e) =>
                  setFilters({ ...filters, proximityToCampus: e.target.value })
                }
                className="p-2"
              >
                <option value="">Any</option>
                <option value="1">Within 1 mile</option>
                <option value="5">Within 5 miles</option>
                <option value="10">Within 10 miles</option>
              </select>
            </div>
            <div className="flex flex-col w-fit">
              <label htmlFor="location">Location</label>
              <input
                className="border p-2 shadow"
                type="text"
                id="location"
                placeholder="Search City"
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-row flex-wrap justify-center">
            {filteredListings?.map((listing) => (
              <div>
                <div className="w-1/2 rounded overflow-hidden shadow-lg hover:shadow-x bg-slate-200">
                  <Link to={`/listing/${listing._id}`} key={listing._id}>
                    <img
                      className="w-full"
                      src={listing.images[0]}
                      alt="Property Image"
                    />
                    <div className="px-6 py-4">
                      <div className="mb-2">
                        <h2 className="text-xl font-bold text-gray-900">
                          {listing.roomType} Room in {listing?.city}
                        </h2>
                      </div>
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <p className="ml-2 text-sm font-medium text-gray-700">
                            {listing.roomDescription.size} sq ft
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-3xl font-extrabold text-blue-800">
                          {listing.rent}Rs. /month
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllListings;
