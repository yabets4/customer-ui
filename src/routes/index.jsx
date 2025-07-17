import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from '../components/Layout';
import Login from '../pages/Login.jsx';
import Home from '../pages/home.jsx';

// CRM pages
import Customers from '../pages/crm/Customer/Customers.jsx';
import Quotes from '../pages/crm/Quotes/Quotes';
import CreateQuote from '../pages/crm/Quotes/CreateQuote.jsx';
import  PaymentEntryForm  from '../pages/crm/Payment/PaymentEntryForm.jsx';
import PaymentTrackingPage from '../pages/crm/Payment/PaymentTrackingPage.jsx';

import SalesReports from '../pages/crm/SalesReports';
import ChangeRequests from '../pages/crm/ChangeRequests';

//Crm order
import Orders from '../pages/crm/SalesOrder/Orders.jsx';
import CreateSalesOrder from '../pages/crm/SalesOrder/createSalesOrder.jsx';
import SalesOrderList from '../pages/crm/SalesOrder/salesOrderList.jsx';
import SalesOrderDetail from '../pages/crm/SalesOrder/salesOrderView.jsx';



// Crm Leads
import LeadList from '../pages/crm/Lead/LeadList.jsx';
import LeadDetailPage from '../pages/crm/Lead/LeadDetailPage.jsx';
import CampaignBuilder from '../pages/crm/Lead/ads/meta/createMetaAd.jsx';
import CampaignDashboard from '../pages/crm/Lead/ads/meta/ManageCampaigns.jsx';
import MetaConnect from '../pages/crm/Lead/ads/meta/MetaConnect.jsx';
import MetaShopManager from '../pages/crm/Lead/ads/meta/MetaShopManager.jsx';
import ManualLeadForm from '../pages/crm/Lead/ManualLeadForm.jsx';

//crm Customers
import CustomersProfile from '../pages/crm/Customer/CustomersProfie.jsx';


// Product & Design pages
import FixedProducts from '../pages/product/FixedProducts';
import CustomProducts from '../pages/product/CustomProducts';
import Variants from '../pages/product/Variants';
import BomTemplates from '../pages/product/BomTemplates';
import DesignAssets from '../pages/product/DesignAssets';
import DesignApprovals from '../pages/product/DesignApprovals';
import CostEngine from '../pages/product/CostEngine';
import Templates from '../pages/product/Templates';

// HR & Payroll pages

import Loanss from '../pages/hr/Loans';


// Project & Task Management pages
import ToolAssignments from '../pages/ProjectTaskManagement/ToolAssignments.jsx';
import Profitability from '../pages/projects/Profitability';


import CustomReportBuilder from '../pages/reports/CustomReportBuilder.jsx';
import Dashboardd from '../pages/reports/Dashboard.jsx';
import KPIs from '../pages/reports/KPIs.jsx';
import ScheduledReports from '../pages/reports/ScheduledReports.jsx';
import Alertss from '../pages/reports/Alerts.jsx';
import AssetReports from '../pages/reports/BuiltInReports/AssetReports.jsx';
import FinanceReports from '../pages/reports/BuiltInReports/FinanceReports.jsx';
import HRReports from '../pages/reports/BuiltInReports/HRReports.jsx';
import InventoryReports from '../pages/reports/BuiltInReports/InventoryReports.jsx';
import ProjectReports from '../pages/reports/BuiltInReports/ProjectReports.jsx';
import QualityReports from '../pages/reports/BuiltInReports/QualityReports.jsx';
import SalesReportss from '../pages/reports/BuiltInReports/SalesReports.jsx';


import Dashboard from '../pages/finance/Dashboard';
import Income from '../pages/finance/Income';
import Expenses from '../pages/finance/Expenses';
import Receivables from '../pages/finance/Receivables';
import Payables from '../pages/finance/Payables';
import Payments from '../pages/finance/Payments';
import Loans from '../pages/finance/Loans';
import Reconciliation from '../pages/finance/Reconciliation';
import PayrollIntegration from '../pages/finance/PayrollIntegration';
import Reports from '../pages/finance/Reports';
import ProfitLossStatement from '../pages/finance/fs/ProfitLossStatement.jsx'
import BalanceSheet from '../pages/finance/fs/BalanceSheet.jsx'
import CashFlowStatement from '../pages/finance/fs/CashFlowStatement.jsx';




