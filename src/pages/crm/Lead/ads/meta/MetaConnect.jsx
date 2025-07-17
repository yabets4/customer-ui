 import { useState } from "react";
import {
  Facebook,
  Instagram,
  Link,
  Globe,
  Settings,
  ShoppingCart,
  CheckCircle2,
  UploadCloud,
} from "lucide-react";

const MetaConnect = () => {
  const [connected, setConnected] = useState(false);
  const [pixelSetup, setPixelSetup] = useState(false);
  const [catalogCreated, setCatalogCreated] = useState(false);
  const [shopReady, setShopReady] = useState(false);

  const handleConnect = () => {
    // Replace with real Facebook SDK call
    alert("🔗 Simulated Meta Business Extension Login");
    setConnected(true);
  };

  const handlePixel = () => {
    alert("📈 Simulated Meta Pixel setup");
    setPixelSetup(true);
  };

  const handleCatalog = () => {
    alert("📦 Simulated Catalog creation");
    setCatalogCreated(true);
  };

  const handleShop = () => {
    alert("🛒 Simulated Shop setup");
    setShopReady(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl shadow-xl mt-10 space-y-6 border border-blue-100">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-6">
        <Link className="w-6 h-6" />
        Connect Facebook & Instagram
      </h2>

      {/* Step 1: Connect */}
      <div className="p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Facebook className="text-blue-600" /> &nbsp; Meta Business Connection
        </h3>
        <p className="text-gray-600 mb-3 text-sm">
          Connect your Facebook Business Manager and Instagram account using Meta Business Extension.
        </p>
        <button
          disabled={connected}
          onClick={handleConnect}
          className={`px-5 py-2 rounded-full transition font-medium flex items-center gap-2 ${
            connected
              ? "bg-green-100 text-green-700 cursor-default"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {connected ? <CheckCircle2 className="text-green-600" /> : <Link />}
          {connected ? "Connected" : "Connect Meta Business"}
        </button>
      </div>

      {/* Step 2: Pixel Setup */}
      <div className="p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <Settings className="text-purple-600" /> &nbsp; Meta Pixel Setup
        </h3>
        <p className="text-gray-600 mb-3 text-sm">
          Track website visitors and measure conversion events with the Meta Pixel.
        </p>
        <button
          disabled={!connected || pixelSetup}
          onClick={handlePixel}
          className={`px-5 py-2 rounded-full transition font-medium flex items-center gap-2 ${
            pixelSetup
              ? "bg-green-100 text-green-700 cursor-default"
              : !connected
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          {pixelSetup ? <CheckCircle2 className="text-green-600" /> : <Globe />}
          {pixelSetup ? "Pixel Installed" : "Install Pixel"}
        </button>
      </div>

      {/* Step 3: Catalog Creation */}
      <div className="p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <UploadCloud className="text-orange-600" /> &nbsp; Product Catalog
        </h3>
        <p className="text-gray-600 mb-3 text-sm">
          Create a catalog to manage your products across Instagram, Facebook, and Shops.
        </p>
        <button
          disabled={!connected || catalogCreated}
          onClick={handleCatalog}
          className={`px-5 py-2 rounded-full transition font-medium flex items-center gap-2 ${
            catalogCreated
              ? "bg-green-100 text-green-700 cursor-default"
              : !connected
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          {catalogCreated ? <CheckCircle2 className="text-green-600" /> : <UploadCloud />}
          {catalogCreated ? "Catalog Created" : "Create Catalog"}
        </button>
      </div>

      {/* Step 4: Shops Setup */}
      <div className="p-5 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <ShoppingCart className="text-teal-600" /> &nbsp; Facebook / Instagram Shop
        </h3>
        <p className="text-gray-600 mb-3 text-sm">
          Set up your online storefront across Facebook and Instagram.
        </p>
        <button
          disabled={!connected || !catalogCreated || shopReady}
          onClick={handleShop}
          className={`px-5 py-2 rounded-full transition font-medium flex items-center gap-2 ${
            shopReady
              ? "bg-green-100 text-green-700 cursor-default"
              : !connected || !catalogCreated
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-teal-600 text-white hover:bg-teal-700"
          }`}
        >
          {shopReady ? <CheckCircle2 className="text-green-600" /> : <ShoppingCart />}
          {shopReady ? "Shop Ready" : "Set Up Shop"}
        </button>
      </div>
    </div>
  );
};

export default MetaConnect;
