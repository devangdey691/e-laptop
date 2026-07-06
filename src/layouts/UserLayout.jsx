import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/layouts/Navbar'
import Footer from '../components/layouts/Footer'

const UserLayout = () => {
    const location = useLocation();

    useEffect(() => {
        const observerOptions = {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Stop observing once it has animated in
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const observeElements = () => {
            const elements = document.querySelectorAll('.scroll-reveal:not(.revealed)');
            elements.forEach(el => observer.observe(el));
        };

        // Initial check
        observeElements();

        // Use MutationObserver to watch for new scroll-reveal nodes being added
        const mutationObserver = new MutationObserver((mutations) => {
            let hasNewNodes = false;
            for (const mutation of mutations) {
                if (mutation.addedNodes.length > 0) {
                    hasNewNodes = true;
                    break;
                }
            }
            if (hasNewNodes) {
                observeElements();
            }
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, [location.pathname]);

    return (
        <div>
            <Navbar/>
            <Outlet />
            <Footer/>
        </div>
    )
}

export default UserLayout
