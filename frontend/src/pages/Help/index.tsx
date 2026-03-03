import { useState } from "react"
import { ChevronDown, BookOpen, MessageCircle, FileText, ExternalLink } from "lucide-react"

const FAQS = [
  {
    q: "How do I add a new product?",
    a: "Go to the Products page and click the 'New Product' button in the top right corner. Fill in the product details including name, description, price, category and stock quantity, then click Save.",
  },
  {
    q: "How do I update the stock quantity of a product?",
    a: "On the Products page, click the stock number of any product (shown in the Stock column). A dialog will appear where you can adjust the quantity up or down.",
  },
  {
    q: "What does 'Low Stock' mean?",
    a: "A product is marked as 'Low Stock' when its quantity falls below 10 units. These products are highlighted in the Products page and also appear in the Notifications bell on the Dashboard.",
  },
  {
    q: "How do I filter products by category?",
    a: "On the Products page, use the category dropdown next to the search bar to filter by a specific category. You can also search by product name using the search field.",
  },
  {
    q: "How do I create or edit categories?",
    a: "Navigate to the Customers page (which manages categories) in the sidebar. You can create new categories with a name and description, or edit and delete existing ones.",
  },
  {
    q: "How does authentication work?",
    a: "Hypesoft uses Keycloak for secure authentication. Read-only operations (viewing products and categories) are public. Creating, editing, or deleting products and categories requires you to be logged in.",
  },
  {
    q: "How do I log out?",
    a: "Click the 'Logout' button at the bottom of the left sidebar. This will sign you out via Keycloak and redirect you to the login page.",
  },
  {
    q: "Where can I see statistics and analytics?",
    a: "The Statistics page (accessible from the sidebar) shows charts for products by category, distribution pie charts, and a summary table. The Dashboard also shows key metrics at a glance.",
  },
]

const DOCS = [
  { icon: BookOpen, title: "Getting Started Guide", desc: "Learn the basics of Hypesoft product management", color: "bg-purple-50 text-purple-600" },
  { icon: FileText, title: "API Documentation", desc: "Full REST API reference for developers", color: "bg-blue-50 text-blue-600" },
  { icon: MessageCircle, title: "Support Center", desc: "Contact our team for technical assistance", color: "bg-green-50 text-green-600" },
]

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Help & Support</h1>
        <p className="text-sm text-gray-500 mt-0.5">Find answers and get in touch with our team</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-4">
        {DOCS.map(({ icon: Icon, title, desc, color }) => (
          <button
            key={title}
            className="bg-white rounded-2xl shadow-card p-4 text-left hover:shadow-card-hover transition-shadow group"
          >
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${color} mb-3`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
            <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            <div className="flex items-center gap-1 mt-2 text-purple-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {FAQS.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-5 text-white">
        <h2 className="text-sm font-semibold mb-1">Still need help?</h2>
        <p className="text-xs text-purple-200 mb-4">Our support team is available Monday–Friday, 9am–6pm BRT.</p>
        <div className="flex gap-2">
          <button className="flex-1 rounded-xl bg-white/20 hover:bg-white/30 transition-colors py-2 text-xs font-semibold">
            Chat with us
          </button>
          <button className="flex-1 rounded-xl bg-white text-purple-700 hover:bg-purple-50 transition-colors py-2 text-xs font-semibold">
            Send Email
          </button>
        </div>
      </div>
    </div>
  )
}
