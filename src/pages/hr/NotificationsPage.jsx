// pages/Notifications/NotificationsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

// Lucide React Icons
import {
    Bell, ArrowLeft, Mail,MessageSquare ,Tag, MailOpen, Trash2, ListChecks, AlertCircle, Filter,
    Calendar, User, DollarSign, FileText, Clock, Info, XCircle
} from 'lucide-react';

const NotificationsPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'read', 'unread'

    // --- Inline Mock Data for Notifications ---
    const mockNotifications = [
        {
            id: 'notif-001',
            type: 'Leave Request',
            message: 'New leave request from Aisha Demisse for Annual Leave (July 20-25).',
            date: '2025-07-10T10:30:00Z',
            isRead: false,
            link: '/leave/approval',
            icon: Calendar,
            priority: 'high'
        },
        {
            id: 'notif-002',
            type: 'Performance Review',
            message: 'Performance review for Tesfaye Gebre is due by July 31st.',
            date: '2025-07-05T09:00:00Z',
            isRead: false,
            link: '/performance/reviews/emp-002',
            icon: FileText,
            priority: 'high'
        },
        {
            id: 'notif-003',
            type: 'Payroll Alert',
            message: 'Payroll for July 2025 is ready for processing.',
            date: '2025-07-28T15:00:00Z',
            isRead: true,
            link: '/payroll/processing',
            icon: DollarSign,
            priority: 'medium'
        },
        {
            id: 'notif-004',
            type: 'System Update',
            message: 'System maintenance scheduled for August 1st, 2:00 AM - 4:00 AM EAT.',
            date: '2025-07-20T11:00:00Z',
            isRead: false,
            link: '/system/announcements',
            icon: Info,
            priority: 'low'
        },
        {
            id: 'notif-005',
            type: 'Feedback Received',
            message: 'You received new feedback from John Smith.',
            date: '2025-07-12T14:45:00Z',
            isRead: false,
            link: '/performance/feedback-log',
            icon: MessageSquare,
            priority: 'medium'
        },
        {
            id: 'notif-006',
            type: 'Asset Return',
            message: 'Reminder: Projector (Epson) checked out by Sara Ali is due for return today.',
            date: '2025-07-13T08:00:00Z',
            isRead: false,
            link: '/inventory/asset-assignment',
            icon: Tag,
            priority: 'high'
        },
        {
            id: 'notif-007',
            type: 'Loan Application',
            message: 'Tesfaye Gebre has submitted a new Housing Advance application.',
            date: '2025-07-11T16:20:00Z',
            isRead: true,
            link: '/finance/loan-management',
            icon: DollarSign,
            priority: 'medium'
        },
    ];
    // --- End Inline Mock Data ---

    const [notifications, setNotifications] = useState([]);

    const filterOptions = [
        { value: 'all', label: 'All Notifications' },
        { value: 'unread', label: 'Unread' },
        { value: 'read', label: 'Read' },
    ];

    useEffect(() => {
        setLoading(true);
        setError(null);
        setTimeout(() => {
            // Sort notifications by date, newest first
            const sortedNotifications = [...mockNotifications].sort((a, b) => new Date(b.date) - new Date(a.date));
            setNotifications(sortedNotifications);
            setLoading(false);
        }, 700);
    }, []);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(notif => {
            if (filterStatus === 'all') return true;
            return filterStatus === 'read' ? notif.isRead : !notif.isRead;
        });
    }, [notifications, filterStatus]);

    const handleMarkAsReadToggle = (id) => {
        setNotifications(prevNotifs =>
            prevNotifs.map(notif =>
                notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
            )
        );
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prevNotifs =>
            prevNotifs.map(notif => ({ ...notif, isRead: true }))
        );
    };

    const handleDeleteNotification = (id) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            setNotifications(prevNotifs => prevNotifs.filter(notif => notif.id !== id));
        }
    };

    const getPriorityClasses = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-700 border-red-200';
            case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50 min-h-screen font-inter">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                    <Bell className="w-10 h-10 text-indigo-600" /> Notifications
                </h1>
                <Link to="/hr/employees"> {/* Assuming a main dashboard */}
                    <Button variant="secondary" className="flex items-center gap-2 px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                        <ArrowLeft size={20} /> Back to Dashboard
                    </Button>
                </Link>
            </div>

            {loading && (
                <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                    <LoadingSpinner />
                    <p className="mt-4 text-lg text-gray-600">Loading notifications...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative mb-6 shadow-md" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="mr-3" size={24} />
                        <div>
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline ml-2">{error}</span>
                        </div>
                    </div>
                </div>
            )}

            {!loading && (
                <>
                    {/* Filters and Actions */}
                    <Card className="p-6 rounded-xl shadow-lg border border-gray-100 bg-white mb-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="w-full md:w-1/3">
                                <Select
                                    label="Filter by Status"
                                    name="filterStatus"
                                    options={filterOptions}
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    icon={<Filter size={18} className="text-gray-400" />}
                                />
                            </div>
                            <div className="flex gap-3 w-full md:w-auto justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={handleMarkAllAsRead}
                                    disabled={filteredNotifications.every(notif => notif.isRead)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                                >
                                    <MailOpen size={20} /> Mark All as Read
                                </Button>
                                {/* Optionally add a "Delete All Read" button */}
                            </div>
                        </div>
                    </Card>

                    {/* Notifications List */}
                    <Card className="p-8 rounded-xl shadow-lg border border-gray-100 bg-white">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <ListChecks size={24} className="text-indigo-500" /> Your Notifications
                            <span className="ml-3 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold">
                                {filteredNotifications.filter(n => !n.isRead).length} Unread
                            </span>
                        </h2>
                        {filteredNotifications.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredNotifications.map(notif => {
                                    const NotifIcon = notif.icon || Bell; // Fallback to Bell icon
                                    return (
                                        <li
                                            key={notif.id}
                                            className={`p-4 rounded-lg border shadow-sm transition-all duration-200
                                                ${notif.isRead ? 'bg-gray-50 border-gray-200' : `bg-white border-blue-300 ring-1 ring-blue-100 hover:shadow-md`}
                                                ${getPriorityClasses(notif.priority)}
                                            `}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-start gap-3">
                                                    <NotifIcon size={24} className={`flex-shrink-0 ${notif.isRead ? 'text-gray-500' : 'text-blue-600'}`} />
                                                    <div>
                                                        <p className={`text-md font-semibold ${notif.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                                            {notif.type}
                                                        </p>
                                                        <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-800'}`}>
                                                            {notif.message}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 flex items-center gap-2 ml-4">
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(notif.date).toLocaleString()}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsReadToggle(notif.id)}
                                                        className="p-1 rounded-full hover:bg-gray-200"
                                                        title={notif.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                                    >
                                                        {notif.isRead ? <MailOpen size={18} className="text-gray-500" /> : <Mail size={18} className="text-blue-600" />}
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteNotification(notif.id)}
                                                        className="p-1 rounded-full hover:bg-red-100"
                                                        title="Delete Notification"
                                                    >
                                                        <Trash2 size={18} className="text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                            {notif.link && (
                                                <div className="text-right mt-2">
                                                    <Link to={notif.link} className="text-blue-600 hover:underline text-sm font-medium">
                                                        View Details &rarr;
                                                    </Link>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center py-10 text-gray-500 text-lg">
                                No notifications found matching your criteria.
                            </div>
                        )}
                    </Card>
                </>
            )}
        </div>
    );
};

export default NotificationsPage;
