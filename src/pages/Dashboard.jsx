import { Link } from 'react-router-dom';

export default function Dashboard() {
  const mockBookings = [
    { id: 1, service: 'Plumbing Repair', date: '2024-07-20', status: 'Completed', professional: 'John Smith' },
    { id: 2, service: 'Electrical Installation', date: '2024-08-05', status: 'Scheduled', professional: 'Jane Doe' },
    { id: 3, service: 'House Cleaning', date: '2024-08-12', status: 'Pending', professional: 'Mike Johnson' },
  ];

  const stats = [
    { label: 'Total Bookings', value: '12' },
    { label: 'Completed', value: '10' },
    { label: 'Saved Professionals', value: '5' },
    { label: 'Total Spent', value: '$750' },
  ];

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-orange-500">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">Service</th>
                <th className="text-left py-3 px-4 font-semibold">Professional</th>
                <th className="text-left py-3 px-4 font-semibold">Date</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4">{booking.service}</td>
                  <td className="py-4 px-4">{booking.professional}</td>
                  <td className="py-4 px-4">{booking.date}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-orange-500 hover:text-orange-600 font-semibold">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/services" className="btn-primary">
          Book More Services
        </Link>
      </div>
    </div>
  );
}
