import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useNotice } from '../../context/NoticeContext.jsx';

const Alert = () => {
  const { notice, clearNotice } = useNotice();

  if (!notice) return null;

  const isSuccess = notice.type === 'success';

  return (
    <div
      role="alert"
      className={`mb-8 flex items-center gap-3 rounded-xl border p-4 ${
        isSuccess
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
      <span>{notice.text}</span>
      <button
        onClick={clearNotice}
        aria-label="Dismiss notification"
        className="ml-auto rounded p-1 hover:opacity-70"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Alert;