import EmployeeListPage from '../pages/hr/EmployeeManagement/EmployeeListPage.jsx';
import EmployeeDetailsPage from '../pages/hr/EmployeeManagement/EmployeeDetailsPage.jsx';
import EmployeeFormPage from '../pages/hr/EmployeeManagement/EmployeeFormPage.jsx';
import PerformanceDashboardPage from '../pages/hr/PerformanceManagement/PerformanceDashboardPage.jsx';
import ReviewFormPage from '../pages/hr/PerformanceManagement/ReviewFormPage.jsx';
import FeedbackLogPage from '../pages/hr/PerformanceManagement/FeedbackLogPage.jsx';
import AttendanceLogPage from '../pages/hr/AttendanceManagement/AttendanceLogPage.jsx';
import ShiftSchedulePage from '../pages/hr/AttendanceManagement/ShiftSchedulePage.jsx';
import LeaveRequestPage from '../pages/hr/LeaveManagement/LeaveRequestPage.jsx';
import LeaveApprovalPage from '../pages/hr/LeaveManagement/LeaveApprovalPage.jsx';
import LeaveCalendarPage from '../pages/hr/LeaveManagement/LeaveCalendarPage.jsx';
import CompensationSettingsPage from '../pages/hr/PayrollManagement/CompensationSettingsPage.jsx';
import PayslipHistoryPage from '../pages/hr/PayrollManagement/PayslipHistoryPage.jsx';
import PayrollProcessingPage from '../pages/hr/PayrollManagement/PayrollProcessingPage.jsx';
import PayslipPage from '../pages/hr/PayrollManagement/PaySlip.jsx';
import ReportsDashboardPage from '../pages/hr/HRReporting/ReportsDashboardPage.jsx';
import LeaveRequestHistoryPlaceholder from '../pages/hr/LeaveManagement/LeaveRequestHistoryPlaceholder.jsx';
import LeaveRequestHistory from '../pages/hr/LeaveManagement/LeaveRequestHistory.jsx';
import FeedbackLog from '../pages/hr/PerformanceManagement/FeedbackLog.jsx';
import PerformanceReviewPage from '../pages/hr/PerformanceManagement/PerformanceReviewPage.jsx';
import AttendancePage from '../pages/hr/AttendanceManagement/AttendancePage.jsx';
import AssetAssignmentPage from '../pages/hr/ToolAssetAssignment/AssetAssignmentPage.jsx';
import ToolCheckoutLogPage from '../pages/hr/ToolAssetAssignment/ToolCheckoutLogPage.jsx';
import SpecificReportPage from '../pages/hr/HRReporting/SpecificReportPage.jsx';
import NotificationsPage from '../pages/hr/NotificationsPage.jsx';
import OnboardingChecklistPage from '../pages/hr/OnboardingManagement/OnboardingChecklistPage.jsx';
import OffboardingChecklistPage from '../pages/hr/OnboardingManagement/OffboardingChecklistPage.jsx';
import ProjectKanbanBoardPage from '../pages/ProjectTaskManagement/ProjectKanbanBoardPage.jsx';
import EmployeeEdit from '../pages/hr/EmployeeManagement/EmployeeEdit.jsx';




import ProjectListPage from '../pages/ProjectTaskManagement/ProjectListPage.jsx';
import ProjectDetailsPage from '../pages/ProjectTaskManagement/ProjectDetailsPage.jsx';
import ProjectFormPage from '../pages/ProjectTaskManagement/ProjectFormPage.jsx';
import TaskListPage from '../pages/ProjectTaskManagement/TaskListPage.jsx';
import TaskDetailsPage from '../pages/ProjectTaskManagement/TaskDetailsPage.jsx';
import TaskFormPage from '../pages/ProjectTaskManagement/TaskFormPage.jsx';
import ProjectGanttChartPage from '../pages/ProjectTaskManagement/ProjectGanttChartPage.jsx';
import ProfitabilityPage from '../pages/ProjectTaskManagement/ProjectProfitability.jsx';
import ProjectReportsPage from '../pages/ProjectTaskManagement/ProjectReportsPage.jsx';
import Projectsingle from '../pages/ProjectTaskManagement/ProjectSingle.jsx';





