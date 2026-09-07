"use client";

import React, { useState, useMemo } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiShoppingBag,
  FiPieChart,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

const DashboardCharts = ({ stats }) => {
  const [metricType, setMetricType] = useState("revenue"); // "revenue" | "orders"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate last 6 months list aligned with real-time calendar
  const timelineData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      const short = monthNames[d.getMonth()];
      months.push({ label, short, sales: 0, orders: 0 });
    }

    // Overlay backend stats if present
    const backendData = stats?.salesChartData || [];
    backendData.forEach((item) => {
      const match = months.find((m) => m.label.toLowerCase() === (item.month || "").toLowerCase());
      if (match) {
        match.sales = Number(item.sales) || 0;
        match.orders = Number(item.orders) || 0;
      }
    });

    // If all sales are 0 (e.g. brand new db with only seed order), add current totalSales to latest month for realistic visualization
    const totalRecorded = months.reduce((acc, curr) => acc + curr.sales, 0);
    if (totalRecorded === 0 && (stats?.totalSales || stats?.totalOrders)) {
      const lastMonth = months[months.length - 1];
      lastMonth.sales = Number(stats.totalSales) || 0;
      lastMonth.orders = Number(stats.totalOrders) || 0;
    }

    return months;
  }, [stats]);

  // Calculations for graph scaling
  const maxValue = useMemo(() => {
    const values = timelineData.map((d) => (metricType === "revenue" ? d.sales : d.orders));
    const highest = Math.max(...values, metricType === "revenue" ? 50 : 5);
    // Add 15% headroom
    return Math.ceil(highest * 1.15);
  }, [timelineData, metricType]);

  // SVG Area Line points calculation
  const svgWidth = 560;
  const svgHeight = 220;
  const paddingX = 45;
  const paddingBottom = 30;
  const paddingTop = 20;
  const innerWidth = svgWidth - paddingX * 2;
  const innerHeight = svgHeight - paddingBottom - paddingTop;

  const points = useMemo(() => {
    return timelineData.map((d, idx) => {
      const x = paddingX + (idx / (timelineData.length - 1)) * innerWidth;
      const val = metricType === "revenue" ? d.sales : d.orders;
      const y = paddingTop + innerHeight - (val / (maxValue || 1)) * innerHeight;
      return { x, y, data: d, val };
    });
  }, [timelineData, metricType, maxValue, innerWidth, innerHeight]);

  // Smooth bezier curve generator
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpX = (curr.x + next.x) / 2;
      path += ` C ${cpX} ${curr.y}, ${cpX} ${next.y}, ${next.x} ${next.y}`;
    }
    return path;
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const bottomY = paddingTop + innerHeight;
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [linePath, points, innerHeight]);

  // Order Fulfillment Stats for Donut Chart
  const totalOrders = stats?.totalOrders || 0;
  const delivered = stats?.deliveredOrders || 0;
  const pending = stats?.pendingOrders || 0;
  const cancelled = stats?.cancelledOrders || 0;
  const otherOrders = Math.max(0, totalOrders - (delivered + pending + cancelled));

  const donutTotal = Math.max(totalOrders, 1);
  const deliveredPct = Math.round((delivered / donutTotal) * 100);
  const pendingPct = Math.round((pending / donutTotal) * 100);
  const cancelledPct = Math.round((cancelled / donutTotal) * 100);

  // SVG Donut calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const deliveredStroke = (delivered / donutTotal) * circumference;
  const pendingStroke = (pending / donutTotal) * circumference;
  const cancelledStroke = (cancelled / donutTotal) * circumference;

  const aov = stats?.totalSales && stats?.totalOrders
    ? (stats.totalSales / stats.totalOrders).toFixed(2)
    : "0.00";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Main Sales & Revenue Line/Bar Graph (2 Columns) */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-skin-sand/35 shadow-sm p-6 space-y-5">
        {/* Graph Header & Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-skin-terracotta/10 text-skin-terracotta">
                <FiTrendingUp size={16} />
              </span>
              <h3 className="text-lg font-serif font-semibold text-skin-charcoal">
                Financial Performance Trends
              </h3>
            </div>
            <p className="text-xs text-skin-charcoal/50 mt-0.5">
              Monthly revenue progression and customer acquisition velocity
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 p-1 bg-skin-cream/30 border border-skin-sand/40 rounded-2xl self-start">
            <button
              onClick={() => setMetricType("revenue")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                metricType === "revenue"
                  ? "bg-skin-charcoal text-white shadow-sm"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal"
              }`}
            >
              <FiDollarSign size={13} />
              <span>Revenue</span>
            </button>
            <button
              onClick={() => setMetricType("orders")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                metricType === "orders"
                  ? "bg-skin-charcoal text-white shadow-sm"
                  : "text-skin-charcoal/60 hover:text-skin-charcoal"
              }`}
            >
              <FiShoppingBag size={13} />
              <span>Orders</span>
            </button>
          </div>
        </div>

        {/* Visual Graph Viewport */}
        <div className="relative pt-2">
          {/* Active Hover Floating Tooltip */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute -top-3 z-10 -translate-x-1/2 pointer-events-none transition-all duration-150"
              style={{ left: `${(points[hoveredIndex].x / svgWidth) * 100}%` }}
            >
              <div className="bg-skin-charcoal text-white px-3 py-1.5 rounded-xl shadow-xl border border-white/10 text-[11px] whitespace-nowrap text-center space-y-0.5">
                <p className="font-semibold text-skin-sand/90">
                  {points[hoveredIndex].data.label}
                </p>
                <p className="text-sm font-serif font-bold text-skin-terracotta">
                  {metricType === "revenue"
                    ? `$${points[hoveredIndex].val.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                    : `${points[hoveredIndex].val} Orders`}
                </p>
                {metricType === "revenue" && points[hoveredIndex].data.orders > 0 && (
                  <p className="text-[9px] text-white/60">
                    {points[hoveredIndex].data.orders} orders placed
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SVG Graph Drawing */}
          <div className="w-full aspect-[2.6/1] min-h-[220px]">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-full overflow-visible"
            >
              <defs>
                {/* Terracotta Gradient Fill */}
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C4704F" stopOpacity="0.32" />
                  <stop offset="70%" stopColor="#C4704F" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#C4704F" stopOpacity="0" />
                </linearGradient>

                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#A85737" />
                  <stop offset="50%" stopColor="#C4704F" />
                  <stop offset="100%" stopColor="#E08A68" />
                </linearGradient>

                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#C4704F" floodOpacity="0.25" />
                </filter>
              </defs>

              {/* Background Horizontal Gridlines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                const y = paddingTop + innerHeight * (1 - ratio);
                const labelVal = Math.round(maxValue * ratio);
                return (
                  <g key={i}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#23201E"
                      strokeOpacity="0.06"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 3.5}
                      textAnchor="end"
                      className="text-[9px] fill-skin-charcoal/40 font-mono select-none"
                    >
                      {metricType === "revenue" ? `$${labelVal}` : labelVal}
                    </text>
                  </g>
                );
              })}

              {/* Area Gradient Background */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* Main Trend Line */}
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />

              {/* Interactive Columns & Points */}
              {points.map((pt, idx) => {
                const isHovered = hoveredIndex === idx;
                const bottomY = paddingTop + innerHeight;
                const barWidth = 14;

                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Background Bar */}
                    <rect
                      x={pt.x - barWidth / 2}
                      y={pt.y}
                      width={barWidth}
                      height={Math.max(0, bottomY - pt.y)}
                      rx={5}
                      className={`transition-all duration-200 ${
                        isHovered
                          ? "fill-skin-terracotta/40"
                          : "fill-skin-sand/30 hover:fill-skin-terracotta/20"
                      }`}
                    />

                    {/* Outer Glow Ring on Hover */}
                    {isHovered && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="9"
                        className="fill-skin-terracotta/20 animate-pulse"
                      />
                    )}

                    {/* Point Circle */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? "5.5" : "4"}
                      className={`transition-all duration-200 ${
                        isHovered
                          ? "fill-skin-terracotta stroke-white stroke-[2]"
                          : "fill-white stroke-skin-terracotta stroke-[2.5]"
                      }`}
                    />

                    {/* X-Axis Month Label */}
                    <text
                      x={pt.x}
                      y={bottomY + 18}
                      textAnchor="middle"
                      className={`text-[10px] font-semibold transition-colors select-none ${
                        isHovered
                          ? "fill-skin-terracotta font-bold"
                          : "fill-skin-charcoal/50"
                      }`}
                    >
                      {pt.data.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Quick Highlights Footer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-skin-sand/30 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-skin-charcoal/40 tracking-wider">
              Avg. Order Value
            </span>
            <p className="font-serif font-bold text-skin-charcoal mt-0.5">${aov}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-skin-charcoal/40 tracking-wider">
              Top Month Velocity
            </span>
            <p className="font-serif font-bold text-skin-charcoal mt-0.5">
              {metricType === "revenue"
                ? `$${Math.max(...timelineData.map((d) => d.sales)).toFixed(2)}`
                : `${Math.max(...timelineData.map((d) => d.orders))} Orders`}
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-skin-charcoal/40 tracking-wider">
              Tracked Span
            </span>
            <p className="font-medium text-skin-charcoal/70 mt-0.5">6-Month Continuous</p>
          </div>
        </div>
      </div>

      {/* 2. Order Fulfillment Status Donut Graph (1 Column) */}
      <div className="bg-white rounded-3xl border border-skin-sand/35 shadow-sm p-6 flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <FiPieChart size={16} />
            </span>
            <h3 className="text-lg font-serif font-semibold text-skin-charcoal">
              Order Fulfillment
            </h3>
          </div>
          <p className="text-xs text-skin-charcoal/50 mt-0.5">
            Real-time delivery status distribution
          </p>
        </div>

        {/* Donut Visualization */}
        <div className="relative flex items-center justify-center py-2">
          <svg width="150" height="150" viewBox="0 0 150 150" className="transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="transparent"
              stroke="#F5EBE6"
              strokeWidth="14"
            />

            {/* Delivered (Emerald) */}
            {deliveredStroke > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="transparent"
                stroke="#10B981"
                strokeWidth="14"
                strokeDasharray={`${deliveredStroke} ${circumference}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            )}

            {/* Pending (Amber) */}
            {pendingStroke > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="transparent"
                stroke="#F59E0B"
                strokeWidth="14"
                strokeDasharray={`${pendingStroke} ${circumference}`}
                strokeDashoffset={-deliveredStroke}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            )}

            {/* Cancelled (Rose) */}
            {cancelledStroke > 0 && (
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="transparent"
                stroke="#F43F5E"
                strokeWidth="14"
                strokeDasharray={`${cancelledStroke} ${circumference}`}
                strokeDashoffset={-(deliveredStroke + pendingStroke)}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            )}
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-serif font-bold text-skin-charcoal">
              {totalOrders}
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-skin-charcoal/50">
              Orders
            </span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="font-semibold text-emerald-900">Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-emerald-800 font-bold">{delivered}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-200/60 text-emerald-800 font-bold">
                {deliveredPct}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="font-semibold text-amber-900">Pending / Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-amber-800 font-bold">{pending}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-200/60 text-amber-800 font-bold">
                {pendingPct}%
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="font-semibold text-rose-900">Cancelled</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-rose-800 font-bold">{cancelled}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-200/60 text-rose-800 font-bold">
                {cancelledPct}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
