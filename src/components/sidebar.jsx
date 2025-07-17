import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Gauge,Star, MessageCircle, ClipboardList, CalendarSync,
  ChevronDown, CircleGauge,
  ChevronRight,
  Users, // CRM & HR
  Settings, // Settings
  Box, // Inventory
  BarChart, // Reports
  CreditCard, // Finance
  Menu, // Mobile menu open
  X, // Mobile menu close
  UsersRound,
  Hammer, // Projects & Task Management
  LayoutDashboard, // Added for Dashboard (common in ERPs)
  Sparkles, // Example for "Ads" sub-module
  Store, // Example for "Shop" sub-module
  Calculator, // Example for "Cost Engine"
  FileWarning, // Example for "Alerts"
  UserPlus, // Example for Onboarding/Exit
  TrendingUp, // Example for Performance/Profitability
  PiggyBank, // Loans & Advances
  RefreshCcw, // Reconciliation
  UserRoundPen,
  UserRoundPlus, 
  FileClock,
  FolderSearch, Calendar1, FileStack, Cog, LogOut, FileText, Drill, Wrench,
} from "lucide-react";

// Module configuration with enhanced icons and potentially more granular pathing
const moduleConfig = {
  crm: {
    label: "CRM & Sales",
    icon: Users,
    basePath: "/crm",
    links: [
      {
        label: "Leads",
        children: [
          { path: "/crm/leadlist", label: "Leads List" },
          { path: "/crm/lead/manualform", label: "Capture Lead" }, // Added for completeness
        ],
      },
      {
        label: "Customers",
        children: [
          { path: "/crm/customers", label: "Customers" },
          { path: "/crm/customers/Profile", label: "customer profile", icon:UserRoundPen },
        ],
      },
      // Add more CRM-related links as needed
      {
        label: "Payments",
        children: [
          { path: "/crm/payments", label: "Payement" },
          { path: "/crm/paymententryform", label: "Add Payment" },
        ],
      },
      {
        label: "Quotes",
        children: [
          { path: "/crm/quotes", label: "All Quotes" },
          { path: "/crm/quotes/create", label: "Create Quote" },
        ],
      },
      {
        label: "Sales Orders",
        children: [
          { path: "/crm/createsalesorder", label: "Create Order" },
          { path: "/crm/salesorderlist", label: "Order list" },
          { path: "/crm/salesorderdetail", label: "Order Detail" },
        ],
      },
      { path: "/crm/reports", label: "Sales Reports" },
      {
        label: "Ads & Marketing",
        children: [
          { path: "/crm/metaconnect", label: "Meta Integration", icon: Sparkles }, // Icon for specific link
          { path: "/crm/campaignbuilder", label: "Campaign Builder" },
          { path: "/crm/campaigndashboard", label: "Manage Campaigns" },
          { path: "/crm/metashopmanager", label: "Shop Manager", icon: Store },
        ]
      },
    ],
  },
  inventory: {
    label: "Inventory",
    icon: Box,
    basePath: "/inventory",
    links: [
      { path: "/inventory/raw-materials", label: "Raw Materials" },
      { path: "/inventory/add-material", label: "Add Material" }, // Renamed for clarity
      { path: "/inventory/movements", label: "Stock Movements" }, // Renamed for clarity
      { path: "/inventory/finished-goods", label: "Tools" },
      { path: "/inventory/tools-machinery", label: " Assets" },
      { path: "/inventory/assets", label: "Fixed Assets" },
      { path: "/inventory/finished-goods/fulfillment", label: "order" }, // Added
    ],
  },
  product: {
    label: "Product & Design",
    icon: ClipboardList,
    basePath: "/product",
    links: [
      { path: "/product/fixed", label: "Fixed Products" },
      { path: "/product/custom", label: "Custom Products" },
      { path: "/product/variants", label: "Product Variants" },
      { path: "/product/bom", label: "BOM Templates" },
      { path: "/product/assets", label: "Design Assets" },
      { path: "/product/approvals", label: "Design Approvals" },
      { path: "/product/costs", label: "Cost Engine", icon: Calculator },
      { path: "/product/templates", label: "Templates" },
    ],
  },
  projects: {
    label: "Project & Task Management",
    icon: Hammer,
    basePath: "/projects",
    links: [
      { path: "/projects", label: "Projects" }, 
      { path: "/projects/tasks", label: "Tasks" },
      { path: "/projects/report", label: "Project Report" },
      { path: "/projects/tools", label: "Tool Assignments" }, // Renamed
      { path: "/projects/profitability", label: "Profitability", icon: TrendingUp },
    ],
  },
  hr: {
    label: "HR & Payroll",
    icon: Users, // Reusing Users icon
    basePath: "/hr",
    links: [
      {
        label: "Employees",
        children: [
          { path: "/hr/employees", label: "Employees List", icon:UsersRound },
          { path: "/hr/new-employees", label: "Add Employee", icon:UserRoundPlus },
          { path: "/hr/onboarding", label: "Onboarding", icon: UserPlus },
          { path: "/hr/exit", label: "Offboarding", icon:LogOut },
        ],
        
      }, 
      {
        label: "Attendance",
        children: [
          { path: "/hr/attendance", label: "Attendance", icon:ClipboardList },
          { path: "/hr/attendance-schedule", label: "Schedule", icon:CalendarSync },
        ]
      },
      {
        label: "Performance",
        children: [
          { path: "/hr/performance", label: "Performance", icon:CircleGauge },
          { path: "/hr/feedback", label: "Feedback", icon:MessageCircle },
          { path: "/hr/review-form", label: "Review Form", icon:Star },
        ]
      },
      {
        label: "Leave Management",
        children: [
          { path: "/hr/leave-history", label: "OverView", icon:FileStack },
          { path: "/hr/leave-request", label: "Leave request", icon:FileClock },
          { path: "/hr/leave-approval", label: "leave Check", icon:FolderSearch },
          { path: "/hr/leave-schedule", label: "Calender", icon:Calendar1 },
        ]
      },
      {
        label: "Payroll Processing",
        children: [
          { path: "/hr/Payroll", label: "Payroll", icon:CircleGauge },
          { path: "/hr/payroll/Compensation-Settings", label: "Compensation Settings", icon:Cog },
        ]
      },
      {
        label: "Loans & Advances",
        children: [
          { path: "/hr/loans", label: "Loans", icon: PiggyBank  },
        ]
      },
      {
        label: "Tools",
        children: [
          { path: "/hr/tools-assigned", label: "Assigned Tools", icon: Drill  },
          { path: "/hr/tools-checkout", label: "Tool Checkout", icon: Wrench  },
        ]
      },
      {
        label: "Report",
        children: [
          { path: "/hr/Reports-Dashboard", label: "Dashboard", icon: LayoutDashboard  },
          { path: "/hr/SpecificReport", label: "HR Report", icon: FileText  },
        ]
      },
      { path: "/hr/Notifications-Page", label: "HR Alerts", icon: FileWarning },
    , ]
  },
  reports: {
    label: "Reports & Analytics", // More descriptive label
    icon: BarChart,
    basePath: "/reports", // Added basePath for consistency
    links: [
      { path: "/reports/custom-builder", label: "Custom Report Builder" }, // Renamed
      { path: "/reports/dashboard", label: "Analytical Dashboard" }, // Renamed
      { path: "/reports/kpis", label: "Key Performance Indicators" }, // Renamed
      { path: "/reports/scheduled", label: "Scheduled Reports" }, // Renamed
      { path: "/reports/alerts", label: "System Alerts" }, // Renamed
      { path: "/reports/asset", label: "Asset Reports" }, // Renamed
      { path: "/reports/finance", label: "Finance Reports" },
      { path: "/reports/hr", label: "HR Reports" },
      { path: "/reports/inventory", label: "Inventory Reports" },
      { path: "/reports/project", label: "Project Reports" },
      { path: "/reports/quality", label: "Quality Reports" },
      { path: "/reports/sales", label: "Sales Reports" },
    ],
  },
  finance: {
    label: "Financial Management",
    icon: CreditCard,
    basePath: "/finance",
    links: [
      { path: "/finance/dashboard", label: "Finance Dashboard", icon: Gauge },
      { path: "/finance/income", label: "Income" },
      { path: "/finance/expenses", label: "Expenses" },
      { path: "/finance/receivables", label: "Receivables (AR)" },
      { path: "/finance/payables", label: "Payables (AP)" },
      { path: "/finance/payments", label: "Payments" },
      { path: "/finance/loans", label: "Loans & Liabilities" },
      { path: "/finance/reconciliation", label: "Reconciliation", icon: RefreshCcw },
      { path: "/finance/payroll-integration", label: "Payroll Integration" }, // Renamed
    ],
  },
  settings: {
    label: "Settings",
    icon: Settings,
    basePath: "/settings",
    links: [
      { path: "/settings/system", label: "System Settings" }, // Renamed
      { path: "/settings/users-roles", label: "Users & Roles" }, // Renamed
      { path: "/settings/integrations", label: "Integrations" }, // Added
      { path: "/settings/audit-logs", label: "Audit Logs" }, // Added
    ],
  },
};

