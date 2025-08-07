import Link from 'next/link'
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon, SparklesIcon, ArrowRightIcon, ShieldCheckIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section - With Image */}
      <section className="relative overflow-hidden pt-20 pb-32">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl animate-pulse delay-500"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-semibold mb-8 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                AI-Powered Municipal Services
                <SparklesIcon className="w-4 h-4" />
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  CitizenNavigator
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                Your intelligent assistant for municipal services. Get instant answers, 
                report issues seamlessly, and track progress in real-time with our AI-powered platform.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
                <Link
                  href="/chat"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  Start Conversation
                  <ArrowRightIcon className="w-5 h-5" />
                </Link>
                
                <Link
                  href="/report"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
                  Report Issue
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">24/7 Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Real-time Updates</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-3 scale-105 opacity-60"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-3xl transform -rotate-2 scale-110 opacity-40"></div>
              
              {/* Image Container */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-500">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  {/* Hero Image - Replace src with your image path */}
                  <img
                    src="/hero.jpeg"
                    alt="Smart city dashboard showing connected municipal services, citizens using mobile devices, and modern urban infrastructure"
                    className="w-full h-full object-cover rounded-2xl hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              
              {/* Floating Stats Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-sm font-semibold text-gray-700">Live 24/7</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need in one place
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Streamlined municipal services designed for modern citizens
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chat Feature */}
        <Link 
          href="/chat" 
            className="group block"
          aria-label="Start chatting with the AI assistant"
        >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
              Ask Questions
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                Get instant, accurate answers about municipal services with reliable citations from our comprehensive knowledge base.
            </p>

              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>Start chatting</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
          </div>
        </Link>
        
          {/* Report Feature */}
        <Link 
          href="/report" 
            className="group block"
          aria-label="Report a municipal incident"
        >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-red-200 transition-all duration-300 transform hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                Report Issues
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
              Submit detailed incident reports for streetlights, waste collection, road issues, and infrastructure problems.
            </p>

              <div className="flex items-center gap-2 text-red-600 font-semibold">
                <span>Report now</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
          </div>
        </Link>
        
          {/* Status Feature */}
        <Link 
          href="/status" 
            className="group block"
          aria-label="Check incident status"
        >
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-2 h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />
            </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                Track Progress
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                Monitor your submitted reports in real-time with detailed status updates and estimated completion timelines.
              </p>

              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>Check status</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-12 text-white shadow-2xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Trusted by Citizens</h3>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Join thousands who rely on CitizenNavigator for their municipal service needs
            </p>
      </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="group">
              <div className="text-4xl md:text-5xl font-black text-blue-400 mb-2 group-hover:scale-110 transition-transform">
              24/7
              </div>
              <div className="font-semibold mb-1">Always Available</div>
              <div className="text-blue-300 text-sm">Round-the-clock service</div>
            </div>
            
          <div className="group">
              <div className="text-4xl md:text-5xl font-black text-green-400 mb-2 group-hover:scale-110 transition-transform">
                &lt;2s
              </div>
              <div className="font-semibold mb-1">Response Time</div>
              <div className="text-blue-300 text-sm">AI-powered speed</div>
            </div>
            
          <div className="group">
              <div className="text-4xl md:text-5xl font-black text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                100%
              </div>
              <div className="font-semibold mb-1">Cited Sources</div>
              <div className="text-blue-300 text-sm">Verified information</div>
            </div>
            
          <div className="group">
              <div className="text-4xl md:text-5xl font-black text-orange-400 mb-2 group-hover:scale-110 transition-transform">
                Live
              </div>
              <div className="font-semibold mb-1">Updates</div>
              <div className="text-blue-300 text-sm">Real-time tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-24">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Experience municipal services like never before. Start your conversation today.
        </p>
        
        <Link
          href="/chat"
          className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6" />
          Start Your Journey
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </section>
    </div>
  )
}