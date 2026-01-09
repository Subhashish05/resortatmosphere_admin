'use client';

import { useLayoutEffect } from 'react';

export default function LazyLoading(data) {
	useLayoutEffect(() => {
		let observer;
		let scrollHandler;
		const lazyImages = document.querySelectorAll('.lazy');
		if ('IntersectionObserver' in window) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const img = entry.target;

							img.src = img.dataset.src;
							img.classList.remove('lazy');
							observer.unobserve(img);
						}
					});
				},
				{ rootMargin: '0px 300px 300px 300px' }
			);

			lazyImages.forEach((img) => observer.observe(img));
		} else {
			// Fallback for browsers without IntersectionObserver
			let timeout;
			scrollHandler = () => {
				if (timeout) clearTimeout(timeout);
				timeout = setTimeout(() => {
					const scrollTop = window.scrollY;
					lazyImages.forEach((img) => {
						if (img.offsetTop < window.innerHeight + scrollTop) {
							img.src = img.dataset.src;
							img.classList.remove('lazy');
						}
					});
					if (document.querySelectorAll('.lazy').length === 0) {
						window.removeEventListener('scroll', scrollHandler);
						window.removeEventListener('resize', scrollHandler);
						window.removeEventListener('orientationchange', scrollHandler);
					}
				}, 20);
			};

			window.addEventListener('scroll', scrollHandler);
			window.addEventListener('resize', scrollHandler);
			window.addEventListener('orientationchange', scrollHandler);
		}

		// Cleanup
		return () => {
			if (observer) observer.disconnect();
			if (scrollHandler) {
				window.removeEventListener('scroll', scrollHandler);
				window.removeEventListener('resize', scrollHandler);
				window.removeEventListener('orientationchange', scrollHandler);
			}
		};
	}, [data]);

	return null; // This component doesn't render anything
}
