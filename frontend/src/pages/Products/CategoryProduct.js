import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilter,
  faFilterCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../../helpers/productCategory";
import VerticalCard from "../../components/Products/VerticalCard";
import SummaryApi from "../../common";

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allbrands, setAllbrands] = useState([]);

  const [sortOption, setSortOption] = useState("asc");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchFilteredProducts = useCallback(async (category, brand) => {
    setLoading(true);

    const response = await fetch(SummaryApi.filterProduct.url, {
      method: SummaryApi.filterProduct.method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        category: category ? [category] : [],
        brand: brand || "",
      }),
    });

    const result = await response.json();
    setData(result.data || []);
    setAllbrands(result.brand || "");
    setLoading(false);
  }, []);

  const handleSingleFilterChange = (type, value) => {
    let category = selectedCategory;
    let brand = selectedBrand;

    if (type === "category") {
      category = value;
      setSelectedCategory(value);
    } else if (type === "brand") {
      brand = value;
      console.log(value);

      setSelectedBrand(value);
    }

    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (brand) params.set("brand", brand);

    navigate(`/product-category?${params.toString()}`);
    fetchFilteredProducts(category, brand);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedData = [...data].sort((a, b) => {
    const priceA = a?.sellingPrice || 0;
    const priceB = b?.sellingPrice || 0;
    return sortOption === "asc" ? priceA - priceB : priceB - priceA;
  });

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const categoryFromUrl = search.get("category") || "";
    const brandFromUrl = search.get("brand") || "";
  
    setSelectedCategory(categoryFromUrl);
    setSelectedBrand(brandFromUrl);
  
    fetchFilteredProducts(categoryFromUrl, brandFromUrl);
  }, [fetchFilteredProducts, location.search]);
  

  return (
    <div className="container mx-auto p-4 flex relative">
      {/* Filter Toggle */}
      <button
        className="px-4 py-2 h-10 text-black border border-gray-300 shadow-md rounded-md mb-4 flex items-center gap-2 hover:shadow-lg transition-all"
        onClick={() => setShowFilters(true)}
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>Filters</span>
      </button>

      {/* Sidebar Filter */}
      <div
        className={`fixed top-20 left-0 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out transform 
        ${
          showFilters ? "translate-x-0 w-72 gap-3" : "-translate-x-full w-0"
        } overflow-y-auto`}
      >
        <div className="p-4">
          <button
            className="px-4 py-2 bg-red-500 w-full text-white rounded-md"
            onClick={() => setShowFilters(false)}
          >
            <FontAwesomeIcon icon={faFilterCircleXmark} />
            <span className="ml-2">Close</span>
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Sort */}
          <div>
            <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300">
              Sort by
            </h3>
            <form className="text-sm flex flex-col gap-2 py-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sort"
                  value="asc"
                  checked={sortOption === "asc"}
                  onChange={handleSortChange}
                />
                Price: Low to High
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sort"
                  value="dsc"
                  checked={sortOption === "dsc"}
                  onChange={handleSortChange}
                />
                Price: High to Low
              </label>
            </form>
          </div>

          {/* Category Filter */}
          <div className="mt-4 relative">
            <div className="mt-2 border rounded-md px-3 py-2 w-full text-sm cursor-pointer relative">
              <details>
                <summary className="list-none">
                  <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1">
                    Category
                  </h3>
                </summary>
                <div className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto">
                  {productCategory.map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="category"
                        value={value}
                        checked={selectedCategory === value}
                        onChange={() =>
                          handleSingleFilterChange("category", value)
                        }
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </details>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mt-4 relative">
            <div className="mt-2 border rounded-md px-3 py-2 w-full text-sm cursor-pointer relative">
              <details>
                <summary className="list-none">
                  <h3 className="text-base uppercase font-medium text-slate-500 border-b pb-1">
                    Brands
                  </h3>
                </summary>

                <fieldset className="flex flex-col gap-2 mt-2 max-h-40 overflow-y-auto">
                  <legend className="sr-only">Select a Brand</legend>

                  {Array.isArray(allbrands) &&
                    allbrands.map((brand) => {
                      const cleanBrand = brand.trim();
                      return (
                        <label
                          key={cleanBrand}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="brand"
                            value={cleanBrand}
                            checked={selectedBrand === cleanBrand}
                            onChange={() =>
                              handleSingleFilterChange("brand", cleanBrand)
                            }
                          />
                          {cleanBrand}
                        </label>
                      );
                    })}

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={!selectedBrand || selectedBrand === ""}
                      onChange={() => handleSingleFilterChange("brand", "")}
                    />
                    None
                  </label>
                </fieldset>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="flex-1 px-4">
        <p className="font-medium text-slate-800 text-lg my-2">
          Search Results: {data.length}
        </p>
        <div className="min-h-[calc(100vh-120px)] overflow-y-scroll scrollbar-none max-h-[calc(100vh-120px)]">
          {sortedData.length !== 0 && !loading ? (
            <VerticalCard data={sortedData} loading={loading} />
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
