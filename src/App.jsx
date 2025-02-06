import DataTable from "./components/DataTable";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b', 
            color: '#e2e8f0', 
            border: '1px solid rgba(148, 163, 184, 0.1)', 
          },
          success: {
            iconTheme: {
              primary: '#14b8a6', 
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', 
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Top-right circle */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
          
          {/* Bottom-left circle */}
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          
          {/* Center decorative line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" 
            style={{ opacity: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="text-center py-3 sm:py-8 px-4 mb-0 sm:mb-4">
            <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-teal-400 to-blue-400 text-transparent bg-clip-text">
              PAN Card Application System
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Manage and process PAN card applications efficiently
            </p>
          </div>

          <DataTable />
        </div>
      </div>
    </>
  );
}

export default App;
