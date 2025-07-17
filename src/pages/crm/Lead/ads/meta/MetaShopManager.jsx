import { useState, useEffect, useRef } from "react";
import {
  Sparkles, Layers, BarChart, Eye, LayoutGrid, Heart, MessageCircle, DollarSign, ImagePlus,
  Rocket, Trash2, Edit, Lightbulb, TrendingUp, Info, CheckCircle, XCircle, ChevronDown,
  ChevronRight, ArrowRight, TrendingDown
} from "lucide-react";

// Mock data for demonstration
const initialProducts = [
  {
    id: "prod_1",
    name: "Elegant Smartwatch",
    description: "Stay connected and track your fitness with style. Long-lasting battery.",
    price: "499",
    currency: "USD",
    metrics: { likes: 1245, comments: 230, reach: 55000, conversions: 120, sales: 59880, roas: 3.5 },
    postedTo: ["Facebook", "Instagram"],
    images: ["https://via.placeholder.com/150/A0DAFB/FFFFFF?text=Smartwatch"],
    status: "Active",
    postedDate: "2025-07-01",
    comments: [
      { id: 1, user: "UserA", text: "Love the design!", date: "2025-07-02" },
      { id: 2, user: "UserB", text: "Is it waterproof?", date: "2025-07-02" },
    ]
  },
  {
    id: "prod_2",
    name: "Premium Wireless Earbuds",
    description: "Immersive sound, comfortable fit, and noise cancellation for your daily commute.",
    price: "199",
    currency: "USD",
    metrics: { likes: 890, comments: 180, reach: 32000, conversions: 75, sales: 14925, roas: 2.8 },
    postedTo: ["Facebook"],
    images: ["https://via.placeholder.com/150/FCA3B7/FFFFFF?text=Earbuds"],
    status: "Active",
    postedDate: "2025-06-25",
    comments: [
      { id: 3, user: "UserC", text: "Great audio quality!", date: "2025-06-26" },
    ]
  },
  {
    id: "prod_3",
    name: "Ergonomic Office Chair",
    description: "Supportive design for long working hours. Breathable mesh back.",
    price: "349",
    currency: "USD",
    metrics: { likes: 320, comments: 55, reach: 9800, conversions: 12, sales: 4188, roas: 1.2 },
    postedTo: ["Instagram"],
    images: ["https://via.placeholder.com/150/FFD180/FFFFFF?text=Office+Chair"],
    status: "Needs Attention",
    postedDate: "2025-07-05",
    comments: []
  },
];

// Reusable KPI Card Component
const KpiCard = ({ icon: Icon, title, value, subText, trend }) => {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Info;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg border border-gray-100 transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="p-3 bg-blue-100 rounded-full">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className={`flex items-center text-sm font-medium ${trendColor}`}>
          {trend && <TrendIcon className="w-4 h-4 mr-1" />}
          <span>{trend ? `${Math.abs(Math.random() * 10).toFixed(1)}%` : ''}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-extrabold text-gray-800 leading-tight">{value}</h3>
      {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
    </div>
  );
};

