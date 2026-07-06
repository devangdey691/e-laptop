import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layouts/Sidebar'
import { Menu, X } from 'lucide-react'

const AdminLayout = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
            {/* Mobile Admin Header */}
            <div className="flex items-center justify-between bg-gray-900 text-white p-4 md:hidden shadow-md shrink-0">
                <span className="text-lg font-black tracking-tight flex items-center">
                    🛒 E-<span className="text-blue-500">Admin</span>
                </span>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity"
                        onClick={() => setIsMobileOpen(false)}
                    />
                    
                    {/* Drawer Content */}
                    <div className="relative flex w-64 max-w-xs flex-col bg-gray-900 text-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <span className="text-lg font-black tracking-tight">
                                🛒 E-<span className="text-blue-500">Admin</span>
                            </span>
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Close Menu"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <Sidebar isMobile={true} onClose={() => setIsMobileOpen(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout