'use client';
import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import { useNotice } from '@/context/noticeContext';

const fetchAttendance = async () => {
	try {
		const res = await fetch('/api/attendance');
		if (!res.ok) {
			const errorText = await res.text();
			console.error(`Fetch error (${res.status}): ${errorText}`);
			return [];
		}
		const json = await res.json();
		return json?.data ?? [];
	} catch (error) {
		console.error('Network or Parsing Error:', error);
		return [];
	}
};

export default function StaffPage() {
    const {addNotice} = useNotice();
	const queryClient = useQueryClient();
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('name');
	const [showModel, setShowModel] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState(null);
	const [isUpdating, setIsUpdating] = useState(false);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['attendance'],
		queryFn: fetchAttendance,
		staleTime: 360 * 60 * 24,
	});

	// Filtering and Sorting Logic
	const filteredAndSortedData = useMemo(() => {
		if (!data) return [];

		// 1. Filter by Name or Role
		let result = data.filter(
			(staff) =>
				staff.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				staff.role?.toLowerCase().includes(searchTerm.toLowerCase())
		);

		// 2. Sort Logic
		result.sort((a, b) => {
			if (sortBy === 'name') return a.full_name.localeCompare(b.full_name);
			if (sortBy === 'salary-desc') return b.salary - a.salary;
			if (sortBy === 'present-desc') return b.days_present - a.days_present;
			return 0;
		});

		return result;
	}, [data, searchTerm, sortBy]);

	// Function to trigger the modal
	const handlePaidClick = (staff) => {
		if (staff.isPaid) return; // Prevent modal if already paid
		setSelectedStaff(staff);
		setShowModel(true);
	};

	// Actual PATCH request logic
	const confirmPayment = async () => {
		if (!selectedStaff) return;
		setIsUpdating(true);

		try {
			const res = await fetch('/api/attendance', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: selectedStaff, isPaid: true }),
			});

			if (res.ok) {
				addNotice('Payment Update successful');
				queryClient.invalidateQueries(['attendance']);
				setShowModel(false);
				setSelectedStaff(null);
			} else {
				const error = await res.text();
				addNotice(`Update failed: ${error}`);
			}
		} catch (error) {
			console.error('Payment Update Error:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	// Function to handle Excel Export
	const exportToExcel = () => {
		// Prepare the data: Map internal keys to Readable Headers
		const excelData = filteredAndSortedData.map((staff, index) => {
			const totalDays = staff.days_present + staff.days_absent || 31;
			const totalPayment = Math.round((staff.salary / totalDays) * staff.days_present);

			return {
				'Full Name': staff.full_name,
				Mobile: staff.mobile || 'N/A',
				Role: staff.role,
				'Monthly Salary': staff.salary,
				'Days Present': staff.days_present,
				'Days Absent': staff.days_absent,
				Payment: totalPayment,
			};
		});

		// Create worksheet
		const worksheet = XLSX.utils.json_to_sheet(excelData);
		// Create workbook
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

		// Download the file
		XLSX.writeFile(workbook, `Attendance_Sheet_${new Date().toISOString().split('T')[0]}.xlsx`);
	};

	if (isError) return <div className="text-center p-10">Error loading data.</div>;

	return (
		<>
			<section className="px-2 md:px-4 mt-4">
				<div className="flex flex-col md:flex-row justify-between items-center p-2 bg-mid gap-4">
					<h1 className="text-center text-2xl font-light md:ml-4">Attendance Sheet</h1>
					<div className="flex gap-4">
						{/* search area */}
						<div className="px-3 py-1 rounded-full shadow bg-light font-light">
							<input
								type="search"
								placeholder="Search staff or role..."
								className="outline-none"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>
						{/* sort area */}
						<div className="px-3 py-1 rounded-full shadow bg-light">
							<select
								className="outline-none bg-light font-light"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="name">Sort by Name</option>
								<option value="salary-desc">Highest Salary</option>
								<option value="present-desc">Highest Attendance</option>
							</select>
						</div>
					</div>
				</div>
			</section>

			<section className="px-2 md:px-4">
                {/* Table */}
				<div className="overflow-x-auto border border-myBorder">
					<table className="w-full border-collapse text-left bg-mid">
						<thead className="bg-black text-neutral-100">
							<tr className="border-b border-myBorder">
								<th className="px-4 py-2">S.I</th>
								<th className="px-4 py-2">Full Name</th>
								<th className="px-4 py-2">Mobile</th>
								<th className="px-4 py-2">Role</th>
								<th className="px-4 py-2 text-right">Salary</th>
								<th className="px-4 py-2 text-right">Present</th>
								<th className="px-4 py-2 text-right">Absent</th>
								<th className="px-4 py-2 text-right">Payment</th>
								<th className="px-4 py-2 text-center">Paid</th>
							</tr>
						</thead>
						<tbody>
							{isLoading
								? Array.from({ length: 10 }).map((_, i) => (
										<tr key={i} className="border-b last:border-0 border-myBorder animate-pulse">
											<td colSpan={9} className="h-12 bg-black/5"></td>
										</tr>
								  ))
								: filteredAndSortedData.map((staff, i) => {
										const totalPayment = Math.round(
											(staff.salary / (staff.days_present + staff.days_absent || 31)) *
												staff.days_present
										);

										return (
											<tr
												key={staff.id}
												className="border-b last:border-0 border-myBorder hover:opacity-80 even:bg-black/10 capitalize font-light"
											>
												<td className="px-4 py-2">{i + 1}</td>
												<td className="px-4 py-2 font-medium">{staff.full_name}</td>
												<td className="px-4 py-2">{staff.mobile || 'N/A'}</td>
												<td className="px-4 py-2">{staff.role}</td>
												<td className="px-4 py-2 text-right">
													₹{staff.salary?.toLocaleString()}
												</td>
												<td className="px-4 py-2 text-right font-semibold text-green-500">{staff.days_present}</td>
												<td className="px-4 py-2 text-right font-semibold text-red-500">{staff.days_absent}</td>
												<td className="px-4 py-2 text-right font-bold">
													₹{totalPayment.toLocaleString()}
												</td>
												<td className={`px-4 py-2 text-center`}>
													<button
														type="button"
														disabled={staff.isPaid}
														className={`px-4 py-1 rounded-sm shadow transition-opacity ${
															staff.isPaid
																? 'bg-green-500 text-white cursor-default'
																: 'bg-red-500 text-white hover:opacity-90'
														}`}
														onClick={() => handlePaidClick(staff.id)}
													>
														{staff.isPaid ? 'Paid' : 'Mark Paid'}
													</button>
												</td>
											</tr>
										);
								  })}
						</tbody>
					</table>
				</div>

                {/* Print btn */}
				<div className="text-right my-5">
					<button
						type="button"
						onClick={exportToExcel}
						className="bg-green-600 text-white rounded-sm shadow py-1 px-6 hover:bg-green-700 transition-colors"
					>
						Export to Excel
					</button>
				</div>
			</section>

			{/* Confirmation Modal */}
			{showModel && (
				<div className="fixed inset-0 bg-black/50 backdrop:blur-sm flex items-center justify-center z-50 backdrop-blur-sm">
					<div className="bg-light p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
						<h3 className="text-xl font-semibold text-main">Confirm Payment</h3>
						<p className="mt-2 text-main font-light">
							Are you sure you want to mark payment for <strong>{selectedStaff?.full_name}</strong> as
							complete?
						</p>
						<div className="mt-6 flex justify-end gap-3">
							<button
								onClick={() => setShowModel(false)}
								className="px-4 py-2 text-muted hover:bg-neutral-100 hover:text-neutral-900 rounded-md transition-colors"
								disabled={isUpdating}
							>
								Cancel
							</button>
							<button
								onClick={confirmPayment}
								className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
								disabled={isUpdating}
							>
								{isUpdating ? 'Processing...' : 'Confirm Paid'}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
