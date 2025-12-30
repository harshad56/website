import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { FileText, CheckCircle2, CreditCard, ShieldAlert, Scale, ChevronRight } from "lucide-react";

const clauses = [
  {
    title: "Acceptance of terms",
    icon: <CheckCircle2 className="w-6 h-6 text-blue-400" />,
    description: "By creating an account you agree to our acceptable use guidelines, payment terms, and privacy policy."
  },
  {
    title: "Usage rights",
    icon: <Scale className="w-6 h-6 text-purple-400" />,
    description: "Subscriptions grant a non-transferable license to use the platform for personal or team training purposes. No reselling or redistribution of content."
  },
  {
    title: "Billing",
    icon: <CreditCard className="w-6 h-6 text-emerald-400" />,
    description: "Plans renew automatically unless cancelled. We prorate upgrades and offer full refunds within 14 days for self-serve plans."
  },
  {
    title: "Content & conduct",
    icon: <ShieldAlert className="w-6 h-6 text-orange-400" />,
    description: "Be respectful in community spaces. We may suspend accounts that share harmful code, harass users, or breach security."
  },
  {
    title: "Liability",
    icon: <FileText className="w-6 h-6 text-slate-400" />,
    description: "The service is provided \"as-is\". We limit liability to the fees paid for the current term as permitted by law."
  }
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
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
            <Badge variant="outline" className="mb-4 border-indigo-500/30 bg-indigo-500/10 text-indigo-300 px-4 py-1">
              Effective Nov 2025
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">Service</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Please review our key terms. We aim to keep our legal language as clear and straightforward as possible.
            </p>
          </motion.div>
        </header>

        <div className="max-w-4xl mx-auto grid gap-6">
          {clauses.map((clause, idx) => (
            <motion.div
              key={clause.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all duration-300" />
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-indigo-500/20 transition-all duration-300">
                    {clause.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-100">{clause.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-200 transition-colors">
                    {clause.description}
                  </p>
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
          <p className="text-slate-500 mb-6">
            Looking for more details? Download the full legal document.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Scale className="w-5 h-5 text-indigo-400" />
            <span className="text-slate-400">Legal inquiries:</span>
            <a href="mailto:legal@codeacademypro.com" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              legal@codeacademypro.com
            </a>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default TermsOfService;