import RawMaterialListPage from '../pages/inventory/RawMaterials/RawMaterialListPage.jsx';
import RawMaterialDetailsPage from '../pages/inventory/RawMaterials/RawMaterialDetailsPage.jsx';
import RawMaterialFormPage from '../pages/inventory/RawMaterials/RawMaterialFormPage.jsx';
import RawMaterialMovementPage from '../pages/inventory/RawMaterials/RawMaterialMovementPage.jsx';
import RawMaterialReportsPage from '../pages/inventory/RawMaterials/RawMaterialReportsPage.jsx';
import FinishedGoodDetailsPage from '../pages/inventory/FinishedGoods/FinishedGoodDetailsPage.jsx';
import FinishedGoodListPage from '../pages/inventory/FinishedGoods/FinishedGoodListPage.jsx';
import FinishedGoodFormPage from '../pages/inventory/FinishedGoods/FinishedGoodFormPage.jsx';
import OrderFulfillmentPage from '../pages/inventory/FinishedGoods/OrderFulfillmentPage.jsx';
import ToolMachineListPage from '../pages/inventory/ToolsMachinery/ToolMachineListPage.jsx';
import ToolMachineDetailsPage from '../pages/inventory/ToolsMachinery/ToolMachineDetailsPage.jsx';
import ToolMachineFormPage from '../pages/inventory/ToolsMachinery/ToolMachineFormPage.jsx';
import ToolUsageLogPage from '../pages/inventory/ToolsMachinery/ToolUsageLogPage.jsx';
import ToolMaintenancePage from '../pages/inventory/ToolsMachinery/ToolMaintenancePage.jsx';
import FixedAssetListPage from '../pages/inventory/FixedAssets/FixedAssetListPage.jsx';
import FixedAssetDetailsPage from '../pages/inventory/FixedAssets/FixedAssetDetailsPage.jsx';
import FixedAssetFormPage from '../pages/inventory/FixedAssets/FixedAssetFormPage.jsx';
import FixedAssetDisposalPage from '../pages/inventory/FixedAssets/FixedAssetDisposalPage.jsx';
import FixedAssetMaintenancePage from '../pages/inventory/FixedAssets/FixedAssetMaintenancePage.jsx';





import ProductCatalogListPage from '../pages/ProductDesignManagement/ProductCatalog/ProductCatalogListPage.jsx';
import ProductCatalogDetailsPage from '../pages/ProductDesignManagement/ProductCatalog/ProductCatalogDetailsPage.jsx';
import ProductCatalogFormPage from '../pages/ProductDesignManagement/ProductCatalog/ProductCatalogFormPage.jsx';
import DesignLibraryPage from '../pages/ProductDesignManagement/DesignTemplates/DesignLibraryPage.jsx';
import DesignDetailsPage from '../pages/ProductDesignManagement/DesignTemplates/DesignDetailsPage.jsx';
import DesignTemplateFormPage from '../pages/ProductDesignManagement/DesignTemplates/DesignTemplateFormPage.jsx';






