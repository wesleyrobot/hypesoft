import { useState, useEffect, useRef } from "react"
import { Send, Search, MoreHorizontal, Phone, Video, Bell } from "lucide-react"

type Msg = { from: "me" | "them"; text: string; time: string }

const INITIAL_CONTACTS = [
  { id: 1, name: "Alice Morgan",  avatar: "https://i.pravatar.cc/40?img=1",  lastMessage: "Can you check the Bomber Jacket stock?", time: "10:08", unread: 3, online: true  },
  { id: 2, name: "James Carter",  avatar: "https://i.pravatar.cc/40?img=5",  lastMessage: "The new shipment arrived today!",             time: "09:50", unread: 1, online: true  },
  { id: 3, name: "Sofia Lima",    avatar: "https://i.pravatar.cc/40?img=9",  lastMessage: "Thanks for updating the prices.",             time: "08:32", unread: 0, online: false },
  { id: 4, name: "Ryan Brooks",   avatar: "https://i.pravatar.cc/40?img=12", lastMessage: "Do we have more Canvas Sneakers?",            time: "07:20", unread: 0, online: false },
  { id: 5, name: "Mia Torres",    avatar: "https://i.pravatar.cc/40?img=15", lastMessage: "The sale campaign was a success!",            time: "Yesterday", unread: 0, online: true  },
  { id: 6, name: "Lucas Silva",   avatar: "https://i.pravatar.cc/40?img=20", lastMessage: "Invoice #1042 has been processed.",           time: "Yesterday", unread: 0, online: false },
]

const INITIAL_MESSAGES: Record<number, Msg[]> = {
  1: [
    { from: "them", text: "Hey! Can you check the Bomber Jacket stock? We have customers waiting.", time: "10:02" },
    { from: "me",   text: "Sure! Let me check right now.",                                          time: "10:03" },
    { from: "me",   text: "We have 15 units in stock. Should be enough!",                          time: "10:03" },
    { from: "them", text: "Great, thanks! Can you update the price to R$ 319,90?",                 time: "10:05" },
    { from: "me",   text: "Done! Price updated successfully.",                                      time: "10:06" },
    { from: "them", text: "Can you check the Bomber Jacket stock?",                                time: "10:08" },
  ],
  2: [
    { from: "them", text: "The new shipment arrived today!",                                        time: "09:45" },
    { from: "me",   text: "Awesome! How many units?",                                               time: "09:47" },
    { from: "them", text: "Around 50 units of mixed products. Need to update the inventory.",       time: "09:48" },
    { from: "me",   text: "I'll update everything in the system right away.",                       time: "09:50" },
  ],
  3: [
    { from: "me",   text: "Hi Sofia, I've updated the product prices as requested.",               time: "08:30" },
    { from: "them", text: "Thanks for updating the prices.",                                        time: "08:32" },
    { from: "them", text: "Everything looks great on our end!",                                     time: "08:32" },
  ],
  4: [
    { from: "them", text: "Do we have more Canvas Sneakers?",                                       time: "07:15" },
    { from: "me",   text: "Currently 3 units. Restock coming next week.",                          time: "07:18" },
    { from: "them", text: "Ok, I'll let the customers know.",                                       time: "07:20" },
  ],
  5: [
    { from: "them", text: "The sale campaign was a success!",   time: "Yesterday 17:00" },
    { from: "me",   text: "Amazing! What were the results?",    time: "Yesterday 17:05" },
    { from: "them", text: "We sold 47 products in one day. Record!", time: "Yesterday 17:06" },
    { from: "me",   text: "That's fantastic! Well done team!", time: "Yesterday 17:07" },
  ],
  6: [
    { from: "them", text: "Invoice #1042 has been processed.", time: "Yesterday 14:30" },
    { from: "me",   text: "Perfect, thank you Lucas!",         time: "Yesterday 14:35" },
  ],
}

export default function Messages() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS)
  const [activeId, setActiveId] = useState(INITIAL_CONTACTS[0].id)
  const [input, setInput] = useState("")
  const [searchContact, setSearchContact] = useState("")
  const [messages, setMessages] = useState<Record<number, Msg[]>>(INITIAL_MESSAGES)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeContact = contacts.find((c) => c.id === activeId)!
  const totalUnread = contacts.reduce((s, c) => s + c.unread, 0)

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeId])

  const openContact = (id: number) => {
    setActiveId(id)
    // Mark as read
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    )
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    // Add message to conversation
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { from: "me", text, time }],
    }))
    // Update contact preview
    setContacts((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, lastMessage: text, time } : c))
    )
    setInput("")
  }

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchContact.toLowerCase())
  )
  const chat = messages[activeId] ?? []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Messages</h1>
          <p className="text-sm text-gray-500 mt-0.5">Team conversations and customer support</p>
        </div>
        {totalUnread > 0 && (
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
            <Bell className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-semibold text-purple-700">
              {totalUnread} unread message{totalUnread > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden flex" style={{ height: "calc(100vh - 200px)" }}>
        {/* Contact list */}
        <div className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                placeholder="Search contacts..."
                value={searchContact}
                onChange={(e) => setSearchContact(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((contact) => (
              <button
                key={contact.id}
                onClick={() => openContact(contact.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 ${
                  activeId === contact.id ? "bg-purple-50 border-l-2 border-l-purple-500" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
                  {contact.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={`text-sm truncate ${contact.unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                      {contact.name}
                    </p>
                    <span className="text-[10px] text-gray-400 shrink-0 ml-1">{contact.time}</span>
                  </div>
                  <p className={`text-xs truncate ${contact.unread > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unread > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white px-1.5 shrink-0">
                    {contact.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src={activeContact.avatar} alt={activeContact.name} className="h-9 w-9 rounded-full object-cover" />
                {activeContact.online && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 border-2 border-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{activeContact.name}</p>
                <p className="text-xs text-gray-400">{activeContact.online ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <Phone className="h-4 w-4 text-gray-500" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <Video className="h-4 w-4 text-gray-500" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                {msg.from === "them" && (
                  <img src={activeContact.avatar} alt="" className="h-7 w-7 rounded-full object-cover mr-2 mt-1 shrink-0" />
                )}
                <div
                  className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                    msg.from === "me"
                      ? "bg-purple-600 text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === "me" ? "text-purple-200" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-3.5 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400"
                placeholder={`Message ${activeContact.name}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
