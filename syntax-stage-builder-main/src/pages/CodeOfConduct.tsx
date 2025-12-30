import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/BackButton";
import { Heart, Users, ShieldCheck, Flag, MessageSquare, Handshake } from "lucide-react";

const principles = [
  {
    title: "Be respectful",
    icon: <Heart className="w-6 h-6 text-rose-400" />,
    details: "Celebrate diverse backgrounds. Assume good intent, avoid harassment, and keep discussions inclusive."
  },
  {
    title: "Share responsibly",
    icon: <MessageSquare className="w-6 h-6 text-blue-400" />,
    details: "No plagiarized solutions, leaked interview content, or malicious code."
  },
  {
    title: "Protect privacy",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
    details: "Do not share personal data about yourself or others in public spaces."
  },
  {
    title: "Report issues",
    icon: <Flag className="w-6 h-6 text-amber-400" />,
    details: "Flag abusive content or security concerns via safety@codeacademypro.com."
  }
];

const CodeOfConduct = () => (
  <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
    {/* Background Glows */}
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-rose-600/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
    </div>

    <div className="container mx-auto px-6 py-12 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <BackButton />
      </motion.div>

      <header className="text-center mb-10 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-rose-500/30 bg-rose-500/10 text-rose-300 px-4 py-1 text-[10px] sm:text-xs">
            Community First
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 tracking-tight">
            Code of <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400">Conduct</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed px-2">
            We cultivate a safe, supportive space for learning. These guidelines apply across the platform, events, and social channels.
          </p>
        </motion.div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {principles.map((principle, idx) => (
          <motion.div
            key={principle.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group h-full">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-rose-500/10 transition-all duration-300">
                  {principle.icon}
                </div>
                <CardTitle className="text-xl font-bold text-slate-100">{principle.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-300 transition-colors">
                  {principle.details}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-16 lg:mt-20 text-center px-4"
      >
        <div className="inline-flex flex-col items-center gap-4 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md max-w-2xl mx-auto w-full">
          <Handshake className="w-10 h-10 text-rose-400" />
          <h3 className="text-xl font-bold">Safe Community</h3>
          <p className="text-slate-400 text-sm sm:text-base text-center">
            Violations may result in warnings, suspension, or removal. Help us keep CodeAcademy Pro a space for everyone.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mt-2 text-[11px] sm:text-sm">
            <span className="text-slate-500 uppercase tracking-widest">Report violations to:</span>
            <a href="mailto:community@codeacademypro.com" className="text-rose-400 hover:text-rose-300 font-bold transition-colors break-all">
              community@codeacademypro.com
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  </div>
);

export default CodeOfConduct;
