// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllOrders } from '../api/orderApi';
import AdminNavbar from './Navbar';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import '../css/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [view, setView] = useState('today'); // 'today' | 'week' | 'month'
  const [error, setError] = useState('');

  // 1) Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Utility: get numeric revenue from an order
  const getOrderRevenue = (order) => {
    if (order.paymentBreakdown && typeof order.paymentBreakdown.total === 'number') {
      return order.paymentBreakdown.total;
    }
    if (Array.isArray(order.products)) {
      return order.products.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : Number(item.price);
        const qty = typeof item.quantity === 'number' ? item.quantity : Number(item.quantity);
        return sum + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
      }, 0);
    }
    return 0;
  };

  // 2) Fetch all orders on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('token');
    if (!adminToken) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        setLoading(true);
        const data = await fetchAllOrders(adminToken);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Unable to fetch orders');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [navigate]);

  // 3) Aggregate into chartData whenever orders or view changes
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setChartData([]);
      return;
    }

    const formatHour = (date) => {
      const h = date.getHours();
      return `${h.toString().padStart(2, '0')}:00`;
    };

    const formatDay = (date) => {
      const d = date.getDate().toString().padStart(2, '0');
      const m = date.toLocaleString('default', { month: 'short' });
      return `${d} ${m}`;
    };

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = now.getMonth();
    const todayDate = now.getDate();

    if (view === 'today') {
      const hours = Array.from({ length: 24 }, (_, i) => ({
        hourLabel: `${i.toString().padStart(2, '0')}:00`,
        revenue: 0,
      }));

      orders.forEach((order) => {
        const dateVal = order.createdAt;
        if (!dateVal) return;
        const oDate = new Date(dateVal);
        if (
          oDate.getFullYear() === todayYear &&
          oDate.getMonth() === todayMonth &&
          oDate.getDate() === todayDate
        ) {
          const idx = oDate.getHours();
          hours[idx].revenue += getOrderRevenue(order);
        }
      });

      setChartData(hours);
    }

    if (view === 'week') {
      const weekArray = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        weekArray.push({
          dayLabel: formatDay(d),
          revenue: 0,
          dateKey: d.toDateString(),
        });
      }

      orders.forEach((order) => {
        const dateVal = order.createdAt;
        if (!dateVal) return;
        const oDate = new Date(dateVal);
        const oKey = oDate.toDateString();
        const idx = weekArray.findIndex((day) => day.dateKey === oKey);
        if (idx !== -1) {
          weekArray[idx].revenue += getOrderRevenue(order);
        }
      });

      setChartData(weekArray.map(({ dayLabel, revenue }) => ({ dayLabel, revenue })));
    }

    if (view === 'month') {
      const monthArray = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        monthArray.push({
          dayLabel: formatDay(d),
          revenue: 0,
          dateKey: d.toDateString(),
        });
      }

      orders.forEach((order) => {
        const dateVal = order.createdAt;
        if (!dateVal) return;
        const oDate = new Date(dateVal);
        const oKey = oDate.toDateString();
        const idx = monthArray.findIndex((day) => day.dateKey === oKey);
        if (idx !== -1) {
          monthArray[idx].revenue += getOrderRevenue(order);
        }
      });

      setChartData(monthArray.map(({ dayLabel, revenue }) => ({ dayLabel, revenue })));
    }
  }, [orders, view]);

  // 4) Handler to switch views
  const handleViewChange = (newView) => {
    setView(newView);
  };

  return (
    <>
      <AdminNavbar onLogout={logout} />

      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>

        {error && <div className="dashboard-error">{error}</div>}

        {loading ? (
          <div className="dashboard-loading">Loading orders…</div>
        ) : (
          <div className="chart-card-dark">
            {/* Toggle Buttons */}
            <div className="chart-controls">
              <button
                className={`chart-button-dark ${view === 'today' ? 'active-dark' : ''}`}
                onClick={() => handleViewChange('today')}
              >
                Today
              </button>
              <button
                className={`chart-button-dark ${view === 'week' ? 'active-dark' : ''}`}
                onClick={() => handleViewChange('week')}
              >
                Week
              </button>
              <button
                className={`chart-button-dark ${view === 'month' ? 'active-dark' : ''}`}
                onClick={() => handleViewChange('month')}
              >
                Month
              </button>
            </div>

            {/* Responsive Area Chart with Shaded Region */}
            <div className="chart-container-dark">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 0 }}
                >
                  {/* Define a glowing gradient for stroke & fill */}
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ffea" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#00ffea" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke="#333" strokeDasharray="4 4" />
                  <XAxis
                    dataKey={view === 'today' ? 'hourLabel' : 'dayLabel'}
                    tick={{ fill: '#ccc', fontSize: 12 }}
                    axisLine={{ stroke: '#555' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(value) => `₹${value}`}
                    tick={{ fill: '#ccc', fontSize: 12 }}
                    axisLine={{ stroke: '#555' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#2d2d2d',
                      border: '1px solid #555',
                      borderRadius: '4px',
                      color: '#fff',
                    }}
                    labelStyle={{ color: '#aaa' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                    labelFormatter={(label) =>
                      view === 'today' ? `Hour: ${label}` : `Date: ${label}`
                    }
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    wrapperStyle={{ fontSize: '14px', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Sales Revenue"
                    stroke="url(#colorRevenue)"
                    strokeWidth={3}
                    fill="url(#colorRevenue)"
                    fillOpacity={0.6}
                    activeDot={{ r: 6, fill: '#ff4081' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
