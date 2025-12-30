import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";

const sections = [
  {
    title: "Data we collect",
    icon: <Eye className="w-6 h-6 text-blue-400" />,
    items: [
      "Account information such as name, email, and authentication tokens",
      "Learning data including course progress, submissions, and messages",
      "Device details (browser, OS) and usage analytics for performance"
    ]
  },
  {
    title: "How we use data",
    icon: <Lock className="w-6 h-6 text-purple-400" />,
    items: [
      "Deliver personalized learning paths and recommendations",
      "Improve platform reliability, security, and new feature planning",
      "Communicate important updates, billing info, and support responses"
    ]
  },
  {
    title: "Your controls",
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    items: [
      "Download or delete your data anytime from account settings",
      "Adjust marketing preferences and notification types",
      "Request human review for automated decisions"
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <BackButton />
        </motion.div>

        <header className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 border-blue-500/30 bg-blue-500/10 text-blue-300 px-4 py-1">
              Updated Nov 2025
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">Policy</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              At CodeAcademy Pro, we care deeply about transparency. This policy outlines how we protect and handle your personal journey.
            </p>
          </motion.div>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300">
                    {section.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-100">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-400 group-hover:text-slate-300 transition-colors">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                        <span className="text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400">Questions? Reach out to</span>
            <a href="mailto:privacy@codeacademypro.com" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              privacy@codeacademypro.com
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500 uppercase tracking-widest">
            We respond to all requests within 30 days.
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
