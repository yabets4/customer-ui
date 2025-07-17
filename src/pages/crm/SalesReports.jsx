import React, { useState, useEffect } from "react";
import {
  Bar,
  Line,
  Doughnut,
  Pie,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
// Import icons from lucide-react (make sure you have it installed: npm install lucide-react)
import {
  Filter,
  Users,
  TrendingUp,
  ReceiptText,
  DollarSign,
  Package,
  PiggyBank,
  AreaChart,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SalesReports = () => {
  // Filters UI state (for demo only, no logic)
  const [selectedDateRange, setSelectedDateRange] = useState("last6months");
  const [selectedSalesperson, setSelectedSalesperson] = useState("All");

  // Mock data setup
  const mockData = {
    pipelineStages: [
      "New",
      "Qualified",
      "Quoted",
      "Negotiation",
      "Closed-Won",
      "Closed-Lost",
    ],
    salesReps: ["Alice", "Bob", "Charlie"],
    regions: ["Addis Ababa", "Bahir Dar", "Mekelle"],
    productCategories: ["Furniture", "Electronics", "Clothing"],
    revenueByMonth: {
      months: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      revenue: [25000, 31000, 28000, 35000, 38000, 40000],
    },
  };

  // Sales Pipeline mock data (value in ETB) by rep and stage
  const pipelineData = {
    Alice: [12000, 9000, 7000, 5000, 15000, 3000],
    Bob: [8000, 11000, 4000, 6000, 12000, 6000],
    Charlie: [7000, 10000, 5000, 7000, 13000, 4000],
  };

  // Sales Performance mock revenue by rep and region
  const salesPerformance = {
    reps: mockData.salesReps,
    regions: mockData.regions,
    revenue: {
      Addis_Ababa: [12000, 9000, 14000],
      Bahir_Dar: [8000, 7000, 6000],
      Mekelle: [5000, 8000, 9000],
    },
  };

  // Quotation Conversion Rate mock
  const quotesSent = 200;
  const quotesAccepted = 140;
  const quotesExpired = 30;
  const quotesRejected = 30;

  // Customer Lifetime Value mock data
  const clvData = {
    customers: ["Cust A", "Cust B", "Cust C", "Cust D", "Cust E"],
    avgOrderValue: [5000, 7000, 6000, 5500, 7200],
    frequency: [4, 6, 5, 3, 7],
  };

  // Product Sales Analytics - best sellers by revenue
  const productSales = {
    products: [
      "Office Chair",
      "LED Monitor",
      "Gaming Desk",
      "Bluetooth Headphones",
      "Ergonomic Keyboard",
    ],
    revenue: [42000, 38000, 35000, 28000, 25000],
  };

  // Revenue Segmentation by Source
  const revenueSources = {
    sources: ["Walk-in", "Website", "Social Media", "Referral"],
    values: [38000, 42000, 15000, 8000],
  };

  // Monthly growth % for Forecasting
  const monthlyGrowthPercent = [5, 8, -3, 10, 9, 5];

  // Helper: prepare datasets for pipeline stacked bar chart
  const pipelineDatasets = mockData.salesReps.map((rep, i) => ({
    label: rep,
    data: pipelineData[rep],
    backgroundColor: `hsl(${i * 120 + 20}, 70%, 60%)`, // Adjusted hue for variety
    borderColor: `hsl(${i * 120 + 20}, 70%, 50%)`,
    borderWidth: 1,
  }));

  // Sales Performance grouped bar data by region
  const salesPerformanceDatasets = mockData.regions.map((region, i) => ({
    label: region,
    data: salesPerformance.revenue[region.replace(" ", "_")],
    backgroundColor: `hsl(${i * 90 + 50}, 60%, 55%)`, // Adjusted hue for variety
    borderColor: `hsl(${i * 90 + 50}, 60%, 45%)`,
    borderWidth: 1,
  }));

  // Common Chart Options for performance and consistency
  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Essential for controlling height with parent div
    animation: false, // Disable animations for performance
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: '#6b7280', // Tailwind gray-500
        },
      },
      tooltip: {
        callbacks: {
          // Add custom currency formatting for tooltips
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined && context.parsed.y !== null) {
              // Check if it's a currency value or percentage
              if (context.dataset.yAxisID === 'y1' && context.dataset.label.includes('%')) {
                label += context.parsed.y.toLocaleString() + '%';
              } else if (context.dataset.yAxisID === 'y' || context.dataset.label.includes('Revenue') || context.dataset.label.includes('Value')) {
                 label += context.parsed.y.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
              } else {
                 label += context.parsed.y.toLocaleString();
              }
            } else if (context.parsed.x !== undefined && context.parsed.x !== null) { // For horizontal bars
                 label += context.parsed.x.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
            } else if (context.parsed) { // For Doughnut/Pie charts
                 label += context.parsed.toLocaleString();
            }
            return label;
          }
        }
      }
    },
    // Common scales for grid line color and text color
    scales: {
      x: {
        ticks: { color: '#6b7280' },
        grid: { color: 'rgba(229, 231, 235, 0.2)' } // Light gray for grid lines
      },
      y: {
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return value.toLocaleString('en-ET', { style: 'currency', currency: 'ETB', maximumFractionDigits: 0 });
          }
        },
        grid: { color: 'rgba(229, 231, 235, 0.2)' }
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8 flex items-center gap-3">
        <TrendingUp className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
        Sales Analytics Dashboard
      </h1>

      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8 flex flex-wrap items-center gap-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Filter className="w-6 h-6 text-blue-500" />
          Filters:
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
            <label className="flex flex-col text-gray-700 dark:text-gray-300 flex-1">
                Date Range
                <select
                    className="mt-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                >
                    <option value="last6months">Last 6 Months</option>
                    <option value="lastyear">Last Year</option>
                    <option value="thisyear">This Year</option>
                    <option value="custom">Custom Range</option>
                </select>
            </label>

            <label className="flex flex-col text-gray-700 dark:text-gray-300 flex-1">
                Salesperson
                <select
                    className="mt-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500"
                    value={selectedSalesperson}
                    onChange={(e) => setSelectedSalesperson(e.target.value)}
                >
                    <option>All</option>
                    {mockData.salesReps.map((rep) => (
                        <option key={rep} value={rep}>
                            {rep}
                        </option>
                    ))}
                </select>
            </label>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

        {/* 1. Sales Pipeline Report */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Users className="w-7 h-7 text-purple-600" />
            Sales Pipeline Report
          </h2>
          {/* Added a fixed height to the chart container */}
          <div className="h-80 md:h-96">
            <Bar
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Deal Value by Sales Rep and Stage (ETB)",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151', // Tailwind gray-700
                  },
                },
                scales: {
                  x: { ...commonChartOptions.scales.x, stacked: true },
                  y: { ...commonChartOptions.scales.y, stacked: true, title: { display: true, text: "Value (ETB)", color: '#6b7280' } },
                },
              }}
              data={{
                labels: mockData.pipelineStages,
                datasets: pipelineDatasets,
              }}
            />
          </div>
        </section>

        {/* 2. Sales Performance Report */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-600" />
            Sales Performance Report
          </h2>
          <div className="h-80">
            <Bar
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Revenue by Sales Rep and Region (ETB)",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                },
                scales: {
                  x: { ...commonChartOptions.scales.x, stacked: false },
                  y: { ...commonChartOptions.scales.y, beginAtZero: true, title: { display: true, text: "Revenue (ETB)", color: '#6b7280' } },
                },
              }}
              data={{
                labels: salesPerformance.reps,
                datasets: salesPerformanceDatasets,
              }}
            />
          </div>
        </section>

        {/* 3. Quotation Conversion Rate */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <ReceiptText className="w-7 h-7 text-blue-600" />
            Quotation Conversion
          </h2>
          <div className="h-80 flex items-center justify-center"> {/* Centering for Doughnut/Pie */}
            <Doughnut
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: `Quotes Sent: ${quotesSent.toLocaleString()}, Accepted: ${quotesAccepted.toLocaleString()}`,
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              if (context.raw !== null) {
                                  label += context.raw.toLocaleString() + ' quotes';
                              }
                              return label;
                          }
                      }
                  }
                },
                scales: {}, // No scales for Doughnut/Pie
              }}
              data={{
                labels: [
                  "Accepted",
                  "Expired",
                  "Rejected",
                  "Pending",
                ],
                datasets: [
                  {
                    label: "Quotes",
                    data: [
                      quotesAccepted,
                      quotesExpired,
                      quotesRejected,
                      quotesSent - quotesAccepted - quotesExpired - quotesRejected,
                    ],
                    backgroundColor: [
                      "rgba(34,197,94,0.8)", // green accepted
                      "rgba(251,191,36,0.8)", // yellow expired
                      "rgba(239,68,68,0.8)", // red rejected
                      "rgba(96,165,250,0.8)", // blue pending (changed for consistency)
                    ],
                    borderColor: [
                      "rgba(34,197,94,1)",
                      "rgba(251,191,36,1)",
                      "rgba(239,68,68,1)",
                      "rgba(96,165,250,1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </section>

        {/* 4. Customer Lifetime Value */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <PiggyBank className="w-7 h-7 text-teal-600" />
            Customer Lifetime Value (CLV)
          </h2>
          <div className="h-80 md:h-96">
            <Line
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Avg Order Value & Purchase Frequency",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                },
                scales: {
                  x: commonChartOptions.scales.x,
                  y: {
                    ...commonChartOptions.scales.y,
                    beginAtZero: true,
                    title: { display: true, text: "Avg Order Value (ETB)", color: '#6b7280' },
                  },
                  y1: {
                    position: "right",
                    beginAtZero: true,
                    grid: { drawOnChartArea: false, color: 'rgba(229, 231, 235, 0.2)' },
                    title: { display: true, text: "Purchase Frequency", color: '#6b7280' },
                    ticks: { color: '#6b7280' },
                  },
                },
              }}
              data={{
                labels: clvData.customers,
                datasets: [
                  {
                    label: "Avg Order Value (ETB)",
                    data: clvData.avgOrderValue,
                    borderColor: "rgba(59, 130, 246, 1)", // Blue
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    yAxisID: "y",
                    tension: 0.3,
                    fill: true,
                  },
                  {
                    label: "Purchase Frequency",
                    data: clvData.frequency,
                    borderColor: "rgba(16, 185, 129, 1)", // Green
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    yAxisID: "y1",
                    tension: 0.3,
                    fill: false,
                  },
                ],
              }}
            />
          </div>
        </section>

        {/* 5. Product-Level Sales Analytics */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Package className="w-7 h-7 text-orange-600" />
            Product Sales Analytics
          </h2>
          <div className="h-80 md:h-96"> {/* Increased height for horizontal bar */}
            <Bar
              options={{
                ...commonChartOptions,
                indexAxis: "y", // Keep it horizontal
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Best Sellers by Revenue (ETB)",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                },
                scales: {
                  x: {
                    ...commonChartOptions.scales.y, // Use y-axis settings for x-axis since it's horizontal
                    title: { display: true, text: "Revenue (ETB)", color: '#6b7280' },
                  },
                  y: commonChartOptions.scales.x, // Use x-axis settings for y-axis since it's horizontal
                },
              }}
              data={{
                labels: productSales.products,
                datasets: [
                  {
                    label: "Revenue",
                    data: productSales.revenue,
                    backgroundColor: "rgba(251, 191, 36, 0.8)", // Yellow-orange
                    borderColor: "rgba(251, 191, 36, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </section>

        {/* 6. Revenue Segmentation */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <AreaChart className="w-7 h-7 text-red-600" />
            Revenue Segmentation
          </h2>
          <div className="h-80 flex items-center justify-center"> {/* Centering for Doughnut/Pie */}
            <Pie
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Revenue by Source",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                  tooltip: {
                      callbacks: {
                          label: function(context) {
                              let label = context.label || '';
                              if (label) {
                                  label += ': ';
                              }
                              if (context.raw !== null) {
                                  label += context.raw.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
                              }
                              return label;
                          }
                      }
                  }
                },
                scales: {}, // No scales for Doughnut/Pie
              }}
              data={{
                labels: revenueSources.sources,
                datasets: [
                  {
                    data: revenueSources.values,
                    backgroundColor: [
                      "rgba(59, 130, 246, 0.8)", // Blue
                      "rgba(16, 185, 129, 0.8)", // Green
                      "rgba(234, 179, 8, 0.8)", // Yellow
                      "rgba(239, 68, 68, 0.8)", // Red
                    ],
                    borderColor: [
                      "rgba(59, 130, 246, 1)",
                      "rgba(16, 185, 129, 1)",
                      "rgba(234, 179, 8, 1)",
                      "rgba(239, 68, 68, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </section>

        {/* 7. Forecasting & Trend Reports */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 lg:col-span-full"> {/* Make it full width on large screens */}
          <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-indigo-600" />
            Forecasting & Trend Reports
          </h2>
          <div className="h-80 md:h-96">
            <Line
              options={{
                ...commonChartOptions,
                plugins: {
                  ...commonChartOptions.plugins,
                  title: {
                    display: true,
                    text: "Revenue Trend & Monthly Growth %",
                    font: { size: 18, weight: 'bold' },
                    color: '#374151',
                  },
                },
                scales: {
                  x: commonChartOptions.scales.x,
                  y: {
                    ...commonChartOptions.scales.y,
                    beginAtZero: true,
                    title: { display: true, text: "Revenue (ETB)", color: '#6b7280' },
                  },
                  y1: {
                    position: "right",
                    grid: { drawOnChartArea: false, color: 'rgba(229, 231, 235, 0.2)' },
                    title: { display: true, text: "Growth (%)", color: '#6b7280' },
                    ticks: {
                      color: '#6b7280',
                      callback: function(value) {
                        return value + '%';
                      }
                    },
                  },
                },
              }}
              data={{
                labels: mockData.revenueByMonth.months,
                datasets: [
                  {
                    label: "Revenue",
                    data: mockData.revenueByMonth.revenue,
                    borderColor: "rgba(59, 130, 246, 1)", // Blue
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    yAxisID: "y",
                    fill: true,
                    tension: 0.3,
                  },
                  {
                    label: "Monthly Growth %",
                    data: monthlyGrowthPercent,
                    borderColor: "rgba(234, 179, 8, 1)", // Yellow
                    backgroundColor: "rgba(234, 179, 8, 0.2)",
                    yAxisID: "y1",
                    fill: false,
                    type: "line",
                    tension: 0.3,
                    pointStyle: "circle", // Changed point style
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(234, 179, 8, 1)",
                    pointBorderColor: "#fff",
                    pointHoverRadius: 7,
                  },
                ],
              }}
            />
          </div>
        </section>

      </div>
    </div>
  );
};

export default SalesReports;