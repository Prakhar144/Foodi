import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useNotice } from '../../context/NoticeContext.jsx';

const Alert = () => {
  const { notice, clearNotice } = useNotice();

  if (!notice) return null;

  const isSuccess = notice.type === 'success';

  return (
    <div
      role="alert"
      className={`mb-8 flex items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl ${
        isSuccess
          ? 'border-emerald-300/15 bg-emerald-400/10 text-emerald-100'
          : 'border-red-300/15 bg-red-400/10 text-red-100'
      }`}
    >
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{notice.text}</span>
      <button
        onClick={clearNotice}
        aria-label="Dismiss notification"
        className="ml-auto rounded-lg p-1.5 text-inherit transition hover:bg-white/10"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;
