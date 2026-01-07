export const formatOrderDate = (isoString: string) => {
	const date = new Date(isoString);

	if (isNaN(date.getTime())) return 'Invalid Date';

	// Add IST offset (+5 hours 30 minutes)
	const istDate = new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000);

	// Format day, month, year
	const day = String(istDate.getDate()).padStart(2, '0');
	const month = String(istDate.getMonth() + 1).padStart(2, '0');
	const year = String(istDate.getFullYear()).slice(-2);

	// Format hour & minute in 12-hour format
	let hours = istDate.getHours();
	const minutes = String(istDate.getMinutes()).padStart(2, '0');
	const dayPeriod = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12 || 12; // convert 0 → 12
	const hourStr = String(hours).padStart(2, '0');

	return `${day}/${month}/${year} ${hourStr}:${minutes} ${dayPeriod}`;
};
