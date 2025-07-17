// src/pages/crm/Orders.jsx
import React, { useState, useEffect } from 'react';

const initialOrders = [
  {
    id: 'SO-001',
    customer: 'John Doe',
    quoteRef: 'Q-001',
    products: ['Table', 'Chair'],
    discount: '10%',
    total: '2700 ETB',
    paymentPlan: '50/50',
    status: 'Confirmed',
    deliveryAddress: 'Addis Ababa',
    notes: 'Deliver ASAP',
    workflowStage: 'Ready for Production'
  }
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer: '',
    quoteRef: '',
    products: '',
    discount: '',
    total: '',
    paymentPlan: '',
    status: 'Confirmed',
    deliveryAddress: '',
    notes: '',
    workflowStage: 'Ready for Production'
  });

  useEffect(() => {
    setOrders(initialOrders);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      ...form,
      id: `SO-${orders.length + 1}`,
      products: form.products.split(',').map((p) => p.trim())
    };
    setOrders([...orders, newOrder]);
    setForm({
      customer: '',
      quoteRef: '',
      products: '',
      discount: '',
      total: '',
      paymentPlan: '',
      status: 'Confirmed',
      deliveryAddress: '',
      notes: '',
      workflowStage: 'Ready for Production'
    });
  };

  const handleDelete = (id) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  return (
    <>
    <div className="p-4 ml-7">
      <h1 className="text-xl font-bold mb-4">Sales Orders</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input name="customer" value={form.customer} onChange={handleChange} placeholder="Customer" className="border p-2" required />
        <input name="quoteRef" value={form.quoteRef} onChange={handleChange} placeholder="Quote Ref" className="border p-2" />
        <input name="products" value={form.products} onChange={handleChange} placeholder="Products (comma-separated)" className="border p-2" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount" className="border p-2" />
        <input name="total" value={form.total} onChange={handleChange} placeholder="Total" className="border p-2" />
        <input name="paymentPlan" value={form.paymentPlan} onChange={handleChange} placeholder="Payment Plan" className="border p-2" />
        <input name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="Delivery Address" className="border p-2" />
        <input name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-2" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2">
          <option>Confirmed</option>
          <option>In Production</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Closed</option>
        </select>
        <select name="workflowStage" value={form.workflowStage} onChange={handleChange} className="border p-2">
          <option>Ready for Production</option>
          <option>QC Passed</option>
          <option>Awaiting Delivery</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded col-span-2">Add Order</button>
      </form>

      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">SO Number</th>
            <th className="border px-2 py-1">Customer</th>
            <th className="border px-2 py-1">Quote Ref</th>
            <th className="border px-2 py-1">Products</th>
            <th className="border px-2 py-1">Discount</th>
            <th className="border px-2 py-1">Total</th>
            <th className="border px-2 py-1">Payment</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Workflow</th>
            <th className="border px-2 py-1">Delivery</th>
            <th className="border px-2 py-1">Notes</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="border px-2 py-1">{order.id}</td>
              <td className="border px-2 py-1">{order.customer}</td>
              <td className="border px-2 py-1">{order.quoteRef}</td>
              <td className="border px-2 py-1">{order.products.join(', ')}</td>
              <td className="border px-2 py-1">{order.discount}</td>
              <td className="border px-2 py-1">{order.total}</td>
              <td className="border px-2 py-1">{order.paymentPlan}</td>
              <td className="border px-2 py-1">{order.status}</td>
              <td className="border px-2 py-1">{order.workflowStage}</td>
              <td className="border px-2 py-1">{order.deliveryAddress}</td>
              <td className="border px-2 py-1">{order.notes}</td>
              <td className="border px-2 py-1 text-center">
                <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:underline text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    </>
  );
};

export default Orders;
