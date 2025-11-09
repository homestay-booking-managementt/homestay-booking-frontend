/* eslint-disable prettier/prettier */

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchHomestays } from "@/api/homestayApi";
import type { Homestay, HomestayFilters } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import FilterForm from "@/components/homestay/FilterForm";
import HomestayList from "@/components/homestay/HomestayList";

interface FilterFormState {
  city: string;
  capacity: string;
  checkIn: string;
  checkOut: string;
}

const defaultFilters: FilterFormState = {
  city: "",
  capacity: "",
  checkIn: "",
  checkOut: "",
};

const HomestayListPage = () => {
  const [filters, setFilters] = useState<FilterFormState>(defaultFilters);
  const [loading, setLoading] = useState(false);
  const [homestays, setHomestays] = useState<Homestay[]>([]);

  // Chuẩn hóa filters
  const sanitizedFilters = useMemo(() => {
    const result: HomestayFilters = {};
    if (filters.city.trim()) result.city = filters.city.trim();
    if (filters.capacity && !Number.isNaN(Number(filters.capacity))) {
      result.capacity = Number(filters.capacity);
    }
    if (filters.checkIn) result.checkIn = filters.checkIn;
    if (filters.checkOut) result.checkOut = filters.checkOut;
    return result;
  }, [filters]);

  const loadHomestays = async (query?: HomestayFilters) => {
    setLoading(true);
    try {
      const data = await fetchHomestays(query);
      setHomestays(Array.isArray(data) ? data : []);
    } catch {
      showAlert("Không thể tải danh sách homestay", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadHomestays(sanitizedFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    loadHomestays();
  };

  useEffect(() => {
    loadHomestays();
  }, []);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h1 className="h3 mb-1">Danh sách Homestay</h1>
          <p className="text-muted mb-0">
            Duyệt qua các homestay hiện có trong hệ thống.
          </p>
        </div>
        <Link className="btn btn-primary mt-3 mt-md-0" to="/homestays/new">
          + Thêm Homestay
        </Link>
      </div>

      {/* Bộ lọc */}
      <FilterForm
        filters={filters}
        loading={loading}
        onChange={setFilters}
        onSubmit={handleSubmit}
        onReset={handleReset}
      />

      {/* Danh sách */}
      <HomestayList loading={loading} homestays={homestays} />
    </div>
  );
};

export default HomestayListPage;
