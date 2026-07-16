import { Link } from 'react-router-dom';
import {
  Search,
  Star,
  Shield,
  Clock,
  Wrench,
  PaintBucket,
  Zap,
  SprayCan as Cleaning,
  Tv,
  Snowflake,
  Smartphone,
  Truck,
  ChevronRight,
  CheckCircle2,
  Users,
  Calendar,
  Award,
  Quote,
} from 'lucide-react';

const services = [
  { name: 'Plumbing', icon: Wrench, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electrical', icon: Zap, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Home Cleaning', icon: Cleaning, color: 'bg-green-100 text-green-600' },
  { name: 'Painting', icon: PaintBucket, color: 'bg-purple-100 text-purple-600' },
  { name: 'Appliance Repair', icon: Tv, color: 'bg-red-100 text-red-600' },
  { name: 'AC Service', icon: Snowflake, color: 'bg-cyan-100 text-cyan-600' },
  { name: 'Mobile Repair', icon: Smartphone, color: 'bg-orange-100 text-orange-600' },
  { name: 'Packers & Movers', icon: Truck, color: 'bg-indigo-100 text-indigo-600' },
];

const steps = [
  {
    title: 'Book a Service',
    desc: 'Choose from 50+ trusted services and pick a time that works for you.',
    icon: Calendar,
  },
  {
    title: 'We Connect You',
    desc: 'We match you with a verified, background-checked professional in minutes.',
    icon: Users,
  },
  {
    title: 'Relax & Enjoy',
    desc: 'Sit back while our expert gets the job done with a smile.',
    icon: Star,
  },
];

const reasons = [
  {
    title: 'Verified Professionals',
    desc: 'Every service partner undergoes a thorough background check and skill assessment.',
    icon: Shield,
  },
  {
    title: 'Hassle-Free Booking',
    desc: 'Pick a time slot that suits you. No calls, no coordination headaches.',
    icon: Calendar,
  },
  {
    title: 'Service Guarantee',
    desc: 'Not satisfied? We\'ll fix it or refund you. No questions asked.',
    icon: Award,
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Homeowner, Mumbai',
    text: 'The plumber arrived on time and fixed a complex issue in under an hour. Incredible service!',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    role: 'Software Engineer, Bangalore',
    text: 'I\'ve used HomeEase for cleaning, AC service, and electrical work. Always professional and reliable.',
    rating: 5,
  },
  {
    name: 'Anita Patel',
    role: 'Teacher, Delhi',
    text: 'Booked a painter for my entire house. The quality was outstanding and the pricing was transparent.',
    rating: 5,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              Trusted by 50,000+ customers
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Home Services,
              <br />
              <span className="text-emerald-200">On Your Schedule</span>
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/80 mb-10 max-w-2xl mx-auto">
              From plumbing to painting, find verified professionals who show up on time and
              deliver quality work. Book in 60 seconds.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="What service do you need? (e.g., Plumbing)"
                  className="w-full pl-12 pr-36 py-4 rounded-xl text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 text-white px-6 py-2.5 rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-emerald-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Verified Pros
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Transparent Pricing
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 24/7 Support
              </span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Happy Customers', icon: Users },
              { value: '500+', label: 'Service Partners', icon: Award },
              { value: '50+', label: 'Services Offered', icon: Wrench },
              { value: '4.8', label: 'Average Rating', icon: Star },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <stat.icon className="w-5 h-5 mx-auto text-emerald-600" />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">
              Simple Process
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Three easy steps to get your home services done
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center group">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-emerald-200" />
                )}
                <div className="w-24 h-24 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-emerald-600 transition-colors group-hover:shadow-lg group-hover:shadow-emerald-200">
                  <step.icon className="w-10 h-10 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-emerald-600 text-white rounded-full text-sm font-bold mb-3">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14">
            <div className="max-w-xl">
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">
                Our Services
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Popular Services
              </h2>
              <p className="text-gray-600 text-lg">
                Choose from a wide range of professional home services
              </p>
            </div>
            <Link
              to="/services"
              className="hidden lg:inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold mt-4 lg:mt-0"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {services.map((service) => (
              <Link
                key={service.name}
                to="/services"
                className="group bg-gray-50 hover:bg-white rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-100/40 transition-all"
              >
                <div
                  className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <service.icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Book Now &rarr;</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center lg:hidden">
            <Link
              to="/services"
              className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              View All Services <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">
                Why HomeEase
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6">
                We Make Home Service Simple & Reliable
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Our platform connects you with the best professionals in your area. Every
                service partner is vetted, trained, and rated by real customers.
              </p>
              <div className="space-y-6">
                {reasons.map((reason) => (
                  <div key={reason.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                      <reason.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{reason.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{reason.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Quote className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">4.8 Average Rating</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      name: 'Sneha K.',
                      text: 'The AC service was thorough and affordable. Technician was very professional!',
                    },
                    {
                      name: 'Amit R.',
                      text: 'Best plumbing service I\'ve used in Bangalore. Showed up exactly on time.',
                    },
                    {
                      name: 'Meera D.',
                      text: 'Home cleaning transformed my apartment. Worth every penny!',
                    },
                  ].map((review) => (
                    <div
                      key={review.name}
                      className="border-l-4 border-emerald-200 pl-4"
                    >
                      <p className="text-gray-700 text-sm italic">
                        &ldquo;{review.text}&rdquo;
                      </p>
                      <p className="text-gray-500 text-xs mt-1 font-medium">
                        — {review.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-600 font-semibold text-sm tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real stories from real customers who trust HomeEase
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-bold text-sm">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
            Ready to Make Your Home Life Easier?
          </h2>
          <p className="text-lg text-emerald-100/80 mb-8 max-w-xl mx-auto">
            Join 50,000+ happy customers. Book your first service today and get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-emerald-700 px-8 py-3.5 rounded-xl hover:bg-emerald-50 font-semibold text-sm transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/services"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl hover:bg-white/20 font-semibold text-sm transition-colors border border-white/20"
            >
              Browse Services
            </Link>
          </div>
          <p className="text-emerald-200/60 text-sm mt-4">
            No commitments. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