// Main Component
export default function MetaShopManager() {
  const [products, setProducts] = useState(initialProducts);
  const [form, setForm] = useState({ name: "", description: "", price: "", currency: "USD", images: [], platform: [] });
  const [editingId, setEditingId] = useState(null);
  const [aiAnalysisInput, setAiAnalysisInput] = useState("");
  const [aiRecommendations, setAiRecommendations] = useState("");
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("post"); // 'post', 'products', 'analysis'

  useEffect(() => {
    // Simulate AI insights generation based on product data
    const generateAiInsights = () => {
      const lowReachProducts = products.filter(p => p.metrics.reach < 10000);
      const lowROASProducts = products.filter(p => p.metrics.roas < 2.0);
      let insights = "";

      if (lowReachProducts.length > 0) {
        insights += `• Consider boosting reach for ${lowReachProducts.length} product(s) like '${lowReachProducts[0].name}'.\n`;
      }
      if (lowROASProducts.length > 0) {
        insights += `• Optimize ad creatives/targeting for ${lowROASProducts.length} product(s) with low ROAS, e.g., '${lowROASProducts[0].name}'.\n`;
      }
      if (insights === "") {
        insights = "All products are performing well! Keep up the great work.";
      }
      setAiRecommendations("💡 **General Product Performance Insights:**\n" + insights);
    };

    generateAiInsights();
  }, [products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter(item => item !== value)
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...files.map(file => ({ file, preview: URL.createObjectURL(file) }))]
      }));
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.description || !form.price || form.images.length === 0 || form.platform.length === 0) {
      alert("Please fill out all required fields and upload at least one image.");
      return;
    }

    const newProduct = {
      ...form,
      id: editingId || `prod_${Date.now()}`,
      metrics: {
        likes: Math.floor(Math.random() * 2000) + 100,
        comments: Math.floor(Math.random() * 300) + 10,
        reach: Math.floor(Math.random() * 100000) + 10000,
        conversions: Math.floor(Math.random() * 200) + 5,
        sales: parseFloat(form.price) * (Math.floor(Math.random() * 20) + 1), // Simulated sales
        roas: (Math.random() * 4) + 1 // Simulated ROAS between 1 and 5
      },
      postedTo: form.platform,
      images: form.images.map(img => img.preview), // Save previews for display
      status: "Active",
      postedDate: new Date().toISOString().split('T')[0],
      comments: [] // New products start with no comments
    };

    const updated = editingId
      ? products.map(p => (p.id === editingId ? newProduct : p))
      : [newProduct, ...products];
    setProducts(updated);
    setForm({ name: "", description: "", price: "", currency: "USD", images: [], platform: [] });
    setEditingId(null);
    if (fileInputRef.current) { // Clear file input
      fileInputRef.current.value = "";
    }
    setActiveTab("products"); // Switch to products list after posting
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      currency: product.currency,
      images: product.images.map(url => ({ file: null, preview: url })), // Re-populate for display
      platform: product.postedTo
    });
    setEditingId(product.id);
    setActiveTab("post"); // Switch to post tab for editing
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for form
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleGenerateAiRecommendation = () => {
    if (!aiAnalysisInput.trim()) {
      setAiRecommendations("Please enter some product details or context for AI analysis.");
      return;
    }

    // Simulate advanced AI analysis based on input
    let recommendation = `💡 **Recommendation for your input:**\n\n`;
    if (aiAnalysisInput.toLowerCase().includes("low sales")) {
      recommendation += "• **Focus on Conversion Funnel:** Analyze product page conversion rates. Are descriptions compelling enough? Are product images high quality?\n";
      recommendation += "• **Targeted Promotions:** Consider running specific ad campaigns with discounts to convert interested users.\n";
    } else if (aiAnalysisInput.toLowerCase().includes("reach")) {
      recommendation += "• **Audience Expansion:** Explore new lookalike audiences or broader interest groups.\n";
      recommendation += "• **Creative Refresh:** A/B test new ad creatives to combat ad fatigue.\n";
    } else if (aiAnalysisInput.toLowerCase().includes("price")) {
      recommendation += "• **Competitive Analysis:** Research competitor pricing for similar products.\n";
      recommendation += "• **Value Proposition:** Highlight unique benefits to justify the price, or consider bundle offers.\n";
    } else {
      recommendation += "• **General Optimization:** Ensure your product descriptions are SEO-friendly and your ad targeting is precise. Consider engaging with comments to build community.\n";
    }
    recommendation += "\nFor more specific recommendations, provide more detailed product IDs or campaign data.";
    setAiRecommendations(recommendation);
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12 font-sans bg-gray-50 min-h-screen">
      {/* Header & Overview */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2 drop-shadow-sm">Kings Shop Manager</h1>
        <p className="text-lg text-gray-600">Streamline your product posting, track performance, and get AI insights.</p>
      </header>

      {/* Tabs for Navigation */}
      <div className="mb-8 bg-white p-2 rounded-xl shadow-md flex justify-around border border-gray-100">
        <button
          className={`flex-1 px-4 py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'post' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('post')}
        >
          <Rocket className="inline-block w-5 h-5 mr-2" /> Post Product
        </button>
        <button
          className={`flex-1 px-4 py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('products')}
        >
          <LayoutGrid className="inline-block w-5 h-5 mr-2" /> Posted Products
        </button>
        <button
          className={`flex-1 px-4 py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300 ${activeTab === 'analysis' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => setActiveTab('analysis')}
        >
          <Lightbulb className="inline-block w-5 h-5 mr-2" /> AI Analysis
        </button>
      </div>

      {/* --- Main Content Sections --- */}

      {/* 1. Post New Product Section */}
      {activeTab === 'post' && (
        <section className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn space-y-8">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3 mb-6">
            <Rocket className="w-7 h-7 text-blue-500" /> {editingId ? "Edit Existing Product" : "Post a New Product"}
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Details Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  placeholder="e.g. Vintage Leather Jacket"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-y"
                  placeholder="Describe your product in detail..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price <span className="text-red-500">*</span></label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    placeholder="e.g. 199.99"
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    id="currency"
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
                  >
                    <option value="ETB">ETB</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Images & Platforms Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images <span className="text-red-500">*</span></label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImagePlus className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-1 text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                    <input id="dropzone-file" type="file" ref={fileInputRef} className="hidden" multiple onChange={handleImageUpload} accept="image/*" />
                  </label>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {form.images.map((img, index) => (
                    <div key={index} className="relative w-28 h-28 rounded-lg overflow-hidden border border-gray-200">
                      <img src={img.preview} alt={`Product preview ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 transition"
                        title="Remove image"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Post to Platforms <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                    <input
                      type="checkbox"
                      name="platform"
                      value="Facebook"
                      checked={form.platform.includes("Facebook")}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-gray-800">Facebook</span>
                  </label>
                  <label className="inline-flex items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                    <input
                      type="checkbox"
                      name="platform"
                      value="Instagram"
                      checked={form.platform.includes("Instagram")}
                      onChange={handleChange}
                      className="form-checkbox h-5 w-5 text-purple-600 rounded"
                    />
                    <span className="ml-2 text-gray-800">Instagram</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-6"
          >
            {editingId ? <Edit className="w-5 h-5" /> : <Rocket className="w-5 h-5" />}
            {editingId ? "Update Product" : "Post Product Now"}
          </button>
        </section>
      )}

      {/* 2. Posted Products Section */}
      {activeTab === 'products' && (
        <section className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn">
          <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3 mb-6">
            <LayoutGrid className="w-7 h-7 text-blue-500" /> Your Posted Products ({products.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-600 text-center col-span-full py-10">No products posted yet. Start by posting one!</p>
            ) : (
              products.map(product => (
                <div key={product.id} className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow duration-300 group">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4 mt-auto">
                      <span className="text-blue-700 font-extrabold text-xl">{product.currency} {product.price}</span>
                      <div className="flex space-x-2">
                        {product.postedTo.includes("Facebook") && <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="w-6 h-6 opacity-75" />}
                        {product.postedTo.includes("Instagram") && <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png" alt="Instagram" className="w-6 h-6 opacity-75" />}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-4 border-t pt-4">
                      <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> Likes: <span className="font-semibold">{product.metrics.likes.toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-blue-500" /> Reach: <span className="font-semibold">{product.metrics.reach.toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><BarChart className="w-4 h-4 text-purple-500" /> Conversions: <span className="font-semibold">{product.metrics.conversions}</span></span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4 text-green-500" /> Sales: <span className="font-semibold">{product.currency} {product.metrics.sales.toLocaleString()}</span></span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4 text-yellow-600" /> ROAS: <span className="font-semibold">{product.metrics.roas.toFixed(1)}x</span></span>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                      <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition" title="Edit Product">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition" title="Delete Product">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition" title="View Comments">
                        <MessageCircle className="w-5 h-5" /> ({product.comments.length})
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* 3. AI Analysis & Recommendation Section */}
      {activeTab === 'analysis' && (
        <section className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100 animate-fadeIn grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3 mb-4">
              <Lightbulb className="w-7 h-7 text-yellow-500" /> AI Strategy & Recommendations
            </h2>
            <p className="text-gray-600 mb-4">
              Leverage AI to get actionable insights. Provide specific details below to receive tailored recommendations for your products.
            </p>

            <div className="space-y-4">
              <label htmlFor="ai-input" className="block text-sm font-medium text-gray-700">Enter product details or performance context:</label>
              <textarea
                id="ai-input"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-y"
                placeholder="e.g., 'Product ID prod_3 has very low ROAS, how can I improve its performance?', 'Recommend strategies to increase reach for all new products.', 'What's the best audience for my high-end watches?'"
                value={aiAnalysisInput}
                onChange={(e) => setAiAnalysisInput(e.target.value)}
              ></textarea>
              <button
                onClick={handleGenerateAiRecommendation}
                className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Get AI Recommendation
              </button>
            </div>
          </div>

          <div className="md:col-span-1 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 shadow-inner">
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> Insights Output
            </h3>
            <div
              className="text-gray-800 text-sm leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: aiRecommendations.replace(/\n/g, '<br/>') }}
            />
             {aiRecommendations === "" && (
              <p className="text-gray-500 italic">Enter your query and click "Get AI Recommendation" to see insights here.</p>
            )}
          </div>
        </section>
      )}

      {/* Storefront Link - Footer-like section */}
      <section className="mt-12">
        <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-4 shadow-sm">
          <Eye className="w-6 h-6 text-blue-600" />
          <p className="text-sm text-gray-700">
            Manage your Meta storefront directly:
            <a
              href="https://facebook.com/commerce_manager"
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 font-medium ml-2 underline hover:text-blue-900 transition"
            >
              facebook.com/commerce_manager <ArrowRight className="inline-block w-4 h-4 ml-1" />
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}