export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        
          {/* Inventory routes */}
          <Route path="/inventory/raw-materials/:id" element={<RawMaterialDetailsPage />} />
          <Route path="/inventory/raw-materials" element={<RawMaterialListPage />} />
          <Route path="/inventory/raw-materials/reports" element={<RawMaterialReportsPage />} />
          <Route path="/inventory/raw-materials/new" element={<RawMaterialFormPage />} />
          <Route path="/inventory/raw-materials/:id/edit" element={<RawMaterialFormPage />} />
          <Route path="/inventory/movements" element={<RawMaterialMovementPage />} />
          <Route path="/inventory/finished-goods" element={<FinishedGoodListPage />} />
          <Route path="/inventory/finished-goods/:id" element={<FinishedGoodDetailsPage />} />
          <Route path="/inventory/finished-goods/new" element={<FinishedGoodFormPage />} />
          <Route path="/inventory/finished-goods/:id/edit" element={<FinishedGoodFormPage />} />

          <Route path="/inventory/finished-goods/fulfillment" element={<OrderFulfillmentPage />} />
          <Route path="/inventory/tools-machinery" element={<ToolMachineListPage />} />
          <Route path="/inventory/tools-machinery/:id" element={<ToolMachineDetailsPage />} />
          <Route path="/inventory/tools-machinery/new" element={<ToolMachineFormPage />} />
          <Route path="/inventory/tools-machinery/:id/edit" element={<ToolMachineFormPage />} />
          <Route path="/inventory/tools-machinery/usage-logs" element={<ToolUsageLogPage />} />
          <Route path="/inventory/tools-machinery/maintenance" element={<ToolMaintenancePage />} />
          <Route path="/inventory/tools-machinery" element={<ToolMachineListPage />} />
          <Route path="/inventory/assets" element={<FixedAssetListPage />} />
          <Route path="/inventory/assets/:id" element={<FixedAssetDetailsPage />} />
          <Route path="/inventory/assets/new" element={<FixedAssetFormPage />} />
          <Route path="/inventory/assets/:id/edit" element={<FixedAssetFormPage />} />
          <Route path="/inventory/assets/:id/disposal" element={<FixedAssetDisposalPage />} />
          <Route path="/inventory/assets/:id/maintenance" element={<FixedAssetMaintenancePage />} />


          {/* CRM routes */}
          <Route path="/crm/customers" element={<Customers />} />
          <Route path="/crm/quotes" element={<Quotes />} />
          <Route path="/crm/quotes/create" element={<CreateQuote />} />
          <Route path="/crm/orders" element={<Orders />} />
          <Route path="/crm/createsalesorder" element={<CreateSalesOrder />} />
          <Route path="/crm/salesorderlist" element={<SalesOrderList />} />
          <Route path="/crm/salesorderdetail" element={<SalesOrderDetail />} />
          <Route path="/crm/payments" element={<PaymentTrackingPage />} />
          <Route path="/crm/paymententryform" element={<PaymentEntryForm />} />
          <Route path="/crm/reports" element={<SalesReports />} />
          <Route path="/crm/changes" element={<ChangeRequests />} />
          <Route path="/crm/leadlist" element={<LeadList />} />
          <Route path="/crm/lead/manualform" element={<ManualLeadForm />} />
          <Route path="/crm/leadlist/:id" element={<LeadDetailPage />} />
          <Route path="/crm/campaignbuilder" element={<CampaignBuilder />} />
          <Route path="/crm/campaigndashboard" element={<CampaignDashboard />} />
          <Route path="/crm/metaconnect" element={<MetaConnect />} />
          <Route path="/crm/metashopmanager" element={<MetaShopManager />} />
          <Route path="//crm/customers/Profile" element={<CustomersProfile />} />



          {/* Product & Design routes */}
          <Route path="/product/product-catalog" element={<ProductCatalogListPage />} />
          <Route path="/product/:id/detail" element={<ProductCatalogDetailsPage />} />
          <Route path="/product/new" element={<ProductCatalogFormPage />} />
          <Route path="/product/:id/edit" element={<ProductCatalogFormPage />} />

          <Route path="/product/design-library" element={<DesignLibraryPage />} />
          <Route path="/product/design-library/:id/detail" element={<DesignDetailsPage />} />
          <Route path="/product/design-library/new" element={<DesignTemplateFormPage />} />
          <Route path="/product/design-library/:id/edit" element={<DesignTemplateFormPage />} />







          <Route path="/product/fixed" element={<FixedProducts />} />




        
          <Route path="/product/fixed" element={<FixedProducts />} />
          <Route path="/product/custom" element={<CustomProducts />} />
          <Route path="/product/variants" element={<Variants />} />
          <Route path="/product/bom" element={<BomTemplates />} />
          <Route path="/product/assets" element={<DesignAssets />} />
          <Route path="/product/approvals" element={<DesignApprovals />} />
          <Route path="/product/costs" element={<CostEngine />} />
          <Route path="/product/templates" element={<Templates />} />

          {/* Project & Task Management routes */}
          <Route path="/projects/:projectId/gantt" element={<ProjectGanttChartPage />} />
          <Route path="/projects/:projectId/kanban" element={<ProjectKanbanBoardPage />} />
          <Route path="/projects/report" element={<ProjectReportsPage />} />
          <Route path="/projects/tools" element={<ToolAssignments />} />
          <Route path="/projects/profitability" element={<Profitability />} />
          <Route path="projects/:projectId/profit" element={<ProfitabilityPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="projects/:projectId/details" element={<ProjectDetailsPage />} />
          <Route path="/projects/new" element={<ProjectFormPage />} /> 
          <Route path="projects/:projectId/edit" element={<ProjectFormPage />} />
          <Route path="projects/:projectId/reports" element={<Projectsingle />} />
          <Route path="projects/tasks/new" element={<TaskFormPage />} />
          <Route path="tasks/:taskId/edit" element={<TaskFormPage />} />
          <Route path="tasks/:taskId/details" element={<TaskDetailsPage />} />
          <Route path="projects/tasks" element={<TaskListPage />} />


          <Route path="/finance/dashboard" element={<Dashboard />} />
          <Route path="/finance/income" element={<Income />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/receivables" element={<Receivables />} />
          <Route path="/finance/payables" element={<Payables />} />
          <Route path="/finance/payments" element={<Payments />} />
          <Route path="/finance/loans" element={<Loans />} />
          <Route path="/finance/reconciliation" element={<Reconciliation />} />
          <Route path="/finance/payroll" element={<PayrollIntegration />} />
          <Route path="/finance/reports" element={<Reports />} />
          <Route path="/finance/p&l" element={<ProfitLossStatement />} />
          <Route path="/finance/balance-sheet" element={<BalanceSheet />} />
          <Route path="/finance/Cash-flow" element={<CashFlowStatement />} />
          


          {/* hr*/}
          <Route path="/hr/employees" element={<EmployeeListPage />} />
          <Route path="/hr/employees/:id" element={<EmployeeDetailsPage />} />
          <Route path="/hr/employees/edit/:employeeId" element={<EmployeeEdit />} />
          <Route path="/hr/onboarding" element={<OnboardingChecklistPage />} />
          <Route path="/hr/new-employees" element={<EmployeeFormPage />} />


          <Route path="/hr/performance" element={<PerformanceDashboardPage />} />
          <Route path="/hr/feedback" element={<FeedbackLog />} />
          <Route path="/hr/feed" element={<FeedbackLogPage />} />
          <Route path="/hr/review-form" element={<ReviewFormPage />} />
          <Route path="/hr/performance/review/:employeeId" element={<PerformanceReviewPage />} />


          <Route path="/hr/leave-request" element={<LeaveRequestPage />} />
          <Route path="/hr/leave-approval" element={<LeaveApprovalPage />} />
          <Route path="/hr/leave-schedule" element={<LeaveCalendarPage />} />
          <Route path="/hr/leave-history" element={<LeaveRequestHistory />} />
          <Route path="/hr/leave-request/:employeeId" element={<LeaveRequestHistoryPlaceholder />} />




          <Route path="/hr/payroll/:employeeId" element={<PayslipHistoryPage />} />
          <Route path="/hr/payroll" element={<PayrollProcessingPage />} />
          <Route path="/hr/payroll/view/:id" element={<PayslipPage />} />

          <Route path="/hr/payroll/Compensation-Settings" element={<CompensationSettingsPage />} />



          <Route path="/hr/attendance-schedule" element={<ShiftSchedulePage />} />
          <Route path="/hr/attendance" element={<AttendanceLogPage />} />
          <Route path="/hr/attendance/log/:employeeId" element={<AttendancePage />} />

          <Route path="/hr/loans" element={<Loanss />} />

          <Route path="/hr/tools-assigned" element={<AssetAssignmentPage />} />
          <Route path="/hr/tools-checkout" element={<ToolCheckoutLogPage />} />

          <Route path="/hr/exit" element={<OffboardingChecklistPage />} />
          <Route path="/hr/Reports-Dashboard" element={<ReportsDashboardPage />} />
          <Route path="/hr/SpecificReport" element={<SpecificReportPage />} />
          <Route path="/hr/Notifications-Page" element={<NotificationsPage />} />


          <Route path="/reports/CustomReportBuilder" element={<CustomReportBuilder />} />
          <Route path="/reports/Dashboardd" element={<Dashboardd />} />
          <Route path="/reports/KPIs" element={<KPIs />} />
          <Route path="/reports/ScheduledReports" element={<ScheduledReports />} />
          <Route path="/reports/Alertss" element={<Alertss />} />
          <Route path="/reports/AssetReports" element={<AssetReports />} />
          <Route path="/reports/FinanceReports" element={<FinanceReports />} />
          <Route path="/reports/HRReports" element={<HRReports />} />
          <Route path="/reports/InventoryReports" element={<InventoryReports />} />
          <Route path="/reports/ProjectReports" element={<ProjectReports />} />
          <Route path="/reports/QualityReports" element={<QualityReports />} />
          <Route path="/reports/SalesReportss" element={<SalesReportss />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
