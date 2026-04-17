import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import { api } from '../../services/api';

const OrderHistoryTable = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDownload = () => {
    if (!filteredOrders) return;
    
    const csvContent = [
      ['Symbol', 'Side', 'Amount', 'Status', 'Reason', 'Timestamp'].join(','),
      ...filteredOrders.map(order => [
        order.symbol,
        order.side,
        order.amount,
        order.status,
        order.reason,
        order.timestamp
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'order-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSideClass = (side) => side === 'BUY' ? 'text-secondary-jade' : 'text-tertiary-magenta';
  const getStatusClass = (status) => status === 'Fulfilled' ? 'bg-secondary-jade/10 text-secondary-jade border border-secondary-jade/20' : 'bg-gray-800 text-gray-400';

  const filteredOrders = orderData?.filter(order => 
    order?.symbol?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
    order?.reason?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')
  ) || [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getOrderHistory();
        setOrderData(data);
      } catch (error) {
        console.error('Failed to fetch order history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="glass-panel overflow-hidden">
        <div className="p-6 invisible-border flex justify-between items-center">
          <h2 className="font-space-grotesk text-lg font-bold tracking-tight text-white">
            AUTONOMOUS ORDER HISTORY
          </h2>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border border-white/10 text-xs pl-9 pr-4 py-1.5 focus:ring-1 focus:ring-primary-cyan w-64 text-white placeholder:text-gray-500 rounded-sm"
            />
            <button 
              onClick={handleDownload}
              className="px-4 py-1.5 text-[11px] font-bold font-space-grotesk bg-gray-700 text-white hover:bg-gray-600 transition-colors uppercase flex items-center gap-2"
            >
              <Download size={14} />
              Download CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[11px] leading-relaxed">
            <thead>
              <tr className="bg-gray-900/50 invisible-border">
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Symbol
                </th>
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Side
                </th>
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Amount
                </th>
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Reason
                </th>
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Timestamp
                </th>
                <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[11px]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y invisible-border">
              {[...Array(4)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-800/10 transition-colors cursor-pointer">
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                  <td className="px-6 py-4 h-4 bg-gray-700 rounded animate-pulse"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (!orderData) return null;

  return (
    <section className="glass-panel overflow-hidden">
      
      {/* Header */}
      <div className="p-6 invisible-border flex justify-between items-center">
        <h2 className="font-space-grotesk text-lg font-bold tracking-tight text-white">
          AUTONOMOUS ORDER HISTORY
        </h2>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border border-white/10 text-xs pl-9 pr-4 py-1.5 focus:ring-1 focus:ring-primary-cyan w-64 text-white placeholder:text-gray-500 rounded-sm"
            />
          </div>
          <button 
            onClick={handleDownload}
            className="px-4 py-1.5 text-[11px] font-bold font-space-grotesk bg-gray-700 text-white hover:bg-gray-600 transition-colors uppercase flex items-center gap-2"
          >
            <Download size={14} />
            Download CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-[11px] leading-relaxed">
          <thead>
            <tr className="bg-gray-900/50 invisible-border">
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Symbol
              </th>
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Side
              </th>
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Amount
              </th>
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Reason
              </th>
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Timestamp
              </th>
              <th className="px-6 py-4 font-space-grotesk uppercase tracking-widest text-gray-400 text-[10px]">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y invisible-border">
            {filteredOrders.map((order) => (
              <tr 
                key={order.id} 
                className="hover:bg-gray-800/10 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 text-primary-cyan font-bold">
                  {order.symbol}
                </td>
                <td className={`px-6 py-4 font-bold ${getSideClass(order.side)}`}>
                  {order.side}
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {order.amount}
                </td>
                <td className="px-6 py-4 text-gray-400 max-w-xs truncate">
                  {order.reason}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {order.timestamp}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 uppercase text-[9px] rounded-sm ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OrderHistoryTable;