const Sidebar = () => {
  const { pathname } = useLocation();
  // State to control which main module dropdown is open
  const [expandedModule, setExpandedModule] = useState(null);
  // State to control visibility of the mobile sidebar
  const [mobileOpen, setMobileOpen] = useState(false);
  // State to control which sub-folder dropdowns are open within a module
  const [openSubfolders, setOpenSubfolders] = useState({});

  // Effect to automatically expand the module related to the current path
  useEffect(() => {
    let foundModuleKey = null;
    for (const key in moduleConfig) {
      if (pathname.startsWith(moduleConfig[key].basePath)) {
        foundModuleKey = key;
        break;
      }
    }
    setExpandedModule(foundModuleKey);

    // Also open relevant subfolders if the path matches a child
    const newOpenSubfolders = {};
    Object.values(moduleConfig).forEach(module => {
      if (module.links) {
        module.links.forEach(link => {
          if (link.children) {
            if (link.children.some(child => pathname.startsWith(child.path))) {
              newOpenSubfolders[link.label] = true;
            }
          }
        });
      }
    });
    setOpenSubfolders(newOpenSubfolders);

  }, [pathname]);

  // Toggle for main modules
  const toggleModule = (key) => {
    setExpandedModule((prev) => (prev === key ? null : key));
  };

  // Toggle for nested sub-folders
  const toggleSubfolder = (label) => {
    setOpenSubfolders((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Effect to manage body overflow when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  // Recursive function to render links and nested children
  const renderLinks = (links, level = 0) => {
    return links.map((link) => {
      if (link.children) {
        const isOpen = openSubfolders[link.label];
        const LinkIcon = link.icon; // Use specific icon if provided

        return (
          <div key={link.label} className={`mt-1`}>
            <button
              onClick={() => toggleSubfolder(link.label)}
              className={`flex items-center justify-between w-full px-2 py-2 text-left text-sm rounded-lg transition-all duration-200 ease-in-out
                          ${isOpen ? "bg-cyan-700/30 text-cyan-200" : "text-gray-300 hover:bg-cyan-700/20"}`}
              style={{ paddingLeft: `${12 + level * 12}px` }} // Indent based on level
            >
              <span className="flex items-center gap-2">
                 {LinkIcon && <LinkIcon className="w-4 h-4 opacity-70" />} {/* Render specific link icon */}
                {link.label}
              </span>
              {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {isOpen && (
              <div className="ml-2 mt-1 flex flex-col space-y-1">
                {renderLinks(link.children, level + 1)}
              </div>
            )}
          </div>
        );
      }

      // Render individual NavLink
      return (
        <NavLink
          to={link.path}
          key={link.path}
          end // Ensures exact match for active class
          className={({ isActive }) =>
            `block px-2 py-2 rounded-lg text-sm transition-all duration-200 ease-in-out
             ${isActive
                ? "bg-cyan-600 text-white font-semibold shadow-md border border-cyan-500"
                : "text-gray-300 hover:bg-cyan-700/20"
            }`
          }
          style={{ paddingLeft: `${12 + level * 12}px` }} // Indent based on level
          onClick={() => setMobileOpen(false)} // Close mobile menu on link click
        >
          <span className="flex items-center gap-2">
            {link.icon && <link.icon className="w-4 h-4 opacity-70" />} {/* Render specific link icon */}
            {link.label}
          </span>
        </NavLink>
      );
    });
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="lg:hidden fixed top-1 left-4 z-[100] p-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setMobileOpen(true)}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 border-r border-gray-800 shadow-2xl p-4 w-64 z-[99]
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex  justify-end lg:hidden mb-4">
          <button
            className="p-2 rounded-full  bg-gray-800 hover:bg-gray-700 text-white transition-colors duration-200"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-extrabold mb-8 text-white select-none text-center">
          King's<span className="font-light text-blue-400">ERP</span>
        </h2>

        <nav className="space-y-3 overflow-y-auto max-h-[calc(100vh-8rem)] pb-8 custom-scrollbar">
          {Object.entries(moduleConfig).map(([key, config]) => {
            const Icon = config.icon;
            const isOpen = expandedModule === key;

            return (
              <div key={key}>
                <button
                  onClick={() => toggleModule(key)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left rounded-xl transition-all duration-300 ease-in-out
                              ${isOpen
                                ? "bg-blue-800 text-blue-200 shadow-lg" // Darker blue, lighter text for active module
                                : "text-gray-200 hover:bg-gray-800" // Lighter text, subtle hover for inactive
                              }`}
                >
                  <span className="flex items-center gap-3 text-lg font-semibold select-none">
                    <Icon className="w-6 h-6 text-blue-400" />
                    {config.label}
                  </span>
                  {isOpen ? <ChevronDown size={20} className="text-blue-300" /> : <ChevronRight size={20} className="text-gray-400" />}
                </button>

                {isOpen && (
                  <div className="ml-2 mt-2 flex flex-col space-y-1 animate-fade-in-down"> {/* Added animation */}
                    {renderLinks(config.links)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Overlay for mobile view */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;
